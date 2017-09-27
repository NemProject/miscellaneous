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

        // Load the Changelly widget in view
        document.getElementById('changwidget').innerHTML = '<iframe src="https://changelly.com/widget/v1?auth=merchant&from=BTC&to=XEM&merchant_id=9bad2685d41a&address='+ this._Wallet.currentAccount.address +'&amount=1&ref_id=9bad2685d41a&color=454545" width="100%" height="500" class="changelly" scrolling="no" style="overflow-y: hidden; border: none" > Can\'t load widget </iframe>'; 

    }

}

export default ChangellyCtrl;
