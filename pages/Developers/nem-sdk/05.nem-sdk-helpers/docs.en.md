---
title: 'Helpers and Format'
parent: NEM-sdk
grand_parent: Developer resources
nav_order: 5
taxonomy:
    category:
        - docs
---

### 5.1 - Helpers

**Namespace**: `nem.utils.helpers`

**Public methods**:
- `needsSignature`
- `haveTx`
- `getTransactionIndex`
- `haveCosig`
- `createNEMTimeStamp`
- `fixPrivateKey`
- `isPrivateKeyValid`
- `isPublicKeyValid`
- `checkAndFormatUrl`
- `createTimeStamp`
- `getTimestampShort`
- `convertDateToString`
- `extendObj`
- `isHexadecimal`
- `searchMosaicDefinitionArray`
- `grep`
- `isTextAmountValid`
- `cleanTextAmount`
- `formatEndpoint`

### 5.2 - Format

**Namespace**: `nem.utils.format`

**Public methods**:
- `address`
- `hexMessage`
- `hexToUtf8`
- `importanceTransferMode`
- `levyFee`
- `nemDate`
- `nemImportanceScore`
- `nemValue`
- `pubToAddress`
- `splitHex`
- `supply`
- `supplyRaw`
- `mosaicIdToName`
- `txTypeToName`

#### Format address 

Add hyphens to unformatted address.

#### Parameters

Name           | Type             | Description                     |
---------------|------------------|---------------------------------|
address        | string           | An unformatted NEM address      | 

#### Example

```javascript
var address = "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S";

// Add hyphens to NEM address
var fmtAddress = nem.utils.format.address(address); //TBCI2A-67UQZA-KCR6NS-4JWAEI-CEIGEI-M72G3M-VW5S
```
#### Format a nem quantity

Change a NEM quantity into an array of values.

Quantity means the smallest unit (1.000000 XEM = 1'000'000)

#### Parameters

Name           | Type             | Description                       |
---------------|------------------|-----------------------------------|
data           | number           | A quantity (smallest unit)        | 

#### Example

```javascript
var xemQuantity = 10003002; // Smallest unit for XEM

// Format quantity
var fmt = nem.utils.format.nemValue(xemQuantity)

var fmtAmount = fmt[0] + "." + fmt[1]; // 10.003002
```

#### Format a message object

Format hexadecimal payload contained in message objects.

Message objects also contains type:

Type 1: Plain message. 
Type 2: Encrypted message.

#### Parameters

Name           | Type             | Description                       |
---------------|------------------|-----------------------------------|
msg            | object           | A message object                  | 

#### Example

```javascript
var msg = {
  "type": 1,
  "payload": "4e454d20697320617765736f6d652021"
}

// Format msg
var fmt = nem.utils.format.hexMessage(msg); // NEM is awesome !
```