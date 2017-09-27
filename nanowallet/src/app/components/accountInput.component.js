import nem from "nem-sdk";

class AccountInputCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor($timeout, Wallet, Recipient, $state) {
        'ngInject';

        // Initialise when component is ready
        this.$onInit = () => {

            //// Component dependencies region ////

            this._$timeout = $timeout;
            this._Wallet = Wallet;
            this._Recipient = Recipient;

            //// End dependencies region ////

            //// Component properties region ///

            // The account bound to the input
            this.accountView = this.account || "";
            // The alias
            this.alias  = "";
            // Show / Hide contact list
            this.showContacts = false;
            // Show title of input according to current page
            this.isCosignatory = $state.router.globals.current.name === 'app.transferTransaction' ? false : true;

            //// End properties region ////

            // If a recipient is set we get it's data
            if (this.account) this.processRecipientInput();
        }

    }

    //// Component methods region ////

    /**
     * Process recipient input and get data from network
     */
    processRecipientInput() {
        // Reset recipient data
        this.resetRecipientData();
        //
        return this._Recipient.getAccount(this.accountView).then((res) => {
            this._$timeout(() => {
                //
                this.setRecipientData(res);
                return;
            });
        },
        (err) => {
            this._$timeout(() => {
                // Reset recipient data
                this.resetRecipientData();
                return;
            });
        });
    }

    /**
     * Process @alias input and get owner data from network
     */
    processAliasInput() {
        // Check if alias
        if (this.accountView.lastIndexOf("@", 0) !== 0) return;
        // Reset recipient data
        this.resetRecipientData();
        //
        return this._Recipient.getAlias(this.accountView).then((res) => {
            this._$timeout(() => {
                //
                this.setRecipientData(res);
                return;
            });
        },
        (err) => {
            this._$timeout(() => {
                // Reset recipient data
                this.resetRecipientData();
                return;
            });
        });
    }

    /**
     * Set data received from Recipient service to the form
     *
     * @param {object} - An [AccountInfo]{@link http://bob.nem.ninja/docs/#accountInfo} object
     */
    setRecipientData(data) {
        // Arrange for alias
        if (this.accountView.lastIndexOf("@", 0) === 0) {
            this.alias = this.accountView.substring(1);
            this.accountView = nem.utils.format.address(data.account.address);
        }
        // Store recipient public key
        this.publicKey = data.account.publicKey;
        // Set clean the address
        this.account = data.account.address;
        return;
    }

    /**
     * Reset data stored for recipient
     */
    resetRecipientData() {
        // Hide alias address input field
        this.alias = "";
        // Reset public key data
        this.publicKey = "";
        // Reset the account
        this.account = "";
        return;
    }

    /**
     * Show / Hide address book <select> and clean data
     */
    showHideAddressBook() {
        this.showContacts = this.showContacts ? this.showContacts = false : this.showContacts = true;
        this.accountView = undefined;
        this.resetRecipientData();
    }

    //// End methods region ////

}

// Header config
let AccountInput = {
    controller: AccountInputCtrl,
    templateUrl: 'layout/partials/accountInput.html',
    bindings: {
        account: '=account',
        publicKey: '=publicKey'
    }
};

export default AccountInput;