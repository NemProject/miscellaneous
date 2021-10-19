---
title: 'Blockchain Requests'
parent: 'NEM Dev Basics (Docker)'
nav_order: 8
taxonomy:
    category:
        - docs
---

In this chapter we'll send [blockchain related requests](http://bob.nem.ninja/docs/#block-chain-related-requests) to our NIS instance on the testnet.

## Current chain height (/chain/height)

The response to this request just contains the height of the blockchain as known by our NIS instance.
If you repeat this query just after starting your node, you will see the height returned vary rapidly.
Note that it takes some time for your NIS instance to got through the whole blockchain after start up.

Here is a sample run:

```http
$ http :7890/chain/height

GET /chain/height HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:7890
User-Agent: HTTPie/0.9.2

HTTP/1.1 200 OK
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Origin: *
Content-Encoding: gzip
Content-Type: application/json
Server: Jetty(9.2.11.v20150529)
Transfer-Encoding: chunked
Vary: Accept-Encoding, User-Agent

{
    "height": 35811
}
```


## Getting the last block (/chain/last-block)

The response to this request holds the last block known by the NIS instance interrogated.

```http
$ http :7890/chain/last-block

GET /chain/last-block HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:7890
User-Agent: HTTPie/0.9.2



HTTP/1.1 200 OK
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Origin: *
Content-Encoding: gzip
Content-Type: application/json
Server: Jetty(9.2.11.v20150529)
Transfer-Encoding: chunked
Vary: Accept-Encoding, User-Agent

{
    "height": 88611, 
    "prevBlockHash": {
        "data": "1fdc88a8d4077f39cffc382934b60d9cc9a8a36c9836c944b930cc3ed88f1bd1"
    }, 
    "signature": "4fe78e41c6b5f497b4f2d45d2d049dbde6fb46eb8eb076bbedcf50c77c2bf5349ef42e83183ffae9f2fbafe38b57c76485c11f2434e40c84c2e83bd276bb8e00", 
    "signer": "f60ab8a28a42637062e6ed43a20793735c58cb3e8f3a0ab74148d591a82eba4d", 
    "timeStamp": 6193224, 
    "transactions": [], 
    "type": 1, 
    "version": -1744830463
}
```

