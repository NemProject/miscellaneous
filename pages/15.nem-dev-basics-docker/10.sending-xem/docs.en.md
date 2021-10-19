---
title: 'Sending XEM'
parent: 'NEM Dev Basics (Docker)'
nav_order: 10
taxonomy:
    category:
        - docs
---

This chapter will cover transfer transactions, arguably one of the most common transactions on the NEM blockchain.

## Unisig transactions

We start with unisig transactions. These transactions are initiated from the account sending the funds, and can immediately be accepted in 
a block.
As a reminder, the type of these transactions is `0x101`, or `257`.
Let's take a closer look at a transaction we have already seen in the [blockchain requests](/04-blockchain-requests#getting-a-transaction-by-its-hash-transaction-get) section, when we validated an [Apostile](https://blog.nem.io/apostille/) signature.

Here is the data returned when we request a transaction by its hash, with each field explained:

``` javascript
{
    "meta": {
        "hash": {
            //the transaction's hash
            "data": "06c19b8c53838fdaefb4a04126bc78e0c3ab90db48d8dba43f2063bb02139d69"
        }, 
        // height of the block where this transaction is stored
        "height": 1002581, 
        // id of the transaction, this is node dependent (different nodes may return different ids for the same transaction)
        "id": 667140, 
        "innerHash": {}
    }, 
    "transaction": {
        // amount transferred, in microXEMs (a millionth of 1 XEM)
        "amount": 0, 
        // deadline before which this transaction has to be confirmed
        "deadline": 60727263, 
        // fee, in microXEMs
        "fee": 18000000, 
        // the message attached to the transaction
	// type 1 is plain, 2 is secure (encrypted)
        "message": {
            "payload": "fe4e54590318b3ce5de42067de2af1da69bb082b6c05a425198f407a392cba3bdae5c3b686", 
            "type": 1
        }, 
        // recipient account of the transaction
        "recipient": "NCZSJHLTIMESERVBVKOW6US64YDZG2PFGQCSV23J", 
        // signature of the transaction, absent if multisig
        "signature": "bc7676f2ba4cb1d88110956b6b21dcf2356b2f86e47c44359a88a74d3d12e6a918fa5a920aff94af7d0984f644a51e18aa2a24bc1890cabad2f3fd2c9f79340e", 
        // public key of the account who created the account
        "signer": "826cedee421ff66e708858c17815fcd831a4bb68e3d8956299334e9e24380ba8", 
        // number of seconds elapsed since the creation of the nemesis block
        "timeStamp": 60723663, 
        // transaction type
        "type": 257, 
        // version of the data structure used
        "version": 1744830465
    }
}
```
### Using nem-sdk

