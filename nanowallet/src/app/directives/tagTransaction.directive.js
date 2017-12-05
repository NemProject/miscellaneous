import nem from 'nem-sdk';

// Unique id for each tx, start with 0
let txId = 0;

function TagTransaction(Alert, Wallet, $filter, $timeout, $state, AddressBook, Recipient, DataStore) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            d: '=',
            a: '=',
            tooltipPosition: '='
        },
        template: '<ng-include src="templateUri"/>',
        link: (scope) => {
                scope.number = txId++;
                scope.walletScope = DataStore;
                scope.mainAccount = scope.a || Wallet.currentAccount.address;
                scope.meta = scope.d.meta;

            if (scope.d.transaction.type == 4100) {
                scope.tx = scope.d.transaction.otherTrans;
                scope.parent = scope.d.transaction;
                scope.confirmed = !(scope.meta.height === Number.MAX_SAFE_INTEGER);
                scope.needsSignature = scope.parent && !scope.confirmed && DataStore.account.metaData && nem.utils.helpers.needsSignature(scope.d, DataStore.account.metaData);
            } else {
                scope.tx = scope.d.transaction;
                scope.parent = undefined;
            }

            // If called from the accounts explorer, hide message decryption
            scope.disableDecryption = $state.current.name === 'app.accountsExplorer' ? true : false;

            // Get the correct line template
            scope.templateUri = 'layout/lines/line' + nem.utils.format.txTypeToName(scope.tx.type) + '.html';

            // 
            scope.mosaicIdToName = nem.utils.format.mosaicIdToName;
            scope.mosaicDefinitionMetaDataPair = scope.walletScope.mosaic.metaData;
            scope.networkId = Wallet.network;
            scope.walletScope.common = nem.model.objects.get("common");

            /**
             * Decode an encrypted message in a transaction
             *
             * @param {object} tx - A transaction object
             */
            scope.decode = (tx) => {
                // Get account private key
                if (!Wallet.decrypt(scope.walletScope.common)) return;

                // Create key pair
                let kp = nem.crypto.keyPair.create(scope.walletScope.common.privateKey);

                // If not the sender, use signer public key for decryption
                if(kp.publicKey.toString() !== tx.signer) {
                    scope.processDecode(tx.signer, tx);
                } else {
                    // Get the recipient account data for the public key
                    Recipient.getAccount(tx.recipient).then((res) => {
                        $timeout(() => {
                            //
                            scope.processDecode(res.account.publicKey, tx);
                            return;
                        });
                    },
                    (err) => {
                        $timeout(() => {
                            // Reset common
                            scope.walletScope.common = nem.model.objects.get("common");;
                            Alert.getAccountDataError(err.statusText);
                            return;
                        });
                    });
                }
            };

            /**
             * Do decoding and set result in the transaction template
             *
             * @param {string} publicKey - The public key of the signer or recipient
             * @param {object} tx - An inner transaction object
             */
            scope.processDecode = (publicKey, tx)  =>{
                // Check public key
                if(!publicKey) return Alert.noPublicKeyForDecoding();

                // Decode the message
                let decoded = nem.crypto.helpers.decode(scope.walletScope.common.privateKey, publicKey, tx.message.payload);
                if (!decoded) return Alert.emptyDecodedMessage();
                            
                // Set decrypted message in the right template,
                // use the tx timeStamp to identify each element in the array of templates generated with 
                // ng-repeat and tag-transaction directive.                                  
                // There is two parts in the template, the line and the details
                let parts = ["line", "details"];
                for (let i = 0; i < parts.length; i++) {
                    $("#"+parts[i]+"-" + tx.timeStamp).html($filter('fmtHexMessage')({
                        "type": 1,
                        "payload": decoded
                    }));
                }
                // Reset common
                scope.walletScope.common = nem.model.objects.get("common");
                // Remove the the decode part of the template
                $("#decodeTxMessage-" + tx.timeStamp).remove();
            }

            /**
             * Cosign a multisig transaction
             *
             * @param {object} parentTx - A multisig transaction object
             * @param {object} tx - An inner transaction object
             * @param {object} meta - The meta data of the multisig transaction object
             */
            scope.walletScope.cosign = (parentTx, tx, meta) => {
                let txCosignData = nem.model.objects.create("signatureTransaction")(nem.model.address.toAddress(parentTx.otherTrans.signer, Wallet.network), meta.innerHash.data);

                // Get account private key
                if (!Wallet.decrypt(scope.walletScope.common)) return;

                // Prepare the signature transaction
                let entity = nem.model.transactions.prepare("signatureTransaction")(scope.walletScope.common, txCosignData, Wallet.network);

                // HW wallet
                entity.otherTrans = parentTx.otherTrans;

                // Use wallet service to serialize and send
                Wallet.transact(scope.walletScope.common, entity).then(() => {
                    $timeout(() => {
                        // Remove needs of signature
                        $("#needsSignature-" + tx.timeStamp).remove();
                        $("#needsSignature2-" + tx.timeStamp).remove();
                        // Push the signer into the transaction object
                        parentTx.signatures.push({ "signer": DataStore.account.metaData.account.publicKey, "timeStamp": nem.utils.helpers.createNEMTimeStamp()});
                        // Reset common
                        scope.walletScope.common = nem.model.objects.get("common");
                        return;
                    });
                }, () => {
                    $timeout(() => {
                        // Reset common
                        scope.walletScope.common = nem.model.objects.get("common");
                        return;
                    });
                });
            }

            /**
             * Return contact label for an address
             *
             * @param {string} address - The address to look for
             *
             * @return {string|boolean} - The account label or false
             */
            scope.getContact = (address) => {
                return AddressBook.getContact(Wallet.current, address);
            }

        }
    };
}

export default TagTransaction;