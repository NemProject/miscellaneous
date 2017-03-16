class ExplorerHomeCtrl {
    constructor(Wallet, $scope, NetworkRequests, Alert, Transactions, $location, DataBridge) {
        'ngInject';

        // Wallet service
        this._Wallet = Wallet;
        // Network requests service
        this._NetworkRequests = NetworkRequests;
        // Alert service
        this._Alert = Alert;
        // Transactions service
        this._Transactions = Transactions;
        // DataBridge service
        this._DataBridge = DataBridge;
        // $location to redirect
        this._location = $location;

        // If no wallet show alert and redirect to home
        if (!this._Wallet.current) {
            this._Alert.noWalletLoaded();
            this._location.path('/');
            return;
        }

        this.nsOwnedMultisig = [];
        
        if(this._DataBridge.accountData.meta.cosignatoryOf.length) {
            for(let i=0; i < this._DataBridge.accountData.meta.cosignatoryOf.length; i++) {
                let multisig = this._DataBridge.accountData.meta.cosignatoryOf[i].address;
                if(undefined !== this._DataBridge.namespaceOwned[multisig]) {
                    let namesArray = Object.keys(this._DataBridge.namespaceOwned[multisig]);
                    for (let k=0; k < namesArray.length; k++) {
                        let namespace = this._DataBridge.namespaceOwned[multisig][namesArray[k]].fqn
                        this.nsOwnedMultisig.push(namespace);
                    }
                }
            }
        }
    }

   

}

export default ExplorerHomeCtrl;