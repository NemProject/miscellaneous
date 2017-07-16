import nem from 'nem-sdk';
import CryptoHelpers from '../utils/CryptoHelpers';
import Helpers from '../utils/helpers';

/** Service storing wallet data and relative functions on user wallet. */
class Wallet {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(AppConstants, $localStorage, Alert, $timeout, $q, AddressBook, Trezor) {
        'ngInject';

        // Service dependencies region //

        this._AppConstants = AppConstants;
        this._storage = $localStorage;
        this._Alert = Alert;
        this._$timeout = $timeout;
        this._$q = $q;
        this._AddressBook = AddressBook;

        // Trezor service
        this._Trezor = Trezor;

        // End dependencies region //

        // Service properties region //

        /**
         * The current wallet used
         *
         * @type {object|undefined}
         */
        this.current = undefined;

        /**
         * The current account used
         *
         * @type {object|undefined}
         */
        this.currentAccount = undefined;

        /**
         * The primary account's algo of current wallet
         *
         * @type {object|undefined}
         */
        this.algo = undefined

        /**
         * The primary account's network of current wallet
         *
         * @type {number}
         */
        this.network = AppConstants.defaultNetwork;

        /**
         * The node for current wallet network
         *
         * @type {object|undefined}
         */
        this.node = undefined;

        /**
         * The nodes corresponding to current wallet network
         *
         * @type {array|undefined}
         */
        this.nodes = undefined;

        /**
         * The search enabled node for current wallet network
         *
         * @type {object|undefined}
         */
        this.searchNode = undefined;

        /**
         * The block explorer for current wallet network
         *
         * @type {string|undefined}
         */
        this.chainLink = undefined;

        /**
         * The nty data
         *
         * @type {array|undefined}
         */
        this.ntyData = undefined;

        /**
         * Get wallets from local storage or set an empty array
         *
         * @type {array}
         */
        this._storage.wallets = this._storage.wallets || [];

        /**
         * The wallet contacts
         *
         * @type {$localStorage~array} 
         */
        this.contacts = undefined;

        // End properties region //
    }

    // Service methods region //

    /**
     * Load a wallet and store in local storage
     *
     * @param {string} data - Base 64 string from .wlt file
     * @param {boolean} isNCC - True if NCC wallet, false otherwise
     *
     * @return {boolean} - True if success, false otherwise
     */
    load(data, isNCC) {
        if (!data) {
            this._Alert.noWalletData();
            return false;
        }
        let wallet;
        if(isNCC) {
            // Parse NCC wallet
            wallet = JSON.parse(data);
        } else {
            // Decode base 64
            wallet = this.base64Decode(data);
        }

        // Check if wallet with same name already present
        if (Helpers.haveWallet(wallet.name, this._storage.wallets)) {
            this._Alert.walletNameExists();
            return false;
        } else {
            // Set wallet in local storage
            this._storage.wallets = this._storage.wallets.concat(wallet);
            //
            this._Alert.loadWalletSuccess();
            return true;
        }
    }

    /**
     * Check if wallet network available and if user know the pass, then set given wallet as current
     *
     * @param {object} common - A common object
     * @param {object} wallet - A wallet object
     *
     * @return {boolean} - True if success, false otherwise
     */
    login(common, wallet) {
        // Check
        if (!wallet) {
            this._Alert.cantLoginWithoutWallet();
            return false;
        }
        // Check if mainnet is disabled
        if(wallet.accounts[0].network === nem.model.network.data.mainnet.id && this._AppConstants.mainnetDisabled) {
            this._Alert.mainnetDisabled();
            return false;
        }
        // Check if mijinnet is disabled
        if(wallet.accounts[0].network === nem.model.network.data.mijin.id && this._AppConstants.mijinDisabled) {
            this._Alert.mijinDisabled();
            return false;
        }
        // If brain wallet pass is weak
        if(wallet.accounts[0].network === nem.model.network.data.mainnet.id && wallet.accounts[0].algo === 'pass:6k' && this.common.password.length < 40) {
            this._Alert.brainWalletUpgrade();
        }
        // Decrypt / generate and check primary 
        if (!this.decrypt(common, wallet.accounts[0], wallet.accounts[0].algo, wallet.accounts[0].network)) return false;
        // Set the wallet object in Wallet service
        this.use(wallet);
        return true;
    }

    /**
     * Set a wallet as current
     *
     * @param {object} wallet - A wallet object
     */
    use(wallet) {
        if (!wallet) {
            this._Alert.noWalletToSet();
            return false;
        }
        this.network = wallet.accounts[0].network;
        // Account used
        this.currentAccount = wallet.accounts[0];
        // Algo of the wallet
        this.algo = wallet.accounts[0].algo;
        this.current = wallet;
        this.contacts = this._AddressBook.getContacts(wallet);
        return true;
    }

