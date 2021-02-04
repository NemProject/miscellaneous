import angular from 'angular';

// Create the module where our functionality can attach to
let ledgerModule = angular.module('app.ledger', []);

// Include our UI-Router config settings
import ledgerConfig from './ledger.config';
ledgerModule.config(ledgerConfig);

// Controllers
import ledgerCtrl from './ledger.controller';
ledgerModule.controller('LedgerCtrl', ledgerCtrl);

// Services
import ledgerService from './ledger.service';
ledgerModule.service('Ledger', ledgerService);

export default ledgerModule;
