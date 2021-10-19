---
title: Objects
parent: NEM-sdk
nav_order: 2
taxonomy:
    category:
        - docs
---

## 2 - Objects

**Namespace**: `nem.model.objects`

This namespace allow to easily `get` or `create` objects to use in the SDK. Each object is accessible via a keyword.

**Public methods**:
- `get`
- `create`

**Keywords**:
- `common`: An object to hold password and private key
- `endpoint`: An object containing info about a remote node
- `mosaicAttachment`: An object containing mosaic data to join in a transfer transaction
- `mosaicDefinitionMetaDataPair`: An object of objects containing mosaics properties
- `invoice`: An invoice object working on NEM mobile clients
- `transferTransaction`: An un-prepared transfer transaction object
- `signatureTransaction`: An un-prepared signature transaction object

### 2.1 - Get objects

Return an empty object

#### Usage:

```javascript
// Get an empty object
var object = nem.model.objects.get("keyword");
```

#### Example:

```javascript
// Get an empty object
var transferTransaction = nem.model.objects.get("transferTransaction");
```
#### Return:

```json
{
    "amount": "",
    "recipient": "",
    "recipientPublicKey": "",
    "isMultisig": false,
    "multisigAccount" : "",
    "message": "",
    "isEncrypted" : false,
    "mosaics": []
}
```

### 2.2 - Create objects

Return an object with parameters.

Using the `create` method takes different parameters depending of the object.

#### Parameters

##### `common`

|Name           | Type             | Description   |
|---------------|------------------|---------------|
|password       | string           | A password    |
|privateKey     | string           | A private key |

##### `endpoint`

|Name           | Type             | Description   |
|---------------|------------------|---------------|
|host           | string           | An NIS uri    |
|port           | string           | An NIS port   |

##### `mosaicAttachment`

|Name           | Type             | Description               |
|---------------|------------------|---------------------------|
|namespaceId    | string           | A namespace name          |
|mosaicName     | string           | A mosaic name             |
|quantity       | long number      | A quantity in micro-units |

##### `transferTransaction`

|Name           | Type             | Description               |
|---------------|------------------|---------------------------|
|recipient      | string           | A recipient address       |
|amount         | number           | An amount                 |
|message        | string           | A message to join         |

#### Usage:

```javascript
// Create an object with parameters
var object = nem.model.objects.create("keyword")(param1, param2, ...);
```

#### Example:

```javascript
// Create an object with parameters
var transferTransaction = nem.model.objects.create("transferTransaction")("TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S", 10, "Hello");
```

#### Return:

```json
{
    "amount": 10,
    "recipient": "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S",
    "recipientPublicKey": "",
    "isMultisig": false,
    "multisigAccount" : "",
    "message": "Hello",
    "isEncrypted" : false,
    "mosaics": []
}
```

### 2.3 - More

Consult `src/model/objects.js` for details about objects and creation parameters
