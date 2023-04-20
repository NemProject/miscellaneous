import { Observable } from "rxjs";

/**
 * TrezorAccount model
 */
export class TrezorAccount {
 
    /**
     * Constructor
     * @param address
     * @param hdKeyPath
     * @param network
     * @param Trezor trezor service
     */
    constructor(address, hdKeyPath, network, Trezor) {
        this.address = address;
        this.hdKeyPath = hdKeyPath;
        this.network = network;
        this._Trezor = Trezor;
    }

    /**
     * Sign a transaction
     * @param transaction
     * @returns {Observable<{data: any, signature: string}>}
     */
    signTransaction(transaction) {
        transaction.setNetworkType(this.network);
        return Observable.fromPromise(this._Trezor.serialize(transaction.toDTO(), { hdKeypath: this.hdKeyPath }));
    }

    /**
     * Sign multiple transactions
     * 
     * @param transactions
     * @returns {Observable<any>} Observable of signed transactions
    */
    signTransactions(transactions) {
        return Observable.merge(...(transactions.map(t => this.signTransaction(t)))).toArray();
    }
}