    /**
     * Set another account of the wallet
     *
     * @param {object} wallet - A wallet object
     * @param {number} index - The index of account in wallet
     */
    useAccount(wallet, index) {
        if (!wallet) {
            this._Alert.noWalletToSet();
            return false;
        }
        // Check if out of bounds
        if (index > Object.keys(wallet.accounts).length - 1) {
            this._Alert.invalidWalletIndex();
            return false;
        }
        // Check if a wallet is defined
        if (this.current === undefined) {
            this._Alert.noCurrentWallet();
            return false;
        }
        this.network = wallet.accounts[0].network;
        // Account used
        this.currentAccount = wallet.accounts[index];
        this.algo = wallet.accounts[0].algo;
        return true;
    }

    /**
     * Decrypt/generate the private key of a wallet account and check it. 
     * Returned private key is contained into the passed common object or true is set to isHW
     *
     * @param {object} common - A common object
     *
     * @return {boolean} - True if decryption / generation is successful, false otherwise
     */
    decrypt(common, account, algo, network) {
        // Arrange
        let acct = account || this.currentAccount;
        let net = network || this.network;
        let alg = algo || this.algo;

        // Try to generate or decrypt key
        if (!nem.crypto.helpers.passwordToPrivatekey(common, acct, alg)) {
            this._Alert.invalidPassword();
            return false;
        }

        // Step out if using HW wallet
        if(common.isHW) return true;

        // Check the private key and address
        if (!nem.utils.helpers.isPrivateKeyValid(common.privateKey) || !nem.crypto.helpers.checkAddress(common.privateKey, net, acct.address)) {
            this._Alert.invalidPassword();
            return false;
        }

        return true;
    }

    _transact(common, transaction) {
        // HW wallet
        if (common.isHW) {
            // Serialize, sign and use nem.com.requests.transaction.announce(endpoint, serialized) to broadcast
            if (this.algo == "trezor") {
                return this._Trezor.serialize(transaction, this.currentAccount).then((serialized) => {
                    return nem.com.requests.transaction.announce(this.node, JSON.stringify(serialized));
                });
            }
        }
        // Normal wallet
        return nem.model.transactions.send(common, transaction, this.node);
    }

    /**
     * Sign and send a prepared transaction
     *
     * @param {object} common - A common object
     * @param {object} transaction - A prepared transaction or raw transaction for the HW
     *
     * @return {boolean} - True if success, false otherwise
     */
    transact(common, transaction) {
        return this._transact(common, transaction).then((res) => {
            // If res code >= 2, it's an error
            if (res.code >= 2) {
                this._Alert.transactionError(res.message);
                return Promise.reject(true);
            } else {
                this._Alert.transactionSuccess();
                return Promise.resolve(true);
            }
        },
        (err) => {
            if(err.code < 0) {
                this._Alert.connectionError();
            }  else {
                this._Alert.transactionError('Failed: '+ err.data.message);
            }
            return Promise.reject(true);
        });
    }

    /**
     * Check if a given wallet needs an upgrade
     *
     * @param {object} wallet - A wallet object
     *
     * @return {boolean} - True if needs upgrade, false otherwise
     */
    needsUpgrade(wallet) {
        if (!wallet) return false;
        if (!wallet.accounts[0].child) return true;
        return false;
    }

    /**
     * Derive a remote for a given account using BIP32
     *
     * @param {object} common - A common object
     * @param {object} account - An account object to upgrade (optional)
     *
     * @return {Promise} - A resolved promise with true if success, or a rejected promise
     */
    deriveRemote(common, account) {
        // Arrange
        if (!common) return Promise.reject(true);
        let _account = account || this.currentAccount;
        let algo = _account.algo || this.algo;
        let network = _account.network || this.network;
        // Get private key
        if (!this.decrypt(common, _account, algo, network)) return Promise.reject(true);
        // Generate remote account using bip32
        return CryptoHelpers.generateBIP32Data(common.privateKey, common.password, 0, network).then((data) => {
            // Add generated child to account
            _account.child = data.publicKey;
            return Promise.resolve(data);
        },
        (err) => {
            this._Alert.bip32GenerationFailed(err);
            return Promise.reject(true);
        });
    }

    /**
     * Derive a remote account for all accounts in a given wallet using BIP32
     *
     * @param {object} common - A common object
     * @param {object} account - An account object to upgrade
     *
     * @return {Promise} - A resolved promise with true if success, or a rejected promise
     */
    upgrade(common, wallet) {
         if (!common || !wallet) return Promise.reject(true);
        return new Promise((resolve, reject) => {
            // Decrypt / generate and check primary
            if (!this.decrypt(common, wallet.accounts[0], wallet.accounts[0].algo, wallet.accounts[0].network)) return reject(true);
            //
            let chain = this._$q.when();
            for (let i = 0; i < Object.keys(wallet.accounts).length; i++) {
                chain = chain.then(() => {
                    this.deriveRemote(common, wallet.accounts[i]).then((res)=> {
                        if(i === Object.keys(wallet.accounts).length - 1) {
                            this._Alert.upgradeSuccess();
                            return resolve(true);
                        }
                    }, 
                    (err) => {
                        return reject(true);
                    }); 
                });
            }
        });
    }

