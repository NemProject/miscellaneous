import angular from 'angular';

// Create the module where our functionality can attach to
let importWalletBankupQrcodeModule = angular.module('app.importWalletBankupQrcode', []);

// Include our UI-Router config settings
import importWalletBankupQrcodeConfig from './importBankupQrcode.config';
importWalletBankupQrcodeModule.config(importWalletBankupQrcodeConfig);

// Controllers
import importWalletBankupQrcodeCtrl from './importBankupQrcode.controller';
importWalletBankupQrcodeModule.controller('importWalletBankupQrcodeCtrl', importWalletBankupQrcodeCtrl);

export default importWalletBankupQrcodeModule;
