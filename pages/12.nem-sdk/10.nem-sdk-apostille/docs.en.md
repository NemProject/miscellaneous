---
title: Apostille
parent: NEM-sdk
nav_order: 10
taxonomy:
    category:
        - docs
---

**Namespace**: `nem.model.apostille`

**Public methods**:
- `create`
- `generateAccount`
- `hashing`
- `verify`

This namespace is used to create and verify Apostilles. For detailled informations about Apostille: https://www.nem.io/ApostilleWhitePaper.pdf

### 10.1 - Create an Apostille

`nem.model.apostille.create` create an apostille object containing information about the apostille, and the transaction ready to be sent via `nem.model.transactions.send`.

#### Example

```javascript
// Create a common object holding key
var common = nem.model.objects.create("common")("", "privateKey");

// Simulate the file content
var fileContent = nem.crypto.js.enc.Utf8.parse('Apostille is awesome !');

// Create the Apostille
var apostille = nem.model.apostille.create(common, "Test.txt", fileContent, "Test Apostille", nem.model.apostille.hashing["SHA256"], false, true, nem.model.network.data.testnet.id);

// Serialize transfer transaction and announce
nem.model.transactions.send(common, apostille.transaction, endpoint).then(...)
```

- See `examples/node/apostille/create` for creation example in node

### 10.2 - Verify an Apostille

`nem.model.apostille.verify` verify an apostille from a file content (as Word Array) and an apostille transaction object.

```javascript
// Create an NIS endpoint object
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

// Simulate the file content
var fileContent = nem.crypto.js.enc.Utf8.parse('Apostille is awesome !');

// Transaction hash of the Apostille
var txHash = "9b2dc096fb55e610c97a870b1d385458ca3d60b6f656428a981069ab8edd9a28";

// Get the Apostille transaction from the chain
nem.com.requests.transaction.byHash(endpoint, txHash).then(function(res) {
  // Verify
  if (nem.model.apostille.verify(fileContent, res.transaction)) {
    console.log("Apostille is valid");
  } else {
    console.log("Apostille is invalid");
  }
}, function(err) {
  console.log("Apostille is invalid");
  console.log(err);
});
```

- See `examples/node/apostille/audit` for verification example in node

### 10.3 - More

Consult `src/model/apostille.js` for more details