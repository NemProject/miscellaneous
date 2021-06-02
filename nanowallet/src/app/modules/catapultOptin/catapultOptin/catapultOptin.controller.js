import nem from 'nem-sdk';
import {
    Account,
    NetworkType,
    Address
} from "symbol-sdk";
import {StatusCode} from "symbol-post-launch-optin-module";
import {PublicAccount} from "symbol-sdk";

class NormalOptInCtrl {
    // Set services as constructor parameter
    constructor(Wallet, Alert, $scope, $timeout, DataStore, $location, Recipient, CatapultOptin) {
        'ngInject';

        // Declaring services
        this._location = $location;
        this._Alert = Alert;
        this._Wallet = Wallet;
        this._scope = $scope;
        this._DataStore = DataStore;
        this._Recipient = Recipient;
        this._$timeout = $timeout;
        this._CatapultOptin = CatapultOptin;


        // If no wallet show alert and redirect to home
        if (!this._Wallet.current) {
            this._Alert.noWalletLoaded();
            this._location.path('/');
            return;
        }

        // Initialization
        this.init();
    }

    init() {
        // Object to contain our password & private key data.
        this.common = nem.model.objects.get("common");
        //Form Data model
        this.formData = {
            passwordDownloadWallet: '',
            confirmPasswordDownloadWallet: '',
        };
        // Set catapult network
        if (this._Wallet.network == nem.model.network.data.mainnet.id) {
            this.catapultNetwork = NetworkType.MAIN_NET;
        }
        else if (this._Wallet.network == nem.model.network.data.testnet.id) {
            this.catapultNetwork = NetworkType.TEST_NET;
        }
        else if (this._Wallet.network == nem.model.network.data.mijin.id) {
            this.catapultNetwork = NetworkType.MIJIN;
        }
        else {
            this.catapultNetwork = NetworkType.MIJIN_TEST;
        }
        //Optin step
       // this.step = 0;
        //Confirm modal step
        this.confirmStep = 0;
        //Optin status
        this.optinStatus = 0;
        this.optinError = null;
        this.optinAmount = 0;

        //Get Opt In Status
        this.checkOptinStatus(this._DataStore.account.metaData.account.address);

        //OPT IN REFACTOR METHODS
        this.step = 0;
        this.fee = 850000;
        this.optinPublicKey = "";
        this.optinAccount = null;
        this.optinAddress = "";
        this.cosignatoriesMapping = [];
        this.multisigDestinationPublicKey = "";
        this.multisigDestinationAddress = "";
        this.formData = {};
        this.formData.password = "";
        this.formData.confirmPassword = "";
        this.formData.acceptPrivacy = false;
        this.formData.addressConfirmed = false;
        this.statusLoading = true;
        this.isOptedIn = false;
        this.formData.selectedAccount = this._DataStore.account.metaData.account;
        this.isMultisig = false;
        this.hasCosignatorySigned = true;
        this.isConfirmAddressModalShown = false;
        this.publicKeyError = false;
    }

    /**
     * Get Opt In Status
     */
    checkOptinStatus(address){
        this.statusLoading = true;
        nem.com.requests.account.data(this._Wallet.node, address).then( account =>  {
            this._CatapultOptin.getStatus(account).then( status => {
                const isMultisig = this.formData.selectedAccount.address !== this._DataStore.account.metaData.account.address;
                if (!isMultisig) {
                    this._CatapultOptin.getNormalCache(account).then(cache => {
                        this._$timeout(() => {
                            this.optinError = cache.errorDTO;
                        });
                    })
                } else {
                    this._CatapultOptin.getMultisigCache(account).then(cache => {
                        this._$timeout(() => {
                            this.optinError = cache.errorDTO;
                        });
                    })
                }
                this._CatapultOptin.getClaimAmount(address).then(amount => {
                    this._$timeout(() => {
                        this.optinAmount = amount;
                        this.optinStatus = status;
                        if (status === StatusCode.OPTIN_PROCESSED) {
                            if (isMultisig) {
                                this._CatapultOptin.getMultisigCache(account, true).then(cache => {
                                    this._$timeout(() => {
                                        this.hasCosignatorySigned = !!cache.multisigDTOs[this._DataStore.account.metaData.account.publicKey];
                                        this.multisigDestinationPublicKey = cache.multisigDestinationPublicKey;
                                        this.multisigDestinationAddress = PublicAccount.createFromPublicKey(this.multisigDestinationPublicKey, this.catapultNetwork).address.pretty();
                                        this.statusLoading = false;
                                    });
                                });
                            } else {
                                this._CatapultOptin.getNormalCache(account).then(cache => {
                                    this._$timeout(() => {
                                        this.optinAddress = PublicAccount.createFromPublicKey(cache.simpleDTO.destination, this.catapultNetwork).address.pretty();
                                        this.statusLoading = false;
                                    });
                                });
                            }
                        } else if (status === StatusCode.OPTIN_SM_DONE) {
                            this._CatapultOptin.getNormalCache(account).then(cache => {
                                this._$timeout(() => {
                                    this.optinAddress = PublicAccount.createFromPublicKey(cache.simpleDTO.destination, this.catapultNetwork).address.pretty();
                                    this.statusLoading = false;
                                });
                            });
                        } else if (status === StatusCode.OPTIN_MS_PENDING) {
                            this._CatapultOptin.getMultisigCache(account, true).then(cache => {
                                this._$timeout(() => {
                                    this.multisigDestinationPublicKey = "";
                                    this.multisigDestinationAddress = "";
                                    this.statusLoading = false;
                                });
                            });
                        } else if (status === StatusCode.OPTIN_MS_PENDING_SIGNATURES || status === StatusCode.OPTIN_MS_DONE ) {
                            this._CatapultOptin.getMultisigCache(account, true).then(cache => {
                                this._$timeout(() => {
                                    this.hasCosignatorySigned = !!cache.multisigDTOs[this._DataStore.account.metaData.account.publicKey];
                                    this.multisigDestinationPublicKey = cache.multisigDestinationPublicKey;
                                    this.multisigDestinationAddress = PublicAccount.createFromPublicKey(this.multisigDestinationPublicKey, this.catapultNetwork).address.pretty();
                                    this.statusLoading = false;
                                });
                            });
                        } else {
                            this.statusLoading = false;
                        }
                    });
                })
            });
        });
    }

