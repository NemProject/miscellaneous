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
                var pointerAdd = this.getPointerAccount(namespace);


            }




            /**
             * calculate pointer address from namespace
             */
            getPointerAccount(namespace){
                
                    var passphrase = this.sha256(namespace);
                    
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

                    return address;

                
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
                        window.open(href);
                    };
                    
                   
                    
                }else{

                    this._Alert.dnsNoInfoFound(' for '+this.searchString);
                 

                }
                this.okPressed = false;

            }





            /**
             * hashing
             */
            sha256(ascii) {
                
                var mathPow = Math.pow;
                var maxWord = mathPow(2, 32);
                var lengthProperty = 'length'
                var i, j; // Used as a counter across the whole file
                var result = ''
            
                var words = [];
                var asciiBitLength = ascii[lengthProperty]*8;
                
                //* caching results is optional - remove/add slash from front of this line to toggle
                // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
                // (we actually calculate the first 64, but extra values are just ignored)
                var hash = this.sha256.h = this.sha256.h || [];
                // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
                var k = this.sha256.k = this.sha256.k || [];
                var primeCounter = k[lengthProperty];
                /*/
                var hash = [], k = [];
                var primeCounter = 0;
                //*/
            
                var isComposite = {};
                for (var candidate = 2; primeCounter < 64; candidate++) {
                    if (!isComposite[candidate]) {
                        for (i = 0; i < 313; i += candidate) {
                            isComposite[i] = candidate;
                        }
                        hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
                        k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
                    }
                }
                
                ascii += '\x80' // Append Ƈ' bit (plus zero padding)
                while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
                for (i = 0; i < ascii[lengthProperty]; i++) {
                    j = ascii.charCodeAt(i);
                    if (j>>8) return; // ASCII check: only accept characters in range 0-255
                    words[i>>2] |= j << ((3 - i)%4)*8;
                }
                words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
                words[words[lengthProperty]] = (asciiBitLength)
                
                // process each chunk
                for (j = 0; j < words[lengthProperty];) {
                    var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
                    var oldHash = hash;
                    // This is now the undefinedworking hash", often labelled as variables a...g
                    // (we have to truncate as well, otherwise extra entries at the end accumulate
                    hash = hash.slice(0, 8);
                    
                    for (i = 0; i < 64; i++) {
                        var i2 = i + j;
                        // Expand the message into 64 words
                        // Used below if 
                        var w15 = w[i - 15], w2 = w[i - 2];
            
                        // Iterate
                        var a = hash[0], e = hash[4];
                        var temp1 = hash[7]
                            + (this.rightRotate(e, 6) ^ this.rightRotate(e, 11) ^ this.rightRotate(e, 25)) // S1
                            + ((e&hash[5])^((~e)&hash[6])) // ch
                            + k[i]
                            // Expand the message schedule if needed
                            + (w[i] = (i < 16) ? w[i] : (
                                    w[i - 16]
                                    + (this.rightRotate(w15, 7) ^ this.rightRotate(w15, 18) ^ (w15>>>3)) // s0
                                    + w[i - 7]
                                    + (this.rightRotate(w2, 17) ^ this.rightRotate(w2, 19) ^ (w2>>>10)) // s1
                                )|0
                            );
                        // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
                        var temp2 = (this.rightRotate(a, 2) ^ this.rightRotate(a, 13) ^ this.rightRotate(a, 22)) // S0
                            + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
                        
                        hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
                        hash[4] = (hash[4] + temp1)|0;
                    }
                    
                    for (i = 0; i < 8; i++) {
                        hash[i] = (hash[i] + oldHash[i])|0;
                    }
                }
                
                for (i = 0; i < 8; i++) {
                    for (j = 3; j + 1; j--) {
                        var b = (hash[i]>>(j*8))&255;
                        result += ((b < 16) ? 0 : '') + b.toString(16);
                    }
                }
                return result;
            }

            rightRotate(value, amount) {
                return (value>>>amount) | (value<<(32 - amount));
            };
            

        }

        export default dnsSearchCtrl;