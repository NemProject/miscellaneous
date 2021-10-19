---
title: 'Address Components'
nav_order: 9
has_children: true
has_toc: false
taxonomy:
    category:
        - docs
---

## Private key, public key, address

As explained in Chapter 2 of the [Technical
Reference](http://nem.io/NEM_techRef.pdf), an account is an Ed25519
cryptographic keypair associated to a mutable state stored on the NEM
blockchain. The state of the account is modified when transactions involving it
are accepted by the network. 

Nem is using the [Ed25519 publick key signature system](https://ed25519.cr.yp.to/) with the
SHA3 hashing algorithm.
Ed25519 was [introduced](https://ed25519.cr.yp.to/ed25519-20110926.pdf) when sha3 was not yet
standardised, and it uses the SHA512 hashing algorithm (the paper names it Ed25519-SHA-512).
However the paper clearly states that `we will not hesitate to recommend Ed25519-SHA-3 after SHA-3 is standardized`.

> Most Ed25519 implementations use the SHA-512 method described in the original paper. To generate NEM keypairs, 
you might need to patch standard implementations, as was [done for the python implementation](https://github.com/NemProject/nem-py/blob/master/ed25519.py)
 by the NEM authors..


The private key uniquely identifies a NEM account. The public key is derived from the private key, and the address of the account is
derived from the public key.

The address of an account is a base-32 encoded triplet consisting of:
* network byte: is it an address on the testnet or the mainnet?
* 160-bit hash of the public key
* 4 byte checksum, for detection of mistyped addresses

From this description we see that we can generate a new account offline, there's
no need to be connected to the network to create an account.

Here is the code generating an address from the public key, [extracted from nem.code](https://github.com/NemProject/nem.core/blob/master/src/main/java/org/nem/core/model/Address.java#L81):

``` java
        private static String generateEncoded(final byte version, final byte[] publicKey) {
                // step 1: sha3 hash of the public key
                final byte[] sha3PublicKeyHash = Hashes.sha3_256(publicKey);

                // step 2: ripemd160 hash of (1)
                final byte[] ripemd160StepOneHash = Hashes.ripemd160(sha3PublicKeyHash);

                // step 3: add version byte in front of (2)
                final byte[] versionPrefixedRipemd160Hash = ArrayUtils.concat(new byte[] { version }, ripemd160StepOneHash);

                // step 4: get the checksum of (3)
                final byte[] stepThreeChecksum = generateChecksum(versionPrefixedRipemd160Hash);

                // step 5: concatenate (3) and (4)
                final byte[] concatStepThreeAndStepSix = ArrayUtils.concat(versionPrefixedRipemd160Hash, stepThreeChecksum);

                // step 6: base32 encode (5)
                return Base32Encoder.getString(concatStepThreeAndStepSix);
        }

```

We see that the steps are:

  1. take the sha3-256 of the public key
  1. take the [ripemd160](https://en.wikipedia.org/wiki/RIPEMD) hash of that result. 
  1. add the prefix corresponding to the network ('N' for Mainnet, 'T' for Testnet, 'M' for Mijin)
  1. compute the checksum by taking the 4 left-most bytes of the sha3-256 of the previous step
  1. append the checksum to the result of step 3

## Multisig accounts

Nem account can be converted to multisig account (from multi signatures). A multisig account has co-signatories accounts, 
and it cannot initiate transactions itself. Only the co-signatories can initiate transactions.

When an account is converted to multisig, the transaction adds the co-signatories and indicates how many of them need to
accept a transaction for it to go through. That's why you'll hear that NEM supports N-of-M multisig accounts. A multisig account
can have M co-signatories, of which N need to validate the transactions. As long as N is smaller or equal to M, it is a
supported configuration. You can have a 1-of-2, 3-of-4, 7-of-20, etc...

## Accounts on the blockchain

From the explanation above, we see that we can create an account without ever interacting the with blockchain.
Does it mean that all possible accounts are pre-defined on the blockchain? No. It means that only accounts that 
have had activity are tracked on the blockchain. Creating your account is done by defining your private key. With 
that private key you have the information needed to access the related account. Be before it had any activity,
it isn't tracked on the blockchain and the amount it stores is 0.

So what is an activity? It is simply a transaction involving the account. That can be an incoming transaction (the
first transaction obviously can't be an outgoing transaction) or a multi-sig conversion transaction.

## Key length and security

The private key is 256 bits long, which might seem small when you hear advices to [use 2048 bits keys for RSA](http://stackoverflow.com/a/1904541).
But [key length is not the only parameter defining your security](https://security.stackexchange.com/a/101045). Nem
uses Ed25519, which is an [elliptic curve cryptography](https://en.wikipedia.org/wiki/Elliptic_curve_cryptography),
requiring smaller key than non elliptic curve cryptography methods to provide the same security level.
It appears that in general, to break an n bit elliptic curve public key, the effort is 2^(n/2), or about 3.4*10^38, basic operations.

The probability to randomly generate a secret key that is linked to an account already existing is also very small.
The key being 256 bits long, there are 10^77 possibilities. We thus see that collision probability is very small, and in 
cryptographic term, negligible.

What's more, you can increase the security of your account by using multi-sig, with which multiple accounts have to validate
transactions from one account.

## Account data

The blockchain stores the following data about accounts:

* address: the account address
* balance: the amount of micro-XEMs stored in the account.
* importance: denotes the probability of an account to generate the next block in case the account has harvesting turned on.
* public key: the public key of the account can be used to validate signatures of the account
* label: unused, always null
* harvestedBlocks: the number of blocks this account has generated.

## The public key of the account is not empty, why?

The public key of an account will be stored on the blockchain with the first transaction issued the account. An account which hasn't issued any
transaction will have its public key field empty.
