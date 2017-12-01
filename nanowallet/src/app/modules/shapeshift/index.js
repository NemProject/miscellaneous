import angular from 'angular';

// Create the module where our functionality can attach to
let ShapeshiftModule = angular.module('app.shapeshift', []);

// Include our UI-Router config settings
import ShapeshiftConfig from './shapeshift.config';
ShapeshiftModule.config(ShapeshiftConfig);

// Controllers
import ShapeshiftCtrl from './shapeshift.controller';
ShapeshiftModule.controller('ShapeshiftCtrl', ShapeshiftCtrl);

export default ShapeshiftModule;
