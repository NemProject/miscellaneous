import nem from 'nem-sdk';
var request = require('request');
const SUPPORT_VERSION = {
    LEDGER_MAJOR_VERSION: 0,
    LEDGER_MINOR_VERSION: 0,
    LEDGER_PATCH_VERSION: 2
}
class LedgerCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(AppConstants, $timeout, Alert, Login, Ledger) {
        'ngInject';

        //// Module dependencies region ////

        this._AppConstants = AppConstants;
        this._$timeout = $timeout;
        this._Alert = Alert;
        this._Login = Login;
        this._Ledger = Ledger;

        //// End dependencies region ////

        //// Module properties region ////

        /**
         * Default network
         *
         * @type {number}
         */
        this.network = this._AppConstants.defaultNetwork;

        /**
         * Available networks
         *
         * @type {object} - An object of objects
         */
        this.networks = nem.model.network.data;

        // Prevent user to click twice on send when already processing
        this.okPressed = false;

        //// End properties region ////
    }

    //// Module methods region ////

    /**
     * Change wallet network
     *
     * @param {number} id - The network id to use at wallet creation
     */
    changeNetwork(id) {
        if (id == nem.model.network.data.mijin.id && this._AppConstants.mijinDisabled) {
            this._Alert.mijinDisabled();
            // Reset network to default
            this.network = this._AppConstants.defaultNetwork;
            return;
        } else if (id == nem.model.network.data.mainnet.id && this._AppConstants.mainnetDisabled) {
            this._Alert.mainnetDisabled();
            // Reset network to default
            this.network = this._AppConstants.defaultNetwork;
            return;
        }
        // Set Network
        this.network = id;
    }

    /**
     * Pop-up alert handler
     */
    alertHandler(inputErrorCode) {
        switch (inputErrorCode) {
            case 'NoDevice':
                this._Alert.ledgerDeviceNotFound();
                break;
            case 'bridge_problem':
                this._Alert.ledgerBridgeNotRunning();
                break;
            case 26628:
                this._Alert.ledgerDeviceLocked();
                break;
            case 27904:
                this._Alert.ledgerNotOpenApp();
                break;
            case 27264:
                this._Alert.ledgerNotUsingNemApp();
                break;
            case 27013:
                this._Alert.ledgerLoginCancelByUser();
                break;
            case 2:
                this._Alert.ledgerNotSupportApp();
                break;
            default:
                this._Alert.createWalletFailed(inputErrorCode);
                break;
        }
    }

    /**
     * Get NEM Ledger app version
     */
    getAppVersion() {
        return new Promise(async (resolve) => {
            var JSONObject = {
                "requestType": "getAppVersion",
            };
            var option = {
                url: "http://localhost:21335",
                method: "POST",
                json: true,
                body: JSONObject
            }
            request(option, function (error, response, body) {
                try {
                    let appVersion = body;
                    if (appVersion.majorVersion == null && appVersion.minorVersion == null && appVersion.patchVersion == null) {
                        if (body.statusCode != null) resolve(body.statusCode);
                        else resolve(body.id);
                    } else {
                        let statusCode;
                        if (appVersion.majorVersion < SUPPORT_VERSION.LEDGER_MAJOR_VERSION) {
                            statusCode = 2;
                        } else if (appVersion.minorVersion < SUPPORT_VERSION.LEDGER_MINOR_VERSION) {
                            statusCode = 2;
                        } else if (appVersion.patchVersion < SUPPORT_VERSION.LEDGER_PATCH_VERSION) {
                            statusCode = 2;
                        } else {
                            statusCode = 1;
                        }
                        resolve(statusCode);
                    }
                } catch (error) {
                    resolve('bridge_problem');
                }
            })
        })
    }

    /**
     * Login with LEDGER
     */
    async login() {
        this.okPressed = true;
        let checkVersion = await this.getAppVersion();
        if (checkVersion == 1) {
            this._$timeout(() => {
                this._Alert.ledgerFollowInstruction();
            });
            this._Ledger.createWallet(this.network)
                .then(wallet => {
                    this._Login.login({}, wallet);
                    this.okPressed = false;
                })
                .catch(error => {
                    this._$timeout(() => {
                        this.alertHandler(error);
                    });
                    this.okPressed = false;
                });
        } else {
            this._$timeout(() => {
                this.alertHandler(checkVersion);
            });
            this.okPressed = false;
        }
    }
    //// End methods region ////
}

export default LedgerCtrl;
