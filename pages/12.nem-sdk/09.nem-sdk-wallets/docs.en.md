---
title: Wallets
parent: NEM-sdk
nav_order: 9
taxonomy:
    category:
        - docs
---

**Namespace**: `nem.model.wallet`

**Public methods**:
- `createPRNG`
- `createBrain`
- `importPrivateKey`

The SDK allow to create wallets 100% compatible with the Nano Wallet client (as BIP32 not implemented yet the client will ask for an upgrade).

Wallet can contain multiple accounts in an object of objects. The first account is the primary account and is labelled like this by default. 

Every accounts objects but primary of brain wallets contains an encrypted private key. Brain wallets primary do not contains an encrypted private key because it is retrieved by the password / passphrase.

Each wallet has an `algo` property, it is needed to know how to decrypt the accounts.

Wallet files (.wlt) are just storing a wallet object as base 64 strings.

### 9.1 - Create simple wallets

`nem.model.wallet.createPRNG` create a wallet object with the primary account's private key generated from a PRNG

```javascript
// Set a wallet name
var walletName = "QuantumMechanicsPRNG";

// Set a password
var password = "Something";

// Create PRNG wallet
var wallet = nem.model.wallet.createPRNG(walletName, password, nem.model.network.data.testnet.id);
```

### 9.2 - Create brain wallets

`nem.model.wallet.createBrain` create a wallet object with primary account's private key derived from a password/passphrase

```javascript
// Set a wallet name
var walletName = "QuantumMechanicsBrain";

// Set a password/passphrase
var password = "Something another thing and something else";

// Create Brain wallet
var wallet = nem.model.wallet.createBrain(walletName, password, nem.model.network.data.testnet.id);
```

### 9.3 - Create private key wallets

`nem.model.wallet.importPrivateKey` create a wallet object with primary account's private key imported

```javascript
// Set a wallet name
var walletName = "QuantumMechanicsImported";

// Set a password
var password = "Something";

// Set private key
var privateKey = "Private key to import";

// Create a private key wallet
var wallet = nem.model.wallet.importPrivateKey(walletName, password, privateKey, nem.model.network.data.testnet.id);
``` 

### 9.4 - Create wallet files

Create an empty file, name it `walletName.wlt` and put the base 64 string given by below code

```javascript
// Convert stringified wallet object to word array
var wordArray = nem.crypto.js.enc.Utf8.parse(JSON.stringify(wallet));

// Word array to base64
var base64 = nem.crypto.js.enc.Base64.stringify(wordArray);
``` 

### 9.5 - Decrypt account in wallet

`nem.crypto.helpers.passwordToPrivatekey` is a function to decrypt an account into a wallet and return it's private key into the `common` object

```javascript
// Create a common object
var common = nem.model.objects.create("common")("walletPassword/passphrase", "");

// Get the wallet account to decrypt
var walletAccount = wallet.accounts[index];

// Decrypt account private key 
nem.crypto.helpers.passwordToPrivatekey(common, walletAccount, wallet.algo);

// The common object now has a private key
console.log(common)

``` 