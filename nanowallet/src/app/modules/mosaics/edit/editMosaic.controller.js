import nem from 'nem-sdk';

class editMosaicCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet, Alert, DataStore, $timeout) {
        'ngInject';

        //// Module dependencies region ////

        this._Alert = Alert;
        this._Wallet = Wallet;
        this._DataStore = DataStore;
        this._$timeout = $timeout;

        //// End dependencies region ////
 
        //// Module properties region ////

        // Form is a mosaic supply change transaction object
        this.formData = nem.model.objects.get("mosaicSupplyChangeTransaction");
        
        // Set first multisig account if any
        this.formData.multisigAccount = this._DataStore.account.metaData.meta.cosignatoryOf.length == 0 ? '' : this._DataStore.account.metaData.meta.cosignatoryOf[0];

        // Default current account address (used in view to get mosaic owned by account)
        this.mosaicOwned = this._DataStore.mosaic.ownedBy[this._Wallet.currentAccount.address];

        // Mosaics owned names for current account
        this.currentAccountMosaicNames = '';

        // Selected mosaic from view
        this.selectedMosaic = '';

        // Needed to prevent user to click twice on send when already processing
        this.okPressed = false;

        // Object to contain our password & private key data.
        this.common = nem.model.objects.get("common");

        // Store the prepared transaction
        this.preparedTransaction = {};

        //// End properties region ////

        // Get mosaics for current account
        this.updateCurrentAccountMosaics();

        // Update the fee in view
        this.prepareTransaction();
    }

    //// Module methods region ////

    /**
     * Update mosaic data for selected mosaic
     *
     * @note: Used in view (ng-update) on selected mosaic changes
     */
    updateMosaic() {
        this.formData.mosaic = this.mosaicOwned[this.selectedMosaic].mosaicId;
    }

    /**
     * Get current account mosaics owned names
     *
     * @note: Used in view (ng-update) on multisig changes
     */
    updateCurrentAccountMosaics() {
        // Get current account
        let acct = this.formData.isMultisig ? this.formData.multisigAccount.address : this._Wallet.currentAccount.address;
        // Set current account mosaics names if mosaicOwned is not undefined
        if (undefined !== this._DataStore.mosaic.ownedBy[acct]) {
            this.currentAccountMosaicNames = Object.keys(this._DataStore.mosaic.ownedBy[acct]).sort();
            this.mosaicOwned = this._DataStore.mosaic.ownedBy[acct];
        } else {
            this.currentAccountMosaicNames = ['nem:xem'];
            this.mosaicOwned = {};
        }
        // Default mosaic selected
        this.selectedMosaic = "nem:xem";
        this.prepareTransaction();
    }

    /**
     * Prepare the transaction
     */
    prepareTransaction() {
        let entity = nem.model.transactions.prepare("mosaicSupplyChangeTransaction")(this.common, this.formData, this._Wallet.network);
        this.preparedTransaction = entity;
        return entity;
    }

    /**
     * Reset data
     */
    resetData() {
        this.formData = nem.model.objects.get("mosaicSupplyChangeTransaction");
        this.common = nem.model.objects.get("common");
        this.preparedTransaction = {};
        this.prepareTransaction();
    }

    /**
     * Prepare and broadcast the transaction to the network
     */
    send() {
        // Disable send button;
        this.okPressed = true;

        // Get account private key for preparation or return
        if (!this._Wallet.decrypt(this.common)) return this.okPressed = false;

        // Prepare the transaction
        let entity = this.prepareTransaction();

        // Use wallet service to serialize and send
        this._Wallet.transact(this.common, entity).then(() => {
            this._$timeout(() => {
                // Enable send button
                this.okPressed = false;
                // Reset form data
                this.resetData();
                return;
            });
        }, () => {
            this._$timeout(() => {
                // Delete private key in common
                this.common.privateKey = '';
                // Enable send button
                this.okPressed = false;
                return;
            });
        });
    }

    //// End methods region ////

}

export default editMosaicCtrl;