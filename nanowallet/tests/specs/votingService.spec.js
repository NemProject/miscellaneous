import Sinks from '../../src/app/utils/sinks';
import WalletFixture from '../data/wallet';
import AccountDataFixture from '../data/accountData';
import PollDetailsFixture from '../data/poll.js';

describe('voting service tests', function() {
    let $controller,
        $rootScope,
        Wallet,
        DataBridge,
        nemUtils,
        Voting,
        $q,
        $filter;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.inject(function(_$filter_, _$rootScope_, _Wallet_, _DataBridge_, _Voting_, _nemUtils_, _$q_) {
        $rootScope = _$rootScope_;
        Wallet = _Wallet_;
        DataBridge = _DataBridge_;
        Voting = _Voting_;
        nemUtils = _nemUtils_;
        $q = _$q_;
        $filter = _$filter_;
    }));

    function createDummyWalletContextTestnet(Wallet) {
        Wallet.setWallet(WalletFixture.testnetWallet);
        Wallet.setDefaultNode();

        DataBridge.accountData = AccountDataFixture.testnetAccountData;
        DataBridge.namespaceOwned = AccountDataFixture.testnetNamespaceOwned;
        DataBridge.mosaicOwned = AccountDataFixture.testnetMosaicOwned;
        DataBridge.mosaicDefinitionMetaDataPair = AccountDataFixture.testnetMosaicDefinitionMetaDataPair;
        DataBridge.nisHeight = 999999999;
    }

    function createDummyWalletContextMainnet(Wallet) {
        Wallet.setWallet(WalletFixture.mainnetWallet);
        Wallet.setDefaultNode();

        DataBridge.accountData = AccountDataFixture.mainnetAccountData;
        DataBridge.namespaceOwned = AccountDataFixture.mainnetNamespaceOwned;
        DataBridge.mosaicOwned = AccountDataFixture.mainnetMosaicOwned;
        DataBridge.mosaicDefinitionMetaDataPair = AccountDataFixture.mainnetMosaicDefinitionMetaDataPair;

        DataBridge.nisHeight = 999999999;
    }

    describe('voting asyncronous tests', function() {

        beforeEach(function(done) {
            $rootScope.$apply();
            setTimeout(function() {
                done();
            }, 1);
        });

        it("can get the polls from a poll index", function(done) {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);

            let pollIndex = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB";

            let transaction = {
                transaction: {
                    amount: 0,
                    deadline: 69431068,
                    fee: 1000000,
                    message: 'poll:{"title": "YYYYYYYYYYY", "type": 0, "doe": 1604098560000, "address": "TDZQAJCDN57LOPS3GF5NVLPPPODRQSUXINRMWWIC"}',
                    recipient: "TCOORH3HFT5TKHHVLOMMFYEAZJ636ODSQYDLPIXX",
                    signature: "9960aa4040ebdf012d50a5386657c2527dcf8ffec341085030601852ea026dae1f282545d479f0909d18fa921d2147a0a8fdf37a76dfde436447b2093801a20d",
                    signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                    timeStamp: 69427468,
                    type: 257,
                    version: -1744830463
                }
            }

            let transactionList = [transaction, transaction];

            spyOn(nemUtils, 'getTransactionsWithString').and.returnValue(Promise.resolve(transactionList));
            spyOn(nemUtils, 'getFirstMessageWithString').and.returnValue(Promise.resolve('pollIndex:{"private":false}'));
            // Act
            let pollsPromise = Voting.getPolls(pollIndex);

            // Assert
            let resp = [
                {
                    "title": "YYYYYYYYYYY",
                    "type": 0,
                    "doe": 1604098560000,
                    "address": "TDZQAJCDN57LOPS3GF5NVLPPPODRQSUXINRMWWIC"
                },
                {
                    "title": "YYYYYYYYYYY",
                    "type": 0,
                    "doe": 1604098560000,
                    "address": "TDZQAJCDN57LOPS3GF5NVLPPPODRQSUXINRMWWIC"
                }
            ];
            pollsPromise.then((polls) => {
                expect(nemUtils.getTransactionsWithString).toHaveBeenCalledWith(pollIndex, "poll:");
                expect(nemUtils.getFirstMessageWithString).toHaveBeenCalledWith(pollIndex, "pollIndex:");
                expect(polls).toEqual(resp);
                done();
            });
            scope.$digest();
        });

        it("can create a POI poll", function(done) {

            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);
            let common = {
                "privateKey": "",
                "password": "TestTest11"
            };

            let mockAddress = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB";

            let details = {
                "formData": {
                    "doe": 1604098560000,
                    "multiple": false,
                    "title": "Poll",
                    "type": 0,
                    "updatable": false
                },
                "description": "test poll",
                "options": ["yes", "no", "maybe"],
            }

            let formDataMessage = "formData:" + JSON.stringify(details.formData);
            let descriptionMessage = "description:" + details.description;
            let optionsObj = {
                strings: details.options,
                addresses: [mockAddress, mockAddress, "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB"],
            };
            let optionsMessage = "options:" + JSON.stringify(optionsObj);
            let header = {
                title: details.formData.title,
                type: details.formData.type,
                doe: details.formData.doe,
                address: mockAddress
            };
            let pollMessage = "poll:" + JSON.stringify(header);

            spyOn(nemUtils, 'createNewAccount').and.returnValue(Promise.resolve({address: mockAddress}));
            spyOn(nemUtils, 'sendMessage').and.returnValue(Promise.resolve());
            // Act
            let pollPromise = Voting.createPoll(details, mockAddress, common);

            let messageParams = [[mockAddress, formDataMessage, common],[mockAddress, descriptionMessage, common],[mockAddress, optionsMessage, common], [mockAddress, pollMessage, common]];

            // Assert
            pollPromise.then((resp) => {
                expect(resp).toEqual(mockAddress);
                expect(nemUtils.createNewAccount).toHaveBeenCalled();
                expect(nemUtils.sendMessage.calls.allArgs()).toEqual(messageParams);
                done();
            }).catch(err=>{
                console.log(err);
            });
            scope.$apply();
        });

        it("can vote on a poll", function(done) {

            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);
            let common = {
                "privateKey": "",
                "password": "TestTest11"
            };

            let mockAddress = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB";

            spyOn(Voting._Transactions, 'prepareTransfer').and.returnValue(Promise.resolve());
            spyOn(Voting._Transactions, 'serializeAndAnnounceTransaction').and.returnValue(Promise.resolve());
            // Act
            Voting.vote(mockAddress, common);

            let formData = {};
            formData.rawRecipient = '';
            formData.recipient = mockAddress;
            formData.recipientPubKey = '';
            formData.message = '';
            formData.amount = 0;
            formData.fee = 0;
            formData.encryptMessage = false;
            formData.innerFee = 0;
            formData.isMultisig = false;
            formData.multisigAccount = '';
            formData.mosaics = null;
            formData.isMosaicTransfer = false;
            let mosaicsMetaData = DataBridge.mosaicDefinitionMetaDataPair;

            // Assert
            expect(Voting._Transactions.prepareTransfer).toHaveBeenCalledWith(common, formData, mosaicsMetaData);
            expect(Voting._Transactions.serializeAndAnnounceTransaction).toHaveBeenCalled();
            done();
            scope.$apply();
        });

        it("can vote on a poll as multisig", function(done) {

            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);
            let common = {
                "privateKey": "",
                "password": "TestTest11"
            };

            let mockAddress = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB";

            spyOn(Voting._Transactions, 'prepareTransfer').and.returnValue(Promise.resolve());
            spyOn(Voting._Transactions, 'serializeAndAnnounceTransaction').and.returnValue(Promise.resolve());
            // Act
            Voting.vote(mockAddress, common, mockAddress);

            let formData = {};
            formData.rawRecipient = '';
            formData.recipient = mockAddress;
            formData.recipientPubKey = '';
            formData.message = '';
            formData.amount = 0;
            formData.fee = 0;
            formData.encryptMessage = false;
            formData.innerFee = 0;
            formData.isMultisig = true;
            formData.multisigAccount = mockAddress;
            formData.mosaics = null;
            formData.isMosaicTransfer = false;
            let mosaicsMetaData = DataBridge.mosaicDefinitionMetaDataPair;

            // Assert
            expect(Voting._Transactions.prepareTransfer).toHaveBeenCalledWith(common, formData, mosaicsMetaData);
            expect(Voting._Transactions.serializeAndAnnounceTransaction).toHaveBeenCalled();
            done();
            scope.$apply();
        });

        it("getDetails passes right parameters to auxiliary functions", function(done) {

            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);

            let mockAddress = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB";
            let QueryOptions = {
                start: 0
            };
            let params = [[mockAddress, "formData:", QueryOptions], [mockAddress, "description:", QueryOptions], [mockAddress, "options:", QueryOptions]];

            spyOn(nemUtils, 'getFirstMessageWithString').and.returnValue(Promise.resolve());
            // Act
            Voting.pollDetails(mockAddress);
            // Assert
            expect(nemUtils.getFirstMessageWithString.calls.allArgs()).toEqual(params);
            done();
            scope.$apply();
        });

        it("gets correct results from an ongoing POI poll", function(done) {

            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);

            let addr1 = "TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3";
            let addr2 = "TBFSKYW7SXRXGQNFUIOWTQ7HHJJFIGXUMUEKVGW2";
            let addr3 = "TAELULQTYYYSZ7JYLKSXPQREGQTRHU6WJYENWJ4Z";

            let details = {
                formData: {
                    doe: 1514721540000,
                    multiple: false,
                },
                options: {
                    addresses: [addr1, addr2],
                    strings: ["yes", "no"],
                },
            }

            let getTransactionsMock = function(address, str){
                expect(str).toEqual("");
                if(address === addr1){
                    return Promise.resolve([{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr1,
                            signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                            timeStamp: 69427468,
                            type: 257,
                        }
                    },{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr1,
                            signer: "f1951b8cad9306b2fc328e4c411752dff74cea74eb1194d05a87d533f497954f",
                            timeStamp: 69427468,
                            type: 257,
                        }
                    }])
                }
                else if(address === addr2){
                    return Promise.resolve([{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr2,
                            signer: "c388c04d4d70f0d21f35b6f176e9270c633c583b6dd6e8dcd9a961c5743a1f93",
                            timeStamp: 69427468,
                            type: 257,
                        }
                    }])
                }
                else{
                    console.log("called with wrong address:", address);
                }
            }

            let getImportanceMock = function(address, height){
                expect(height).toEqual(0);
                if(address === addr1){
                    return Promise.resolve(1);
                }
                else if(address === addr2){
                    return Promise.resolve(2);
                }
                else if(address === addr3){
                    return Promise.resolve(27);
                }
            }

            spyOn(Voting, 'pollDetails').and.returnValue(Promise.resolve(details));
            spyOn(nemUtils, 'getTransactionsWithString').and.callFake(getTransactionsMock);
            spyOn(nemUtils, 'getHeightByTimestamp').and.returnValue(Promise.resolve(0));
            spyOn(nemUtils, 'getImportance').and.callFake(getImportanceMock);

            //spyOn(Voting.Address, 'toAddress').and.callThrough();

            let end = new Date().getTime();

            // Act
            let resultsPromise = Voting.getPOIResults(addr1, end);

            // Assert
            let getTransParams = [[addr1, ""], [addr2, ""]];
            let getImportanceParams = [[addr3, 0], [addr2, 0], [addr1, 0]];

            let results = {
                "totalVotes": 3,
                "options": [{
                    "text": "yes",
                    "votes": 2,
                    "weighted": 3,
                    "percentage": 10
                },{
                    "text": "no",
                    "votes": 1,
                    "weighted": 27,
                    "percentage": 90
                }],
            }

            resultsPromise.then((resp) => {
                expect(resp).toEqual(results);
                expect(Voting.pollDetails).toHaveBeenCalledWith(addr1);
                expect(nemUtils.getTransactionsWithString.calls.allArgs()).toEqual(getTransParams);
                expect(nemUtils.getHeightByTimestamp).toHaveBeenCalledWith(end);
                expect(nemUtils.getImportance.calls.allArgs()).toEqual(getImportanceParams);
                done();
            }).catch(err=>{
                console.log(err);
            });
            scope.$apply();
        });

        it("gets correct results from an ended POI poll, and ignores votes sent after the closing", function(done) {

            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);

            let addr1 = "TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3";
            let addr2 = "TBFSKYW7SXRXGQNFUIOWTQ7HHJJFIGXUMUEKVGW2";
            let addr3 = "TAELULQTYYYSZ7JYLKSXPQREGQTRHU6WJYENWJ4Z";

            let details = {
                formData: {
                    doe: 1514721540000,
                    multiple: false,
                },
                options: {
                    addresses: [addr1, addr2],
                    strings: ["yes", "no"],
                },
            }

            let getTransactionsMock = function(address, str){
                expect(str).toEqual("");
                if(address === addr1){
                    return Promise.resolve([{
                        meta: {
                            height: 10
                        },
                        transaction: {
                            recipient: addr1,
                            signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                            type: 257,
                        }
                    },{
                        meta: {
                            height: 11
                        },
                        transaction: {
                            recipient: addr1,
                            signer: "f1951b8cad9306b2fc328e4c411752dff74cea74eb1194d05a87d533f497954f",
                            type: 257,
                        }
                    }])
                }
                else if(address === addr2){
                    return Promise.resolve([{
                        meta: {
                            height: 5
                        },
                        transaction: {
                            recipient: addr2,
                            signer: "c388c04d4d70f0d21f35b6f176e9270c633c583b6dd6e8dcd9a961c5743a1f93",
                            type: 257,
                        }
                    }])
                }
                else{
                    console.log("called with wrong address:", address);
                }
            }

            let getImportanceMock = function(address, height){
                expect(height).toEqual(10);
                if(address === addr1){
                    return Promise.resolve(3);
                }
                else if(address === addr2){
                    console.log("called getImportance with an invalid address (voted after ending)");
                }
                else if(address === addr3){
                    return Promise.resolve(27);
                }
            }

            spyOn(Voting, 'pollDetails').and.returnValue(Promise.resolve(details));
            spyOn(nemUtils, 'getTransactionsWithString').and.callFake(getTransactionsMock);
            spyOn(nemUtils, 'getHeightByTimestamp').and.returnValue(Promise.resolve(10));
            spyOn(nemUtils, 'getImportance').and.callFake(getImportanceMock);

            let end = new Date().getTime();

            // Act
            let resultsPromise = Voting.getPOIResults(addr1, end);

            // Assert
            let getTransParams = [[addr1, ""], [addr2, ""]];
            let getImportanceParams = [[addr3, 10], [addr1, 10]];

            let results = {
                "totalVotes": 2,
                "options": [{
                    "text": "yes",
                    "votes": 1,
                    "weighted": 3,
                    "percentage": 10
                },{
                    "text": "no",
                    "votes": 1,
                    "weighted": 27,
                    "percentage": 90
                }],
            }

            resultsPromise.then((resp) => {
                expect(resp).toEqual(results);
                expect(Voting.pollDetails).toHaveBeenCalledWith(addr1);
                expect(nemUtils.getTransactionsWithString.calls.allArgs()).toEqual(getTransParams);
                expect(nemUtils.getHeightByTimestamp).toHaveBeenCalledWith(end);
                expect(nemUtils.getImportance.calls.allArgs()).toEqual(getImportanceParams);
                done();
            }).catch(err=>{
                console.log(err);
            });
            scope.$apply();
        });

        it("POI poll vote counting correctly counts multiple votes on the same option as one vote", function(done) {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);

            let addr1 = "TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3";
            let addr2 = "TBFSKYW7SXRXGQNFUIOWTQ7HHJJFIGXUMUEKVGW2";
            let addr3 = "TAELULQTYYYSZ7JYLKSXPQREGQTRHU6WJYENWJ4Z";

            let details = {
                formData: {
                    doe: 1514721540000,
                    multiple: false,
                },
                options: {
                    addresses: [addr1, addr2],
                    strings: ["yes", "no"],
                },
            }

            let getTransactionsMock = function(address, str){
                expect(str).toEqual("");
                if(address === addr1){
                    return Promise.resolve([{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr1,
                            signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                            timeStamp: 69427468,
                            type: 257,
                        }
                    },{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr1,
                            signer: "f1951b8cad9306b2fc328e4c411752dff74cea74eb1194d05a87d533f497954f",
                            timeStamp: 69427468,
                            type: 257,
                        }
                    },{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr1,
                            signer: "f1951b8cad9306b2fc328e4c411752dff74cea74eb1194d05a87d533f497954f",
                            timeStamp: 69427468,
                            type: 257,
                        }
                    }])
                }
                else if(address === addr2){
                    return Promise.resolve([{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr2,
                            signer: "c388c04d4d70f0d21f35b6f176e9270c633c583b6dd6e8dcd9a961c5743a1f93",
                            timeStamp: 69427468,
                            type: 257,
                        }
                    }])
                }
                else{
                    console.log("called with wrong address:", address);
                }
            }

            let getImportanceMock = function(address, height){
                expect(height).toEqual(0);
                if(address === addr1){
                    return Promise.resolve(1);
                }
                else if(address === addr2){
                    return Promise.resolve(2);
                }
                else if(address === addr3){
                    return Promise.resolve(27);
                }
            }

            spyOn(Voting, 'pollDetails').and.returnValue(Promise.resolve(details));
            spyOn(nemUtils, 'getTransactionsWithString').and.callFake(getTransactionsMock);
            spyOn(nemUtils, 'getHeightByTimestamp').and.returnValue(Promise.resolve(0));
            spyOn(nemUtils, 'getImportance').and.callFake(getImportanceMock);

            //spyOn(Voting.Address, 'toAddress').and.callThrough();

            let end = new Date().getTime();

            // Act
            let resultsPromise = Voting.getPOIResults(addr1, end);

            // Assert
            let getTransParams = [[addr1, ""], [addr2, ""]];
            let getImportanceParams = [[addr3, 0], [addr2, 0], [addr1, 0]];

            let results = {
                "totalVotes": 3,
                "options": [{
                    "text": "yes",
                    "votes": 2,
                    "weighted": 3,
                    "percentage": 10
                },{
                    "text": "no",
                    "votes": 1,
                    "weighted": 27,
                    "percentage": 90
                }],
            }

            resultsPromise.then((resp) => {
                expect(resp).toEqual(results);
                expect(Voting.pollDetails).toHaveBeenCalledWith(addr1);
                expect(nemUtils.getTransactionsWithString.calls.allArgs()).toEqual(getTransParams);
                expect(nemUtils.getHeightByTimestamp).toHaveBeenCalledWith(end);
                expect(nemUtils.getImportance.calls.allArgs()).toEqual(getImportanceParams);
                done();
            }).catch(err=>{
                console.log(err);
            });
            scope.$apply();
        });

        it("POI poll vote counting correctly invalidates multiple votes on different options by the same account", function(done) {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);

            let addr1 = "TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3";
            let addr2 = "TBFSKYW7SXRXGQNFUIOWTQ7HHJJFIGXUMUEKVGW2";
            let addr3 = "TAELULQTYYYSZ7JYLKSXPQREGQTRHU6WJYENWJ4Z";

            let details = {
                formData: {
                    doe: 1514721540000,
                    multiple: false,
                },
                options: {
                    addresses: [addr1, addr2],
                    strings: ["yes", "no"],
                },
            }

            let getTransactionsMock = function(address, str){
                expect(str).toEqual("");
                if(address === addr1){
                    return Promise.resolve([{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr1,
                            signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                            type: 257,
                        }
                    },{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr1,
                            signer: "f1951b8cad9306b2fc328e4c411752dff74cea74eb1194d05a87d533f497954f",
                            type: 257,
                        }
                    }])
                }
                else if(address === addr2){
                    return Promise.resolve([{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr2,
                            signer: "c388c04d4d70f0d21f35b6f176e9270c633c583b6dd6e8dcd9a961c5743a1f93",
                            type: 257,
                        }
                    },{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr1,
                            signer: "f1951b8cad9306b2fc328e4c411752dff74cea74eb1194d05a87d533f497954f",
                            type: 257,
                        }
                    }])
                }
                else{
                    console.log("called with wrong address:", address);
                }
            }

            let getImportanceMock = function(address, height){
                expect(height).toEqual(0);
                if(address === addr1){
                    return Promise.resolve(3);
                }
                else if(address === addr2){
                    return Promise.resolve(100000);
                }
                else if(address === addr3){
                    return Promise.resolve(27);
                }
            }

            spyOn(Voting, 'pollDetails').and.returnValue(Promise.resolve(details));
            spyOn(nemUtils, 'getTransactionsWithString').and.callFake(getTransactionsMock);
            spyOn(nemUtils, 'getHeightByTimestamp').and.returnValue(Promise.resolve(0));
            spyOn(nemUtils, 'getImportance').and.callFake(getImportanceMock);

            //spyOn(Voting.Address, 'toAddress').and.callThrough();

            let end = new Date().getTime();

            // Act
            let resultsPromise = Voting.getPOIResults(addr1, end);

            // Assert
            let getTransParams = [[addr1, ""], [addr2, ""]];
            let getImportanceParams = [[addr3, 0], [addr1, 0]];

            let results = {
                "totalVotes": 2,
                "options": [{
                    "text": "yes",
                    "votes": 1,
                    "weighted": 3,
                    "percentage": 10
                },{
                    "text": "no",
                    "votes": 1,
                    "weighted": 27,
                    "percentage": 90
                }],
            }

            resultsPromise.then((resp) => {
                expect(resp).toEqual(results);
                expect(Voting.pollDetails).toHaveBeenCalledWith(addr1);
                expect(nemUtils.getTransactionsWithString.calls.allArgs()).toEqual(getTransParams);
                expect(nemUtils.getHeightByTimestamp).toHaveBeenCalledWith(end);
                expect(nemUtils.getImportance.calls.allArgs()).toEqual(getImportanceParams);
                done();
            }).catch(err=>{
                console.log(err);
            });
            scope.$apply();
        });

        it("POI poll vote counting correctly calculates vote weights for multiple option", function(done) {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);

            let addr1 = "TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3";
            let addr2 = "TBFSKYW7SXRXGQNFUIOWTQ7HHJJFIGXUMUEKVGW2";
            let addr3 = "TAELULQTYYYSZ7JYLKSXPQREGQTRHU6WJYENWJ4Z";

            let details = {
                formData: {
                    doe: 1514721540000,
                    multiple: true,
                },
                options: {
                    addresses: [addr1, addr2],
                    strings: ["yes", "no"],
                },
            }

            let getTransactionsMock = function(address, str){
                expect(str).toEqual("");
                if(address === addr1){
                    return Promise.resolve([{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr1,
                            signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                            type: 257,
                        }
                    },{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr1,
                            signer: "f1951b8cad9306b2fc328e4c411752dff74cea74eb1194d05a87d533f497954f",
                            type: 257,
                        }
                    }])
                }
                else if(address === addr2){
                    return Promise.resolve([{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr2,
                            signer: "c388c04d4d70f0d21f35b6f176e9270c633c583b6dd6e8dcd9a961c5743a1f93",
                            type: 257,
                        }
                    },{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr1,
                            signer: "f1951b8cad9306b2fc328e4c411752dff74cea74eb1194d05a87d533f497954f",
                            type: 257,
                        }
                    }])
                }
                else{
                    console.log("called with wrong address:", address);
                }
            }

            let getImportanceMock = function(address, height){
                expect(height).toEqual(0);
                if(address === addr1){
                    return Promise.resolve(2);
                }
                else if(address === addr2){
                    return Promise.resolve(2);
                }
                else if(address === addr3){
                    return Promise.resolve(26);
                }
            }

            spyOn(Voting, 'pollDetails').and.returnValue(Promise.resolve(details));
            spyOn(nemUtils, 'getTransactionsWithString').and.callFake(getTransactionsMock);
            spyOn(nemUtils, 'getHeightByTimestamp').and.returnValue(Promise.resolve(0));
            spyOn(nemUtils, 'getImportance').and.callFake(getImportanceMock);

            //spyOn(Voting.Address, 'toAddress').and.callThrough();

            let end = new Date().getTime();

            // Act
            let resultsPromise = Voting.getPOIResults(addr1, end);

            // Assert
            let getTransParams = [[addr1, ""], [addr2, ""]];
            let getImportanceParams = [[addr3, 0], [addr2, 0], [addr2, 0], [addr1, 0]];

            let results = {
                "totalVotes": 4,
                "options": [{
                    "text": "yes",
                    "votes": 2,
                    "weighted": 3,
                    "percentage": 10
                },{
                    "text": "no",
                    "votes": 2,
                    "weighted": 27,
                    "percentage": 90
                }],
            }

            resultsPromise.then((resp) => {
                expect(resp).toEqual(results);
                expect(Voting.pollDetails).toHaveBeenCalledWith(addr1);
                expect(nemUtils.getTransactionsWithString.calls.allArgs()).toEqual(getTransParams);
                expect(nemUtils.getHeightByTimestamp).toHaveBeenCalledWith(end);
                expect(nemUtils.getImportance.calls.allArgs()).toEqual(getImportanceParams);
                done();
            }).catch(err=>{
                console.log(err);
            });
            scope.$apply();
        });

        it("gets correct results from an ongoing 1a1v poll", function(done) {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);

            let addr1 = "TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3";
            let addr2 = "TBFSKYW7SXRXGQNFUIOWTQ7HHJJFIGXUMUEKVGW2";
            let addr3 = "TAELULQTYYYSZ7JYLKSXPQREGQTRHU6WJYENWJ4Z";

            let details = {
                formData: {
                    doe: 1514721540000,
                    multiple: false,
                },
                options: {
                    addresses: [addr1, addr2],
                    strings: ["yes", "no"],
                },
                whitelist: [addr1, addr2, addr3]
            }

            let getTransactionsMock = function(address, str){
                expect(str).toEqual("");
                if(address === addr1){
                    return Promise.resolve([{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr1,
                            signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                            timeStamp: 69427468,
                            type: 257,
                        }
                    },{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr1,
                            signer: "f1951b8cad9306b2fc328e4c411752dff74cea74eb1194d05a87d533f497954f",
                            timeStamp: 69427468,
                            type: 257,
                        }
                    }])
                }
                else if(address === addr2){
                    return Promise.resolve([{
                        meta: {
                            height: 0
                        },
                        transaction: {
                            recipient: addr2,
                            signer: "c388c04d4d70f0d21f35b6f176e9270c633c583b6dd6e8dcd9a961c5743a1f93",
                            timeStamp: 69427468,
                            type: 257,
                        }
                    }])
                }
                else{
                    console.log("called with wrong address:", address);
                }
            }

            spyOn(Voting, 'pollDetails').and.returnValue(Promise.resolve(details));
            spyOn(nemUtils, 'getTransactionsWithString').and.callFake(getTransactionsMock);
            spyOn(nemUtils, 'getHeightByTimestamp').and.returnValue(Promise.resolve(0));

            let end = new Date().getTime();

            // Act
            let resultsPromise = Voting.get1a1vResults(addr1, end);

            // Assert
            let getTransParams = [[addr1, ""], [addr2, ""]];

            let results = {
                "totalVotes": 3,
                "options": [{
                    "text": "yes",
                    "votes": 2,
                    "weighted": 2,
                    "percentage": 200/3
                },{
                    "text": "no",
                    "votes": 1,
                    "weighted": 1,
                    "percentage": 100/3
                }],
            }

            resultsPromise.then((resp) => {
                expect(resp).toEqual(results);
                expect(Voting.pollDetails).toHaveBeenCalledWith(addr1);
                expect(nemUtils.getTransactionsWithString.calls.allArgs()).toEqual(getTransParams);
                expect(nemUtils.getHeightByTimestamp).toHaveBeenCalledWith(end);
                done();
            }).catch(err=>{
                console.log(err);
            });
            scope.$apply();
        });

    });


});
