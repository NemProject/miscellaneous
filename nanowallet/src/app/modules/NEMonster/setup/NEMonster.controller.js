import nem from 'nem-sdk';
import Helpers from '../../../utils/helpers';

class NEMonsterCtrl {
    // Set services as constructor parameter
    constructor(Wallet, Alert, DataStore, $filter, $timeout, $http, $state) {
        'ngInject';

        // Declaring services
        this._Alert = Alert;
        this._Wallet = Wallet;
        this._DataStore = DataStore;
        this._$filter = $filter;
        this._$timeout = $timeout;
        this._$http = $http;
        this._Helpers = Helpers;
        this._$state = $state;

        // Initialization
        this.init();
    }

    //// Module methods region ////

    /**
     * Initialize module properties
     */
    init() {

        // Form is a transfer transaction object, pre-set recipient if any from state parameter
        this.formData = nem.model.objects.create("transferTransaction")('');
        // Mosaics are null by default
        this.formData.mosaics = null;
        // Set first multisig account if any
        this.formData.multisigAccount = this._DataStore.account.metaData.meta.cosignatoryOf.length == 0 ? '' : this._DataStore.account.metaData.meta.cosignatoryOf[0];
        // Switch between mosaic transfer and normal transfers
        this.isMosaicTransfer = false;
        // Selected mosaic
        this.selectedMosaic = "nem:xem";
        // Mosaics data for current account
        this.currentAccountMosaicData = "";
        this.formData.messageType = 0; 
        this.formData.message = '';
        this.formData.amount = 0;
        this.formData.recipient ='';
        this.formData.recipientPublicKey = '';

        this.itemElement = {};

        // Pagination properties
        this.currentPage = 0;
        this.pageSize = 4;

        // Prevent user to click twice on send when already processing
        this.okPressed = false;
        // Is namespace selected
        this.nameSpaceSelected = true;
        // Object to contain our password & private key data.
        this.common = nem.model.objects.get("common");

        // Generate dedicated sink
        let sinkSeed = "NEMonster-" + this._Wallet.currentAccount.address;
        let sinkPrivate = nem.crypto.js.SHA3(sinkSeed, { outputLength: 256 }).toString();
        let sinkKeyPair = nem.crypto.keyPair.create(sinkPrivate);
        let sinkAddress = nem.model.address.toAddress(sinkKeyPair.publicKey.toString(), this._Wallet.network);

        // Set sink as recipient
        this.formData.recipient = sinkAddress;

        // Store the prepared transaction
        this.preparedTransaction = {};

        // Store transactions
        this.transactions = [];
        this.noMoreTxes = false;

        this.getTransactions(false);
        this.prepareTransaction();
    }

    /**
     * Get transactions of the pointer address
     */
    getTransactions(isUpdate, txHash) {
        let obj = {
            'params': {
                'address': this.formData.recipient,
                'hash': txHash ? txHash : '',
                'pageSize': isUpdate ? 100 : 50
            }
        };
        return this._$http.get(this._Wallet.node.host + ':' + this._Wallet.node.port + '/account/transfers/incoming', obj).then((res) => {
            if(isUpdate) {
                // Check if txes left to load
                if (!res.data.data.length || res.data.data.length < 100) this.noMoreTxes = true;
                //
                for (let i = 0; i < res.data.data.length; i++) {
                    this.transactions.push(res.data.data[i]);
                }
            } else {
                this.transactions = res.data.data;
                this.analyzeTransactions();  
            }
        });
    }

