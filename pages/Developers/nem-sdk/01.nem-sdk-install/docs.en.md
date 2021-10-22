---
title: SDK Introduction
parent: NEM-sdk
grand_parent: Developer resources
nav_order: 1
taxonomy:
    category:
        - docs
---

### 1.1 - Installation

#### For the browser:

Download the library source, open the `dist/` folder and put `nem-sdk.js` into your project.

Library include the `require()` function so you can `require()` the module directly

```html
<script src="nem-sdk.js"></script>
<script>
  // Include the library
  var nem = require("nem-sdk").default;
  console.log(nem)
</script>
```

#### For Node:

##### Using npm:

`npm install nem-sdk`

```javascript
// Use require
var nem = require("nem-sdk").default;
```

```javascript
// ES6
import nem from 'nem-sdk';
```

##### Using `build/` folder:

```javascript
// Use the build/ folder
var nem = require("path/to/build/index.js").default;
``` 
### 1.2 - Build

#### Install dependencies:

```npm install```

#### Build:

```npm run build```

#### Build for the browser (after above build):

```npm run browserify```

### 1.3 - Organisation

The SDK is organised in namespaces and sub-namespaces. 

There is 4 main namespaces:

#### `nem.com`
- `requests`: Requests to NIS and the outside world
- `websockets`: Connection, subscription and requests to NIS websockets

#### `nem.crypto`
- `keyPair`: Functions to create keypair from hex and sign data with it
- `helpers`: Miscellaneous cryptographic functions, like encrypt private key, decrypt a wallet, derive a password...
- `nacl`: External cryptographic library modified for NEM
- `js`: Access to the crypto-js library

#### `nem.model`
- `address`: Functions regarding NEM addresses like base32 encoding / decoding, verify, convert public key to address...
- `objects`: Contains usesul objects models
- `fees`: Contains all the transaction fees and calculation functions
- `network`: Contains networks types and functions related
- `nodes`: Contains array of nodes for different networks, default nodes, search by hash nodes...
- `sinks`: Contains the sink addresses for namespaces and mosaics by network
- `transactions`: Contains functions to prepare and send transaction objects
- `transactionTypes`: Contains all the NEM transactions types
- `wallet`: Contains functions to create wallets

#### `nem.utils`
- `convert`: Contains convertion functions
- `helpers`: Contains miscellaneous helper functions
- `format`: Contains miscellaneous formatting functions
- `nty`: Contains functions to build nty data
- `Serialization`: Contains functions to serialize transactions

Consult the code directly for details, almost all functions are commented, with parameters, return values and types. 
