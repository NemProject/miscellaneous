---
title: 'Blockchain Monitoring'
parent: 'NEM Dev Basics (Docker)'
nav_order: 7
taxonomy:
    category:
        - docs
---

Monitoring the blockchain is possibly an important part of your application on NEM. The most obvious example being
monitoring activities involving your account.

Two approaches are available:

- With **polling**, you regularly retrieve the latest block and handle it. If your polling interval is significantly smaller than the average block generation time, you can be sure to handle all blocks. If your polling interval is bigger and multiple blocks have been generated between two pollings, you can still request all new blocks in your handler. This approach has its downsides: If the time between the queries is too long, the poller only knows about the activity of interest that occured on the blockchain after a delay. Similarily, if the time between polling requests is too short, the poller wastes resources by sending a lot of requests although nothing interesting happened. Therefore, the scalability of this approach is limited. Its development, however, is very easy and might be sufficient in most cases.

- The cleaner approach is to **subscribe** to notifications on the NIS instance you connect to. This is done using websockets. It's also the approach NanoWallet uses. However, it is a bit more complex.

## Active monitoring: the polling approach

The pollign approach is very easy to explain, and it translates immediately in runnable code in any language, expecially if it provides
REST and JSON libraries. Here are the steps to do in a loop:

* retrieve the last block
  * if this is a new block, handle it and remember this was the last block we've seen
  * if this is a block we already handled, wait for x seconds.
* repeat

The number of seconds x we wait (the polling interval) will determine if we will handle all blocks. If it is smaller than the average generation time of a block, 
we can be sure that all blocks will be retrieved at least once by this code. We call this rapid polling in opposition of slow polling. 
An interval of 15 seconds seems safe for rapid polling.

### Rapid polling


