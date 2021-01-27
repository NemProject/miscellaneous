import nem from 'nem-sdk';
import {Account, NamespaceRegistrationTransaction, NetworkType, Password, PublicAccount} from "symbol-sdk";
import {Wallet, Network, MnemonicPassPhrase, ExtendedKey} from "symbol-hd-wallets";
import {MnemonicQR} from 'symbol-qr-library';
import {StatusCode} from "catapult-optin-module";
import {TransactionMapping} from "symbol-sdk";
import {generatePaperWallet} from "symbol-paper-wallets";

const DEFAULT_ACCOUNT_PATH = "m/44'/4343'/0'/0'/0'";

class MultisigOptInCtrl {
	// Set services as constructor parameter
    constructor(Wallet, Alert, $scope, $timeout, $filter, Ledger, DataStore, $location, Recipient, CatapultOptin) {
        'ngInject';

        // Declaring services
        this._location = $location;
        this._Alert = Alert;
        this._Wallet = Wallet;
        this._scope = $scope;
        this._$filter = $filter;
        this._Ledger = Ledger;
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
            origin: {
                mnemonic: '',
                account: null
            },
            passwordDownloadWallet: '',
            confirmPasswordDownloadWallet: '',
        };
        // Set first multisig account if any
        this.formData.multisigSelector = this._DataStore.account.metaData.meta.cosignatoryOf.length === 0 ? '' : this._DataStore.account.metaData.meta.cosignatoryOf[0];
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

        // Optin types of Trezor wallet
        this.types = [{
            name: this._$filter('translate')('CATAPULTOPTIN_ACCOUNT_UNLOCK'),
            key: false
        }, {
            name: this._$filter('translate')('SYMBOL_WALLET_CREATING_BY_LEDGER_IMPORT_TYPE_INFO'),
            key: true
        }];

        // Optin to Symbol Ledger wallet
        this.optinSymbolLedger = this._Wallet.algo == "ledger";

        // Symbol account paths
        this.defaultAccountPath = '';
        this.setAccountPath();

