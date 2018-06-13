function importWalletBankupQrcodeConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.importWalletBankupQrcode', {
            url: '/import-wallet-bankup-qrcode',
            controller: 'importWalletBankupQrcodeCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/importWalletBankupQrcode/index.html',
            title: 'Import wallet bankup qrcode'
        });

};

export default importWalletBankupQrcodeConfig;