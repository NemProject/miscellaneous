import nem from 'nem-sdk';
import {
    Account,
    NamespaceRegistrationTransaction,
    NetworkType,
    Password,
    PublicAccount,
    TransactionMapping, VrfKeyLinkTransaction
} from "symbol-sdk";
import { Wallet, Network, MnemonicPassPhrase, ExtendedKey } from "symbol-hd-wallets";
import { MnemonicQR } from 'symbol-qr-library';
import { StatusCode } from "catapult-optin-module";
import { generatePaperWallet } from "symbol-paper-wallets";

const DEFAULT_ACCOUNT_PATH = "m/44'/4343'/0'/0'/0'";
const VRF_ACCOUNT_PATH = "m/44'/4343'/0'/1'/0'";

class NormalOptInCtrl {
    // Set services as constructor parameter
    constructor(Wallet, Alert, $scope, $timeout, DataStore, $location, Recipient, CatapultOptin, Ledger) {
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
        this._Ledger = Ledger;


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
        // Include Namespaces checkbox
        this.includeNamespaces = true;
        // Include Vrf checkbox
        this.includeVrf = false;
        // Namespaces
        this.namespaces = [];
        this.includedNamespaces = {};
        this.skipNamespaces = false;
        this.arrangeNamespaces();

        // Optin to Symbol Ledger wallet
        this.optinSymbolLedger = this._Wallet.algo == "ledger";

        // Symbol account paths
        this.defaultAccountPath = '';
        this.vrfAccountPath = '';
        this.setAccountPaths();

        //Get Opt In Status
        this.checkOptinStatus();
        //Final optin address
        this.formData.finalSymbolAddress = '';
        //Final optin namespaces
        this.formData.finalSymbolNamespaces = [];
        //Final optin vrf public key
        this.formData.finalSymbolVrfPublicKey = '';

        //OPT IN REFACTOR METHODS
        this.step = 0;

        this.formData = {};
        this.formData.password = "";
        this.formData.confirmPassword = "";
        this.formData.walletName = "";
        this.formData.privateKey = "";
        this.formData.entropy = "";
        this.statusLoading = true;
        this.isOptedIn = false;
        this.optinStopped = false;
    }

    /**
     * Set the Optin method for current Trezor NEM account
     */
    optinMethod(usingLedger) {
        this.optinSymbolLedger = usingLedger;
        this.setAccountPaths();
        if (!this.optinSymbolLedger) {
            this.resetEntropy();
        }
        this.step = 10;
    }

    /**
     * Reset imported Symbol account
     */
    resetImport() {
        this.includeVrf = false;
        this.optinSymbolLedger = false;
        if (this._Wallet.algo == "trezor") {
            this.step = 100;
        } else {
            if (this._Wallet.algo == "ledger") {
                this.optinSymbolLedger = true;
            } else {
                this.resetEntropy();
            }
            this.step = 10;
        }
    }

    /**
     * Set the account paths for Symbol wallets
     */
    setAccountPaths() {
        if (this.optinSymbolLedger) {
            // Get the account index of the wallet
            const currentHDKeyPath = this._Wallet.currentAccount.hdKeypath;
            const index = parseInt(currentHDKeyPath.split("'/")[2]);
            this.defaultAccountPath = `m/44'/4343'/${index}'/0'/0'`;
        } else {
            this.defaultAccountPath = DEFAULT_ACCOUNT_PATH;
            this.vrfAccountPath = VRF_ACCOUNT_PATH;
        }
    }

