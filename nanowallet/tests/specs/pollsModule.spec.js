import Sinks from '../../src/app/utils/sinks';
import WalletFixture from '../data/wallet';
import AccountDataFixture from '../data/accountData';
import PollDetailsFixture from '../data/poll.js'

describe('voting module tests', function() {
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
        let ctrl = $controller('pollsCtrl', {$scope: scope});

        // Assert
        expect(ctrl.loadingPoll).toBe(false);
        expect(ctrl.loadingResults).toBe(false);
        expect(ctrl.common).toEqual({"password": "", "privateKey": ""});
        expect(ctrl.allPolls).toEqual([]);
        expect(ctrl.pollsList).toEqual([]);
        expect(ctrl.selectedPoll).toBe(null);

        expect(ctrl.selectedOption).toEqual("");
        expect(ctrl.selectedOptions).toEqual([]);

        expect(ctrl.showDetails).toBe(false);
        expect(ctrl.showVote).toBe(false);

        expect(ctrl.tab).toEqual(1);
        expect(ctrl.onlyVotable).toBe(true);

        expect(ctrl.issues).toEqual([]);
        expect(ctrl.invalidVote).toBe(true);
        expect(ctrl.alreadyVoted).toBe(false);
        expect(ctrl.pollFinished).toBe(false);

        expect(ctrl.voting).toBe(false);
    });

    describe('voting delegated tests', function() {

        beforeEach(function(done) {
            $rootScope.$apply();
            setTimeout(function() {
                done();
            }, 1);
        });

        it("pass right parameters to getPolls", function() {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);
            let ctrl = $controller('pollsCtrl', {$scope: scope});

            spyOn(ctrl._Voting, 'getPolls').and.returnValue($q.when({}));
            let testIndex = "TBQXEACS5UAWDBUIILLWXNHK44TVHAOTDVICKHHB";

            // Act
            ctrl.pollIndexAccount = testIndex;
            ctrl.getPolls();

            // Assert
            expect(ctrl._Voting.getPolls).toHaveBeenCalledWith(testIndex);
        });

        it("pass right parameters to vote", function() {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);
            let ctrl = $controller('pollsCtrl', {$scope: scope});
            ctrl.common = {
                "privateKey": "",
                "password": "TestTest11"
            };

            ctrl.selectedPoll = PollDetailsFixture.testPoll;
            ctrl.selectedOption = 1;

            // Act
            spyOn(ctrl._Voting, 'vote').and.returnValue($q.when({}));
            ctrl.vote();

            // Assert
            expect(ctrl._Voting.vote).toHaveBeenCalledWith("TAKS2UKMWNT7RWCHHAAC3MZBNPJJ7Z4HFX7I4MWV", ctrl.common);
        });

        it("pass right parameters to vote when multisig", function() { // TODO
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);
            let ctrl = $controller('pollsCtrl', {$scope: scope});
            ctrl.common = {
                "privateKey": "",
                "password": "TestTest11"
            };

            ctrl.multisigVote = true;
            ctrl.multisigAccount = "TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3";

            ctrl.selectedPoll = PollDetailsFixture.testPoll;
            ctrl.selectedOption = 1;

            // Act
            spyOn(ctrl._Voting, 'vote').and.returnValue($q.when({}));
            ctrl.vote();

            // Assert
            expect(ctrl._Voting.vote).toHaveBeenCalledWith("TAKS2UKMWNT7RWCHHAAC3MZBNPJJ7Z4HFX7I4MWV", ctrl.common, "TCCXQPJNPXAZFKV2IZHIFLAGTSN42WPNAQI6XGK3");
        });

        it("vote is not called with wrong password", function() {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);
            let ctrl = $controller('pollsCtrl', {$scope: scope});
            ctrl.common = {
                "privateKey": "",
                "password": "TestTest"
            };

            ctrl.selectedPoll = PollDetailsFixture.testPoll;
            ctrl.selectedOption = 1;

            // Act
            spyOn(ctrl._Voting, 'vote').and.returnValue($q.when({}));
            ctrl.vote();

            // Assert
            expect(ctrl._Voting.vote).not.toHaveBeenCalled();
        });

        it("vote is not called if the vote is not valid", function() {
            // Arrange:
            let scope = $rootScope.$new();
            createDummyWalletContextTestnet(Wallet);
            let ctrl = $controller('pollsCtrl', {$scope: scope});
            ctrl.common = {
                "privateKey": "",
                "password": "TestTest11"
            };

            ctrl.selectedPoll = PollDetailsFixture.pastPoll;

            // Act
            spyOn(ctrl._Voting, 'vote').and.returnValue($q.when({}));
            ctrl.vote();

            // Assert
            expect(ctrl._Voting.vote).not.toHaveBeenCalled();
            expect(ctrl.invalidVote).toBe(true);
        });

    });

});
