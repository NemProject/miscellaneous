import nem from 'nem-sdk';
import Helpers from '../../../utils/helpers';

class ExplorerTransactionsCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet, Alert, $timeout, $http, $scope) {
        'ngInject';

        //// Module dependencies region ////

        this._Wallet = Wallet;
        this._Alert = Alert;
        this._$timeout = $timeout;
        this._$http = $http;
        this._Helpers = Helpers;

        //// End dependencies region ////

        //// Module properties region ////

        // Store transactions
        this.transactions = [];
        this.noMoreTxes = false;

        // Pagination properties
        this.currentPage = 0;
        this.pageSize = 10;

        //// End properties region ////

        // Get transactions
        this.getTransactions(false);

        // Watch node change
        $scope.$watch(() => this._Wallet.node, (val) => {
            if (!val) return;
            this.transactions = [];
            this.noMoreTxes = false;
            this.currentPage = 0;
            this.getTransactions(false);
        }, true);
    }

    //// Module methods region ////

    /**
     * Get transactions of the account
     */
    getTransactions(isUpdate, txId) {
        let obj = {
            'params': {
                'address': this._Wallet.currentAccount.address,
                'pageSize': isUpdate ? 100 : 50
            }
        };
        if (isUpdate) {
            obj['params']['id'] = txId;
        }
        return this._$http.get(this._Wallet.node.host + ':' + this._Wallet.node.port + '/account/transfers/all', obj).then((res) => {
            if (isUpdate) {
                // Check if txes left to load
                if (!res.data.data.length || res.data.data.length < 100) this.noMoreTxes = true;
                //
                for (let i = 0; i < res.data.data.length; i++) {
                    this.transactions.push(res.data.data[i]);
                }
            } else {
                this.transactions = res.data.data;
            }
        });
    }

    //// End methods region ////
}

export default ExplorerTransactionsCtrl;