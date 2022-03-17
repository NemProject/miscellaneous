import {Observable} from 'rxjs';
import {TrezorAccount} from '../modules/trezor/trezorAccount';
import nemsdk from 'nem-sdk';
const nem = require('nem-library');
const voting = require('nem-voting');

class Voting {
    constructor($filter, $timeout, Alert, Wallet, Ledger, Trezor, VotingUtils, DataStore) {
        'ngInject';

        /***
         * Declare services
         */
        this._$timeout = $timeout;
        this._$filter = $filter;
        this._Alert = Alert;
        this._Wallet = Wallet;
        this._Ledger = Ledger;
        this._Trezor = Trezor;
        this._DataStore = DataStore;
        this._VotingUtils = VotingUtils;
        if(this._Wallet.network < 0){
            nem.NEMLibrary.bootstrap(nem.NetworkTypes.TEST_NET);
        }
        else{
            nem.NEMLibrary.bootstrap(nem.NetworkTypes.MAIN_NET);
        }
    }

    // Voting Functions

    init() {
        if ((this._Wallet.network < 0 && nem.NEMLibrary.getNetworkType() !== nem.NetworkTypes.TEST_NET) ||
            (this._Wallet.network > 0 && nem.NEMLibrary.getNetworkType() !== nem.NetworkTypes.MAIN_NET)) {
                nem.NEMLibrary.reset();
                if(this._Wallet.network < 0){
                    nem.NEMLibrary.bootstrap(nem.NetworkTypes.TEST_NET);
                }
                else{
                    nem.NEMLibrary.bootstrap(nem.NetworkTypes.MAIN_NET);
                }
            }
    }

    /**
     * getPolls(pollIndexAddress) returns a list with the poll headers from all the polls that are on the given index
     *
     * @param {string} pollIndexAddress - NEM address for the poll index account
     * @param {string} lastId - the id of the last transaction fetched for pagination
     *
     * @return {promise} - a list of all the poll header objects on the index account
     */
    getPolls(pollIndexAddress, lastId) {
        this.init();
        const obs = voting.PollIndex.fromAddress(new nem.Address(pollIndexAddress), lastId)
            .map((index) => {
                const headers = index.headers.map((header) => {
                    return {
                        title: header.title,
                        type: header.type,
                        doe: header.doe,
                        address: header.address.plain(),
                        creator: header.creator.plain(),
                        whitelist: header.whitelist,
                    }
                });
                return {
                    polls: headers,
                    lastId: index.lastId,
                }
            });
        return obs.first().toPromise();
    }

    /**
     * getOfficialPolls(pollIndexAddress) returns a list with the poll headers for all the official polls
     *
     * @return {promise} - a list of all the poll header objects on the index account
     */
    getOfficialPolls() {
        this.init();
        const obs = voting.getAllOfficialPolls()
            .map((polls) => {
                return polls.map((header) => {
                    return {
                        title: header.title,
                        type: header.type,
                        doe: header.doe,
                        address: header.address.plain(),
                        creator: header.creator.plain(),
                        whitelist: header.whitelist,
                    }
                });
            });
        return obs.first().toPromise();
    }

