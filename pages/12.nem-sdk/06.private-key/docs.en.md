---
title: 'Private Key'
parent: NEM-sdk
nav_order: 6
taxonomy:
    category:
        - docs
---

A private key is a 64 or 66 characters hex string, looking like this:

```
// 64 characters hexadecimal private key
712cb1b773066cf572b6f271cb10be49b3e71ed24dd7b6a2ac876af9f3ad84e7

// 66 characters hexadecimal private key (always start with 00 in that case)
00d32b7c09e8747908b1ed9dbc893ff33987b2275bb3401cd5199f45b1bbbc7d75
```

### 6.1 - Create private keys

To obtain a private key, 4 choices are possible:

1) You can type yourself a random 64 hexadecimal string

2) Use the included PRNG:
``` javascript
// Create random bytes from PRNG
var rBytes = nem.crypto.nacl.randomBytes(32);

// Convert the random bytes to hex
var privateKey = nem.utils.convert.ua2hex(rBytes);
```

3) Create a private key from a passphrase:
``` javascript
// Derive a passphrase to get a private key
var privateKey = nem.crypto.helpers.derivePassSha(passphrase, 6000).priv;
```

4) Use a private key from another source.

### 6.2 - Create key pairs

Key pairs are objects representing accounts keys (private, secret and public) and are used to sign data or transactions.

#### Parameters

Name           | Type             | Description                     |
---------------|------------------|---------------------------------|
hexData        | string           | 64 or 66 hexadecimal characters | 

#### Example

```javascript
// A funny but valid private key
var privateKey = "aaaaaaaaaaeeeeeeeeeebbbbbbbbbb5555555555dddddddddd1111111111aaee";

// Create a key pair
var keyPair = nem.crypto.keyPair.create(privateKey);
```

### 6.3 - Sign with key pair

To sign a transaction or any other data simply use the above `keyPair` object

#### Example

```javascript
var signature = keyPair.sign(data);
```

### 6.4 - Extract public key from key pair

You can extract the public key from the `keyPair` object very easily

#### Example

```javascript
var publicKey = keyPair.publicKey.toString();
```

### 6.5 - Verify a signature

To verify a signature you need the signer public key, the data that have been signed and the signature.

#### Parameters

Name           | Type             | Description               |
---------------|------------------|---------------------------|
publicKey      | string           | The signer public key     | 
data           | string           | The data that were signed | 
signature      | string           | The signature of the data |


#### Example

```javascript
var signer = "0257b05f601ff829fdff84956fb5e3c65470a62375a1cc285779edd5ca3b42f6"
var signature = "392511e5b1d78e0991d4cb2a10037cc8be775e56d76b8157a4da726ccb44042e9b419084c09128ffe2a78fe78e2a19beb0e2f57e14b66c962187e61457bd9e09"
var data = "NEM is awesome !";
// Verify
var result = nem.crypto.verifySignature(signer, data, signature);
```

- See `examples/nodejs/verifySignature.js` for node demonstration
