import nem from "nem-sdk";

class SimpleAndMultisigSelectCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor($timeout, Wallet, DataStore) {
        'ngInject';

        // Initialize when component is ready
        this.$onInit = () => {

            //// Component dependencies region ////

            this._$timeout = $timeout;
            this._Wallet = Wallet;
            this._DataStore = DataStore;

            //// End dependencies region ////
            this.allAccounts = [
                this._DataStore.account.metaData.account,
                ...this._DataStore.account.metaData.meta.cosignatoryOf
            ]
        }

    }

    //// Component methods region ////

    /**
     * Update the controller
     */
    update() {
        this._$timeout(() => {
            this.updateCtrl();
        })
    }

    //// End methods region ////

}

// MultisigSelect config
let SimpleAndMultisigSelect = {
    controller: SimpleAndMultisigSelectCtrl,
    templateUrl: 'layout/partials/simpleAndMultisigSelect.html',
    bindings: {
        account: '=account',
        updateCtrl: '&',
        isDisabled: '=isDisabled'
    }
};

export default SimpleAndMultisigSelect;
