import Sinks from '../../src/app/utils/sinks';
import WalletFixture from '../data/wallet';
import AccountDataFixture from '../data/accountData';

describe('Poll creation module tests', function() {
    let $controller,
        $rootScope,
        Wallet,
        DataBridge,
        $q,
        $filter;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.inject(function(_$filter_, _$controller_, _$rootScope_, _Wallet_, _DataBridge_, _$q_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        Wallet = _Wallet_;
        DataBridge = _DataBridge_;
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

    it("Default properties initialized", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('createPollCtrl', {$scope: scope});

        // Assert
        expect(ctrl.formData).toEqual({
            title: '',
            doe: NaN,
            multiple: false,
            type: 0,
        });
        expect(ctrl.description).toEqual('');
        expect(ctrl.options).toEqual(['yes', 'no']);
        expect(ctrl.whitelist).toEqual(['']);
        expect(ctrl.hasWhitelist).toBe(false);
        expect(ctrl.hasMosaic).toBe(false);
        expect(ctrl.doeString).toEqual('');
        expect(ctrl.invalidData).toBe(true);
        expect(ctrl.issues).toEqual({
            blankTitle: true,
            pastDate: false,
            invalidDate: true,
            blankOptions: [
                false, false
            ],
            invalidAddresses: [],
            invalidIndexAccount: false,
            noPassword: true,
            titleTooLong: false,
            descriptionTooLong: false,
            optionsTooLong: false,
            whitelistTooLong: false,
            pollTooLong: false
        });

        // Common
        expect(ctrl.common).toEqual({"password": "", "privateKey": ""});

        expect(ctrl.formDataMessage).toEqual('');
        expect(ctrl.descriptionMessage).toEqual('');
        expect(ctrl.optionsMessage).toEqual('');
        expect(ctrl.whitelistMessage).toEqual('');
        expect(ctrl.pollMessage).toEqual('');

        expect(ctrl.fee).toEqual(4000000);

        expect(ctrl.creating).toBe(false);
    });

    it("Calculates correct fee (POI)", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('createPollCtrl', {$scope: scope});

        ctrl.formData = {
            title: "XXXXXXXXXX",
            doe: 1514721540000,
            multiple: false,
            updatable: false,
            type: 0
        };
        ctrl.description = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
        ctrl.options = ['yes', 'no'];

        // Act
        scope.$digest();
        ctrl.updateMessages();

        // Assert
        expect(ctrl.fee).toEqual(18000000);
    });

    it("Calculates correct fee (1a1v)", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('createPollCtrl', {$scope: scope});

        ctrl.formData = {
            title: "XXXXXXXXXX",
            doe: 1514721540000,
            multiple: false,
            updatable: false,
            type: 1
        };
        ctrl.whitelist = ["TAR75H2CSRTWAPLLLHI7M2B3SXPTD2HASALUD36B", "TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3"];
        ctrl.description = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
        ctrl.options = ['yes', 'no'];

        // Act
        scope.$digest();
        ctrl.updateMessages();

        // Assert
        expect(ctrl.fee).toEqual(26000000);
    });

    it("Calculates correct fee (token)", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('createPollCtrl', {$scope: scope});

        ctrl.formData = {
            title: "XXXXXXXXXX",
            doe: 1514721540000,
            multiple: false,
            updatable: false,
            type: 2
        };
        ctrl.formData.mosaic = "nem:xem";
        ctrl.description = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
        ctrl.options = ['yes', 'no'];

        // Act
        scope.$digest();
        ctrl.updateMessages();

        // Assert
        expect(ctrl.fee).toEqual(20000000);
    });

    it("calculates correct fees on mainet", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextMainnet(Wallet);
        let ctrl = $controller('createPollCtrl', {$scope: scope});

        ctrl.formData = {
            title: "XXXXXXXXXX",
            doe: 1514721540000,
            multiple: false,
            updatable: false,
            type: 0
        };
        ctrl.formData.mosaic = "nem:xem";
        ctrl.whitelist = ["TAR75H2CSRTWAPLLLHI7M2B3SXPTD2HASALUD36B", "TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3"];
        ctrl.description = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
        ctrl.options = ['yes', 'no'];

        // Act
        ctrl.formData.type = 0;
        scope.$digest();
        ctrl.updateMessages();

        // Assert
        expect(ctrl.fee).toEqual(18000000);

        // Act
        ctrl.formData.type = 1;
        scope.$digest();
        ctrl.updateMessages();

        // Assert
        expect(ctrl.fee).toEqual(26000000);

        // Act
        ctrl.formData.type = 2;
        scope.$digest();
        ctrl.updateMessages();

        // Assert
        expect(ctrl.fee).toEqual(20000000);
    });

    it("generates correct messages", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextMainnet(Wallet);
        let ctrl = $controller('createPollCtrl', {$scope: scope});

        ctrl.formData = {
            title: "XXXXXXXXXX",
            doe: 1514721540000,
            multiple: false,
            updatable: false,
            type: 0
        };
        ctrl.formData.mosaic = "nem:xem";
        ctrl.whitelist = ["TAR75H2CSRTWAPLLLHI7M2B3SXPTD2HASALUD36B", "TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3"];
        ctrl.description = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
        ctrl.options = ['yes', 'no'];

        // Act
        ctrl.formData.type = 0;
        scope.$digest();
        ctrl.updateMessages();

        // Assert
        expect(ctrl.formDataMessage).toEqual('formData:{"title":"XXXXXXXXXX","doe":1514721540000,"multiple":false,"updatable":false,"type":0}');
        expect(ctrl.descriptionMessage).toEqual('description:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
        expect(ctrl.optionsMessage).toEqual('options:{"strings":["yes","no"],"addresses":["XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"]}');
        expect(ctrl.pollMessage).toEqual('poll:{"title":"XXXXXXXXXX","type":0,"doe":1514721540000,"address":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}');

        // Act
        ctrl.formData.type = 1;
        scope.$digest();
        ctrl.updateMessages();

        // Assert
        expect(ctrl.whitelistMessage).toEqual('whitelist:["TAR75H2CSRTWAPLLLHI7M2B3SXPTD2HASALUD36B","TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3"]');

        // Act
        ctrl.formData.type = 2;
        scope.$digest();
        ctrl.updateMessages();

        // Assert
        expect(ctrl.formDataMessage).toEqual('formData:{"title":"XXXXXXXXXX","doe":1514721540000,"multiple":false,"updatable":false,"type":2,"mosaic":"nem:xem"}');
        expect(ctrl.pollMessage).toEqual('poll:{"title":"XXXXXXXXXX","type":2,"doe":1514721540000,"address":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","mosaic":"nem:xem"}');
    });

    it("Can change mosaic", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('createPollCtrl', {$scope: scope});

        // Act
        ctrl.formData.type = 2;
        ctrl.formData.mosaic = "nano:points";
        scope.$digest();

        // Assert
        expect(ctrl.formData.mosaic).toEqual("nano:points");
    });

    it("Can change poll Index Account", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('createPollCtrl', {$scope: scope});

        // Act
        ctrl.pollIndexAccount = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB";
        scope.$digest();

        // Assert
        expect(ctrl.pollIndexAccount).toEqual("TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB");
    });

    it("Can change poll type", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('createPollCtrl', {$scope: scope});

        // Act
        ctrl.typeString = "Simple";
        ctrl.changeType();
        scope.$digest();

        // Assert
        expect(ctrl.hasMosaic).toBe(false);
        expect(ctrl.hasWhitelist).toBe(true);
        expect(ctrl.formData.type).toEqual(1);

        // Act
        ctrl.typeString = "POI";
        ctrl.changeType();
        scope.$digest();

        // Assert
        expect(ctrl.hasMosaic).toBe(false);
        expect(ctrl.hasWhitelist).toBe(false);
        expect(ctrl.formData.type).toEqual(0);

    });

    describe('poll Creation module delegated tests', function() {

        it("Pass right parameters to createPoll", function() {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);
            let ctrl = $controller('createPollCtrl', {$scope: scope});
            ctrl.common = {
                "privateKey": "",
                "password": "TestTest11"
            };

            ctrl.formData = {
                title: "XXXXXXXXXXT",
                doe: 1514721540000,
                multiple: false,
                updatable: false,
                type: 0
            };
            ctrl.formData.mosaic = "nem:xem";
            ctrl.whitelist = ["TAR75H2CSRTWAPLLLHI7M2B3SXPTD2HASALUD36B", "TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3"];
            ctrl.description = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
            ctrl.options = ['yes', 'no'];

            let expectedDetails = {
                formData: {
                    title: "XXXXXXXXXXT",
                    doe: 1514721540000,
                    multiple: false,
                    updatable: false,
                    type: 0
                },
                options: [
                    'yes', 'no'
                ],
                description: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                whitelist: ["TAR75H2CSRTWAPLLLHI7M2B3SXPTD2HASALUD36B", "TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3"]
            };
            if (ctrl.formData.type !== 2)
                delete expectedDetails.formData.mosaic;
            scope.$digest();

            spyOn(ctrl._Voting, 'createPoll').and.returnValue($q.when({}));
            // Act
            ctrl.create();

            // Assert
            expect(ctrl._Voting.createPoll).toHaveBeenCalledWith(expectedDetails, ctrl.pollIndexAccount, ctrl.common);

            //with different index
            ctrl.pollIndexAccount = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB";
            ctrl.create();

            expect(ctrl._Voting.createPoll).toHaveBeenCalledWith(expectedDetails, "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB", ctrl.common);
        });

        it("Pass right parameters to createPoll with different pollIndex", function() {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);
            let ctrl = $controller('createPollCtrl', {$scope: scope});
            ctrl.common = {
                "privateKey": "",
                "password": "TestTest11"
            };

            ctrl.formData = {
                title: "XXXXXXXXXXT",
                doe: 1514721540000,
                multiple: false,
                updatable: false,
                type: 0
            };
            ctrl.formData.mosaic = "nem:xem";
            ctrl.whitelist = ["TAR75H2CSRTWAPLLLHI7M2B3SXPTD2HASALUD36B", "TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3"];
            ctrl.description = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
            ctrl.options = ['yes', 'no'];

            let expectedDetails = {
                formData: {
                    title: "XXXXXXXXXXT",
                    doe: 1514721540000,
                    multiple: false,
                    updatable: false,
                    type: 0
                },
                options: [
                    'yes', 'no'
                ],
                description: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                whitelist: ["TAR75H2CSRTWAPLLLHI7M2B3SXPTD2HASALUD36B", "TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3"]
            };
            if (ctrl.formData.type !== 2)
                delete expectedDetails.formData.mosaic;
            ctrl.pollIndexAccount = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB";
            scope.$digest();

            spyOn(ctrl._Voting, 'createPoll').and.returnValue($q.when({}));
            // Act
            ctrl.create();

            // Assert
            expect(ctrl._Voting.createPoll).toHaveBeenCalledWith(expectedDetails, "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB", ctrl.common);
        });

        it("Can't call createPoll if wrong password", function() {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);
            let ctrl = $controller('createPollCtrl', {$scope: scope});
            scope.$digest();
            spyOn(ctrl._Voting, 'createPoll');
            ctrl.common = {
                "privateKey": "",
                "password": "TestTest"
            }
            ctrl.formData = {
                title: "XXXXXXXXXXT",
                doe: 1514721540000,
                multiple: false,
                updatable: false,
                type: 0
            };
            ctrl.formData.mosaic = "nem:xem";
            ctrl.whitelist = ["TAR75H2CSRTWAPLLLHI7M2B3SXPTD2HASALUD36B", "TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3"];
            ctrl.description = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
            ctrl.options = ['yes', 'no'];

            // Act
            ctrl.create();

            // Assert
            expect(ctrl._Voting.createPoll).not.toHaveBeenCalled();
        });

        it("Can't call createPoll if invalid fields", function() {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);
            let ctrl = $controller('createPollCtrl', {$scope: scope});
            scope.$digest();
            spyOn(ctrl._Voting, 'createPoll');
            ctrl.common = {
                "privateKey": "",
                "password": "TestTest"
            }
            ctrl.formData = {
                title: "XXXXXXXXXXT",
                doe: 1000000000000, //past date
                multiple: false,
                updatable: false,
                type: 0
            };
            ctrl.formData.mosaic = "nem:xem";
            ctrl.whitelist = ["TAR75H2CSRTWAPLLLHI7M2B3SXPTD2HASALUD36B", "TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3"];
            ctrl.description = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
            ctrl.options = ['yes', 'no'];

            // Act
            ctrl.create();

            // Assert
            expect(ctrl._Voting.createPoll).not.toHaveBeenCalled();
        });
    });

});
