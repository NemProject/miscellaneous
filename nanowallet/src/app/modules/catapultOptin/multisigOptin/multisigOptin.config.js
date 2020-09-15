function MultisigOptInConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.multisigOptin', {
            url: '/multisigOptin',
            controller: 'MultisigOptInCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/catapultOptin/multisigOptin/multisigOptin.html',
            title: 'Catapult Opt In'
        });

};

export default MultisigOptInConfig;
