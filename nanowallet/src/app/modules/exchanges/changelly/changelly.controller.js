class ChangellyCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet) {
        'ngInject';

        //// Module dependencies region ////

        this._Wallet = Wallet;

        //// End dependencies region ////

        // Open the Changelly widget in a new window
        let child = window.open("https://widget.changelly.com?currencies=ada,etc,xmr,bch,usdc,trx,neo,eos,xlm,usdt,dash,xrp,ltc,xem,btc,eth&from=btc&to=xem&amount=1&address="+ this._Wallet.currentAccount.address +"&payment_id=&fiat=true&fixedTo=false&theme=jungle&merchant_id=9bad2685d41a",'1418115287605','width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=0,left=0,top=0,noopener=1');
        child.opener = null;
    }

}

export default ChangellyCtrl;