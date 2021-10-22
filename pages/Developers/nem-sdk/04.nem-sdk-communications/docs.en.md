---
title: Communications
parent: NEM-sdk
grand_parent: Developer resources
nav_order: 4
taxonomy:
    category:
        - docs
---

### 4.1 - Create endpoints

To communicate with an NIS you need an `endpoint` object. The object contains the node host and port so it is easier to handle.

#### Examples

```javascript
// Custom endpoint
var endpoint = nem.model.objects.create("endpoint")("http://myNode", 7890);

// Using sdk data
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
```

### 4.2 - API requests

**Namespace**: `nem.com.requests`

22 NIS API calls and a few other external requests are implemented and organised in namespaces:

#### `nem.com.requests.account`
- `data`: Gets account data
- `forwarded`: Gets the account data of the account for which the given account is the delegate account
- `harvesting.blocks`: Gets harvested blocks
- `harvesting.stop`: Stop delegated harvesting
- `harvesting.start`: Start delegated harvesting
- `namespaces.owned`: Gets namespaces that an account owns
- `mosaics.owned`: Gets mosaics that an account owns
- `mosaics.allDefinitions`: Gets all mosaic definitions that an account owns
- `mosaics.definitions`: Gets mosaic definitions that an account has created
- `transactions.incoming`: Gets incoming transactions
- `transactions.unconfirmed`: Gets unconfirmed transactions
- `transactions.all`: Gets all transactions
- `transactions.outgoing`: Gets outgoing transactions
- `unlockInfo`: Gets information about the maximum number of allowed harvesters and how many harvesters are already using the node

#### `nem.com.requests.apostille`
- `audit`: Audit an apostille

#### `nem.com.requests.chain`
- `height`: Gets the chain height
- `lastBlock`: Gets the last block
- `time`: Get network time

#### `nem.com.requests.endpoint`
- `heartbeat`: Gets the node status

#### `nem.com.requests.market`
- `xem`: Gets XEM price in BTC
- `btc`: Gets BTC price in $

#### `nem.com.requests.namespace`
- `roots`: Gets root namespaces
- `info`: Gets the namespace with given id
- `mosaicDefinitions`: Gets mosaic definitions of a namespace

#### `nem.com.requests.supernodes`
- `all`: Gets all supernodes info

#### `nem.com.requests.transaction`
- `byHash`: Gets a transaction by hash
- `announce`: Announce a transaction to the network

### 4.3 - Usage

Requests are wrapped in `Promises` which allow to use `then()` for callbacks

#### Examples:

``` javascript
// Gets chain height
nem.com.requests.chain.height(endpoint).then(function(res) {
	console.log(res)
}, function(err) {
	console.error(err)
})

// Gets account data
nem.com.requests.account.data(endpoint, "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S").then(...);
```

### 4.4 - More

Consult `src/com/requests` for details about requests parameters.

- See `examples/browser/monitor` for browser demonstration
- See `examples/node/requests` for all requests in node

### 4.5 - WebSockets

**Namespace**: `nem.com.websockets`

**Note**: For now webSockets use two versions of SockJS to work in Node (v1.1.4) and the browser (v0.3.4). Using only latest SockJS v1.1.4, gives an error when used in browser:

`XMLHttpRequest cannot load http://bob.nem.ninja:7778/w/messages/info?t=1429552020306. A wildcard '*' cannot be used in the 'Access-Control-Allow-Origin' header when the credentials flag is true. Origin 'null' is therefore not allowed access.`

If anyone has a solution to that, it is welcome.

#### `nem.com.websockets.connector`
- `create`: Create a connector object

#### `nem.com.websockets.subscribe`
- `errors`: Subscribes to error channel

#### `nem.com.websockets.subscribe.account`
- `data`: Subscribes to account data channel
- `transactions.recent`: Subscribes to recent transactions channel
- `transactions.confirmed`: Subscribes to confirmed transactions channel
- `transactions.unconfirmed`: Subscribes to unconfirmed transactions channel

#### `nem.com.websockets.subscribe.chain`
- `height`: Subscribes to new chain height channel
- `blocks`: Subscribes to new blocks channel

#### `nem.com.websockets.requests.account`
- `data`: Requests account data from channel
- `transactions.recent`: Requests recent transactions from channel

### 4.6 - Usage

You first need to create a connector object pointing to the right endpoint then use this connector to open the connection.

If connection is a success, the `connector.connect` function will resolve a promise in a `.then()` function, in which you can request and subscribe to channels.

Subscription takes a connector and resolve in a simple callback function (`.then()` not supported), where your data will be received from the channel. It acts exactly like a `.on('something')`.

#### Parameters

##### `create`

Name           | Type             | Description                     |
---------------|------------------|---------------------------------|
endpoint       | object           | An endpoint object (using websocket port) | 
address        | string           | A NEM account address      |

##### All subscription methods

Name           | Type             | Description                     |
---------------|------------------|---------------------------------|
connector      | object           | An open connector object        |
callback       | function         | A callback function where data will be received | 
address        | string           | A NEM account address (optional, for custom account subscription)|

##### All request methods 

Name           | Type             | Description                     |
---------------|------------------|---------------------------------|
connector      | object           | An open connector object        |
address        | string           | A NEM account address (optional, for custom account request)|

#### Example:

``` javascript
// Create an endpoint object
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.websocketPort);

// Address to subscribe
var address = "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S";

// Create a connector object
var connector = nem.com.websockets.connector.create(endpoint, address);

// Connect using connector
connector.connect().then(function() {
  // If we are here we are connected
  console.log("Connected");

  // Subscribe to new blocks channel
  nem.com.websockets.subscribe.chain.blocks(connector, function(res) {
    console.log(res);
  });

  // Subscribe to account data channel
  nem.com.websockets.subscribe.account.data(connector, function(res) {
    console.log(res);
  });

  // Request account data
  nem.com.websockets.requests.account.data(connector);

}, function (err) {
  // If we are here connection failed 10 times (1/s).
  console.log(err);
});
```

### 4.7 - More

Consult `src/com/websockets` for details.

- See `examples/browser/websockets` for browser demonstration
- See `examples/nodejs/websockets.js` for Node demonstration