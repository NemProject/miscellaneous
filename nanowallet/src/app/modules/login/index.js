import angular from 'angular';

// Create the module where our functionality can attach to
let loginModule = angular.module('app.login', []);

// Include our UI-Router config settings
import loginConfig from './login.config';
loginModule.config(loginConfig);

// Controllers
import LoginCtrl from './login.controller';
loginModule.controller('LoginCtrl', LoginCtrl);

// Services
import LoginService from './login.service';
loginModule.service('Login', LoginService);

export default loginModule;
