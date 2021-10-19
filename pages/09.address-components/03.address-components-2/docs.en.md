---
title: 'Generate Key and Key Pair'
parent: 'Address Components'
nav_order: 1
taxonomy:
    category:
        - docs
---

## Generating a key-pair

The easiest way to generate a key-pair is currently the [nem-sdk](https://github.com/QuantumMechanics/NEM-sdk), which is a javascript implementation 
usable in the browser and on nodejs. All this is setup in the docker container accompanying this guide.

The first step is to generate a random private key.
When printed as an hexadecimal value, it can be used to create an account with the NanoWallet.
 
Here is how you generate a key-pair:
``` javascript
//import the nem-sdk
// This is not needed if you use the repl.js script available in the container
var nem = require("nem-sdk").default;
// generate 32 random bytes. 
// You could write the 32 bytes of your choice if you prefer, but that might be dangerous as
// it would be less random.
// 
var rBytes = nem.crypto.nacl.randomBytes(32);
// convert the random bytes to an hex string
// the result, rHex, can be printed out to the console for taking a backup with console.log(rBytes).
// Take a backup copy of that value as it lets you recreate the keypair to give
// you access to your account.
// This value is also usable with the NEM NanoWallet.
var rHex = nem.utils.convert.ua2hex(rBytes);
// generate the keypair
var keyPair = nem.crypto.keyPair.create(rHex);
```

The public key can be printed out easily with:
``` javascript
keyPair.publicKey.toString()
'4fe5efd97360bc8a32ec105d419222eeb714e6d06fd8b895a5eedda2b0edf931'
```


## Generating the address from the public key

As described above, the address has a prefix for each network supported
(mainnet, testnet, mijin), so the nem-sdk helpers to generate an address take
as argument the public key and the network id for which to generate the
address.

The network ids are stored under `nem.model.network.data.testnet.id`,
`nem.model.network.data.mainnet.id`, `nem.model.network.data.mijin.id`.

With this info, we can generate the address:

``` javascript
nem.model.address.toAddress(keyPair.publicKey.toString(),  nem.model.network.data.testnet.id)
'TA6XFSJYZYAIYP7FL7X2RL63647FRMB65YC6CO3G'
```
