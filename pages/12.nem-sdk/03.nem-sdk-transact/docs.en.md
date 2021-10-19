---
title: Transactions
parent: NEM-sdk
nav_order: 3
taxonomy:
    category:
        - docs
---

**Namespace**: `nem.model.transactions`

**Public methods**:
- `prepare`
- `send`
- `prepareMessage`

**Keywords**:
- `transferTransaction`
- `mosaicTransferTransaction`
- `signatureTransaction`

This namespace is used to prepare and send transactions. 

For now only preparation of simple and mosaics transactions with encrypted, unencrypted and hex messages are implemented.

### 3.1 - Create and prepare transaction objects

In part 2 you can see in the examples how to build a transfer transaction object, with or without data.

Transaction objects you will create via `nem.model.objects` are un-prepared transaction objects. They only contain raw / incomplete data and need to be arranged before being signed and sent.

Using the `prepare` method takes different parameters depending of the transaction object.

#### Parameters

##### `transferTransaction`

|Name           | Type             | Description                  |
|---------------|------------------|------------------------------|
|common         | object           | A common object              |
|tx             | object           | A transferTransaction object |
|network        | number           | A network id                 |

##### `mosaicTransferTransaction`

|Name                          | Type             | Description                           |
|------------------------------|------------------|---------------------------------------|
|common                        | object           | A common object                       |
|tx                            | object           | A transferTransaction object          |
|mosaicDefinitionMetaDataPair  | object           | A mosaicDefinitionMetaDataPair object (see 3.4)|
|network                       | number           | A network id                          |

#### Usage:

```javascript
// Prepare a transaction object
var preparedTransaction = nem.model.transactions.prepare("keyword")(param1, param2, ...);
```

#### Transfer transaction example:

```javascript
// Create an object with parameters
var transferTransaction = nem.model.objects.create("transferTransaction")("TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S", 10, "Hello");

// Prepare the above object
var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id)
```

#### Return:

```javascript
{
	type: 257,
  	version: -1744830463,
  	signer: '0257b05f601ff829fdff84956fb5e3c65470a62375a1cc285779edd5ca3b42f6',
  	timeStamp: 62995509,
  	deadline: 62999109,
  	recipient: 'TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S',
  	amount: 10000000,
  	fee: 2000000,
  	message: { type: 1, payload: '48656c6c6f' },
  	mosaics: null
}
```

You can easily see the difference between an un-prepared transaction object (2.2) and above prepared object.

#### Note:

Amounts are in the smallest unit possible in a prepared transaction object:

> 1000000 = 1 XEM

#### Signature transaction example:

```javascript
// Create an object with parameters (multisig account address and inner transaction hash)
var signatureTransaction = nem.model.objects.create("signatureTransaction")("TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S", "161d7f74ab9d332acd46f96650e74371d65b6e1a0f47b076bdd7ccea37903175");

// Prepare the above object
var transactionEntity = nem.model.transactions.prepare("signatureTransaction")(common, signatureTransaction, nem.model.network.data.testnet.id)
```

#### Return:

```javascript
{
  type: 4098,
  version: -1744830463,
  signer: '0257b05f601ff829fdff84956fb5e3c65470a62375a1cc285779edd5ca3b42f6',
  timeStamp: 62995509,
  deadline: 62999109,
  otherHash: {
    data: '161d7f74ab9d332acd46f96650e74371d65b6e1a0f47b076bdd7ccea37903175'
  },
  otherAccount: 'TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S',
  fee: 6000000
}
```

### 3.2 - Sending prepared transactions

Once your transaction is prepared simply use the `send` method of the namespace.

#### Parameters

|Name           | Type             | Description                   |
|---------------|------------------|-------------------------------|
|common         | object           | A common object               |
|entity         | object           | A prepared transaction object |
|endpoint       | object           | An endpoint object            |

#### Example

```javascript
// Serialize transfer transaction and announce
nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res) {....});

```

#### return

A `NemAnnounceResult` object (http://bob.nem.ninja/docs/#nemAnnounceResult)

### 3.3 - Transfer transactions without mosaics

The two provided example speaks for themselves:

- See `examples/node/transfer.js` for node
- See `examples/browser/transfer` for browser

The node version contains only the strict necessary while browser example needs to handle form and update fees.

### 3.4 - Transfer transactions with mosaics

- See `examples/node/mosaicTransfer.js` for node
- See `examples/browser/mosaicTransfer` for browser

Similar to transfer transaction, it use the same un-prepared `transferTransaction` object, but needs an array of `mosaicAttachment` objects.

Keyword of the preparation function is `mosaicTransferTransaction`.

Preparation of mosaic transfer transactions requires a `mosaicDefinitionMetaDataPair` object containing mosaic definitions of the mosaics you are joining to the transaction. 

Definitions are needed to know informations about the included mosaic(s) and calculate quantity and fee accordingly.

#### Two ways are possible to get mosaic definitions:

 1) You can take it from NIS API using http://bob.nem.ninja/docs/#retrieving-mosaic-definitions and put the definition into `model/objects.js`, in the `mosaicDefinitionMetaDataPair` object (like shown by the comments). If mosaics used in your application are fixed, it is the way to go.

 2) Query the network using the embedded API requests (`nem.com.requests.namespace.mosaicDefinitions`) as shown in the examples. If mosaics used in your application are not fixed, it is the way to go.
