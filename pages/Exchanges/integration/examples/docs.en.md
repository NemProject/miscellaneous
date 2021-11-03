---
title: 'Transaction examples'
parent: 'Integrating with an Exchange'
grand_parent: 'Exchanges'
taxonomy:
    category:
        - docs
---

- TOC
{:toc}

## v1 XEM transfer

[/transaction/get?hash=86a1...](http://alice6.nem.ninja:7890/transaction/get?hash=86a1a104e316b23d6b70100165a5b7398b017f9081e658ec7597a019919665eb)

```json
{
    "meta": {
        "innerHash": {},
        "id": 1307939,
        "hash": {
            "data": "86a1a104e316b23d6b70100165a5b7398b017f9081e658ec7597a019919665eb"
        },
        "height": 1412114
    },
    "transaction": {
        "timeStamp": 85497762,
        "amount": 1001000000,
        "signature": "3b0369f3fee1afea7d7aafa2cd197ec1de6917982e6603cbd108d2e92a1a181fff384fc819a36700ea6ad69ab4c54d20577461fb85e310ac63ad4ccb2a79a209",
        "fee": 50000,
        "recipient": "NC2KPEXZDILXDWO6Y2OY4W7FRSVFGKYC7VB6W4D4",
        "type": 257,
        "deadline": 85584162,
        "message": {},
        "version": 1744830465,
        "signer": "d7e062d8c08329cf316289f7c1a6ae87ee07e8033f2eccd6042ba3d5c6c2ddca"
    }
}
```

**Transferred XEM** = Amount / 1'000'000 = 1'001'000'000 / 1'000'000 = **1'001 XEM**

## v2 XEM transfer with empty mosaic array

[/transaction/get?hash=d64b...](http://alice6.nem.ninja:7890/transaction/get?hash=d64bc5397bb1c8a6aa662591b6a9ddbf7b80f6949cb068064987723d4e99b582)

```json
{
    "meta": {
        "innerHash": {},
        "id": 1869422,
        "hash": {
            "data": "d64bc5397bb1c8a6aa662591b6a9ddbf7b80f6949cb068064987723d4e99b582"
        },
        "height": 1561629
    },
    "transaction": {
        "timeStamp": 94541749,
        "amount": 4060230000,
        "signature": "24d71881f917a6b5aa369cbc49e0d8ab8959549eb8d85ec0ff92cf34266e0be03b5dca751747d96b211a35b2470437356effc60964f7ec21667265266a52c406",
        "fee": 100000,
        "recipient": "NBA7SFOHPI3MHWKQWCJMWJQHMOCAHXNM2PYY36SA",
        "mosaics": [],
        "type": 257,
        "deadline": 94624549,
        "message": {
            "payload": "343338343936",
            "type": 1
        },
        "version": 1744830466,
        "signer": "fe228e4315f678ed3912e06528c8ee0630530ef8f2edec952bcc06cfbd255d76"
    }
}
```

**Transferred XEM** = Amount / 1'000'000 = 4'060'230'000 / 1'000'000 = **4'060.23 XEM**

## v2 XEM transfer with XEM in mosaic array and multiplier = 1

[/transaction/get?hash=ef59...](http://alice6.nem.ninja:7890/transaction/get?hash=ef59aea3e324b5064bcf5e44b6c15ed8d815f765dcfaade98d8814c4cce6cc83)

```json
{
    "meta": {
        "innerHash": {},
        "id": 1197127,
        "hash": {
            "data": "ef59aea3e324b5064bcf5e44b6c15ed8d815f765dcfaade98d8814c4cce6cc83"
        },
        "height": 1378347
    },
    "transaction": {
        "timeStamp": 83456174,
        "amount": 1000000,
        "signature": "0b0985776b9e31d2e9472c8c24a519d87be66ebee4525e8ff30eb469edacc218ae496062d447eb673236245411638d05c58ccd281d5677b920d41399dd99d105",
        "fee": 50000,
        "recipient": "NA366XE76M32CC4Y4O3G5XUITUEUFCV32F6QJGUA",
        "mosaics": [{
            "quantity": 2000000000,
            "mosaicId": {
                "namespaceId": "nem",
                "name": "xem"
            }
        }],
        "type": 257,
        "deadline": 83542574,
        "message": {},
        "version": 1744830466,
        "signer": "85a26d0f8a2e024c180ac184b91c2e4b1f13762914ca415a3b20b8256cc68740"
    }
}
```

**Transferred XEM** = (Amount / 1'000'000) * (Quantity / 1'000'000) =<br/>
= (1'000'000 / 1'000'000) * (2'000'000'000 / 1'000'000) =<br/>
= 1 * 2'000 = **2'000 XEM**

## v2 XEM transfer with XEM in mosaic array and multiplier > 1

[/transaction/get?hash=ef33...](http://alice6.nem.ninja:7890/transaction/get?hash=ef33af9b121f9891717bd582cd075435a93bff7fd568816f7bf2a0a5207b9447)

```json
{
    "meta": {
        "innerHash": {},
        "id": 645570,
        "hash": {
            "data": "ef33af9b121f9891717bd582cd075435a93bff7fd568816f7bf2a0a5207b9447"
        },
        "height": 987691
    },
    "transaction": {
        "timeStamp": 59821608,
        "amount": 2000000,
        "signature": "76732f5af6f2d2a0a31ce46d526bf333195bbb409bdd5a9801a390d8d42619d8ba54680b4038d58c4722819ca211952e82221fd3b36665d0453fc283f6998308",
        "fee": 2000000,
        "recipient": "NDY4RHUZ3CZOZ53O5HNEXTEM7UF5X3MMDGH4IMAD",
        "mosaics": [{
            "quantity": 1000000,
            "mosaicId": {
                "namespaceId": "nem",
                "name": "xem"
            }
        }, {
            "quantity": 1,
            "mosaicId": {
                "namespaceId": "nextem",
                "name": "nex"
            }
        }],
        "type": 257,
        "deadline": 59908008,
        "message": {},
        "version": 1744830466,
        "signer": "099132a49ed0c15936a464cf6ef43120f01fa88835803593571882feea6161db"
    }
}
```

**Transferred XEM** = (Amount / 1'000'000) * (Quantity / 1'000'000) =<br/>
= (2'000'000 / 1'000'000) * (1'000'000 / 1'000'000) = 2 * 1 = **2 XEM**

## v2 XEM transfer with XEM in mosaic array and multiplier = 0

[/transaction/get?hash=da21...](http://alice6.nem.ninja:7890/transaction/get?hash=da210ebfc7ccc49902bd345007e178a9b22c9397e4f17e995a340bf4d9e54fe1)

```json
{
    "meta": {
        "innerHash": {},
        "id": 645552,
        "hash": {
            "data": "da210ebfc7ccc49902bd345007e178a9b22c9397e4f17e995a340bf4d9e54fe1"
        },
        "height": 987623
    },
    "transaction": {
        "timeStamp": 59817565,
        "amount": 0,
        "signature": "97ebf83182ce6fda5ac529852d80cb739afa3f6ec01eac8468a7862ec7b6ce39ac74e641d4ed5a73097948c13c4b7a1a3aba827305cf7edc916d2f9244b64309",
        "fee": 1000000,
        "recipient": "NDY4RHUZ3CZOZ53O5HNEXTEM7UF5X3MMDGH4IMAD",
        "mosaics": [{
            "quantity": 1000000,
            "mosaicId": {
                "namespaceId": "nem",
                "name": "xem"
            }
        }],
        "type": 257,
        "deadline": 59903965,
        "message": {},
        "version": 1744830466,
        "signer": "099132a49ed0c15936a464cf6ef43120f01fa88835803593571882feea6161db"
    }
}
```

**Transferred XEM** = (Amount / 1'000'000) * (Quantity / 1'000'000) =<br/>
= (0 / 1'000'000) * (1'000'000 / 1'000'000) = 0 * 1 = **0 XEM**

## Multisig transfer v1 XEM transfer

[/transaction/get?hash=3eef....](http://alice6.nem.ninja:7890/transaction/get?hash=3eef4c05b4018d2d32c62b24dcfd2f98d50daf6be8622fa20c7eca4d9c58487c)

```json
{
    "meta": {
        "innerHash": {
            "data": "c74f36e32561f1e701bc078cd4aad88d9635d88697ebbb423aa277e207406069"
        },
        "id": 1870489,
        "hash": {
            "data": "3eef4c05b4018d2d32c62b24dcfd2f98d50daf6be8622fa20c7eca4d9c58487c"
        },
        "height": 1562196
    },
    "transaction": {
        "timeStamp": 94577007,
        "signature": "78165861fc817f7f37a0068e9dbd716e576de9b669aef64c21b72b302663e2ff8a0d9cbf92fd8c21aa0dc8ee013706269030d758d471394ec4c7cc02e066ab02",
        "fee": 500000,
        "type": 4100,
        "deadline": 94580607,
        "version": 1744830465,
        "signatures": [{
            "timeStamp": 94577079,
            "otherHash": {
                "data": "c74f36e32561f1e701bc078cd4aad88d9635d88697ebbb423aa277e207406069"
            },
            "otherAccount": "NAGJG3QFWYZ37LMI7IQPSGQNYADGSJZGJRD2DIYA",
            "signature": "69fcd4d661d9b6ac5625086a071dfe852e7c33576f019995b27be73b9c2652ccb47b40f335e980a45b63871d78a411528f82f879239c5b42445e66d40de4ae0e",
            "fee": 500000,
            "type": 4098,
            "deadline": 94663479,
            "version": 1744830465,
            "signer": "ae6754c70b7e3ba0c51617c8f9efd462d0bf680d45e09c3444e817643d277826"
        }],
        "signer": "aa455d831430872feb0c6ae14265209182546c985a321c501be7fdc96ed04757",
        "otherTrans": {
            "timeStamp": 94577007,
            "amount": 868000000,
            "fee": 100000,
            "recipient": "NC64UFOWRO6AVMWFV2BFX2NT6W2GURK2EOX6FFMZ",
            "type": 257,
            "deadline": 94580607,
            "message": {
                "payload": "313030393138383233",
                "type": 1
            },
            "version": 1744830465,
            "signer": "fbae41931de6a0cc25153781321f3de0806c7ba9a191474bb9a838118c8de4d3"
        }
    }
}
```

**Transferred XEM** = Amount / 1'000'000 = 868'000'000 / 1'000'000 = **868 XEM**

## Multisig transfer v2 XEM transfer with empty mosaic array

[/transaction/get?hash=96f8....](http://alice6.nem.ninja:7890/transaction/get?hash=96f8d047f2eaaf78f5ea96555db21630fc4e43061dd80dce4149d1d24416e073)

```json
{
    "meta": {
        "innerHash": {
            "data": "dd2218241053cb5ad44946aec721e30d317bd9713ad2cd83b501bf74b3b610e3"
        },
        "id": 520709,
        "hash": {
            "data": "96f8d047f2eaaf78f5ea96555db21630fc4e43061dd80dce4149d1d24416e073"
        },
        "height": 528781
    },
    "transaction": {
        "timeStamp": 32061299,
        "signature": "321ed509c3303e275e2cc2bd2dc2539d4c994e5fe221c6551ba3bbb211df22207f3f7409b61abd3630c042c157151d92a494cced55f0ace107cf2afc3d9f3c0d",
        "fee": 6000000,
        "type": 4100,
        "deadline": 32064899,
        "version": 1744830465,
        "signatures": [{
            "timeStamp": 32062846,
            "otherHash": {
                "data": "dd2218241053cb5ad44946aec721e30d317bd9713ad2cd83b501bf74b3b610e3"
            },
            "otherAccount": "NDZZFLW4EPNZF2QKNU53DEEKVRDSUU7NZYNA77DY",
            "signature": "d54d415963fc37b067d35fa5d4fde4ee3eda421dfafa7e04eff331137fa35fb9ee258a5977debd404d03fa9818d6802cdf7f6266f112a59e399807a8e6052d0e",
            "fee": 6000000,
            "type": 4098,
            "deadline": 32066446,
            "version": 1744830465,
            "signer": "dc2487384e01ced7dd17d663de8412d68fce0b3f22b3b0f94fbb16e386690550"
        }],
        "signer": "5622868e7e5fafc45683b7b212d1d1e09216ac5956d7c8494c291baca2fc0650",
        "otherTrans": {
            "timeStamp": 32061299,
            "amount": 100000000,
            "fee": 2000000,
            "recipient": "NAMOAVHFVPJ6FP32YP2GCM64WSRMKXA5KKYWWHPY",
            "mosaics": [],
            "type": 257,
            "deadline": 32064899,
            "message": {},
            "version": 1744830466,
            "signer": "5adbe9f8f06e732e84122d91e0509fc2a557a5fc0198e9172ef1e7a67a4217cc"
        }
    }
}
```

**Transferred XEM** = Amount / 1'000'000 = 100'000'000 / 1'000'000 = **100 XEM**

## Multisig transfer v2 XEM transfer with XEM in mosaic array and multiplier = 1

[/transaction/get?hash=1ba1...](http://alice6.nem.ninja:7890/transaction/get?hash=1ba14816710c418a3f33237d37f52ff7fe8d321269d25b90c9c52c8371f0bee5)

```json
{
    "meta": {
        "innerHash": {
            "data": "1b8aa2f82fc44a8b488374d30752ed044c2fd56e27b7a6dede0b0bc5b892e3f7"
        },
        "id": 1205660,
        "hash": {
            "data": "1ba14816710c418a3f33237d37f52ff7fe8d321269d25b90c9c52c8371f0bee5"
        },
        "height": 1384326
    },
    "transaction": {
        "timeStamp": 83817591,
        "signature": "25f9384d07755901d14d0189ef897ac6739f890b652db15dbf7ba99053d8994d1f652089b689cabe05989520fb3278e5bffffbf0c16d79236653ab89ea39f20e",
        "fee": 150000,
        "type": 4100,
        "deadline": 83903991,
        "version": 1744830465,
        "signatures": [{
            "timeStamp": 83817790,
            "otherHash": {
                "data": "1b8aa2f82fc44a8b488374d30752ed044c2fd56e27b7a6dede0b0bc5b892e3f7"
            },
            "otherAccount": "NB24NHKJ6EHFFK3RFY2OW4I6ZTJHCFRC6F24HX5V",
            "signature": "7ddb7646bcf8184c55f1f6cc1303f15cd01165a3fc1553ec9ac806a3f59cfaf2a3ec243d458cd0151a1c058db24f1a8652ec57f4888f3422fd69621c9e961c0f",
            "fee": 150000,
            "type": 4098,
            "deadline": 83904190,
            "version": 1744830465,
            "signer": "7224cc2279a1da25f1eb01ee0f05e97ada2ffa5561e7308a12f47a2f49e39b54"
        }],
        "signer": "b1df31992f04275d593796eef7a2f96571c3999eefd92d22317bb07c205cadf7",
        "otherTrans": {
            "timeStamp": 83817591,
            "amount": 1000000,
            "fee": 50000,
            "recipient": "NDSMUVPLLAN6SVPZH6KFRM6YL2BGEAXKUSKJAUU2",
            "mosaics": [{
                "quantity": 5123456,
                "mosaicId": {
                    "namespaceId": "nem",
                    "name": "xem"
                }
            }],
            "type": 257,
            "deadline": 83903991,
            "message": {},
            "version": 1744830466,
            "signer": "2ae9eac59f52e7c1a15a1b53e69bfe5e897643980e4fe3a5cdf96507a5e2885b"
        }
    }
}
```

**Transferred XEM** = (Amount / 1'000'000) * (Quantity / 1'000'000) =<br/>
= (1'000'000 / 1'000'000) * (5'123'456 / 1'000'000) = 1 * 5.123456 = **5.123456 XEM**

## Multisig transfer v2 XEM transfer with XEM in mosaic array and multiplier > 1

[/transaction/get?hash=1690...](http://alice6.nem.ninja:7890/transaction/get?hash=169082bbb14914ee9c9547ea5bb1dff6512d2c9e42c3e4cfa930f9ce0c52183d)

```json
{
    "meta": {
        "innerHash": {
            "data": "15fb73d6d482e42f636ee9375be8725113cf7a724d3167b2769303ab469ec98b"
        },
        "id": 1849509,
        "hash": {
            "data": "169082bbb14914ee9c9547ea5bb1dff6512d2c9e42c3e4cfa930f9ce0c52183d"
        },
        "height": 1553734
    },
    "transaction": {
        "timeStamp": 94065118,
        "signature": "46f41f0930cad2c92096c5e0313f8f52d3ac8329a5eb083b8ecf13efc967b8282d3dd98adf8ddc54ec443d06860605574c8d60b570182428c5b6305a2737a500",
        "fee": 150000,
        "type": 4100,
        "deadline": 94151518,
        "version": 1744830465,
        "signatures": [],
        "signer": "3f0212e9942969fe0244878b17abc7169fa0e5447381a8917bee9933f3e94047",
        "otherTrans": {
            "timeStamp": 94065118,
            "amount": 100000000,
            "fee": 100000,
            "recipient": "NDKIDQOVCGN463JUSAUJ3YKGLVVLSZV3ZKA46JQC",
            "mosaics": [{
                "quantity": 100,
                "mosaicId": {
                    "namespaceId": "nem",
                    "name": "xem"
                }
            }],
            "type": 257,
            "deadline": 94151518,
            "message": {
                "payload": "36343362373765633232336134613165",
                "type": 1
            },
            "version": 1744830466,
            "signer": "df029b6b13f48f77033d92c89114cb17e6bfb66d864b4182f6bbdc0b34cdd323"
        }
    }
}
```

**Transferred XEM** = (Amount / 1'000'000) * (Quantity / 1'000'000) =<br/>
= (100'000'000 / 1'000'000) * (100 / 1'000'000) = 100 * 0.0001 = **0.01 XEM**

## Multisig transfer v2 XEM transfer with XEM in mosaic array and multiplier = 0

[/transaction/get?hash=ac01...](http://alice6.nem.ninja:7890/transaction/get?hash=ac0184ee30e032e63c98aa06939279db9696c3af4f9113e4b6afe9c05dad3f36)

```json
{
    "meta": {
        "innerHash": {
            "data": "cea833013c0b823b20b350e02a284ad7749be1952acaca758d785ddfc135cea8"
        },
        "id": 1850381,
        "hash": {
            "data": "ac0184ee30e032e63c98aa06939279db9696c3af4f9113e4b6afe9c05dad3f36"
        },
        "height": 1553900
    },
    "transaction": {
        "timeStamp": 94075362,
        "signature": "8cb32872304b09109e1b2cb41bd958f057ed7d1d0b48330790f7cc54f88c17db28d31ab335579f74f328bf57a38913b996af06a51c37f44b39ffc676df43710f",
        "fee": 150000,
        "type": 4100,
        "deadline": 94161762,
        "version": 1744830465,
        "signatures": [],
        "signer": "d07ee96038cb8e491163098b2b49acdf03b6cda1660a84768bc9a2e5c5c0696d",
        "otherTrans": {
            "timeStamp": 94075362,
            "amount": 0,
            "fee": 100000,
            "recipient": "NDIGV7FUKZWTXNERTFRPKBCZLCDUUE5HJVQHTJQZ",
            "mosaics": [{
                "quantity": 120000,
                "mosaicId": {
                    "namespaceId": "nem",
                    "name": "xem"
                }
            }],
            "type": 257,
            "deadline": 94161762,
            "message": {
                "payload": "77486a514357706c",
                "type": 1
            },
            "version": 1744830466,
            "signer": "fd2df62158c8028e7318467259fa240de9f33a52c0abf9c6cfa1195772f44af4"
        }
    }
}
```

**Transfered XEM** = (Amount/1'000'000) * (quantity/1'000'000) =<br/>
= (0/1'000'000) * (120'000/1'000'000) = 0 * 0.120000 = **0 XEM**
