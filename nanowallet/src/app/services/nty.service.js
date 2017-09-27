import nem from 'nem-sdk';

/** Service storing wallet data and relative functions on user wallet. */
class Nty {

    /**
     * Initialize services and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor($localStorage, Wallet) {
        'ngInject';

        /**
         * Service dependencies
         */

        // Local storage
        this._storage = $localStorage;

        // Wallet service
        this._Wallet = Wallet;
    }

    /**
     * Set nty data in Wallet service if exists in local storage
     */
    set() {
        if (this._Wallet.network == nem.model.network.data.mainnet.id) {
            if (this._storage.ntyMainnet) {
                this._Wallet.ntyData = this._storage.ntyMainnet;
            }
        } else if (this._Wallet.network == nem.model.network.data.testnet.id) {
            if (this._storage.ntyTestnet) {
                this._Wallet.ntyData = this._storage.ntyTestnet;
            }
        } else {
            if (this._storage.ntyMijin) {
                this._Wallet.ntyData = this._storage.ntyMijin;
            }
        }
    }

    /**
     * Set nty data into local storage and update in service
     *
     * @param data: The nty data
     */
    setInLocalStorage(data) {
        if (this._Wallet.network == nem.model.network.data.mainnet.id) {
            this._storage.ntyMainnet = data;
        } else if (this._Wallet.network == nem.model.network.data.testnet.id) {
            this._storage.ntyTestnet = data;
        } else {
            this._storage.ntyMijin = data;
        }
        this._Wallet.ntyData = data;
    }

    /**
     * Purge nty data from local storage and update in service
     */
    purgeLocalStorage() {
        if (this._Wallet.network == nem.model.network.data.mainnet.id) {
            delete this._storage.ntyMainnet;
        } else if (this._Wallet.network == nem.model.network.data.testnet.id) {
            delete this._storage.ntyTestnet;
        } else {
            delete this._storage.ntyMijin;
        }
        this._Wallet.ntyData = undefined;
    }

}

export default Nty;