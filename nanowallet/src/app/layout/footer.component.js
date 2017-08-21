class AppFooterCtrl {
    constructor(AppConstants, $localStorage, $filter, Alert) {
        'ngInject';

        // Application constants
        this._AppConstants = AppConstants;
        this._storage = $localStorage;
        this._$filter = $filter;
        this._Alert = Alert;
    }

    /**
     * Reset data from localstorage
     */
    purge() {
        if (confirm(this._$filter('translate')('HEADER_PURGE_MESSAGE')) == true) {
           this._storage.wallets = [];
            this._Alert.successPurge();
        } else {
            this._Alert.purgeCancelled();
        }
    }
}

let AppFooter = {
    controller: AppFooterCtrl,
    templateUrl: 'layout/footer.html'
};

export default AppFooter;