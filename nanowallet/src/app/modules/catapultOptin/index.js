import angular from 'angular';

// Create the module where our functionality can attach to
let catapultOptin = angular.module('app.catapultOptin', []);

// Include our UI-Router config settings
import CatapultOptInConfig from './catapultOptin/catapultOptin.config';
catapultOptin.config(CatapultOptInConfig);

// Controllers
import CatapultOptInCtrl from './catapultOptin/catapultOptin.controller';
catapultOptin.controller('CatapultOptInCtrl', CatapultOptInCtrl);

// Create the module where our functionality can attach to
let multisigOptin = angular.module('app.multisigOptin', []);

export default catapultOptin;
