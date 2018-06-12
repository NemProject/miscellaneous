        import nem from 'nem-sdk';
        import Helpers from '../../../utils/helpers';

        class dnsSearchCtrl {
            // Set services as constructor parameter
            constructor($location,Wallet, Alert, DataStore, $filter, $timeout, $http, $state) {
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
                
                // If no wallet show alert and redirect to home
                if (!this._Wallet.current) {
                    this._Alert.noWalletLoaded();
                    this._location.path('/');
                    return;
                }

        
                
                // Initialization
                this.init();
            }

            //// Module methods region ////

            /**
             * Initialize module properties
             */
            init() {

                // Pointer add for view
                this.pointerAdd = '';
                this.namespaceOwner = '';
                // search string
                this.searchString = '';
                // Prevent user to click twice on send when already processing
                this.okPressed = false;
                // search type: redirect to web / get info
                this.searchType = 1;

                // dns results
                this.objDnsResults ='';

            }

            /**
             * start search for dns info
             */
            startSearch(schType){

                this.okPressed = true;
                this.pointerAdd = '';
                this.namespaceOwner = '';
                this.objDnsResults ='';
                this.searchType = schType;

                var namespace = this.searchString.replace(/.nem/g, '').toLowerCase();
                this.getPointerAccount(namespace);


            }




            /**
             * calculate pointer address from namespace
             */
            getPointerAccount(namespace){
                
                    var passphrase = nem.crypto.js.SHA256(namespace);


                    var privateKey =  nem.crypto.helpers.derivePassSha(passphrase, 1).priv;
                    
                    var keyPair = nem.crypto.keyPair.create(privateKey);
                    
                    var publicKey = keyPair.publicKey.toString();
                    
                    var address = nem.model.address.toAddress(publicKey, this._Wallet.network);
                    
                    this.pointerAdd = address;


                    return this._$http.get(this._Wallet.node.host + ':' + this._Wallet.node.port + '/namespace?namespace='+namespace).then((res) => {

                        this.namespaceOwner = res.data["owner"];

                        // Get transactions / and analyze
                        this.getTransactions(false);


                    },  (err) => {
                        console.log(JSON.stringify( err)); 
                        this._Alert.invalidNamespaceName();
                        this.okPressed = false;
                                 
                    });

                
            }


            /**
             * Get transactions of the pointer address
             */
            getTransactions(isUpdate, txHash) {
                let obj = {
                    'params': {
                        'address': this.pointerAdd, //pointer address here this.formData.pointerAdd
                        'hash': txHash ? txHash : '',
                        'pageSize': isUpdate ? 100 : 50
                    }
                };
                return this._$http.get(this._Wallet.node.host + ':' + this._Wallet.node.port + '/account/transfers/all', obj).then((res) => {
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
                var stop =0;
                var currNetwork = this._Wallet.network;
                var dnsResults = '';
                var ownerAdd = this.namespaceOwner;
                //console.log(JSON.stringify(data));

                $.each(data, function( index, value ) {


                    //change if multisig
                     if (value['transaction']['type']==4100){

                        value = value['transaction']['otherTrans'];

                    }else{

                        value = value['transaction'];    
                    }

                    
                                    
                    if ( nem.model.address.toAddress(value['signer'], currNetwork) == ownerAdd){
                
                    var hex = value['message']['payload'];
                    hex = hex.toString();//force conversion
                    var str = '';
                    for (var i = 0; i < hex.length; i += 2)
                        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));

                    var objPayload = jQuery.parseJSON( str );
                    if (objPayload['dns']=='yes' && stop==0){
                
                        stop =1;
                        console.log(str);
                        dnsResults = str;
                           
                
                    }
                
                    }
                                                    
                
                });
                if (stop==1){
                    var objDnsResults = jQuery.parseJSON( dnsResults );

                    this._Alert.dnsMsgSuccess(' for '+this.searchString);
                    this.objDnsResults =objDnsResults;

                    if (this.searchType==1){ //redirect to web
                        //window.location ='http://'+objDnsResults['ip1'];
                        var href = 'http://'+objDnsResults['ip1'];
                        //window.open(href);

                        var win = window.open(href, '_blank');
                        if (win) {
                            //Browser has allowed it to be opened
                            win.focus();
                        } else {
                            //Browser has blocked it
                            alert('Please allow popups');
                        }
                    };
                    
                   
                    
                }else{

                    this._Alert.dnsNoInfoFound(' for '+this.searchString);
                 

                }
                this.okPressed = false;

            }




            

        }

        export default dnsSearchCtrl;