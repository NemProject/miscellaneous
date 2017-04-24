import helpers from '../../../utils/helpers';
import Serialization from '../../../utils/Serialization';
import convert from '../../../utils/convert';

class SignMultisigCtrl {
    constructor(Wallet, Alert, $location, DataBridge, NetworkRequests) {
        'ngInject';

        // Alert service
        this._Alert = Alert;
        // $location to redirect
        this._location = $location;
        // Wallet service
        this._Wallet = Wallet;
        // DataBridge service
        this._DataBridge = DataBridge;
        // Network requests service
        this._NetworkRequests = NetworkRequests;

        // If no wallet show alert and redirect to home
        if (!this._Wallet.current) {
            this._Alert.noWalletLoaded();
            this._location.path('/');
            return;
        }

        /**
         * Default properties 
         */

         // Store unconfirmed txes
         this.unconfirmed = [];

        // Unconfirmed txes pagination properties
        this.currentPage = 0;
        this.pageSize = 5;
        this.numberOfPages = function() {
            return Math.ceil(this.unconfirmed.length / this.pageSize);
        }

        // Get unconfirmed transactions
        this.getUnconfirmedTransactions();

    }

    /**
     * Fetch unconfirmed transactions for the current account
     */
    getUnconfirmedTransactions() {
        // Reset to initial page
        this.currentPage = 0;
        // 
        this._NetworkRequests.getUnconfirmedTxes(helpers.getHostname(this._Wallet.node), this._Wallet.currentAccount.address).then((res) => {
            this.unconfirmed = res.data;
            for (let i = 0; i < res.data.length; i++) {
                this.unconfirmed[i].meta.innerHash = {
                    "data": res.data[i].meta.data
                }
                // Not showing the good hash for some reason, but unecessary
                /*let byteArray = Serialization.serializeTransaction(this.unconfirmed[i].transaction);
                let txHash = CryptoJS.SHA3(convert.ua2words(byteArray, byteArray.length), {
                    outputLength: 256
                });
                this.unconfirmed[i].meta.hash = {
                    "data": txHash.toString(CryptoJS.enc.Hex)
                }*/
                this.unconfirmed[i].meta.height = 9007199254740991;
            }
        },
        (err) => {
            if(err.status === -1) {
                this._Alert.connectionError();
            } else {
                this._Alert.errorGetTransactions(err.data.message);
            }
        });
    }


}

export default SignMultisigCtrl;