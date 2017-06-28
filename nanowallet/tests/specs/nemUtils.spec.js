    import Sinks from '../../src/app/utils/sinks';
import WalletFixture from '../data/wallet';
import AccountDataFixture from '../data/accountData';
import PollDetailsFixture from '../data/poll.js';

describe('nemUtils tests', function() {
    let $controller,
        $rootScope,
        Wallet,
        DataBridge,
        nemUtils,
        $q,
        $filter;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.inject(function(_$filter_, _$rootScope_, _Wallet_, _DataBridge_, _nemUtils_, _$q_) {
        $rootScope = _$rootScope_;
        Wallet = _Wallet_;
        DataBridge = _DataBridge_;
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

    describe('nemUtils asyncronous tests', function() {

        beforeEach(function(done) {
            $rootScope.$apply();
            setTimeout(function() {
                done();
            }, 1);
        });

        it("getTransactionsWithString test", function(done) {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);

            let mockAddress = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB";

            let transaction1 = {
                meta: {
                    height: 5,
                    id: 1
                },
                transaction: {
                    message: 'message1',
                    recipient: "TCOORH3HFT5TKHHVLOMMFYEAZJ636ODSQYDLPIXX",
                    signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                    type: 257,
                }
            };
            let transaction2 = {
                meta: {
                    height: 6,
                    id: 2
                },
                transaction: {
                    message: 'message2',
                    recipient: "TCOORH3HFT5TKHHVLOMMFYEAZJ636ODSQYDLPIXX",
                    signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                    type: 257,
                }
            };
            let transaction3 = {
                meta: {
                    height: 7,
                    id: 3
                },
                transaction: {
                    message: 'message3',
                    recipient: "TCOORH3HFT5TKHHVLOMMFYEAZJ636ODSQYDLPIXX",
                    signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                    type: 257,
                }
            };
            let transaction4 = {
                meta: {
                    height: 8,
                    id: 4
                },
                transaction: {
                    message: 'message4',
                    recipient: "TCOORH3HFT5TKHHVLOMMFYEAZJ636ODSQYDLPIXX",
                    signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                    type: 257,
                }
            };

            let transactionList = [transaction1, transaction2, transaction3, transaction4];

            let transactionsMock = function(node, address, txID){
                if(!txID){
                    return Promise.resolve({data: [transaction4, transaction3]});
                }
                else if(txID !== 1){
                    return Promise.resolve({data: [transaction2, transaction1]});
                }
                else{
                    return Promise.resolve({data: []});
                }
            };

            spyOn(nemUtils._NetworkRequests, 'getAllTransactionsFromID').and.callFake(transactionsMock);
            // Act
            let messagesPromise = nemUtils.getTransactionsWithString(mockAddress, "");

            // Assert
            let resp = [transaction4, transaction3, transaction2, transaction1];
            messagesPromise.then((trans) => {
                expect(trans).toEqual(resp);
                done();
            });
            //expect(Voting._nemUtils.getTransactionsWithString).toHaveBeenCalledWith(pollIndex, "poll:");
            scope.$digest();
        });

        it("getTransactionsWithString test with non empty string", function(done) {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);

            let mockAddress = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB";

            let transaction1 = {
                meta: {
                    height: 5,
                    id: 1
                },
                transaction: {
                    message: 'message1',
                    recipient: "TCOORH3HFT5TKHHVLOMMFYEAZJ636ODSQYDLPIXX",
                    signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                    type: 257,
                }
            };
            let transaction2 = {
                meta: {
                    height: 6,
                    id: 2
                },
                transaction: {
                    message: 'message2',
                    recipient: "TCOORH3HFT5TKHHVLOMMFYEAZJ636ODSQYDLPIXX",
                    signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                    type: 257,
                }
            };
            let transaction3 = {
                meta: {
                    height: 7,
                    id: 3
                },
                transaction: {
                    message: 'message3',
                    recipient: "TCOORH3HFT5TKHHVLOMMFYEAZJ636ODSQYDLPIXX",
                    signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                    type: 257,
                }
            };
            let transaction4 = {
                meta: {
                    height: 8,
                    id: 4
                },
                transaction: {
                    message: 'message4',
                    recipient: "TCOORH3HFT5TKHHVLOMMFYEAZJ636ODSQYDLPIXX",
                    signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                    type: 257,
                }
            };

            let transactionList = [transaction1, transaction2, transaction3, transaction4];

            let transactionsMock = function(node, address, txID){
                if(!txID){
                    return Promise.resolve({data: [transaction4, transaction3]});
                }
                else if(txID !== 1){
                    return Promise.resolve({data: [transaction2, transaction1]});
                }
                else{
                    return Promise.resolve({data: []});
                }
            };

            spyOn(nemUtils._NetworkRequests, 'getAllTransactionsFromID').and.callFake(transactionsMock);
            spyOn(nemUtils, '_$filter').and.returnValue((a)=>{return a});
            // Act
            let messagesPromise = nemUtils.getTransactionsWithString(mockAddress, "message");

            // Assert
            let resp = [transaction4, transaction3, transaction2, transaction1];
            messagesPromise.then((trans) => {
                console.log("dd");
                expect(trans).toEqual(resp);
                done();
            });
            //expect(Voting._nemUtils.getTransactionsWithString).toHaveBeenCalledWith(pollIndex, "poll:");
            scope.$digest();
        });

        it("getTransactionsWithString filters by message correctly", function(done) {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);

            let mockAddress = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB";

            let transaction1 = {
                meta: {
                    height: 5,
                    id: 1
                },
                transaction: {
                    message: 'message1',
                    recipient: "TCOORH3HFT5TKHHVLOMMFYEAZJ636ODSQYDLPIXX",
                    signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                    type: 257,
                }
            };
            let transaction2 = {
                meta: {
                    height: 6,
                    id: 2
                },
                transaction: {
                    message: 'message2',
                    recipient: "TCOORH3HFT5TKHHVLOMMFYEAZJ636ODSQYDLPIXX",
                    signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                    type: 257,
                }
            };
            let transaction3 = {
                meta: {
                    height: 7,
                    id: 3
                },
                transaction: {
                    message: 'message3',
                    recipient: "TCOORH3HFT5TKHHVLOMMFYEAZJ636ODSQYDLPIXX",
                    signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                    type: 257,
                }
            };
            let transaction4 = {
                meta: {
                    height: 8,
                    id: 4
                },
                transaction: {
                    message: 'message4',
                    recipient: "TCOORH3HFT5TKHHVLOMMFYEAZJ636ODSQYDLPIXX",
                    signer: "b5122223d6a43eea2d22579c2bb229ac24f51f2b98c5970725a05439b71eee93",
                    type: 257,
                }
            };

            let transactionList = [transaction1, transaction2, transaction3, transaction4];

            let transactionsMock = function(node, address, txID){
                if(!txID){
                    return Promise.resolve({data: [transaction4, transaction3]});
                }
                else if(txID !== 1){
                    return Promise.resolve({data: [transaction2, transaction1]});
                }
                else{
                    return Promise.resolve({data: []});
                }
            };

            spyOn(nemUtils._NetworkRequests, 'getAllTransactionsFromID').and.callFake(transactionsMock);
            spyOn(nemUtils, '_$filter').and.returnValue((a)=>{return a});
            // Act
            let messagesPromise = nemUtils.getTransactionsWithString(mockAddress, "message2");

            // Assert
            let resp = [transaction2];
            messagesPromise.then((trans) => {
                console.log("dd");
                expect(trans).toEqual(resp);
                done();
            });
            scope.$digest();
        });

        it("can get Importance for current block", function(done) {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);

            let mockAddress = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB";

            spyOn(nemUtils._NetworkRequests, 'getAccountData').and.returnValue(Promise.resolve({
                account: {
                    importance: 5
                }
            }));
            spyOn(nemUtils._NetworkRequests, 'getHistoricalAccountData').and.returnValue(Promise.resolve({
            }));
            // Act

            // Assert
            nemUtils.getImportance(mockAddress).then((resp)=>{
                expect(nemUtils._NetworkRequests.getAccountData).toHaveBeenCalled();
                expect(nemUtils._NetworkRequests.getHistoricalAccountData).not.toHaveBeenCalled();
                expect(resp).toEqual(5);
                done();
            });
            scope.$digest();
        });

        it("can get historical Importance", function(done) {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);

            let mockAddress = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB";

            spyOn(nemUtils._NetworkRequests, 'getAccountData').and.returnValue(Promise.resolve({
            }));
            spyOn(nemUtils._NetworkRequests, 'getHistoricalAccountData').and.returnValue(Promise.resolve({
                data: {
                    data: [
                        {
                            importance: 5
                        }
                    ]
                }
            }));
            // Act

            // Assert
            nemUtils.getImportance(mockAddress, 1).then((resp)=>{
                expect(nemUtils._NetworkRequests.getAccountData).not.toHaveBeenCalled();
                expect(nemUtils._NetworkRequests.getHistoricalAccountData).toHaveBeenCalled();
                expect(resp).toEqual(5);
                done();
            });
            scope.$digest();
        });

        it("can check if a transaction does not exist", function(done) {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);

            let mockAddress1 = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHH";
            let mockAddress2 = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB";

            spyOn(nemUtils, 'getTransactionsWithString').and.returnValue(Promise.resolve([]));
            spyOn(nemUtils._NetworkRequests, 'getUnconfirmedTxes').and.returnValue(Promise.resolve([]));
            // Act

            // Assert
            nemUtils.existsTransaction(mockAddress1, mockAddress2).then((resp)=>{
                expect(nemUtils.getTransactionsWithString).toHaveBeenCalled();
                expect(nemUtils._NetworkRequests.getUnconfirmedTxes).toHaveBeenCalled();
                expect(resp).toEqual(0);
                done();
            });
            scope.$digest();
        });

        it("can check if a transaction does exist", function(done) {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);

            let mockAddress1 = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHH";
            let mockAddress2 = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB";

            spyOn(nemUtils, 'getTransactionsWithString').and.returnValue(Promise.resolve([{ transaction: {}}]));
            spyOn(nemUtils._NetworkRequests, 'getUnconfirmedTxes').and.returnValue(Promise.resolve([]));
            // Act

            // Assert
            nemUtils.existsTransaction(mockAddress1, mockAddress2).then((resp)=>{
                expect(nemUtils.getTransactionsWithString).toHaveBeenCalled();
                expect(nemUtils._NetworkRequests.getUnconfirmedTxes).not.toHaveBeenCalled();
                expect(resp).toEqual(2);
                done();
            });
            scope.$digest();
        });

        it("can check if a transaction exists as unconfirmed", function(done) {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);

            let mockAddress1 = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHH";
            let mockAddress2 = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB";

            spyOn(nemUtils, 'getTransactionsWithString').and.returnValue(Promise.resolve([]));
            spyOn(nemUtils._NetworkRequests, 'getUnconfirmedTxes').and.returnValue(Promise.resolve([{transaction: {
                recipient: mockAddress2
            }}]));
            // Act

            // Assert
            nemUtils.existsTransaction(mockAddress1, mockAddress2).then((resp)=>{
                expect(nemUtils.getTransactionsWithString).toHaveBeenCalled();
                expect(nemUtils._NetworkRequests.getUnconfirmedTxes).toHaveBeenCalled();
                expect(resp).toEqual(1);
                done();
            });
            scope.$digest();
        });

    });
});
