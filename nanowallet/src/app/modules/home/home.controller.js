class HomeCtrl {
    constructor(AppConstants) {
        'ngInject';

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

    }
}

export default HomeCtrl;