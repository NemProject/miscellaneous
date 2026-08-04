import nem from 'nem-sdk';
import WalletFixture from '../data/wallet';
import AccountDataFixture from '../data/accountData';

/**
 * Map the node list of the Wallet service to the endpoint objects exposed by the controllers
 *
 * @param {object} Wallet - The Wallet service
 *
 * @return {array} - An array of endpoint objects
 */
const expectedEndpoints = (Wallet) => Wallet.nodes.map((node) => ({
    "host": node.uri,
    "port": nem.model.nodes.defaultPort
}));

export const setupMainnetWallet = (Wallet, Nodes, DataBridge) => {
    Wallet.use(WalletFixture.mainnetWallet);
    Nodes.setDefault();
    DataBridge.accountData = AccountDataFixture.mainnetAccountData;
}

export const setupTestnetWallet = (Wallet, Nodes, DataBridge) => {
    Wallet.use(WalletFixture.testnetWallet);
    Nodes.setDefault();
    DataBridge.accountData = AccountDataFixture.testnetAccountData;
}

export const assertTestnetNodes = ($controller, $rootScope, controlName, Wallet, Nodes, DataBridge) => {
    // Arrange:
    setupTestnetWallet(Wallet, Nodes, DataBridge);

    const ctrl = $controller(controlName, {
        $scope: $rootScope.$new()
    });

    // Act:
    ctrl.setNodes();
    
    // Assert:
    expect(ctrl.nodes).toEqual(expectedEndpoints(Wallet));
}

export const assertSuperNodes = async ($controller, $rootScope, controlName, Wallet, Nodes, DataBridge, SuperNodeProgram, $timeout) => {
    // Arrange:
    const expectedDTO = new Array(2).fill({
        "host": "http://localhost",
        "port": 7890
    });

    spyOn(SuperNodeProgram, 'getRandomNodes').and.returnValue(Promise.resolve(expectedDTO));

    setupMainnetWallet(Wallet, Nodes, DataBridge);

    const ctrl = $controller(controlName, {
        $scope: $rootScope.$new()
    });

    // Act:
    await ctrl.setNodes();
    $timeout.flush();

    // Assert:
    expect(ctrl.nodes).toEqual(expectedDTO);
}

export const assertMainnetNodes = async ($controller, $rootScope, controlName, Wallet, Nodes, DataBridge, SuperNodeProgram, $timeout) => {
    // Arrange:
    spyOn(SuperNodeProgram, 'getRandomNodes').and.returnValue(Promise.reject('error'));

    setupMainnetWallet(Wallet, Nodes, DataBridge);

    const ctrl = $controller(controlName, {
        $scope: $rootScope.$new()
    });

    // Act:
    await ctrl.setNodes();
    $timeout.flush();

    // Assert:
    expect(ctrl.nodes).toEqual(expectedEndpoints(Wallet));
}
