---
title: 'Account Requests'
parent: 'NEM Dev Basics (Docker)'
grand_parent: Developer resources
nav_order: 9
taxonomy:
    category:
        - docs
---

In this chapter we'll send [account related requests](http://bob.nem.ninja/docs/#account-related-requests) to our NIS instance on the testnet.

## Account data 
### From address (/account/get)
An account data can be retrieved with a GET request to `/account/get` and
passing the address in hexadecimal format, i.e. without the '-', in the
`address` parameter. Here is a succesful request:

```http
$ http 23.228.67.85:7890/account/get?address=TA6XFSJYZYAIYP7FL7X2RL63647FRMB65YC6CO3G

GET /account/get?address=TA6XFSJYZYAIYP7FL7X2RL63647FRMB65YC6CO3G HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: 23.228.67.85:7890
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
    "account": {
        "address": "TA6XFSJYZYAIYP7FL7X2RL63647FRMB65YC6CO3G", 
        "balance": 99784000000, 
        "harvestedBlocks": 0, 
        "importance": 0.00021510404390950709, 
        "label": null, 
        "multisigInfo": {}, 
        "publicKey": "4fe5efd97360bc8a32ec105d419222eeb714e6d06fd8b895a5eedda2b0edf931", 
        "vestedBalance": 18958960000
    }, 
    "meta": {
        "cosignatories": [], 
        "cosignatoryOf": [], 
        "remoteStatus": "INACTIVE", 
        "status": "LOCKED"
    }
}
```

