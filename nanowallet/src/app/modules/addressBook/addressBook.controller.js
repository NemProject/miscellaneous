import helpers from '../../utils/helpers';
import CryptoHelpers from '../../utils/CryptoHelpers';

class AddressBookCtrl {
    constructor($localStorage, DataBridge, Wallet, Alert, $location, $filter, $q, $rootScope) {
        'ngInject';

        // DataBidge service
        this._DataBridge = DataBridge;
        // Wallet service
        this._Wallet = Wallet;
        // Alert service
        this._Alert = Alert;
        // $location to redirect
        this._location = $location;
        //Local storage
        this._storage = $localStorage;
        // Filters
        this._$filter = $filter;
        // Promises
        this._$q = $q;
        // Address
        this.accountAddress = '';
        // $rootScope
        this._$rootScope = $rootScope;

        // If no wallet show alert and redirect to home
        if (!this._Wallet.current) {
            this._Alert.noWalletLoaded();
            this._location.path('/');
            return;
        }

        /**
         * Default contacts properties
         */
        this.formData = {};
        this.formData.label = '';
        this.formData.address = '';
        this.is_edit = false;
        this.editElem = {};
        this.removeElem = {};

        // Sort
        this.revers = false;
        this.propertyName = 'label';

        // Contact list
        this._storage.contacts = this._storage.contacts || [];
        this.contacts = helpers.haveAddressBook(this._Wallet.currentAccount.address, this._storage.contacts);

        if (this.contacts === false) {
            this.contacts = {
                name: this._Wallet.currentAccount.address,
                items: []
            };
        }

        // Needed to prevent user to click twice on send when already processing
        this.okPressed = false;

        // Object to contain our password & private key data.
        this.common = {
            'password': '',
            'privateKey': '',
        };

        // Contacts to address book pagination properties
        this.currentPage = 0;
        this.pageSize = 10;
        this.numberOfPages = function() {
            return Math.ceil(this.contacts.items.length / this.pageSize);
        }
    }

    /**
     *
     * @param {object} propertyName - The property for filter
     */
    sortBy(propertyName) {
        this.revers = (this.propertyName === propertyName) ? !this.revers : false;
        this.propertyName = propertyName;
    };

    /**
     * New a contact
     */
    addContact() {
        this.is_edit = false;
        this.cleanData();
        $('#contactModal').modal('show');
    }

    /**
     * Add new contact to address book
     */
    add() {
        // Disable send button;
        this.okPressed = true;

        // Decrypt/generate private key and check it. Returned private key is contained into this.common
        if (!CryptoHelpers.passwordToPrivatekeyClear(this.common, this._Wallet.currentAccount, this._Wallet.algo, true)) {
            this._Alert.invalidPassword();
            // Enable send button
            this.okPressed = false;
            return;
        } else if (!CryptoHelpers.checkAddress(this.common.privateKey, this._Wallet.network, this._Wallet.currentAccount.address)) {
            this._Alert.invalidPassword();
            // Enable send button
            this.okPressed = false;
            return;
        }

        this.contacts.items.push({
            "label": this.formData.label,
            "address": this.formData.address
        });

        // Save data to locale storage
        this.saveAddressBook();

        // Reset data
        this.cleanData();

        $('#contactModal').modal('hide');

        // Enable send button;
        this.okPressed = false;
    }

    /**
     * Edit a contact
     *
     * @param {object} elem - The object to edit
     */
    editContact(elem) {
        this.is_edit = true;
        this.editElem = elem;
        this.formData.label = elem.label;
        this.formData.address = elem.address;
        $('#contactModal').modal('show');
    }

    /**
     * Save new values contact
     */
    edit() {
        // Disable send button;
        this.okPressed = true;

        // Decrypt/generate private key and check it. Returned private key is contained into this.common
        if (!CryptoHelpers.passwordToPrivatekeyClear(this.common, this._Wallet.currentAccount, this._Wallet.algo, true)) {
            this._Alert.invalidPassword();
            // Enable send button
            this.okPressed = false;
            return;
        } else if (!CryptoHelpers.checkAddress(this.common.privateKey, this._Wallet.network, this._Wallet.currentAccount.address)) {
            this._Alert.invalidPassword();
            // Enable send button
            this.okPressed = false;
            return;
        }

        var indexOfElem = this.contacts.items.indexOf(this.editElem);
        this.contacts.items[indexOfElem].label = this.formData.label;
        this.contacts.items[indexOfElem].address = this.formData.address;

        // Save data to locale storage
        this.saveAddressBook();

        // Reset data
        this.cleanData();

        $('#contactModal').modal('hide');

        // Enable send button;
        this.okPressed = false;
    }

