import angular from 'angular';

// Create the module where our functionality can attach to
let NEMonster = angular.module('app.NEMonster', []);

// Include our UI-Router config settings
import NEMonsterConfig from './setup/NEMonster.config';
NEMonster.config(NEMonsterConfig);

// Controllers
import NEMonsterCtrl from './setup/NEMonster.controller';
NEMonster.controller('NEMonsterCtrl',NEMonsterCtrl);

export default NEMonster;