However, as is the case here, the probability to get an empty list of transactions on the testnet is quite high.
We can repeat this query on the mainnet, using [another server](http://chain.nem.ninja/#/nodes) than the one running in our docker container:

```http
$ http 85.25.36.97:7890/chain/last-block

GET /chain/last-block HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: 85.25.36.97:7890
User-Agent: HTTPie/0.9.2

HTTP/1.1 200 OK
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Origin: *
Content-Encoding: gzip
Content-Type: application/json
Server: Jetty(9.2.11.v20150529)
Transfer-Encoding: chunked
Vary: Accept-Encoding, User-Agent

{
    "height": 1051051, 
    "prevBlockHash": {
        "data": "35e2b73c979f733ac401c78efdf8d7e8fbd951f766d7334bc8a2fd5ebc8815ce"
    }, 
    "signature": "58c9f1324fed656dfe5539b60e1116c19a1414386475957eda9108c6bdfbe35a7e7ffc413e963bf690e0612b750004f66e12b11656bd53a3326cae3fc9c99e0c", 
    "signer": "14a9611f2913233fc74d97654ae88626a816249bd77e0bd9b3f53276ac6bed9e", 
    "timeStamp": 63656860, 
    "transactions": [
        {
            "amount": 57713397132, 
            "deadline": 63657452, 
            "fee": 40000000, 
            "message": {
                "payload": "39643365386337316464376631366532", 
                "type": 1
            }, 
            "recipient": "NBZMQO7ZPBYNBDUR7F75MAKA2S3DHDCIFG775N3D", 
            "signature": "220ff8e40445c731f9a898efe165815e1f49a2038738dd60f2545f4fe11f6eed1d074bcf28a06f576d892ce094a2b2730c066f830b6eb23ef0cdbaf7ade1680d", 
            "signer": "a025abd5dd0f0e9f226c4673be03a5a3d72cb95b8acd39fe4f2f2c2fb2d1b9ec", 
            "timeStamp": 63656852, 
            "type": 257, 
            "version": 1744830465
        }
    ], 
    "type": 1, 
    "version": 1744830465
}
```

We will take a closer look to the transaction data in a later section.

## Getting a block at height (POST /block/at/public)

You can request a block at a particular height. Not that this is a POST request, with a JSON payload of the form
```
{ height: $block_height }
```

Here is an example query:
```http
$ http :7890/block/at/public height:=243

POST /block/at/public HTTP/1.1
Accept: application/json
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 15
Content-Type: application/json
Host: localhost:7890
User-Agent: HTTPie/0.9.2

{
    "height": 243
}

HTTP/1.1 200 OK
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Origin: *
Content-Type: application/json
Server: Jetty(9.2.11.v20150529)
Transfer-Encoding: chunked

{
    "height": 243, 
    "prevBlockHash": {
        "data": "307729f94d6f38a97997be33cb8bb15d4f297128f17da94f62c4356333437e6b"
    }, 
    "signature": "37e4d221b30d71299811ad78a10ee37ac167c4901f414c273bc35c73f99eea8d128946392cbe8cf8ba3bb16e3aa45845ed535dc5f65401c76c7e58f2642fa703", 
    "signer": "f973d58cd550da293e52764d431edd5a04b28baa2b7b83b2e8fb7a5d3a7c398b", 
    "timeStamp": 348897, 
    "transactions": [], 
    "type": 1, 
    "version": -1744830463
}
```

## Getting a transaction by its hash (/transaction/get)

It is also possible to get a transaction by its hash. This is useful if you want to validate a Apostille hash.
So let's do exactly that!

Without looking at the details just yet, we will see how we can validate the NIS archive we downloaded from [http://bob.nem.ninja/](http://bob.nem.ninja/).
At the time of writing, `nis-ncc-0.6.84.tgz` is available, together with its signature file `nis-ncc-0.6.84.tgz.sig` which has the content
```
Signatures are now published using apostille.
txId: 06c19b8c53838fdaefb4a04126bc78e0c3ab90db48d8dba43f2063bb02139d69
block: 1002581
```
We see the `txId` which is the hash of the transaction we will need to get. Let's download that transaction:

```http
$ http http://bigalice3.nem.ninja:7890/transaction/get?hash=06c19b8c53838fdaefb4a04126bc78e0c3ab90db48d8dba43f2063bb02139d69

GET /transaction/get?hash=06c19b8c53838fdaefb4a04126bc78e0c3ab90db48d8dba43f2063bb02139d69 HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: bigalice3.nem.ninja:7890
User-Agent: HTTPie/0.9.2



HTTP/1.1 200 OK
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Origin: *
Content-Encoding: gzip
Content-Type: application/json
Server: Jetty(9.2.11.v20150529)
Transfer-Encoding: chunked
Vary: Accept-Encoding, User-Agent

{
    "meta": {
        "hash": {
            "data": "06c19b8c53838fdaefb4a04126bc78e0c3ab90db48d8dba43f2063bb02139d69"
        }, 
        "height": 1002581, 
        "id": 667140, 
        "innerHash": {}
    }, 
    "transaction": {
        "amount": 0, 
        "deadline": 60727263, 
        "fee": 18000000, 
        "message": {
            "payload": "fe4e54590318b3ce5de42067de2af1da69bb082b6c05a425198f407a392cba3bdae5c3b686", 
            "type": 1
        }, 
        "recipient": "NCZSJHLTIMESERVBVKOW6US64YDZG2PFGQCSV23J", 
        "signature": "bc7676f2ba4cb1d88110956b6b21dcf2356b2f86e47c44359a88a74d3d12e6a918fa5a920aff94af7d0984f644a51e18aa2a24bc1890cabad2f3fd2c9f79340e", 
        "signer": "826cedee421ff66e708858c17815fcd831a4bb68e3d8956299334e9e24380ba8", 
        "timeStamp": 60723663, 
        "type": 257, 
        "version": 1744830465
    }
}
```

We see that the transaction we have downloaded is well from the block as advertised in the `.sig` file. 
The interesting part is the payload of the transaction, which is `fe4e54590318b3ce5de42067de2af1da69bb082b6c05a425198f407a392cba3bdae5c3b686`.
The first 10 characters, ie `FE4E545903`, indicate that it is a non-signed file hash using SHA-256 (all details are in the [Apostille Whitepaper](https://www.nem.io/ApostilleWhitePaper.pdf). Dropping this prefix leaves us with the SHA-256 of the file `nis-ncc-0.6.84.tgz`, `18b3ce5de42067de2af1da69bb082b6c05a425198f407a392cba3bdae5c3b686`.

If you want to automate this in your scripts, here's how you can extract an Apostile file hash with the help of jq:
```
http http://bigalice3.nem.ninja:7890/transaction/get?hash=06c19b8c53838fdaefb4a04126bc78e0c3ab90db48d8dba43f2063bb02139d69 | jq -r '.transaction.message.payload[10:]'
```