This returns the account's info:
* address
* balance in microXEMs
* the number of [harvested blocks](https://nem.ghost.io/the-beginners-guide-to-nem/#whatisharvesting)
* the account's [importance](https://nem.ghost.io/the-beginners-guide-to-nem/#whatisproofofimportance). Accounts need at least 10k vested NEM to be included in the importance calculation
* a label which is always null as it is currently not used
* information about multisig in multisigInfo. This account is not a multisig account.
* the publicKey. As this account's public key is on the blockchain, it means it has already generated a transaction
* the [vestedBalance](https://nem.ghost.io/the-beginners-guide-to-nem/#whatisavestedbalance)

The meta information gives us info about

* if it is a multisig account (it isn't)
* if it is a cosignatory for any multisig account (it isn't)
* remoteStatus, which indicates if the account is/has a remote account for harvesting. The values can be (from [the API](http://bob.nem.ninja/docs/#accountMetaData)):
  * "REMOTE": The account is a remote account and therefore remoteStatus is not applicable for it.
  * "ACTIVATING": The account has activated remote harvesting but it is not yet active.
  * "ACTIVE": The account has activated remote harvesting and remote harvesting is active.
  * "DEACTIVATING": The account has deactivated remote harvesting but remote harvesting is still active.
  * "INACTIVE": The account has inactive remote harvesting, or it has deactivated remote harvesting and deactivation is operational.
* the harvesting status:
  * "UNKNOWN": The harvesting status of the account is not known.
  * "LOCKED": The account is not harvesting.
  * "UNLOCKED": The account is harvesting.


As we see, this account has its public key on the blockchain. We can retrieve the exact same information using the public key of the account

### From public key (/account/get/from-public-key)
Here is the data retrieved for the same account using the public key:

```http
$ http 23.228.67.85:7890/account/get/from-public-key?publicKey=4fe5efd97360bc8a32ec105d419222eeb714e6d06fd8b895a5eedda2b0edf931

GET /account/get/from-public-key?publicKey=4fe5efd97360bc8a32ec105d419222eeb714e6d06fd8b895a5eedda2b0edf931 HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: 23.228.67.85:7890
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
    "account": {
        "address": "TA6XFSJYZYAIYP7FL7X2RL63647FRMB65YC6CO3G", 
        "balance": 99784000000, 
        "harvestedBlocks": 0, 
        "importance": 0.00021510404390950709, 
        "label": null, 
        "multisigInfo": {}, 
        "publicKey": "4fe5efd97360bc8a32ec105d419222eeb714e6d06fd8b895a5eedda2b0edf931", 
        "vestedBalance": 18958960000
    }, 
    "meta": {
        "cosignatories": [], 
        "cosignatoryOf": [], 
        "remoteStatus": "INACTIVE", 
        "status": "LOCKED"
    }
}
```

## Multisig accounts

The account we have retrieved above was not a multisig account. In this section we will take a look at 
the data returned for a multisig account. We will first take a look at the data returned for an account
that has been converted to a multisig account. It is not possible to initiate a transaction from the account itself,
only from the cosignatories.

Here is the data returned for a 1-of-2 multisig account:

```http
$ http 23.228.67.85:7890/account/get?address=TAPWFJHCGV3GL3CZEERB3IGXPMBWNGGEZKAVPNFB

GET /account/get?address=TAPWFJHCGV3GL3CZEERB3IGXPMBWNGGEZKAVPNFB HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: 23.228.67.85:7890
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
    "account": {
        "address": "TAPWFJHCGV3GL3CZEERB3IGXPMBWNGGEZKAVPNFB", 
        "balance": 956000000, 
        "harvestedBlocks": 0, 
        "importance": 0.0, 
        "label": null, 
        "multisigInfo": {
            "cosignatoriesCount": 2, 
            "minCosignatories": 1
        }, 
        "publicKey": "e3775e0cbab73d014b0309f81890455bf3c8df1325f2de1aa6a800951220d611", 
        "vestedBalance": 0
    }, 
    "meta": {
        "cosignatories": [
            {
                "address": "TBK2DJE2RUMO7VTM3CWOJV24FYQB3YZDOYSFNTRR", 
                "balance": 899000000, 
                "harvestedBlocks": 0, 
                "importance": 0.0, 
                "label": null, 
                "multisigInfo": {}, 
                "publicKey": "3eee54c75945d22500f1c6844b175b9efc9db171e2e941704fa396dc6ecd2ffd", 
                "vestedBalance": 0
            }, 
            {
                "address": "TBQC5LH73T7V2L6JDBMAXAZDGM7CNW2JEC5AA5RH", 
                "balance": 899000000, 
                "harvestedBlocks": 0, 
                "importance": 0.0, 
                "label": null, 
                "multisigInfo": {}, 
                "publicKey": "61a2896696fef452d001299f279567aacc79706c2b2c899f9dec70e0b92eb6b6", 
                "vestedBalance": 0
            }
        ], 
        "cosignatoryOf": [], 
        "remoteStatus": "INACTIVE", 
        "status": "LOCKED"
    }
}
```


And here is the data returned for the 2 cosignatories, of which 1 signature is needed to validate a transaction. This means that
any of these can encode a transaction. In a N-of-M multisig account, with N>1, one of the cosignatories has to initiate the transaction,
and N-1 additional cosignatories need to sign the transaction afterwards.

We see that `account.multisigInfo` holds the number of cosignatories, and how many are required to sign a transaction for it to be accepted by the network.
The `meta.cosignatories` contains the info about the cosignatory accounts, the same info as returned by a request to `/account/get`.

Here is the first cosignatory:
```http
$ http 23.228.67.85:7890/account/get?address=TBQC5LH73T7V2L6JDBMAXAZDGM7CNW2JEC5AA5RH

GET /account/get?address=TBQC5LH73T7V2L6JDBMAXAZDGM7CNW2JEC5AA5RH HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: 23.228.67.85:7890
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
    "account": {
        "address": "TBQC5LH73T7V2L6JDBMAXAZDGM7CNW2JEC5AA5RH", 
        "balance": 899000000, 
        "harvestedBlocks": 0, 
        "importance": 0.0, 
        "label": null, 
        "multisigInfo": {}, 
        "publicKey": "61a2896696fef452d001299f279567aacc79706c2b2c899f9dec70e0b92eb6b6", 
        "vestedBalance": 0
    }, 
    "meta": {
        "cosignatories": [], 
        "cosignatoryOf": [
            {
                "address": "TAPWFJHCGV3GL3CZEERB3IGXPMBWNGGEZKAVPNFB", 
                "balance": 956000000, 
                "harvestedBlocks": 0, 
                "importance": 0.0, 
                "label": null, 
                "multisigInfo": {
                    "cosignatoriesCount": 2, 
                    "minCosignatories": 1
                }, 
                "publicKey": "e3775e0cbab73d014b0309f81890455bf3c8df1325f2de1aa6a800951220d611", 
                "vestedBalance": 0
            }
        ], 
        "remoteStatus": "INACTIVE", 
        "status": "LOCKED"
    }
}
```

And here is the second:
```http
$ http 23.228.67.85:7890/account/get?address=TBK2DJE2RUMO7VTM3CWOJV24FYQB3YZDOYSFNTRR

GET /account/get?address=TBK2DJE2RUMO7VTM3CWOJV24FYQB3YZDOYSFNTRR HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: 23.228.67.85:7890
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
    "account": {
        "address": "TBK2DJE2RUMO7VTM3CWOJV24FYQB3YZDOYSFNTRR", 
        "balance": 899000000, 
        "harvestedBlocks": 0, 
        "importance": 0.0, 
        "label": null, 
        "multisigInfo": {}, 
        "publicKey": "3eee54c75945d22500f1c6844b175b9efc9db171e2e941704fa396dc6ecd2ffd", 
        "vestedBalance": 0
    }, 
    "meta": {
        "cosignatories": [], 
        "cosignatoryOf": [
            {
                "address": "TAPWFJHCGV3GL3CZEERB3IGXPMBWNGGEZKAVPNFB", 
                "balance": 956000000, 
                "harvestedBlocks": 0, 
                "importance": 0.0, 
                "label": null, 
                "multisigInfo": {
                    "cosignatoriesCount": 2, 
                    "minCosignatories": 1
                }, 
                "publicKey": "e3775e0cbab73d014b0309f81890455bf3c8df1325f2de1aa6a800951220d611", 
                "vestedBalance": 0
            }
        ], 
        "remoteStatus": "INACTIVE", 
        "status": "LOCKED"
    }
}
```

We see that `meta.cosignatoryOf` gives info about the multisig account it is a cosignatory of.