        //Cosigners mapping status
        this.cosignersMapping = {};
        //Optin step
        this.step = 0;
        //Confirm modal step
        this.confirmStep = 0;
        //Optin status
        this.optinStatus = 0;
        // Include Namespaces checkbox
        this.includeNamespaces = true;
        // Cosign data
        this.formData.cosign = {};
        //Change selector
        this.onMultisigSelectorChange();
        //Get Opt In Status
        // this.checkOptinStatus();
    }

    /**
     * Set the account path for Symbol wallet
     */
    setAccountPath() {
        if (this.optinSymbolLedger) {
            // Get the account index of the wallet
            const currentHDKeyPath = this._Wallet.currentAccount.hdKeypath;
            const index = parseInt(currentHDKeyPath.split("'/")[2]);
            this.defaultAccountPath = `m/44'/4343'/${index}'/0'/0'`;
        } else {
            this.defaultAccountPath = DEFAULT_ACCOUNT_PATH;
        }
    }

    /**
     * Get Opt In Status
     */
    checkOptinStatus(){
        this.step = 0;
        if (this.formData.multisigAccount && this.formData.multisigAccount.meta.cosignatories.length >= 9) {
            this.step = -1;
        } else {
            this._CatapultOptin.getStatus(this.formData.multisigSelector.address).then( status => {
                this._$timeout(() => {
                    this.step = 1;
                    this.optinStatus = status;
                    if (status === StatusCode.OPTIN_MS_PENDING || status === StatusCode.OPTIN_MS_CONVERT) this.step = 2;
                    if (status === StatusCode.OPTIN_MS_DONE) this.step = 6;

                    this._CatapultOptin.getMultisigCache(this.formData.multisigAccount).then(msigCache => {
                        if (this.optinStatus === StatusCode.OPTIN_MS_CONVERT || status === StatusCode.OPTIN_MS_DONE) {
                            this.buildCosignData();
                        }
                        if (this.optinStatus === StatusCode.OPTIN_MS_CONVERT){
                            const nisPubKey = this._DataStore.account.metaData.account.publicKey;
                            if (msigCache.cosignDTOs[nisPubKey] != null) this.step = 5;
                        }

                        const destinations = msigCache.cosignersDestinations;
                        this._$timeout(() => {
                            this.cosignersMapping = Object.keys(destinations).reduce((acc, key) => {
                                try {
                                    acc[key] = PublicAccount.createFromPublicKey(destinations[key], this.catapultNetwork).address.pretty();
                                } catch (e) {
                                    acc[key] = null;
                                }
                                return acc;
                            }, {});
                        });
                    });
                });
            });
        }
    }

    /**
     * Mnemonic click handler
     */
    onMnemonicClick() {
        const nisPubKey = this._DataStore.account.metaData.account.publicKey;
        // Lookup to 10 derivation accounts and search for the correct one
        let found = false;
        for (let i=0; !found && i < 10; i++) {
            const mnemonic = new MnemonicPassPhrase(this.formData.origin.mnemonic);
            const account = this.mnemonicToAccount(mnemonic, i);
            if (account && account.address.pretty() === this.cosignersMapping[nisPubKey]) {
                this.formData.origin.account = account;
                found = true;
            }
        }
        if (!found){
            this._Alert.votingUnexpectedError("Mnemonic doesn't match the account that you made normal OptIn");
        }
        else {
            this._$timeout(() => {
                if (this.optinStatus === StatusCode.OPTIN_MS_PENDING ) {
                    this.generateRandomAccount();
                    this.buildOptinAccount();
                    this.step = 3;
                }
                else if (this.optinStatus === StatusCode.OPTIN_MS_CONVERT) {
                    this.step = 4;
                }
            });
        }
    }

    /**
     * Ledger account click handler
     */
    async onLedgerUnlockClick() {
        this.setAccountPath();
        alert("Please open Symbol BOLOS app");
        const nisPubKey = this._DataStore.account.metaData.account.publicKey;
        const defaultPublicKey = await this._Ledger.getSymbolAccount(this.defaultAccountPath, this.catapultNetwork, true);
        const defaultAccount = PublicAccount.createFromPublicKey(defaultPublicKey, this.catapultNetwork);
        this.formData.origin.account = defaultAccount;
        if (defaultAccount && defaultAccount.address.pretty() === this.cosignersMapping[nisPubKey]) {
            this._$timeout(() => {
                if (this.optinStatus === StatusCode.OPTIN_MS_PENDING ) {
                    this.generateRandomAccount();
                    this.buildOptinAccount();
                    this.step = 3;
                } else if (this.optinStatus === StatusCode.OPTIN_MS_CONVERT) {
                    this.step = 4;
                }
            });
        } else {
            this._$timeout(() => {
                this._Alert.votingUnexpectedError("Symbol Ledger account doesn't match the account that you made normal OptIn");
            });
        }
    }

    /**
     * Build optin destination data
     */
    buildCosignData() {
        this.formData.cosign = {};
        this._CatapultOptin.getMultisigCache(this.formData.multisigAccount).then(msigCache => {
            this._$timeout(() => {
                this.formData.cosign.account = PublicAccount.createFromPublicKey(msigCache.signalDTO.destination, this.catapultNetwork);
                this.formData.cosign.address = this.formData.cosign.account.address.plain();
                this.formData.cosign.signedMapping = msigCache.cosignDTOs;
                this.formData.cosign.namespaces = msigCache.namespaceDTOs.map(dto => {
                    if (dto != null) {
                        const catNamespaceTx = TransactionMapping.createFromPayload(dto.payload);
                        if (catNamespaceTx instanceof NamespaceRegistrationTransaction) {
                            return catNamespaceTx.namespaceName;
                        }
                    }
                    return 'Unavailable';
                });
            });
        });

    }

    /**
     * Generate account from mnemonic object
     * @param mnemonic
     * @return {Account}
     */
    mnemonicToAccount(mnemonic, accountIndex = 0) {
        const mnemonicSeed = mnemonic.toSeed().toString('hex');
        const xkey = ExtendedKey.createFromSeed(mnemonicSeed);
        const wallet = new Wallet(xkey);
        const bip32Path = "m/44'/4343'/"+ accountIndex + "'/0'/0'";
        return wallet.getChildAccount(bip32Path, this.catapultNetwork);
    }

    /**
     * Generate random account
     */
    generateRandomAccount() {
        let mnemonic = MnemonicPassPhrase.createRandom();
        this.formData.optinMnemonic = mnemonic.plain;
    }

    /**
     * Builds Optin account once mnemonic is set
     */
    buildOptinAccount() {
        try {
            const mnemonic = new MnemonicPassPhrase(this.formData.optinMnemonic);
            if (!mnemonic.isValid()) {
                throw new Error('Invalid mnemonic');
            }
            const account = this.mnemonicToAccount(mnemonic);

            this.formData.optinAccount = account;
            this.formData.optinAddress = account.publicAccount.address.pretty();
            this.formData.optinPublicKey = account.publicAccount.publicKey;
            this.formData.optinPrivateKey = account.privateKey;

            generatePaperWallet(mnemonic, this.catapultNetwork).then(bytes => {
                const Uint8ToString = (u8a) => {
                    var CHUNK_SZ = 0x8000;
                    var c = [];
                    for (var i=0; i < u8a.length; i+=CHUNK_SZ) {
                        c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
                    }
                    return c.join("");
                };

                const b64encoded = btoa(Uint8ToString(bytes));
                $("#symbol-wallet-download").attr('href', 'data:application/pdf;base64,' + b64encoded);
                $("#symbol-wallet-download").attr('download','symbol-wallet-'+ account.address.pretty().substr(0,6) + '.pdf');
            });
        } catch (e) {
            this.formData.optinAddress = '';
            this.formData.optinPublicKey = '';
            this.formData.optinPrivateKey = '';
        }
    }

    /**
     * Builds Optin origin account once mnemonic is set
     */
    buildOriginAccount() {
        try {
            const mnemonic = new MnemonicPassPhrase(this.formData.origin.mnemonic);
            if (!mnemonic.isValid()) {
                throw new Error('Invalid mnemonic');
            }
            this.formData.origin.account = this.mnemonicToAccount(mnemonic);
        } catch (e) {
            this.formData.origin.account = null;
        }
    }

    /**
     * IncludeNamespaces checkbox handler
     */
    onIncludeNamespacesChange() {
        if (this.includeNamespaces) {
            this.arrangeNamespaces();
        }
        this.calculateFee();
    }

    /**
     * Arrange namespaces into an array
     */
    arrangeNamespaces() {
        this.namespaces = [];
        let multisig = this.formData.multisigAccount.account.address;
        if(undefined !== this._DataStore.namespace.ownedBy[multisig]) {
            let namesArray = Object.keys(this._DataStore.namespace.ownedBy[multisig]);
            for (let k=0; k < namesArray.length; k++) {
                let namespace = this._DataStore.namespace.ownedBy[multisig][namesArray[k]].fqn;
                this.namespaces.push(namespace);
            }
        }
        //Filters Root Namespaces
        this.namespaces = this.namespaces.filter(namespace => !namespace.includes("."));
        this.calculateFee();
    }

    /**
     * Process multisig account input and get data from network
     */
    onMultisigSelectorChange() {
        // Reset recipient data
        this.resetMultisigData();
        //
        return this._Recipient.getAccount(this.formData.multisigSelector.address).then((res) => {
                this._$timeout(() => {
                    //
                    this.setMultisigData(res);
                    return;
                });
            },
            (err) => {
                this._$timeout(() => {
                    // Reset recipient data
                    this.resetMultisigData();
                    return;
                });
            });
    }

    /**
     * Set data received from Recipient service
     *
     * @param {object} data - An [AccountInfo]{@link http://bob.nem.ninja/docs/#accountInfo} object
     */
    setMultisigData(data) {
        this.formData.multisigAccount = data;
        this.checkOptinStatus();
        this.arrangeNamespaces();
        this.calculateFee();
    }

    /**
     * Reset data stored and properties for multisig account
     */
    resetMultisigData() {
        this.common.password = '';
        this.formData.passwordDownloadWallet = '';
        this.formData.confirmPasswordDownloadWallet = '';
        this.formData.origin.mnemonic = '';
        this.formData.origin.account = null;
        this.cosignersMapping = {};
        this.step = 0;
        this.confirmStep = 0;
        this.optinStatus = 0;
        this.formData.multisigAccount = undefined;
        this.namespaces = [];
        this.formData.backupConfirm = false;
        this.formData.understandConfirm = false;
        this.formData.acceptTerms = false;
    }

    /**
     * Check if Namespace is Owned
     */
    checkNamespaceIsOwned() {
        let namespaceToRemove = this.formData.namespaceRemoved;
        if (this.namespaces.includes(namespaceToRemove) ) return true;
        return false;
    }

    /**
     * Opt out of Namespace
     */
    deleteNamespacefromOpIn(){
        let namespaceRemove = this.formData.namespaceRemoved;
        if (this.namespaces.includes(namespaceRemove)) {
            this.namespaces = this.namespaces.filter(namespace => namespace !== namespaceRemove);
        }
        this.formData.namespaceRemoved = '';
        this.calculateFee();
    }

    /**
     * Prepares download link
     */
    prepareDownloadWallet() {
        if (this.formData.passwordDownloadWallet.length > 0 && this.formData.passwordDownloadWallet === this.formData.confirmPasswordDownloadWallet) {
            try {
                const mnemonic = new MnemonicPassPhrase(this.formData.optinMnemonic);
                if (!mnemonic.isValid()) {
                    throw new Error('Invalid mnemonic');
                }
                new MnemonicQR(
                    mnemonic,
                    this.formData.passwordDownloadWallet,
                    this.catapultNetwork,
                    'no-chain-id'
                ).toBase64().toPromise().then(qr => {
                    const account = this.mnemonicToAccount(mnemonic);
                    $("#symbol-qr-download").attr('href', qr);
                    $("#symbol-qr-download").attr('download','symbol-wallet-'+ account.address.pretty().substr(0,6) + '.jpeg');
                });
            } catch (e) {
                this._Alert.votingUnexpectedError('Error preparing backup wallet');
            }
        } else {
            $("#symbol-qr-download").attr('href', '');
        }
    }

    /**
     * Sends optin simple or multisig account by a valid form
     */
    send() {
        const prevStep = this.step;
        if (this._Wallet.decrypt(this.common)) {
            if (this._DataStore.account.metaData.account.balance < this.fee) {
                this._$timeout(() => {
                    this._Alert.insufficientBalance();
                });
            }
            else {
                $('#catapultOptinResume').modal('hide');
                this._CatapultOptin.sendMultisigStartOptIn(
                    this.common,
                    this.formData.multisigSelector.address,
                    this.formData.origin.account,
                    this.defaultAccountPath,
                    this.formData.optinAccount,
                    this.includeNamespaces ? this.namespaces: [],
                    this.optinSymbolLedger
                ).then( _ => {
                    this.step = 0;
                    this.common.password = '';
                    this.resetMultisigData();
                    setTimeout(() => {
                        this.cosignersMapping = {};
                        this.optinStatus = 0;
                        this.formData.cosign = {};
                        this.onMultisigSelectorChange();
                        this.checkOptinStatus();
                    }, 3000);
                }).catch((e) => {
                    this._$timeout(() => {
                        this.step = prevStep;
                        if (e !== 'handledLedgerErrorSignal') {
                            this._Alert.votingUnexpectedError(e)
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
        this.fee = 0;
        const signalFee = 350000;
        const singleNamespaceFee = 850000;
        const baseConvertLength = 607;
        const cosignerConvertLength = 64;
        const dummyKey = '0'.repeat(64);
        const convertDummyMsg = '0'.repeat(baseConvertLength +
            this.formData.multisigAccount.meta.cosignatories.length * cosignerConvertLength);

        let configTransaction = nem.model.objects.create("transferTransaction")(
            dummyKey,
            0,
            convertDummyMsg);
        const privateStore = nem.model.objects.create("common")("", dummyKey);
        configTransaction = nem.model.transactions.prepare("transferTransaction")(
            privateStore,
            configTransaction,
            this._Wallet.network
        );
        const cosigFee = 450000;
        const convertFee = configTransaction.fee;
        this._$timeout(() => {
            this.fee = signalFee + singleNamespaceFee * (this.includeNamespaces ? this.namespaces.length: 0) + convertFee + cosigFee;
        });

    }

    /**
     * Sends sign optin
     */
    sign() {
        const prevStep = this.step;
        if (this._Wallet.decrypt(this.common)) {
            if (this._DataStore.account.metaData.account.balance < 450000) {
                this._$timeout(() => {
                    this._Alert.insufficientBalance();
                });
            }
            else {
                this._$timeout(() => {
                    this._CatapultOptin.sendMultisigSignOptIn(
                        this.common,
                        this.formData.multisigSelector.address,
                        this.formData.origin.account,
                        this.defaultAccountPath,
                        this.formData.cosign.account,
                        this.optinSymbolLedger
                    ).then(_ => {
                        this.step = 0;
                        this.common.password = '';
                        this.resetMultisigData();
                        setTimeout(() => {
                            this.cosignersMapping = {};
                            this.optinStatus = 0;
                            this.formData.cosign = {};
                            this.onMultisigSelectorChange();
                            this.checkOptinStatus();
                        }, 3000);
                    }).catch((e) => {
                        this._$timeout(() => {
                            this.step = prevStep;
                            if (e !== 'handledLedgerErrorSignal') {
                                this._Alert.votingUnexpectedError(e);
                            }
                        });
                    });
                });
            }
        }
        this.common.password = '';
    }

    /**
     * Download wallet handler
     */
    onDownloadWalletClick() {
        if (!this.isValidQRPassword()){
            this.confirmStep = 2;
            this.formData.passwordDownloadWallet = '';
            this.formData.confirmPasswordDownloadWallet = '';
        }
    }

    /**
     * Checks if QR password is valid
     */
    isValidQRPassword() {
        if (this.formData.passwordDownloadWallet !== this.formData.confirmPasswordDownloadWallet  || this.formData.passwordDownloadWallet.length < 8) return false;
        try {
            new Password(this.formData.passwordDownloadWallet);
            return true;
        } catch (e) {
            return false;
        }
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

export default MultisigOptInCtrl;