It is quite straight-forward to translate that to code, even in a bash script using [httpie](https://httpie.org/) and [jq](https://stedolan.github.io/jq/).
Let's see how this can be done!

First we initialise 2 variables: the monitored address, and the last block seen by the script which is set to 0 at the start of the script:
```
observed_address="TA6XFSJYZYAIYP7FL7X2RL63647FRMB65YC6CO3G"
last_block_analysed=0
```

As we will continually monitor the blockchain, our code will be wrapped in an infinite while loop:

``` bash
while true; do


done
```

In the loop, we retrieve the last block by sending a GET query to `/chain/last-block`, and save the result in variable `block`:
```
block=$(http :7890/chain/last-block)
```

This will retrieve the last block in a json document. Here is an example from the mainnet chain showing the format of the document
retrieved.

```http
$ http 199.217.112.135:7890/chain/last-block

GET /chain/last-block HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: 199.217.112.135:7890
User-Agent: HTTPie/0.9.8

HTTP/1.1 200 OK
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Origin: *
Content-Encoding: gzip
Content-Type: application/json
Server: Jetty(9.2.11.v20150529)
Transfer-Encoding: chunked
Vary: Accept-Encoding, User-Agent

{
    "height": 1106506, 
    "prevBlockHash": {
        "data": "00f421e0b9a8c449bc37f0e19c21c5b1a1c24258eed8d347b0351ff2fe20078e"
    }, 
    "signature": "96a8b050cd0ae341da7ea3aafa11a966821c2e3d0b614800a6d53fe6e5bbf5f2730c64d7f80b43898e1cb3eb0048e7a65f09bee591decfc07092d068064a7804", 
    "signer": "8ca523bd39f350799b0cc150055b713bd7c65e9bbc94b90502c973a47730a431", 
    "timeStamp": 67011602, 
    "transactions": [
        {
            "amount": 133400000000, 
            "deadline": 67033173, 
            "fee": 14000000, 
            "message": {
                "payload": "39333630383163323265303031636336", 
                "type": 1
            }, 
            "recipient": "NBZMQO7ZPBYNBDUR7F75MAKA2S3DHDCIFG775N3D", 
            "signature": "9240c0fc833d2ae351ea2ef5e5b2723ee9e7df87c05c40d754f232a7c58666b556dbfda1ab3804a5d91877e868017e3c7c9b8cd3a23f8fe045668b568c36ab01", 
            "signer": "5d348ef8fa3cacd0fdc6a1532e47d92bb01cc119045b19940fdd9daac7e36890", 
            "timeStamp": 67011573, 
            "type": 257, 
            "version": 1744830465
        }, 
        {
            "amount": 347000000, 
            "deadline": 67015172, 
            "fee": 6000000, 
            "message": {
                "payload": "4e6f64652072657761726473207061796f75743a20726f756e6420323032312d32303234", 
                "type": 1
            }, 
            "mosaics": [], 
            "recipient": "NBKQSUMBKTSFBQ3AMXAZMRNONDXQFQAABYFIMPV4", 
            "signature": "cffee2a656befe6bb30652e2d8716680931e4b892164319ad6299c0a9875088d7efd5a7f17765277948d42ae1a146c8f99903904c4563fcf16c3e40f9db4880e", 
            "signer": "d96366cdd47325e816ff86039a6477ef42772a455023ccddae4a0bd5d27b8d23", 
            "timeStamp": 67011572, 
            "type": 257, 
            "version": 1744830466
        }
    ], 
    "type": 1, 
    "version": 1744830465
}
```

Parsing that with jq is easy. The height of the block retrieved is available in the top level property `height`, extract with jq using the
filter `.height`. As the JSON describing the last block is saved in variable `$block`, we can simply pipe it to jq
```
chain_height=$(echo "$block" | jq '.height')
```

The transactions are stored in the top level property named `transactions` as an array value, that can be empty if no transaction is
included in that block. This corresponds to a jq filter `'.transactions[]?`, the question mark indicating that it can be empty.
But we are only interested in the transactions to our address. This means that the  property `recipient` of the transaction should 
hold a value equal to our `$observed_address`.  This corresponds to a filte `select(.recipient=="'$observed_address'")`.
Assigning the transaction select by our filter to a variable `found_recipient` results in this code:
```
found_recipient=$(echo "$block" | jq -r '.transactions[]?|select(.recipient=="'$observed_address'")')
```
That variable will be empty if no transaction involving the monitored address was found. We can use the bash empty string test `[[ -n $variable ]]`
to determine if the block holds a transaction to our monitored address:
``` bash
if [[ -n $found_recipient ]] ; then
  echo "Our monitored address received a transaction!"
else
  echo "Not our observed recipient"
fi
```
 
Putting all this in a script results in this.
##### Bash
```bash
#!/bin/bash

observed_address="TA6XFSJYZYAIYP7FL7X2RL63647FRMB65YC6CO3G"
last_block_analysed=0
while true; do
    # get last block
    block=$(http :7890/chain/last-block)
    echo "$block"
    chain_height=$(echo "$block" | jq '.height')
    if [[ $last_block_analysed -eq $chain_height ]]; then
        echo "Waiting at $chain_height"
        sleep 15
    else
        last_block_analysed=$chain_height
        found_recipient=$(echo "$block" | jq -r '.transactions[]?|select(.recipient=="'$observed_address'")')
        if [[ -n $found_recipient ]] ; then
          echo "Our monitored address received a transaction!"
        else
          echo "Not our observed recipient"
        fi
    fi
done
```
##### Ruby
``` ruby
require 'rest-client'
require 'json'

observed_address="TC6LCF7ZCL5WL4HTE64JPUU2UPVKNZB2LMVUNELV"
last_block_analysed=0
while true
  r=RestClient.get 'localhost:7890/chain/height'
  chain_height=JSON.parse(r.body)["height"]
  if last_block_analysed==chain_height
    puts "sleeping"
    sleep 15
  else
    r=RestClient.get('localhost:7890/chain/last-block')
    b=JSON.parse(r.body)
    last_block_analysed=b["height"]
    b["transactions"].select{|t| t["recipient"]=="observed_address"}.each do |recipient|
      puts "We received a transaction!"
    end
  end
end
```

### Slow polling

If the polling interval is too big, the code has to be prepared to query blocks that were generated during the
polling interval.

We will implement this in Ruby. Here are the steps we will execute:

* retrieve the block chain heigh
* while the last block analysed has a height smaller than the current blockchain heigh:
  * fetch the block following the last block analysed
  * check if the block has a transaction of interest
  * update the last block analysed to the one we just analysed
* wait some time
* repeat


As this requires a bit more logic than the previous example, we will structure our code a bit better.
For each operation we will define a function. The first one is to retrieve the current blockchain height,
which issues a get request to `/chain/height`.

```
def current_height
  res = RestClient.get('http://localhost:7890/chain/height')
  JSON.parse(res.body)["height"]
end
```

We will also need a function to retrieve a block at a specific height. This is done
by passing a JSON payload specifying the height to a POST request:
```
def block_at(height)
  res = RestClient.post('http://localhost:7890/block/at/public', {'height': height}.to_json , {content_type: :json, accept: :json})
  JSON.parse(res.body)
end
```
This code sends a POST request to /block/at/public, with a JSON payload specifying the height of the block to return, and sets HTTP headers
regarging the content type.

We will also need to check if a block as a transaction to the observed address, and this is done with this function:
```
def block_has_recipient(block,recipient)
    block["transactions"].collect {|tx| tx["recipient"]}.include?(recipient)
end
```
What this code is first collect all recipients found in transaction, and then check if this array contains our recipient of interes.

With these helper functions in place, putting the pieces together is a nearly literal translation of the steps
highlighted above. We require the needed libraries, define the helper functions, initialise the variables holding the 
address observed, and the height of the last block analysed (in our case set to the current height), resulting in this code:

``` ruby
require 'rest-client'
require 'json'

def block_at(height)
  res = RestClient.post('http://localhost:7890/block/at/public', {'height': height}.to_json , {content_type: :json, accept: :json})
  JSON.parse(res.body)
end

def current_height
  res = RestClient.get('http://localhost:7890/chain/height')
  JSON.parse(res.body)["height"]
end

def block_has_recipient(block,recipient)
    block["transactions"].collect {|tx| tx["recipient"]}.include?(recipient)
end


observed_address="TDK4QKF7HBHEAFTEUROFMCAFJQGBZTSZ2ZSGZKZM"
last_block_analysed=current_height()

while true
  chain_height=current_height()
  while last_block_analysed<chain_height
    # get block at height last_block_analysed+1
    block=block_at(last_block_analysed+1)
    # analyse block
    if block_has_recipient(block,observed_address)
      puts "transaction found in block at height #{last_block_analysed+1}"
    else
      puts "no watched recipient in block at heigh #{last_block_analysed+1}"
    end
    last_block_analysed=last_block_analysed+1
  end
  sleep 300
end

```
## Passive monitoring: the subscription approach
While in the previous sections our program was actively contacting our NIS instance to check if action should be taken
because a new block was generated, we can use a passive approach in which our program subscribes to notifications on
specific events. This is done over a websocket connection.

The NEM Infrastructure Server listens for websocket connections on port 7778. It expects [STOMP](https://stomp.github.io/) formatted
messages. If your language provides libraries to communicate with STOMP over websockets, it should be easy to interoperate with NIS.
Just note that Websocksets require a handshake, which is visible at the stomp client level. If you are interested in more details,
[a good explanation is available on the web](http://jmesnil.net/stomp-websocket/doc/#requirements).

We will work in javascript, for which the library stompjs covers our needs. These can be installed with
```
npm install -g stompjs
```
You might find examples using SockJS, and this guide started by using it. However, due to problems with SockJS
(such as code working one day but not the day after), we switched to a solution using only stompjs.

The implementation is quite straightforward when you know how and to which messages you need to subscribe. 
We will work in the nodejs REPL, which you can start with `node`, or if you use the containers of this guide, with 
`./ndev repl.js`.

The URL you need to connect to for websockets is `http://$NIS:7778/w/messages/websocket` (replace $NIS with the IP or hostname of the NIS
you want to connect to). If you run in the tools container, you can use `localhost`.

To be notified of new blocks, you subscribe to `/blocks/new`. The body of the notification is simply the height of 
the new block.

Now that we have all information, we can take a closer look at the implementation.
First we require the libraries:
``` javascript
var stomp=require('stompjs');
```
Note that if you use the repljs script with `ndev repl.js`, these are already available and this step is not required.

Then we open the websocket connection and create the STOMP connection over it.
``` javascript
var stompClient = stomp.overWS('ws://localhost:7778/w/messages/websocket');
```
As mentioned above, websockets require a handshake, and we need to initiate it from the STOMP client.
When the connection is established, it will trigger a callback passed as second argument to the `connect` function:
``` javascript
stompClient.connect({}, callback);
```
The callback is a function taking as argument the frame received from the server. In this case it will be the frame
confirming the connection.
In the callback you can subscribe to the messages of interest. In this example we will subscribe to the new block notification,
and simply log the height of the new block in the console:

``` javascript
var callback=function(frame){
        stompClient.subscribe('/blocks/new', function(data) {
                             var blockHeight = JSON.parse(data.body);
                             console.log(blockHeight);
                         });
}
```

Putting it all together, here is our code:


``` javascript
// require libraries if not using repl.js script
var stomp=require('stompjs');
// create a STOMP client over that websocket connection
var stompClient = stomp.overWS('ws://localhost:7778/w/messages/websocket');
// Define the callback function that we want to execute after connection.
// Here we subscribe to new block notifications
var callback=function(frame){
        stompClient.subscribe('/blocks/new', function(data) {
                             var blockHeight = JSON.parse(data.body);
                             console.log(blockHeight);
                         });
}

// Connect and subscribe 
stompClient.connect({}, callback );
```

This will notify your program when a new block is available, but you would still need to go and retrieve the block to check
if it includes transactions involving your account. But we can do better! We can ask to be notified of new transactions involving
a specific account. This is done by subscribing to the channel `/w/api/account/subscribe` with the payload
`"{'account':'$ADDRESS'}"` (replace $ADDRESS by the account's address,
all uppercase and without hyphen). Here is an example illustrating the format of the frame you receive:

``` json
 Frame {
  command: 'MESSAGE',
  headers: 
   { 'content-length': '541',
     'message-id': '3tbjipuy-147',
     subscription: 'sub-0',
     destination: '/transactions/TA6XFSJYZYAIYP7FL7X2RL63647FRMB65YC6CO3G' },
  body: '{"meta":{"innerHash":{},"id":0,"hash":{"data":"ccd0ab18ea047922b646b82f6171d227a348cfe35ef793930e950e5c82243cdf"},"height":942799},"transaction":{"timeStamp":67191609,"amount":1000000,"signature":"dcb6e30b2a750d5bc95b94a33b620bfc90dbd2a71a730a335315fdf55d859467bc70ae797c91fe52ce0a44fa83db84ecc090cf3b91aea4928f3113ec51b3b907","fee":1000000,"recipient":"TA6XFSJYZYAIYP7FL7X2RL63647FRMB65YC6CO3G","type":257,"deadline":67195209,"message":{},"version":-1744830463,"signer":"73211c5f54b7595ade5cd0c5583b91076e33eb99c8b601cf76043e5a176b4f57"}}\r\n',
  ack: [Function],
  nack: [Function] }
```

With this information, it is easy to write our program that will log to the console the amount in microXEMs of transactions involving our 
account:
``` javascript
stomp=require('stompjs');

stompClient = stomp.overWS('ws://localhost:7778/w/messages/websocket');
stompClient.debug = undefined;
stompClient.connect({}, function(frame) {
        stompClient.subscribe('/unconfirmed/TA6XFSJYZYAIYP7FL7X2RL63647FRMB65YC6CO3G', 
                              function(data) {
                                  var body = JSON.parse(data.body);
                                  console.log(body.transaction.amount); }        );
});

```
You might want to check if this is an incoming our outgoing transaction. But that's left as an exercice for the reader ;-)

If you want to have a look at other websocket features proposed by NIS, the best place to look is [the deprecated lightwallet 
documentation](https://github.com/QuantumMechanics/nem-lightwallet/tree/master/lightwallet).
