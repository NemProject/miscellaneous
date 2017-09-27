import nem from "nem-sdk";

class MultisigSelectCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor($timeout, Wallet, DataStore) {
        'ngInject';

        // Initialise when component is ready
        this.$onInit = () => {

            //// Component dependencies region ////

            this._$timeout = $timeout;
            this._Wallet = Wallet;
            this._DataStore = DataStore;

            //// End dependencies region ////

        }

    }

    //// Component methods region ////

    update() {
        this._$timeout(() => {
            this.updateCtrl();
        })
    }

    //// End methods region ////

}

// Header config
let MultisigSelect = {
    controller: MultisigSelectCtrl,
    templateUrl: 'layout/partials/multisigSelect.html',
    bindings: {
        multisigAccount: '=multisigAccount',
        updateCtrl: '&',
        isDisabled: '=isDisabled'
    }
};

export default MultisigSelect;