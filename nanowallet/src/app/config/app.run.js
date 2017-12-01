function AppRun(AppConstants, $rootScope, $timeout, Wallet, Alert, $transitions) {
    'ngInject';

     // Change page title based on state
    $transitions.onSuccess({ to: true }, (transition) => {
        $rootScope.setPageTitle(transition.router.globals.current.title);
        // Enable tooltips globally
        $timeout( function() {
            $('[data-toggle="tooltip"]').tooltip()
        });     
    });

    // Check if a wallet is loaded before accessing private states
    $transitions.onStart({ 
        to: (state) => { 
            return (state.name !== 'app.home') && (state.name !== 'app.login') && (state.name !== 'app.signup') && (state.name !== 'app.faq') && (state.name !== 'app.trezor');
        }
    }, (transition) => {
        if (!Wallet.current) {
            Alert.noWalletLoaded();
            return transition.router.stateService.target('app.home');
        }
    });

    // Helper method for setting the page's title
    $rootScope.setPageTitle = (title) => {
        $rootScope.pageTitle = '';
        if (title) {
            $rootScope.pageTitle += title;
            $rootScope.pageTitle += ' \u2014 ';
        }
        $rootScope.pageTitle += AppConstants.appName;
    };
}

export default AppRun;