    /**
     * createPoll(details, pollIndex, common) creates a poll with the given details on the given pollIndex
     *
     * @param {object} details - poll details, without the option addresses
     * @param {string} pollIndex - NEM address of the poll index
     * @param {object} common - common object
     *
     * @return {promise} - the generated poll Address
     */
    createPoll(details, pollIndex, common) {
        this.init();
        let d = new Date();
        let chainTime = this._DataStore.chain.time;
        console.log("chain time:", chainTime);
        let timeStamp = Math.floor(chainTime) + Math.floor(d.getSeconds() / 10);
        let due = (this._Wallet.network === nemsdk.model.network.data.testnet.id) ? 60 : 24 * 60;
        let deadline = timeStamp + due * 60;
        const formData = {
            title: details.formData.title,
            doe: details.formData.doe,
            type: details.formData.type,
            multiple: details.formData.multiple,
        };
        const description = details.description;
        const options = details.options;
        const whitelist = (details.formData.type === 1) ? details.whitelist.map(a => new nem.Address(a)) : undefined;

        const poll = new voting.UnbroadcastedPoll(formData, description, options, whitelist);

        let account = {};
        if (common.isHW) {
            if (this._Wallet.algo == "trezor") {
                account = new TrezorAccount(this._Wallet.currentAccount.address, this._Wallet.currentAccount.hdKeypath, nem.NEMLibrary.getNetworkType(), this._Trezor);
            }
        } else {
            account = nem.Account.createWithPrivateKey(common.privateKey);
        }

        const index = new voting.PollIndex(new nem.Address(pollIndex), false, []);

        const broadcastData = poll.broadcast(account.publicKey, index);
        broadcastData.transactions = broadcastData.transactions.map((t) => {
            t.timeWindow = nem.TimeWindow.createFromDTOInfo(timeStamp, deadline);
            t.fee = Math.floor(t.fee);
            return t;
        });
        const nodeSplit = this._Wallet.node.host.split("://");
        const node = {
            protocol: nodeSplit[0],
            domain: nodeSplit[1],
            port: this._Wallet.node.port,
        }
        console.log("node", node);
        const transactionHttp = new nem.TransactionHttp([
            node,
        ]);
        const signTransaction = (i) => {
            let p;
            if (common.isHW) {
                if (this._Wallet.algo == "trezor") {
                    if (window['isElectronEnvironment']) {
                        const transaction = broadcastData.transactions[i];
                        transaction.setNetworkType(nem.NEMLibrary.getNetworkType());
                        const dto = transaction.toDTO();
                        p = this._Trezor.serialize(dto, this._Wallet.currentAccount);
                    } else {
                        p = account.signTransaction(broadcastData.transactions[i]).first().toPromise();
                    }
                } else if (this._Wallet.algo == "ledger") {
                    const transaction = broadcastData.transactions[i];
                    transaction.setNetworkType(nem.NEMLibrary.getNetworkType());
                    const dto = transaction.toDTO();
                    p = this._Ledger.serialize(dto, this._Wallet.currentAccount);
                }
            } else {
                p = Promise.resolve(account.signTransaction(broadcastData.transactions[i]));
            }
            return p.then((signed) => {
                if (broadcastData.transactions.length - 1 === i) {
                    return [signed];
                }
                if (common.isHW && this._Wallet.algo == "trezor" && window['isElectronEnvironment']) {
                    return new Promise(resolve => setTimeout(() => signTransaction(i + 1).then((next) => {
                        resolve([signed].concat(next));
                    }).catch(err => resolve([null])), 500));
                } else {
                    return signTransaction(i + 1).then((next) => {
                        return [signed].concat(next);
                    });
                }
            }).catch(err => {
                if (common.isHW && this._Wallet.algo == "ledger") {
                    throw 'handledLedgerErrorSignal';
                } else {
                    throw err;
                }
            });
        }

        return signTransaction(0).then((signedTransactions) => {
            return Observable.merge(...(signedTransactions.map((t) => {
                return transactionHttp.announceTransaction(t);
            })))
                .map(() => {
                    return broadcastData.broadcastedPoll.address.plain();
                }).last().toPromise();
        }).catch(err => {
            throw err;
        });

    }

    /**
     * vote(address, common, multisigAccount) sends a vote to the given address. Can vote as multisig
     *
     * @param {object} poll - poll address
     * @param {string} option - option string on which to vote
     * @param {object} common - common object
     * @param {string} multisigAccount - NEM address of the multisig account we want to send the vote for (optional)
     *
     * @return {promise} - returns a promise that resolves when the vote has been sent
     */
    vote(poll, option, common, multisigAccount) {
        this.init();
        let d = new Date();
        let chainTime = this._DataStore.chain.time;
        let timeStamp = Math.floor(chainTime) + Math.floor(d.getSeconds() / 10);
        let due = (this._Wallet.network === nemsdk.model.network.data.testnet.id) ? 60 : 24 * 60;
        let deadline = timeStamp + due * 60;
        return voting.BroadcastedPoll.fromAddress(new nem.Address(poll))
            .map((poll) => {
                let voteTransaction;
                if (multisigAccount) {
                    const multisigAcc = nem.PublicAccount.createWithPublicKey(multisigAccount.publicKey);
                    voteTransaction = poll.voteMultisig(multisigAcc, option);
                    voteTransaction.timeWindow = nem.TimeWindow.createFromDTOInfo(timeStamp, deadline);
                    voteTransaction.otherTransaction.timeWindow = nem.TimeWindow.createFromDTOInfo(timeStamp, deadline);
                } else {
                    voteTransaction = poll.vote(option);
                    voteTransaction.timeWindow = nem.TimeWindow.createFromDTOInfo(timeStamp, deadline);
                }
                return voteTransaction;
            }).first().toPromise();
    }

    /**
     * pollDetails(pollAddress) returns the details of a poll stored in the given pollAddress
     *
     * @param {string} pollAddress - NEM address for the poll account
     *
     * @return {promise} - a promise that returns the details object of the poll
     */
    pollDetails(pollAddress) {
        this.init();
        return voting.BroadcastedPoll.fromAddress(new nem.Address(pollAddress))
            .map((poll) => {
                const data = {
                    formData: poll.data.formData,
                    description: poll.data.description,
                    options: {
                        strings: poll.data.options,
                        link: {},
                    },
                    whitelist: poll.data.whitelist,
                };
                poll.data.options.forEach((option) => {
                    data.options.link[option] = poll.getOptionAddress(option).plain();
                });
                return data;
            }).first().toPromise();
    }