    /**
     * Get Opt In Status
     */
    checkOptinStatus() {
        this.step = 0;
        this._CatapultOptin.checkIfOptinHasStopped().then(hasStopped => {
            this._$timeout(() => {
                this.optinStopped = hasStopped;
            });
            if (!hasStopped) {
                this._CatapultOptin.getStatus(this._DataStore.account.metaData.account.address).then(status => {
                    this._$timeout(() => {
                        this.optinStatus = status;
                        this.statusLoading = false;
                        if (status === StatusCode.OPTIN_SM_DONE) {
                            this.isOptedIn = true;
                            this._CatapultOptin.getNormalCache(this._DataStore.account.metaData).then(cache => {
                                this._$timeout(() => {
                                    this.formData.finalSymbolAddress = PublicAccount.createFromPublicKey(cache.simpleDTO.destination, this.catapultNetwork).address.pretty();
                                    this.formData.finalSymbolNamespaces = cache.namespaceDTOs.map(dto => {
                                        if (dto != null) {
                                            const catNamespaceTx = TransactionMapping.createFromPayload(dto.payload);
                                            if (catNamespaceTx instanceof NamespaceRegistrationTransaction) {
                                                return catNamespaceTx.namespaceName;
                                            }
                                        }
                                        return 'Unavailable';
                                    });
                                    const vrfTx = TransactionMapping.createFromPayload(cache.vrfDTO.payload);
                                    if (vrfTx instanceof VrfKeyLinkTransaction) {
                                        this.formData.finalSymbolVrfPublicKey = vrfTx.linkedPublicKey;
                                    }
                                });
                            });
                        }
                        else if (status === StatusCode.OPTIN_SM_PENDING) {
                            this.isOptedIn = false;
                            this.calculateFee();
                            this.arrangeNamespaces();
                        }
                    });
                });
            }
        });
    }

    /**
     * Generate account from mnemonic object
     * @param mnemonic
     * @param derivationPath
     * @return {Account}
     */
    mnemonicToAccount(mnemonic, derivationPath) {
        const mnemonicSeed = mnemonic.toSeed().toString('hex');
        const xkey = ExtendedKey.createFromSeed(mnemonicSeed);
        const wallet = new Wallet(xkey);
        return wallet.getChildAccount(derivationPath, this.catapultNetwork);

    }

    /**
     * Generate random account
     */
    async generateRandomAccount() {
        const enc = new TextEncoder();
        const entropyBytes = enc.encode(this.formData.entropy);
        entropyBytes.sort(() => Math.random() - 0.5);
        const entropySliced = entropyBytes.slice(0, 32);
        let mnemonic = MnemonicPassPhrase.createFromEntropy(entropySliced);
        this.formData.optinMnemonic = mnemonic.plain;
        const account = this.mnemonicToAccount(mnemonic, DEFAULT_ACCOUNT_PATH);
        const vrfAccount = this.mnemonicToAccount(mnemonic, VRF_ACCOUNT_PATH);

        this.formData.optinAccount = account;
        this.formData.optinVrfAccount = vrfAccount;
        this.formData.optinAddress = account.publicAccount.address.pretty();
        this.formData.optinVrfAddress = vrfAccount.publicAccount.address.pretty();
        this.formData.optinPublicKey = account.publicAccount.publicKey;
        this.formData.optinVrfPublicKey = vrfAccount.publicAccount.publicKey;
        this.formData.optinPrivateKey = account.privateKey;
        this.formData.optinVrfPrivateKey = vrfAccount.privateKey;

        generatePaperWallet(mnemonic, this.catapultNetwork).then(bytes => {
            const Uint8ToString = (u8a) => {
                var CHUNK_SZ = 0x8000;
                var c = [];
                for (var i = 0; i < u8a.length; i += CHUNK_SZ) {
                    c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
                }
                return c.join("");
            };

            const b64encoded = btoa(Uint8ToString(bytes));
            $("#downloadWallet").attr('href', 'data:application/pdf;base64,' + b64encoded);
            $("#downloadWallet").attr('download', 'symbol-wallet-' + account.address.pretty().substr(0, 6) + '.pdf');
        });
    }

    /**
     * Get Ledger account from hardware device
     */
    async getLedgerSymbolAccount() {
        alert("Please open Symbol BOLOS app");
        const defaultPublicKey = await this._Ledger.getSymbolAccount(this.defaultAccountPath, this.catapultNetwork, true);
        const defaultAccount = PublicAccount.createFromPublicKey(defaultPublicKey, this.catapultNetwork);
        this._$timeout(() => {
            this.formData.optinAccount = { publicAccount: defaultAccount };
            this.formData.optinAddress = defaultAccount.address.pretty();
            this.formData.optinPublicKey = defaultAccount.publicKey;
            this.step = 11;
        });
    }