    /**
     * Remove a contact from address book array
     *
     * @param {object} elem - The object to delete
     */
    removeContact(elem) {
        this.removeElem = elem;
        $('#removeContactModal').modal('show');
    }

    /**
     * Remove a contact
     */
    remove() {
        // Disable send button;
        this.okPressed = true;

        // Decrypt/generate private key and check it. Returned private key is contained into this.common
        if (!CryptoHelpers.passwordToPrivatekeyClear(this.common, this._Wallet.currentAccount, this._Wallet.algo, true)) {
            this._Alert.invalidPassword();
            // Enable send button
            this.okPressed = false;
            return;
        } else if (!CryptoHelpers.checkAddress(this.common.privateKey, this._Wallet.network, this._Wallet.currentAccount.address)) {
            this._Alert.invalidPassword();
            // Enable send button
            this.okPressed = false;
            return;
        }

        // If the deleted element is the elem 0 and length of array mod 5 gives 0 (means it is the last object of the page),
        // we return a page behind unless it is page 1.
        if (this.contacts.items.indexOf(this.removeElem) === 0 && this.currentPage + 1 > 1 && (this.contacts.items.length - 1) % 5 === 0) {
            this.currentPage = this.currentPage - 1;
        }

        this.contacts.items.splice(this.contacts.items.indexOf(this.removeElem), 1);
        this.removeElem = {};

        this.saveAddressBook();

        $('#removeContactModal').modal('hide');

        // Enable send button;
        this.okPressed = false;
    }

    // Save data to locale storage
    saveAddressBook() {
        let i = null;
        for (i = 0; this._storage.contacts.length > i; i++) {
            if (this._storage.contacts[i].name === this._Wallet.currentAccount.address) {
                this._storage.contacts[i] = this.contacts;
                return true;
            }
        }

        this._storage.contacts.push(this.contacts);
    }

    /**
     * Clean temp data
     */
    cleanData() {
        this.formData.label = "";
        this.formData.address = "";
        this.editElem = {};
    }

    /**
     * Export address book to .adb file
     */
    exportAddressBook() {
        // Wallet object string to word array
        let contacts = this.contacts.items;

        for (var i = 0; i < contacts.length; i++) {
            delete contacts[i].$$hashKey;
        }

        let wordArray = CryptoJS.enc.Utf8.parse(JSON.stringify(contacts));
        // Word array to base64
        let base64 = CryptoJS.enc.Base64.stringify(wordArray);
        // Set download element attributes
        $("#exportAddressBook").attr('href', 'data:application/octet-stream,' + base64);
        $("#exportAddressBook").attr('download', this._Wallet.current.name + '.adb');
        // Simulate click to trigger download
        document.getElementById("exportAddressBook").click();
    }

    /**
     * Trigger for select .adb file
     */
    uploadAddressBook() {
        document.getElementById("uploadAddressBook").click();
    }

    /**
     * Import address book from .adb file
     * @param $fileContent - content file for import
     */
    importAddressBook($fileContent) {
        let contacts = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse($fileContent)));

        if (contacts.length) {
            for (var i = 0; i < contacts.length; i++) {
                if (typeof contacts[i].label != 'undefined' && typeof contacts[i].address != 'undefined') {
                    this.contacts.items.push(contacts[i]);
                }
            }

            $("#uploadAddressBook").val(null);

            // Save data to locale storage
            this.saveAddressBook();

            // Show alert
            this._Alert.addressBookFileSuccess();
        }
    }

    /**
     * Send XEM to select address
     *
     * @param address - account address
     */
    transferTransaction(address) {
        this._$rootScope.address = address;
        this._location.path('/transfer-transactions');
    }
}

export default AddressBookCtrl;