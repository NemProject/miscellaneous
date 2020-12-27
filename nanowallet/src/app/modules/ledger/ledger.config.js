function LedgerConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.ledger', {
            url: '/ledger',
            controller: 'LedgerCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/ledger/ledger.html',
            title: 'LEDGER'
        });

};

export default LedgerConfig;