    /**
     * getResults(pollAddress, type, end) returns the result object for the poll depending of the type of the counting
     *
     * @param {string} pollAddress - NEM address of the poll
     *
     * @return {promise} - A promise that returns the result object of the poll
     */
    getResults(pollAddress) {
        this.init();
        return voting.BroadcastedPoll.fromAddress(new nem.Address(pollAddress))
            .switchMap((poll) => {
                return poll.getResults();
            }).first().toPromise();
    }

    /**
     * hasVoted(addrses, pollDetails)
     *
     * @param {string} address - NEM address of the poll
     * @param {object} pollDetails - poll details object of the poll. The details can be obtained from the address,
     * but passing as a parameter is faster, since when we check for votes on the voting module we already have the details
     *
     * @return {promise} - A promise that returns:
     *                          0 if there are no votes
     *                          1 if there is an unconfirmed vote
     *                          2 if there is a confirmed vote
     */
    hasVoted(address, pollDetails) {
        this.init();
        var orderedAddresses = [];
        if(pollDetails.options.link){
            orderedAddresses = pollDetails.options.strings.map((option)=>{
                return pollDetails.options.link[option];
            });
        }
        else{
            orderedAddresses = pollDetails.options.addresses;
        }
        var confirmedPromises = orderedAddresses.map((optionAddress) => {
            return this._VotingUtils.existsTransaction(address, optionAddress);
        });
        return Promise.all(confirmedPromises).then((data) => {
            return Math.max.apply(null, data);
        });
    }

    isInWhitelist(address, whitelist) {
        address = new nem.Address(address);
        const findI = whitelist.findIndex(a => a.plain() === address.plain());
        return findI >= 0;
    }

    getBroadcastFee(details) {
        this.init();
        const formData = {
            title: details.formData.title,
            doe: details.formData.doe,
            type: details.formData.type,
            multiple: details.formData.multiple,
        };
        const description = details.description;
        const options = details.options;
        let whitelist;
        if (details.formData.type === 1) {
            console.log("wl", details.whitelist);
            try {
                whitelist = details.whitelist.map(a => new nem.Address(a));
            } catch (err) {
                return 0;
            }
        }

        const poll = new voting.UnbroadcastedPoll(formData, description, options, whitelist);

        return poll.getBroadcastFee();
    }

    broadcastVotes(votes, common) {
        let account;
        if (common.isHW) {
            if (this._Wallet.algo == "trezor") {
                account = new TrezorAccount(this._Wallet.currentAccount.address, this._Wallet.currentAccount.hdKeypath, nem.NEMLibrary.getNetworkType(), this._Trezor);
            }
        } else {
            account = nem.Account.createWithPrivateKey(common.privateKey);
        }
        // sign
        let signedTransactionsPromise;
        if (common.isHW) {
            if (this._Wallet.algo == "trezor") {
                if (window['isElectronEnvironment']) {
                    const signTransaction = (i) => {
                        const transaction = votes[i];
                        transaction.setNetworkType(nem.NEMLibrary.getNetworkType());
                        const dto = transaction.toDTO();
                        const p = this._Trezor.serialize(dto, this._Wallet.currentAccount);
                        return p.then((signed) => {
                            if (votes.length - 1 === i) {
                                return [signed];
                            }
                            return new Promise(resolve => setTimeout(() => signTransaction(i + 1).then((next) => {
                                resolve([signed].concat(next));
                            }).catch(err => resolve([null])), 500));
                        }).catch(err => {
                            throw err;
                        });
                    }
                    signedTransactionsPromise = signTransaction(0);
                } else {
                    signedTransactionsPromise = account.signTransactions(votes).first().toPromise();
                }
            } else if (this._Wallet.algo == "ledger") {
                const signTransaction = (i) => {
                    const transaction = votes[i];
                    transaction.setNetworkType(nem.NEMLibrary.getNetworkType());
                    const dto = transaction.toDTO();
                    const p = this._Ledger.serialize(dto, this._Wallet.currentAccount);
                    return p.then((signed) => {
                        if (votes.length - 1 === i) {
                            return [signed];
                        }
                        return signTransaction(i + 1).then((next) => {
                            return [signed].concat(next);
                        });
                    }).catch(err => {
                        throw 'handledLedgerErrorSignal';
                    });
                }
                signedTransactionsPromise = signTransaction(0);
            }
        } else {
            const signed = votes.map(v => {
                return account.signTransaction(v);
            });
            signedTransactionsPromise = Promise.resolve(signed);
        }
        // broadcast
        return signedTransactionsPromise.then(signedTransactions => {
            const nodeSplit = this._Wallet.node.host.split("://");
            const node = {
                protocol: nodeSplit[0],
                domain: nodeSplit[1],
                port: this._Wallet.node.port,
            }
            const transactionHttp = new nem.TransactionHttp([
                node,
            ]);
            return Promise.all(signedTransactions.map(t => {
                return transactionHttp.announceTransaction(t).first().toPromise();
            }));
        }).catch(e => {
            throw e;
        });
    }
}

export default Voting;