A transaction that is send to a NIS for inclusion in the blockchain needs to be signed.
Although the process to follow is [very precisely described] (http://bob.nem.ninja/docs/#gathering-data-for-the-signature),
it is rather involved, and using a library including that feature is much easier and less error-prone.

In this section we will use the nodejs [nem-sdk](https://github.com/QuantumMechanics/NEM-sdk).
The procedure (using nem-sdk) to send a transaction includes 3 steps:
* create a transferTransaction object
* prepare the transaction for announcement on a specific network (mainnet, testnet or mijin).
* send the prepared transaction to NIS for inclusion in the blockchain.

The information required to generate a transfer transaction is:
* the private key of the sender account
* the address of the recipient, all uppercase and without hyphen
* the amount of XEMs to be sent
* the message sent with the transaction
* the address and port on which the NIS instance we will send the transaction to is listening

We define all these in variables:

``` javascript
var privateKey = "YOUR_ACCOUNT_PRIVATE_KEY";
var recipient = "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S";
var amount = 10;
var message = "dev guide test transaction";
var nisURL = "http://localhost";
var nisPort = "7890";
```
As we are running the containers accompanying this guide, we send our transaction on the testnet to
the NIS instance that runs locally. The sender and recipient accounts are test accounts used for this guide.

We first instanciate the endpoint, i.e. the variable identifying the NIS instance we will contact. 
The nem-sdk has this helper function `nem.model.objects.create` to instanciate model objects. In this case
we instanciate an `endpoint` with the `nisURL`and `nisPort` defined previously:

``` javascript
var endpoint = nem.model.objects.create("endpoint")(nisURL, nisPort);
```

Taking a look at the `endpoint` created, we see it is simply an object holding the properties of the endpoint we want to
connect to:
``` javascript
> endpoint
{ host: 'http://localhost', port: '7890' }

```

Transactions of any type have at least some common information to be provided. This info is place in a `common` object that
we instanciate. In our case, that object will hold the private key of the sender account under the `privateKey` property:

``` javascript
var common = nem.model.objects.get("common");
common.privateKey = privateKey;
```

Here again we have a simple key-value mapping:

``` javascript
> common
{ password: '',
  privateKey: 'YOUR_ACCOUNT_PRIVATE_KEY' }

```

We can now execute the three steps required to send a transaction. 
First a transferTransaction object is instanciate with the `recipient` address, the `amount` and the `message`:

``` javascript
var transferTransaction = nem.model.objects.create("transferTransaction")(recipient, amount, message);
```

The object created holds the information of the transaction as well as some characteristics of the transaction:
``` javascript
> transferTransaction
{ amount: 10,
  recipient: 'TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S',
  recipientPublicKey: '',
  isMultisig: false,
  multisigAccount: '',
  message: 'dev guide test transaction',
  isEncrypted: false,
  mosaics: [] }
```

In addition to the amount, recipient and message, it also specifies if this is a multisig transaction, and if mosaics are
exchanged.

At that time we can prepare the transaction for sending. This will prepare the transaction to be sent to NIS, including:
* setting the actual sender in case of a multisig transaction
* translate the amount in microXEMs 
* set the due time for accepting the transaction
* wrap the transaction in a multisig transaction if needed (see below for more details)

The sender of the transaction is identified by its public key, derived from its private key. The network this transaction is 
destined for is needed to automatically set the due time. 
This explains the arguments passed to the prepare method: `common` for the sender's private key, `transferTransaction` for the
transaction data, and `nem.model.network.data.testnet.id` for the network:

``` javascript
var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id)
```

Let's take a look at the transactionEntity:

``` javascript
> transactionEntity
{ type: 257,
  version: -1744830463,
  signer: '4fe5efd97360bc8a32ec105d419222eeb714e6d06fd8b895a5eedda2b0edf931',
  timeStamp: 68284025,
  deadline: 68287625,
  recipient: 'TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S',
  amount: 10000000,
  fee: 2000000,
  message: 
   { type: 1,
     payload: '6465762067756964652074657374207472616e73616374696f6e' },
  mosaics: null }
```

We see that a complete transaction object recognised by the NEM network has been constructed:
* amount and [fees](http://bob.nem.ninja/docs/#transaction-fees) are expressed in microXEMs
* the transaction type and version are set
* the transaction timestamp and its deadline are set.
* the message has also been [prepared](https://github.com/QuantumMechanics/NEM-sdk/blob/master/src/model/transactions.js#L186). Type 1 indicates it is a message that has not been encrypted. 


Once the transaction is prepared, it can be signed by the initiating account (which requires its private key), and sent to
 the endpoint we instanciated earlier:

``` javascript
nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res) {console.log("done");});
```

If you use this guide's docker containers, you can inspect the POST request sent to the NIS server by accessing the mitmproxy interface
at [http://localhost:8081](http://localhost:8081). Here is a screenshot:

![](transaction_unisig_post.png)

We see that the payload is a JSON object with fields data and signature. The `data` field is the serialised trnsaction, and the NIS API documentation
explains [how to generated the signature](http://bob.nem.ninja/docs/#creating-a-signed-transaction).


> If you want to take a look at the internals of nem-sdk, here is some details on the serialisation and signature of transactions.
The serialisation is done with a call to `nem.utils.serialization.serializeTransaction(transactionEntity);` and the serialised transaction
is then encode with a call to `nem.utils.convert.ua2hex(serialized)`.
The signature is applied to the serialised transaction.


When our transaction has been received by NIS, it is in state unconfirmed, until it it included in a block.

As conclusion, let's look at the complete code. If you don't count the variable
initialisation, you have just 6 lines of code required to send a transaction to
a NIS instance.
Here is the complete code:

``` javascript
// parameters initialisation
var privateKey = "YOUR_ACCOUNT_PRIVATE_KEY";
var recipient = "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S";
var amount = 10;
var message = "dev guide test transaction";
var nisURL = "http://localhost";
var nisPort = "7890";

// endpoint initialisation
var endpoint = nem.model.objects.create("endpoint")(nisURL, nisPort);
// transaction common data initialisation
var common = nem.model.objects.get("common");
common.privateKey = privateKey;

// create transfer transaction object
var transferTransaction = nem.model.objects.create("transferTransaction")(recipient, amount, message);
// prepare transaction
var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id)
// sign and send to NIS
nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res) {console.log("done");});
```

### From another language
If you use another language that doesn't let you use nem-sdk, You can easily build the JSON objects to define transaction. However,
you need to sign the transactions before they are sent to a NIS instance. To do that you have two solutions. 

The first one is to 
implement the signing algorithm yourself in your preferred code. This offers the best integration with your language and tools, and 
although it is very instructive and will give you a good idea of the inner workings of NEM, it is not straight-forward and time intensive.

The second one, which is easier and will be covered in this section, is to write a small signing server with Nodejs, and ask it to sign 
transactions you build in your language. The way you communicate with the Nodejs signing server is your choice to make, but in this example
we will use [zerorpc](http://www.zerorpc.io/) from a python client. But you could possibly choose a completely different solution, such as
[a Redis server to implement a work queue](https://redis.io/commands/rpoplpush).

Here are the steps that are needed when preparing a transaction with nem-sdk:

``` javascript
        var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, tx, network.id);
        var kp = nem.crypto.keyPair.create(common.privateKey);
        var serialized = nem.utils.serialization.serializeTransaction(transactionEntity);
        var signature = kp.sign(serialized);
```
The steps are:

* prepare the JSON object with the transaction data
* get the private key to be used for signing
* serialise the transaction
* sign the serialised transaction

We can thus develop a small server that will expose a sign method, taking as argument the `common`, `tx` and network name for which the transaction is destined, and returning the signed transaction JSON object ready for sending to a NIS instance.
Here it is:

``` javascript
var zerorpc = require("zerorpc");
var server = new zerorpc.Server({
    sign: function(_tx,_common,net_name, reply) {
        // parse arguments to get objects
        var common=JSON.parse(_common);
        var tx=JSON.parse(_tx)
        // get network object corresponding to name passed as argument, eg "testnet"
        var network=nem.model.network.data[net_name]

        // build the transaction object
        var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, tx, network.id);
        // initialise keypair object based on private key
        var kp = nem.crypto.keyPair.create(common.privateKey);
        // serialise transaction object
        var serialized = nem.utils.serialization.serializeTransaction(transactionEntity);
        // sign serialised transaction
        var signature = kp.sign(serialized);

        // build result object
        var result = { 
                'data': nem.utils.convert.ua2hex(serialized),
                'signature': signature.toString()
        };
        
        // send response to client
        reply(null, result);
    }   
});             
server.bind("tcp://0.0.0.0:4242");
```


> In the example, the client is passing the private key to be used for signing to the server. An alternative could be to defined to private key at the side of the signing server. You could also add limitations on the transactions that are signed, such as refusing to sign transactions for higher than accepted amounts.


The client is developed in python, and is equally simple. It builds transaction objects, converts them to JSON formatted strings, and 
asks the server to sign it. The response that is received is a JSON object ready to be sent to a NIS instance. Here is the complete
client code:


``` python
import zerorpc
import requests

// initialise client
c = zerorpc.Client()
c.connect("tcp://127.0.0.1:4242")

// initialise transaction and signer data
tx={ "amount": 11, "recipient": "TAPWFJHCGV3GL3CZEERB3IGXPMBWNGGEZKAVPNFB", "recipientPublicKey": "", "isMultisig": False, "multisigAccount": "", "message": "msg", "isEncrypted": False, "mosaics": [] }
common={ "password": "", "privateKey": "YOU_PRIVATE_KEY" }

// convert to json strings
str_common=json.dumps(common)
str_tx=json.dumps(tx)

// call remote procedure, passing string arguments
signed = c.sign(str_tx, str_common, "testnet")

// post signed transaction to a NIS instance
url="http://localhost:7890/transaction/announce"
response = requests.post(url, json=signed)
```


## Multisig transactions
M-of-N multisig transactions are not initiated by the account sending the funds (let's call it the actual sender). The transaction is initiate by
one of the N accounts that have been indicated as cosignatories of the account. The transaction stay unconfirmed as long as less than M cosignatory 
accounts have signed it. Once the transaction has been signed by M cosignatories, it can be included in a block.

As a reminder, the type of a multisig transfer transaction is `0x1004` or `4100`.
When a transfer has to be done from a multisig account, a normal transfer transaction is wrapped in a multisig transaction. Let's see how this work.

Initiating multisig transactions is very similar to initiating a unisig transaction. We start by defining variables we will use. Only one 
additional variable is defined: `actual_sender`, which is a javascript object holging the public key of the multisig account (the actual sender).

``` javascript
var privateKey = "YOU_SIGNER_PRIVATE_KEY";
var recipient = "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S";
var amount = 10;
var message = "dev guide test multisig transaction";
var nisURL = "http://localhost";
var nisPort = "7890";
var actual_sender={publicKey: "e3775e0cbab73d014b0309f81890455bf3c8df1325f2de1aa6a800951220d611"}
```

Then, exactly as for the unisig transaction, we initialise the endpoint defining which NIS we will use, 
we initialise the part common to all transactions, and we build a transfer transaction object.


``` javascript
var endpoint = nem.model.objects.create("endpoint")(nisURL, nisPort);
var common = nem.model.objects.get("common");
common.privateKey = privateKey;
var transferTransaction = nem.model.objects.create("transferTransaction")(recipient, amount, message);
```

At this time we have some differences from the unisig transaction. If we look at the transferTransaction object:

``` javascript
> transferTransaction
{ amount: 10,
  recipient: 'TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S',
  recipientPublicKey: '',
  isMultisig: false,
  multisigAccount: '',
  message: 'dev guide test multisig transaction',
  isEncrypted: false,
  mosaics: [] }
```

we see that by default it is not a multisig transaction (`isMultisig: false`). To mark this as a multisig transaction, we
have to assign true to the `isMultisig` field, and add information about the actual sender under the key `multisigAccount`.
This is done like this:

``` javascript
transferTransaction.isMultisig= true;
transferTransaction.multisigAccount=actual_sender
```
These two lines are the only changes necessary from the unisig code to initiate a multisig transaction!
Our transferTransaction object then looks like this:

``` javascript
> transferTransaction
{ amount: 10,
  recipient: 'TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S',
  recipientPublicKey: '',
  isMultisig: true,
  multisigAccount: { publicKey: 'e3775e0cbab73d014b0309f81890455bf3c8df1325f2de1aa6a800951220d611' },
  message: 'dev guide test multisig transaction',
  isEncrypted: false,
  mosaics: [] }
```

Then, like for the unisig transaction, we prepare the transaction to get a transactionEntity:

``` javascript
var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id)
```

This object looks like this:
``` javascript
> transactionEntity
{ type: 4100,
  version: -1744830463,
  signer: '61a2896696fef452d001299f279567aacc79706c2b2c899f9dec70e0b92eb6b6',
  timeStamp: 68309713,
  deadline: 68313313,
  fee: undefined,
  otherTrans: 
   { type: 257,
     version: -1744830463,
     signer: 'e3775e0cbab73d014b0309f81890455bf3c8df1325f2de1aa6a800951220d611',
     timeStamp: 68309713,
     deadline: 68313313,
     recipient: 'TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S',
     amount: 10000000,
     fee: 3000000,
     message: 
      { type: 1,
        payload: '6465762067756964652074657374206d756c7469736967207472616e73616374696f6e' },
     mosaics: null } }
```

We observer that it has type 4100, and includes a field `otherTrans`, which is of type 257. This shows that
the transfer transaction (of type 257) is wrapped in a multisig transaction (of type 4100).

The fee of the outer transaction is null, which is a problem that will be fixed in nem-sdk. For now, we have to set it
manually if it is null. The fee of a multisig transaction is 6 XEMs per cosignatory. The example account is a 1-of-2 account,
so 6 XEMS are sufficient, but remember that fees are set in microXEMs, so we set the value to 6000000:

``` javascript
transactionEntity.fee=6000000
```


> **Be very causious when setting fees manually**. An error can easily occur, and you might end up transferring millions of XEMs 
when you wanter to transfer only a couple of XEMs.... Some users of the NanoWallet have set the amount to transfer as the fee, 
making a similar error in your code might be catastrophic. Always double check and validate your code in the testnet first!!!



With this fix in place, we can now sign and send the transaction to NIS:
``` javascript
nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res) {console.log("done");});
```



``` javascript
// parameters initialisation
var privateKey = "YOU_SIGNER_PRIVATE_KEY";
var recipient = "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S";
var amount = 10;
var message = "dev guide test multisig transaction";
var nisURL = "http://localhost";
var nisPort = "7890";
var actual_sender={publicKey: "e3775e0cbab73d014b0309f81890455bf3c8df1325f2de1aa6a800951220d611"}

// endpoint initialisation
var endpoint = nem.model.objects.create("endpoint")(nisURL, nisPort);
// transaction common data initialisation
var common = nem.model.objects.get("common");
common.privateKey = privateKey;

// create transfer transaction object
var transferTransaction = nem.model.objects.create("transferTransaction")(recipient, amount, message);
transferTransaction.isMultisig= true;
transferTransaction.multisigAccount=actual_sender


// prepare transaction
var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id)
// temporary nem-sdk fix
transactionEntity.fee=6000000
// sign and send to NIS
nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res) {console.log("done");});
```