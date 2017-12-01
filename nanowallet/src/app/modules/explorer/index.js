import angular from 'angular';

// Create the module where our functionality can attach to
let explorerHomeModule = angular.module('app.explorerHome', []);

// Include our UI-Router config settings
import ExplorerHomeConfig from './home/explorerHome.config';
explorerHomeModule.config(ExplorerHomeConfig);

// Controllers
import ExplorerHomeCtrl from './home/explorerHome.controller';
explorerHomeModule.controller('ExplorerHomeCtrl', ExplorerHomeCtrl);

// Components
import ExplorerNav from './layout/nav.component';
explorerHomeModule.component('explorerNav', ExplorerNav);

export default explorerHomeModule;
