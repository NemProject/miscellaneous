import nem from 'nem-sdk';
import {
    buildMultisigDTO,
    buildSimpleDTO,
    MultisigCache,
    NormalCache,
    status
} from "symbol-post-launch-optin";
import {PublicAccount, NetworkType, Account} from "symbol-sdk";
import {broadcastDTO} from "symbol-post-launch-optin";


/** Service with relative functions on symbol opt in books. */
class CatapultOptin {

    constructor($localStorage, $filter, Wallet, Trezor, Ledger, DataStore, Alert, $timeout) {
        'ngInject';

        this.normalCaches = {};
        this.multisigCaches = {};
        // Service dependencies region //

        this._storage = $localStorage;
        this._$filter = $filter;
        this._Wallet = Wallet;
        this._DataStore = DataStore;
        this._Trezor = Trezor;
        this._Ledger = Ledger;
        this._Alert = Alert;
        this._$timeout = $timeout;
        // End dependencies region //

        // Service properties region //

        // End properties region //
    }

    // Service methods region //

    /**
     * Returns optin config
     */
    getOptinConfig() {
        let CATNetwork, NISStopAccount;
        if (this._Wallet.network === nem.model.network.data.testnet.id) {
            CATNetwork = NetworkType.TEST_NET;
            NISStopAccount = 'TAXF5HUGBKGSC3MOJCRXN5LLKFBY43LXI3DE2YLS';
        } else if (this._Wallet.network === nem.model.network.data.mainnet.id) {
            CATNetwork = NetworkType.MAIN_NET;
            NISStopAccount = 'NAQ7RCYM4PRUAKA7AMBLN4NPBJEJMRCHHJYAVA72';
        } else if (this._Wallet.network === nem.model.network.data.mijin.id) {
            CATNetwork = NetworkType.MIJIN;
        } else {
            CATNetwork = NetworkType.MIJIN_TEST;
        }
        return {
            NIS: {
                endpoint: this._Wallet.node,
                network: this._Wallet.network,
                configAddress: NISStopAccount,
            },
            SYM: {
                network: CATNetwork,
                generationHash: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6'
            },
            snapshotInfoApi: 'http://post-optin.symboldev.com/'
        };
    }

    getStatus(account) {
        return new Promise( (resolve) => {
            const config = this.getOptinConfig();
            if (account.meta.cosignatories.length > 0) {
                this.getMultisigCache(account, true).then(cache => {
                    status(account, config, cache).then(resolve);
                });
            } else {
                this.getNormalCache(account, true).then(cache => {
                    status(account, config, cache).then(resolve);
                });
            }
        });
    }

    getClaimAmount(address) {
        return new Promise(resolve => {
            fetch(this.getOptinConfig().snapshotInfoApi + 'balance?address=' + address).then(result => {
                result.json().then(json => {
                    resolve(json && json.amount ? json.amount : 0);
                }).catch(() => {
                    resolve(0);
                })
            }).catch(() => {
                resolve(0);
            });
        });
        // return Promise.resolve(Math.round(Math.random() * Math.pow(10, Math.round(Math.random() * 10)) * Math.pow(10, 6)) / Math.pow(10, 6));
    }

    getNormalCache(account, forceRefresh = false) {
        return new Promise(resolve => {
            if (!this.normalCaches[account.account.address] || forceRefresh) {
                const cache = new NormalCache(account, this.getOptinConfig());
                cache.loadFromChain().then(_ => {
                    this.normalCaches[account.account.address] = cache;
                    resolve(cache);
                });
            }
            else {
                resolve(this.normalCaches[account.account.address]);
            }
        })
    }

    getMultisigCache(account, forceRefresh = false) {
        return new Promise(resolve => {
            if (!this.multisigCaches[account.account.address] || forceRefresh) {
                const cache = new MultisigCache(account, this.getOptinConfig());
                cache.loadFromChain().then(_ => {
                    this.multisigCaches[account.account.address] = cache;
                    resolve(cache);
                });
            }
            else {
                resolve( this.multisigCaches[account.account.address] );
            }
        })
    }

