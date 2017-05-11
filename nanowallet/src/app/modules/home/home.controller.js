class HomeCtrl {
    constructor(AppConstants, NetworkRequests, $localStorage) {
        'ngInject';

        this._NetworkRequests = NetworkRequests;
        this._storage = $localStorage;

        this.appName = AppConstants.appName;

        // Detect recommended browsers
        let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        let isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        let isFirefox = /Firefox/.test(navigator.userAgent);

        // If no recommended browser used, open modal
        if(!isChrome && !isSafari && !isFirefox) {
        	$('#noSupportModal').modal({
			  backdrop: 'static',
			  keyboard: false
			}); 
        }

        // Get position and closest nodes if no mainnet node in local storage
        if (navigator.geolocation && !this._storage.selectedMainnetNode) {
            // Get position
            navigator.geolocation.getCurrentPosition((res) => {
                // Get the closest nodes
                this._NetworkRequests.getNearestNode(res.coords).then((res) => {
                    // Pick a random node in the array
                    let node = res.data[Math.floor(Math.random()*res.data.length)];
                    // Set the node in local storage
                    this._storage.selectedMainnetNode = 'http://'+node.ip+':7778';
                }, (err) => {
                    // If error it will use default node
                    console.log(err)
                });
            });
        }
    }

}

export default HomeCtrl;