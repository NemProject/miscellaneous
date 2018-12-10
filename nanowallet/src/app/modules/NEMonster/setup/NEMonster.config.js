function NEMonsterConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.NEMonster', {
            url: '/NEMonster/setup',
            controller: 'NEMonsterCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/NEMonster/setup/NEMonster.html',
            title: 'NEMonster'
        });

};

export default NEMonsterConfig;