    /**
     * Sends simple optin status
     *
     * @param common
     * @param destinationPublicKey
     */
    sendSimpleOptin(common, destinationPublicKey) {
        return new Promise( (resolve, reject) => {
            const config = this.getOptinConfig();
            const simpleDTO = buildSimpleDTO(destinationPublicKey);
            if (this._Wallet.algo == "trezor") {
                this._sendTrezorDTOs(common, [simpleDTO]).then(resolve).catch(reject);
            } else if (this._Wallet.algo == "ledger") {
                alert(this._$filter('translate')('LEDGER_NANO_NOT_OPENED_NEM_APP'));
                this._sendLedgerDTOs(common, [simpleDTO]).then(resolve).catch(reject);
            }
            else {
                broadcastDTO(common.privateKey, simpleDTO, config).then((message) => {
                    if (message !== 'SUCCESS') {
                        reject('Sending OptIn failed: ' + message.toString());
                    } else {
                        resolve(true);
                    }
                }).catch(reject);
            }
        });
    }
    /**
     * Sends multisig optin status
     *
     * @param common
     * @param NIS1multisigAddress
     * @param SYMMultisigPublicKey
     * @param SYMCosignerPublicKey
     */
    sendMultisigOptin(common, NIS1multisigAddress, SYMMultisigPublicKey) {
        return new Promise( (resolve, reject) => {
            const config = this.getOptinConfig();
            const dto = buildMultisigDTO(NIS1multisigAddress, SYMMultisigPublicKey, "0000000000000000000000000000000000000000000000000000000000000000");
            if (this._Wallet.algo == "trezor") {
                this._sendTrezorDTOs(common, [dto]).then(resolve).catch(reject);
            } else if (this._Wallet.algo == "ledger") {
                alert(this._$filter('translate')('LEDGER_NANO_NOT_OPENED_NEM_APP'));
                this._sendLedgerDTOs(common, [dto]).then(resolve).catch(reject);
            }
            else {
                broadcastDTO(common.privateKey, dto, config).then((message) => {
                    if (message !== 'SUCCESS') {
                        reject('Sending OptIn failed: ' + message.toString());
                    } else {
                        resolve(true);
                    }
                }).catch(reject);
            }
        });
    }

    /**
     * Signs and Sends DTOS via trezor
     *
     * @param common
     * @param dtos
     */
    _sendTrezorDTOs(common, dtos) {
        return new Promise((resolve, reject) => {
            Promise.all( dtos.map( dto => this.createTransactionFromDTO(dto, common))).then( transactions => {
                const signTransaction = (i) => {
                    return this._Trezor.serialize(transactions[i], this._Wallet.currentAccount).then( serialized => {
                        if (transactions.length - 1 === i) {
                            return [JSON.stringify(serialized)];
                        }
                        return new Promise(resolve => setTimeout( () => signTransaction(i + 1).then((next) => {
                            resolve([JSON.stringify(serialized)].concat(next));
                        }).catch(err => resolve([null])), 500));
                    }).catch(err => {
                        reject(err.data.message);
                    });
                };
                signTransaction(0).then((signedTransactions) => {
                    if (signedTransactions.filter(_ => _ != null).length === dtos.length){
                        Promise.all(signedTransactions.map( signedTransaction => nem.com.requests.transaction.announce(this._Wallet.node, signedTransaction)))
                            .then(resolve)
                            .catch(reject);
                    } else {
                        reject('Transaction not signed');
                    }

                }).catch(reject);
            });
        });
    }

    /**
     * Signs and Sends DTOS via Ledger
     *
     * @param common
     * @param dtos
     */
    _sendLedgerDTOs(common, dtos) {
        return new Promise((resolve, reject) => {
            Promise.all( dtos.map( dto => this.createTransactionFromDTO(dto, common))).then( transactions => {
                const signTransaction = (i) => {
                    return this._Ledger.serialize(transactions[i], this._Wallet.currentAccount).then( serialized => {
                        if (transactions.length - 1 === i) {
                            return [JSON.stringify(serialized)];
                        }
                        return new Promise(resolve => signTransaction(i + 1).then((next) => {
                            resolve([JSON.stringify(serialized)].concat(next));
                        }).catch(err => resolve([null])));
                    }).catch(_ => {
                        reject('handledLedgerErrorSignal');
                    });
                };
                signTransaction(0).then((signedTransactions) => {
                    if (signedTransactions.filter(_ => _ != null).length === dtos.length){
                        Promise.all(signedTransactions.map( signedTransaction => nem.com.requests.transaction.announce(this._Wallet.node, signedTransaction)))
                            .then(resolve)
                            .catch(reject);
                    } else {
                        reject('Transaction not signed');
                    }

                }).catch(reject);
            });
        });
    }

    /**
     * Creates a transaction from a dto
     *
     * @param dto
     * @param common
     */
    createTransactionFromDTO(dto, common){
        let configTransaction = nem.model.objects.create("transferTransaction")(this.getOptinConfig().NIS.configAddress, 0, dto.toMessage());
        // Prepare with Signer and Network
        configTransaction = nem.model.transactions.prepare("transferTransaction")(
            common,
            configTransaction,
            this._Wallet.network
        );
        return new Promise( (resolve) => {
            nem.com.requests.chain.time(this._Wallet.node).then( time => {
                configTransaction.timeStamp = Math.floor(time.receiveTimeStamp / 1000);
                configTransaction.deadline = configTransaction.timeStamp + 60 * 60;
                resolve(configTransaction);
            });
        });
    }

    // End methods region //

}

export default CatapultOptin;