    calculateMultisigDestinationAddress() {
        try {
            if (this.multisigDestinationPublicKey.length !== 64) {
                this.multisigDestinationAddress = null;
                this.publicKeyError = false;
            } else {
                this._CatapultOptin.checkIfNIS1PublicKeyOrPrivateKey(this.multisigDestinationPublicKey).then(result => {
                    this._$timeout(() => {
                        if (result) {
                            this.multisigDestinationAddress = PublicAccount.createFromPublicKey(this.multisigDestinationPublicKey, this.catapultNetwork).address.pretty();
                            this.publicKeyError = false;
                        } else {
                            this.multisigDestinationAddress = null;
                            this.publicKeyError = true;
                        }
                    });
                });
            }
        } catch (e) {
            this.publicKeyError = false;
            this.multisigDestinationAddress = null;
        }
    }

    isValidMultisigDestination() {
        if (!this.isMultisig) return true;
        try {
            if (this.multisigDestinationPublicKey.length !== 64) {
                return false;
            }
            PublicAccount.createFromPublicKey(this.multisigDestinationPublicKey, this.catapultNetwork);
            return true;
        } catch (e) {
            return false;
        }
    }

    onPrivateKeyChange() {
        try {
            if (this.optinPublicKey.length !== 64) {
                this.optinAccount = null;
                this.publicKeyError = false;
            } else {
                this._CatapultOptin.checkIfNIS1PublicKeyOrPrivateKey(this.optinPublicKey).then(result => {
                    this._$timeout(() => {
                        if (result) {
                            this.optinAccount = PublicAccount.createFromPublicKey(this.optinPublicKey, this.catapultNetwork);
                            this.publicKeyError = false;
                        } else {
                            this.optinAccount = null;
                            this.publicKeyError = true;
                        }
                    });
                });
            }
        } catch (e) {
            this.optinAccount = null;
            this.publicKeyError = false;
        }
    }

    onMultisigSelectorChange(){
        this.isMultisig = this.formData.selectedAccount.address !== this._DataStore.account.metaData.account.address;
        this.checkOptinStatus(this.formData.selectedAccount.address);
        if (this.isMultisig) {
            nem.com.requests.account.data(this._Wallet.node, this.formData.selectedAccount.address).then( account =>  {
                this._CatapultOptin.getMultisigCache(account, true).then(cache => {
                    this.cosignatoriesMapping = [];
                    for (let cosignatory of account.meta.cosignatories) {
                        this.cosignatoriesMapping.push([
                            cosignatory.address, cache.multisigDTOs[cosignatory.publicKey] ?
                                PublicAccount.createFromPublicKey(cache.multisigDTOs[cosignatory.publicKey].destination, this.catapultNetwork).address.plain()
                                : null
                        ]);
                    }
                });
            });
        }
    }

    /**
     * Shows Symbol Address confirmation modal
     */
    showConfirmAddressModal() {
        this.formData.addressConfirmed = false;

        if (this._Wallet.decrypt(this.common))
            this.isConfirmAddressModalShown = true;
    }

    /**
     * Hides Symbol Address confirmation modal
     */
    hideConfirmAddressModal() {
        this.isConfirmAddressModalShown = false;
    }


    /**
     * Sends optin simple or multisig account by a valid form
     */
    send() {
        this.isConfirmAddressModalShown = false;
        if (this._Wallet.decrypt(this.common)) {
            this.step = 0;
            this.statusLoading = true;
            this._$timeout(() => {
                if (!this.isMultisig) {
                    this._CatapultOptin.sendSimpleOptin(this.common, this.optinPublicKey).then(result => {
                        this.checkOptinStatus(this.formData.selectedAccount.address);
                        this.optinAccount = null;
                        this.optinPublicKey = '';
                    }).catch(e => {
                        // this
                    });
                } else {
                    this._CatapultOptin.sendMultisigOptin(this.common, this.formData.selectedAccount.publicKey, this.multisigDestinationPublicKey).then(result => {
                        this.checkOptinStatus(this.formData.selectedAccount.address);
                        this.onMultisigSelectorChange();
                        this.optinAccount = null;
                        this.optinPublicKey = '';
                        this.multisigDestinationPublicKey = '';
                        this.multisigDestinationAddress = '';
                    }).catch(e => {
                        // this
                    });
                }
            });
        }
        this.common.password = '';
        this.formData.acceptTerms = false;
        this.formData.acceptPrivacy = false;
    }

    /**
     * Copy the account address to clipboard
     */
    copyToClipboard(text) {
        var dummy = document.createElement("input");
        document.body.appendChild(dummy);
        dummy.setAttribute("id", "dummy_id");
        dummy.setAttribute('value', text);
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        this._Alert.copySuccess();
    }
}

export default NormalOptInCtrl;
