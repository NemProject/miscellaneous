import nem from "nem-sdk";

function PasswordInput() {
    'ngInject';

    return {
        restrict:'E',
        scope: {
        	common: '='
        },
        template: '<ng-include src="templatePasswordInput"/>',
        link: (scope) => {
        	scope.templatePasswordInput = 'layout/partials/passwordInput.html';
        }

    };
}

export default PasswordInput;