    /**
     * Arrange namespaces into an array
     */
    arrangeNamespaces() {
        //Get Normal Namespaces
        if (!this._DataStore.namespace.ownedBy.hasOwnProperty(this._Wallet.currentAccount.address)) {
            this.skipNamespaces = true;
            return;
        }
        this.namespaces = [];
        const namespaces = Object.keys(this._DataStore.namespace.ownedBy[this._Wallet.currentAccount.address]);
        //Filters Root Namespaces
        this.namespaces = namespaces.filter(namespace => !namespace.includes("."));
        this.skipNamespaces = this.namespaces.length === 0;
        this.namespaces.forEach(namespace => {
            this.includedNamespaces[namespace] = true;
        });
        //this.calculateFee();
    }

    /**
     * Reset Account Data and entropy
     */
    resetAccount() {
        this.formData.optinAccount = null;
        this.formData.optinVrfAccount = '';
        this.formData.optinAddress = '';
        this.formData.optinVrfAddress = '';
        this.formData.optinPublicKey = '';
        this.formData.optinVrfPublicKey = '';
        this.formData.optinPrivateKey = '';
        this.formData.optinVrfPrivateKey = '';
        if (this._Wallet.algo !== 'ledger' && (this._Wallet.algo !== 'trezor' || this.isTrezorOptinLedger)) {
            this.resetEntropy();
        }
    }

    /**
     * Sends optin simple or multisig account by a valid form
     */
    send() {
        if (this._Wallet.decrypt(this.common)) {
            if (this._DataStore.account.metaData.account.balance < this.fee) {
                this._$timeout(() => {
                    this._Alert.insufficientBalance();
                });
            }
            else {
                this._$timeout(() => {
                    const namespaces = [];
                    for (let namespace of Object.keys(this.includedNamespaces)) {
                        if (this.includedNamespaces[namespace]) namespaces.push(namespace)
                    }
                    this._CatapultOptin.sendSimpleOptin(
                        this.common,
                        this.formData.optinAccount,
                        this.defaultAccountPath,
                        namespaces,
                        this.includeVrf ? this.formData.optinVrfAccount : null,
                        this.optinSymbolLedger
                    ).then(_ => {
                        this._$timeout(() => {
                            this.step = 0;
                            this.statusLoading = true;
                            this.common.password = '';
                            this.checkOptinStatus();
                        });
                    }).catch((e) => {
                        if (e !== 'handledLedgerErrorSignal') {
                            this._$timeout(() => {
                                this._Alert.votingUnexpectedError(e);
                            });
                        }
                    });
                });
            }
        }
        this.common.password = '';
        this.formData.backupConfirm = false;
        this.formData.understandConfirm = false;
        this.formData.acceptTerms = false;
    }

    /**
     * Calculates the fee cost of the messages
     */
    calculateFee() {
        const namespaces = [];
        for (let namespace of Object.keys(this.includedNamespaces)) {
            if (this.includedNamespaces[namespace]) namespaces.push(namespace)
        }
        this._$timeout(() => {
            this.fee = (200000 + (namespaces.length * 850000) + (this.includeVrf ? 850000 : 0)) / Math.pow(10, 6);
        });
    }

    //NEW METHODS FOR REFACTOR
    resetEntropy() {
        let elem = document.getElementById("pBarOptIn");
        this.entropyDone = false;
        elem.style.width = this.formData.entropyWidth + '%';
        elem.innerHTML = Math.round(this.formData.entropyWidth) + '%';
        this.getEntropy();
    }

    getEntropy() {
        // Prepare
        let elem = document.getElementById("pBarOptIn");
        this.formData.entropyWidth = 0;
        this.formData.entropy = "";
        // Watch for cursor movements
        $("html").mousemove((e) => {
            //console.log("pos x: " + e.pageX);
            //console.log("pos y: " + e.pageY);
            if (this.formData.entropyWidth >= 100 && !this.entropyDone) {
                this._$timeout(() => {
                    // Stop catching cursor movements
                    $("html").off('mousemove');
                    elem.innerHTML = '<span class="fa fa-check-circle" aria-hidden="true"></span> Done!';
                    this.entropyDone = true;
                    this.generateRandomAccount();
                });
            } else {
                this.formData.entropy += e.pageX + "" + e.pageY;
                this.formData.entropyWidth += 0.15;
                elem.style.width = this.formData.entropyWidth + '%';
                elem.innerHTML = Math.round(this.formData.entropyWidth) + '%';
            }
        });
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
