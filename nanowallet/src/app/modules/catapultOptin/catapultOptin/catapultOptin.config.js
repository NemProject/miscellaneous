function CatapultOptInConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.catapultOptin', {
            url: '/catapultOptin',
            controller: 'CatapultOptInCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/catapultOptin/catapultOptin/catapultOptin.html',
            title: 'Symbol Opt In'
        });

};

export default CatapultOptInConfig;