    /**
     * Analyze transactions from pointer address
     */
    analyzeTransactions(){

        var data = this.transactions;
        var potentialMonsterHash = [];

        $.each(data, ( index, value ) => {

            //change if multisig
            if (value['transaction']['type']==4100){
                var value2 = value['transaction']['otherTrans'];
            } else {
                var value2 = value['transaction'];    
            }

            // loop transactions to find catch trans
            if (nem.model.address.toAddress(value2['signer'], this._Wallet.network) == this._Wallet.currentAccount.address){
                potentialMonsterHash.push(value['meta']['hash']['data']);
            }
        });

        var index;
        var columns = {};
        for (index = 0; index < potentialMonsterHash.length; ++index) {

            var colors = ['#F45B69', '#4286f4', '#42f4b6', '#8941f4', '#f49d41', '#ce3333', '#a9ce33', '#33ce35', '#338ace', '#ce3385','#f4ce42','#cee5ce'];
            var grad = ['grad','','grad2','','grad3','','grad4','','grad5','','grad6','','grad7','','grad8','','grad9','','','','','',''];
            var monster = ['monster', 'monster2'];
            var hair = ['hair', 'hair2'];
            var eyes = ['eyes', 'eyes2','eyes3','eyes4','eyes5','eyes2','eyes2','eyes6','eyes6'];
            var iris = ['iris', 'iris2','iris3','iris4','iris5','iris6','iris7','iris8','iris9'];
            var mouth = ['mouth', 'mouth2', 'mouth3', 'mouth4', 'mouth5', 'mouth6'];
            var teeth = ['teeth', 'teeth3','teeth3','teeth4',''];
            var rnd = [1,2,3,4,5,6,7,8,9,10];

            var nam1 = ['The', 'Decayface','Wispface','Fetidmorph','Mc','Glowmirage','Forsaken','Enraged','Grumpy','Slender','Horror','Glacial','Crowned','Cave','Angry','Disfigured','The Furry','The Fiery Storm','The Elusive','The Brutal','The Diabolical','The Bewitched','The Agile','The Giant','Glowteeth','Thunderseeker','Duskcrackle','The Long-Horned Terror','The Crowned Harlequin','The Screeching','Hollowface','The Meager','The Grim Vision','The Chaotic','The Half','The Savage Corpse','Acidhound','The Undead','The shy','The Cold-Blooded','The Ugly','The Primitive'];
            var nam2 = ['Phenomenon','Teeth','Savage','Beast','Lion','Gargoyle','Monster','Dragon','Viper','Vampier','Buffalo','Leopard','Freak','Rot Bear','Entity','Ooze','Slayer Owl','Lich','Crocodile','Phoenix','Stinkmask','Dweller','Hunter','Sun Rhino','Jackal','Butcher Viper','Spider','Dog','Hellmonster','Skeleton','Lon','Jeff','Kristof','Nelson','Alexandra'];

            var hash = this.hashStr(potentialMonsterHash[index],5381);
            var ind = Math.abs(hash % colors.length);
            var hash = this.hashStr(potentialMonsterHash[index],3581);
            var ind2 = Math.abs(hash % monster.length);
            var hash = this.hashStr(potentialMonsterHash[index],1581);
            var ind3 = Math.abs(hash % hair.length);
            var hash = this.hashStr(potentialMonsterHash[index],2881);
            var ind4 = Math.abs(hash % eyes.length);
            var hash = this.hashStr(potentialMonsterHash[index],7881);
            var ind5 = Math.abs(hash % mouth.length);
            var hash = this.hashStr(potentialMonsterHash[index],4528);
            var ind6 = Math.abs(hash % teeth.length);
            var hash = this.hashStr(potentialMonsterHash[index],1526);
            var ind7 = Math.abs(hash % nam1.length);
            var hash = this.hashStr(potentialMonsterHash[index],4518);
            var ind8 = Math.abs(hash % nam2.length);
            var hash = this.hashStr(potentialMonsterHash[index],1258);
            var ind9 = Math.abs(hash % grad.length);
            var hash = this.hashStr(potentialMonsterHash[index],1250);
            var ind10 = Math.abs(hash % colors.length);
            var hash = this.hashStr(potentialMonsterHash[index],1112);
            var ind11 = Math.abs(hash % rnd.length);
            //alert(colors[ind] + ' '+ ind +' : '+ colors[ind2]+ ' '+ ind2);

            var eyecolor = colors[ind10];
            var rndo = rnd[ind11];
            if (rndo<9){eyecolor='#000'};

            columns[index] = {
                color : colors[ind],
                monster : monster[ind2],
                hair : hair[ind3],
                eyes : eyes[ind4],
                iris : iris[ind4],
                mouth : mouth[ind5],
                teeth : teeth[ind6],
                nam1 : nam1[ind7],
                nam2 : nam2[ind8],
                grad : grad[ind9],
                grad2 : eyecolor
            };
        }

        // Starting monster
        columns[index+1] = {
            color : '#42bcf4',
                monster : 'monster',
                hair : 'hair',
                eyes : 'eyes3',
                iris : 'iris3',
                mouth : 'mouth',
                teeth : 'teeth3',
                nam1 : 'Jeff The Monster Slayer',
                nam2 : '',
                grad : 'grad',
                grad2 : '#000'
        };

        this.itemElement = Object.keys(columns).map(key => columns[key]);
       //alert(JSON.stringify(this.itemElement));
    }

    //djb2 hash
    hashStr(str, hash) {
        for (var i = 0; i < str.length; i++) {
            var charCode = str.charCodeAt(i);
            hash = ((hash << 5) + hash) + charCode; /* hash * 33 + c */
        }
        return hash;    
    }

    /**
     * Prepare the transaction
     */
    prepareTransaction() {
        // Create a new object to not affect the view
        let cleanTransferTransaction = nem.model.objects.get("transferTransaction");

        // Clean recipient
        cleanTransferTransaction.recipient = this.formData.recipient.toUpperCase().replace(/-/g, '');

        // Amount is 0
        cleanTransferTransaction.amount = 0;

        // Set multisig, if selected
        if (this.formData.isMultisig) {
            cleanTransferTransaction.isMultisig = true;
            cleanTransferTransaction.multisigAccount = this.formData.multisigAccount;
        }

        // Set the message
        cleanTransferTransaction.message = '';
        cleanTransferTransaction.messageType = this.formData.messageType;

        // Prepare transaction object according to transfer type
        let entity;

        cleanTransferTransaction.mosaics = null;
        // Prepare
        entity = nem.model.transactions.prepare("transferTransaction")(this.common, cleanTransferTransaction, this._Wallet.network);

        // Set the entity for fees in view
        this.preparedTransaction = entity;

        // Return prepared transaction
        return entity;
    }

    /**
     * Prepare and broadcast the transaction to the network
     */
    send() {
        // Disable send button
        this.okPressed = true;

        // Get account private key for preparation or return
        if (!this._Wallet.decrypt(this.common)) return this.okPressed = false;

        // Prepare the transaction
        let entity = this.prepareTransaction();

        // Sending will be blocked if recipient is an exchange and no message set
        if (!this._Helpers.isValidForExchanges(entity)) {
            this.okPressed = false;
            this._Alert.exchangeNeedsMessage();
            return;
        }

        // Use wallet service to serialize and send
        this._Wallet.transact(this.common, entity).then(() => {
            this._$timeout(() => {
                // Enable send button
                this.okPressed = false;
                // Reset all
                this.init();
                return;
            });
        }, () => {
            this._$timeout(() => {
                // Delete private key in common
                this.common.privateKey = '';
                // Enable send button
                this.okPressed = false;
                return;
            });
        });
    } 

}

export default NEMonsterCtrl;