    /**
     * Derive a new account for the current wallet using BIP32
     *
     * @param {object} common - A common object
     * @param {string} label - A label for the new account
     *
     * @return {Promise} - A resolved promise with true if success, or a rejected promise
     */
    addAccount(common, label) {
        // Account is always derived from the primary
        let primary = this.current.accounts[0];
        // Get private key
        if (!this.decrypt(common, primary, primary.algo, primary.network)) return Promise.reject(true);
        // Current number of accounts in wallet + 1
        let newAccountIndex = Object.keys(this.current.accounts).length;
        //
        let newAccount = nem.model.objects.create("account")("", label);

        if (common.isHW) {
            // Do derivation
            return Promise.resolve(true);
        } else {
            return this.deriveAccount(common, newAccount).then((res) => {
                // Generate remote for the new account
                return this.deriveRemote(common, this.current.accounts[newAccountIndex]).then((res) => {
                    return Promise.resolve(true)
                },
                (err) => {
                    return Promise.reject(true);
                });
            }, 
            (err) => {
                return Promise.reject(true);
            })
        }    
    }

    /**
     * Derive a new account from a wallet primary
     *
     * @param {object} common - A common object
     * @param {object} newAccount - An account object
     *
     * @return {Promise} - A resolved promise with true if success, or a rejected promise
     */
    deriveAccount(common, newAccount) {
        // Account is always derived from the primary
        let primary = this.current.accounts[0];
        // Get private key
        if (!this.decrypt(common, primary, primary.algo, primary.network)) return Promise.reject(false);

        // Current number of accounts in wallet + 1
        let newAccountIndex = Object.keys(this.current.accounts).length;

        // Derive the account at new index
        return CryptoHelpers.generateBIP32Data(common.privateKey, common.password, newAccountIndex, this.network).then((data) => {
            let generatedAccount = data.address;
            let generatedPrivateKey = data.privateKey;
            // Encrypt generated account's private key
            let encrypted = nem.crypto.helpers.encodePrivKey(generatedPrivateKey, common.password);
            // Update new account object
            newAccount.address = generatedAccount;
            newAccount.encrypted = encrypted.ciphertext;
            newAccount.iv = encrypted.iv;
            // Set created object in wallet
            this.current.accounts[newAccountIndex] = newAccount;
            // Show alert
            this._Alert.generateNewAccountSuccess();
            // Add the account into address book
            this._AddressBook.addAccount(this.current.accounts[0].address, newAccount);
            return Promise.resolve(true);
        },
        (err) => {
            this._Alert.bip32GenerationFailed(err);
            return Promise.reject(true);
        });
    }

    /**
     * Encrypt key for mobile and crete a QR element
     *
     * @param {object} common - A common object
     * @param {object} wallet - A wallet object
     *
     * @return {HTMLelement} - An HTML element to append in the view 
     */
    generateQR(common, wallet) {
        let wlt  = wallet || this.current;
        if (!this.decrypt(common, wlt.accounts[0], wlt.accounts[0].algo, wlt.accounts[0].network)) return false;
        // Encrypt private key for mobile apps
        let mobileKeys = nem.crypto.helpers.toMobileKey(common.password, common.privateKey);
        // Create model
        let QR = nem.model.objects.create("walletQR")(this.network === nem.model.network.data.testnet.id ? 1 : 2, 3, this.current.name, mobileKeys.encrypted, mobileKeys.salt);
        let code = kjua({
            size: 256,
            text: JSON.stringify(QR),
            fill: '#000',
            quiet: 0,
            ratio: 2,
        });
        return code;
    }

    /**
     * Prepare a download element for the given wallet
     *
     * @param {object} wallet - A wallet object
     *
     * @return {void}
     */
    prepareDownload(wallet) {
        if (!wallet) {
            this._Alert.errorWalletDownload();
            return false;
        }
        let base64 = this.base64Encode(wallet);
        // Set download element attributes
        $("#downloadWallet").attr('href', 'data:application/octet-stream,' + base64);
        $("#downloadWallet").attr('download', wallet.name + '.wlt');
        return true;
    }

    /**
     * Encode a wallet object to base64
     *
     * @param {object} wallet - A wallet object
     *
     * @return {string} - The base64 wallet string
     */
    base64Encode(wallet) {
        // Wallet object string to word array
        let wordArray = nem.crypto.js.enc.Utf8.parse(angular.toJson(wallet)); 
        // Word array to base64
        return nem.crypto.js.enc.Base64.stringify(wordArray);
    }

    /**
     * Decode a base64 string to a wallet object
     *
     * @param {string} base64 - A base64 string wallet
     *
     * @return {object} - A wallet object
     */
    base64Decode(base64) {
        // Wallet base 64 string to word array
        let wordArray = nem.crypto.js.enc.Base64.parse(base64);
        // Word array to JSON string
        return JSON.parse(wordArray.toString(nem.crypto.js.enc.Utf8));
    }

    /**
     * Reset Wallet service properties
     */
    reset() {
        this.current = undefined;
        this.currentAccount = undefined;
        this.algo = undefined
        this.network = this._AppConstants.defaultNetwork;
        this.node = undefined;
        this.nodes = undefined;
        this.searchNode = undefined;
        this.chainLink = undefined;
        this.ntyData = undefined;
        this.contacts = undefined;
        return true;
    }

    // End methods region //

}

export default Wallet;