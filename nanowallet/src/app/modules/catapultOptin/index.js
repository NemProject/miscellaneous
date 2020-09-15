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

// Include our UI-Router config settings
import MultisigOptInConfig from './multisigOptin/multisigOptin.config';
catapultOptin.config(MultisigOptInConfig);

// Controllers
import MultisigOptInCtrl from './multisigOptin/multisigOptin.controller';
catapultOptin.controller('MultisigOptInCtrl', MultisigOptInCtrl);


export default catapultOptin;
