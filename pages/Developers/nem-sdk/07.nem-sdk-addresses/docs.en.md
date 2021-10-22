---
title: Addresses
parent: NEM-sdk
grand_parent: Developer resources
nav_order: 7
taxonomy:
    category:
        - docs
---

## 7 - Addresses

**Namespace**: `nem.model.address`

**Public methods**:
- `b32encode`
- `b32decode`
- `toAddress`
- `isFromNetwork`
- `isValid`
- `clean`

Addresses are base32 string used to receive XEM. They look like this:

> NAMOAV-HFVPJ6-FP32YP-2GCM64-WSRMKX-A5KKYW-WHPY
> NAMOAVHFVPJ6FP32YP2GCM64WSRMKXA5KKYWWHPY

The version without hyphens ("-") is the one we'll use in our queries and lower level processing. The formatted version is only for visual purposes.

#### Beginning of the address depend of the network:

- **Mainnet (104)**: N

- **Testnet (-104)**: T

- **Mijin (96)**: M

### 7.1 - Convert public key to an address

```javascript
var address = nem.model.address.toAddress(publicKey, networkId)
```

### 7.2 - Verify address validity

```javascript
var isValid = nem.model.address.isValid(address);
```

### 7.3 - Verify if address is from given network

```javascript
var isFromNetwork = nem.model.address.isFromNetwork(address, networkId);
```

### 7.4 - More

Consult `src/model/address.js` for more details