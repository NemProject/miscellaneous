---
title: 'Namespaces and Mosaics'
parent: 'General Information'
taxonomy:
    category:
        - docs
nav_order: 2
---

#### Mosaics and Namespaces

Mosaics are a very important backbone of the NEM platform. Mosaics add depth and breath into NEM. Given these mosaics, we are now able to do a lot more, and which actually opens up a plethora of things that otherwise cannot be done in most blockchain platforms. Coupled with NEM’s multisig, mosaics allow new levels of blockchain utility and versatility.

The basic things you need to know about NEM’s recent fork are Namespaces and Mosaics features. The easiest way to appreciate it is the domain and file analogy on the internet. Imagine that a domain address has to be unique in a root (lowest level) directory. Namespace addresses this unique feature. If one creates a namespace, that namespace will appear unique in the NEM ecosystem. For example, if one were to create a namespace called “foo” that namespace cannot be created by a second person.  Just like on the internet, a domain can have a sub-domain, namespaces can have sub-namespaces.   And it is possible to create multiple sub-namespaces with the same name (example: “foo.bar” and “foo2.bar”, “bar” is the sub-namespace/sub-domain). A namespace and a domain name is the same in this document and shall be used interchangeably. Namespaces can have up to 3 levels, a namespace and its two levels of sub-namespace domains.

Next up is the mosaic itself.  A mosaic is like a file hosted on a domain and represents an asset, and like a website and directory, a mosaic can have the same name as other files on other domains.  But a total address of a namespace + mosaic will always be unique as the root namespace was unique even if the rest of it isn't.  

**Examples:**

- Namespace (root level domain): `spaceminers`
- Sub-domain 1: `mars`
- Sub-domain 2: `moon`

**Mosaics:**

- <font color=gold>gold</font>
- <font color=red>gem</font>
- <font color=blue>water</font>

Accordingly, mosaics can be named as such:

- `spaceminers` * <font color=gold>gold</font>
- `spaceminers` * <font color=red>gem</font>
- `spaceminers` * <font color=blue>water</font>
- `spaceminers.mars` * <font color=gold>gold</font>
- `spaceminers.mars` * <font color=red>gem</font>
- `spaceminers.mars` * <font color=blue>water</font>
- `spaceminers.mars.moon` * <font color=gold>gold</font>
- `spaceminers.mars.moon` * <font color=red>gem</font>
- `spaceminers.mars.moon` * <font color=blue>water</font>

Each of the above mosaics is made unique by the namespace’s fully qualified name. Also, the mosaic is preceded by an “ * ” to differentiate it from a namespace.  

In summary, everything under the root level domain belongs to the account that created it. In the above examples, the root level domain name is `spaceminers`.

#### Significance of Namespaces and Mosaics

Namespaces gives rise to a unique naming convention. Mosaics gives rise to the creation of assets. Some call it a colored coin while others may call it a token. We call it a mosaic it will take on many types of properties when it is full blown (hence we call it a mosaic as it evolves to form the “big picture”) .

Our initial rollout is a mosaic that has the following properties:

**description**
Free-text description of the mosaic up to 128 characters, changeable by the owner.

**divisibility**
Adding this makes a quantity divisible, up to 6 decimal places. A divisibility of 2 means 2 decimal places.

**information**
Arbitrary byte array that can be in the property, with a size limit; this is the same as “messages” in NEM.

**domain name or namespace** (required)
Globally unique fully qualified domain name that is registered and owned by the mosaic creator. A top level namespace has a size limit of 16 characters, sub-namespaces have a limit of 64 characters.

**name** (required)
Name of the mosaic, up to a size limit of 32 characters; must be unique under the domain name.

**mutable quantity**
The amount of mosaic in circulation. If immutable, it is fixed, otherwise it is dynamic, i.e., more can be created or destroyed later.

**transferability**
If no, it means it can only be transferred between user and creator. Otherwise, it is freely transferable between third parties.

**levy**
A levy allows the creator of a mosaic to set a tax on any subsequent transactions of that mosaic. This levy is sent to an account of the creators choosing. Any mosaic or XEM may be used as a levy.

In the future Mosaics might have their feature set expanded to among other things include dividends, reputation, recallability, composability (ability to put assets in assets), issuer covered fees on trades, expansion of the non-transferable white list, IoT compatibility, levies to be redefinable, variable expirations, smart contracts, storage, and processing power. In addition addition to discussing these up grades to Mosaics, we have also discussed making Namespaces have transferable names.  

#### Lightwallet

In the initial roll out of Namespaces and Mosaics, the new NEM light wallet supports making, editing, and sending.  NCC can be used to see your namespace and mosaic transactions but not initiate them.  NCC is undergoing a new upgrade and is planned to support those features soon.  

You can download the latest lightwallet version from the bob.nem.ninja repository.  If the file is password protected, the password is "nem".  

Fees for making a namespace or mosaic are 100 XEM and the fee for making a sub-namespace is 10 XEM.  

#### Transferring Namespaces

At this point in time ownership of namespaces and/or mosaic editing rights attached to a namespace are not directly transferable through the blockchain.  You can however create a 1-of-1 multisig account, which is essentially a delegate account of your primary account.  That account's private key will be muted and all control of all transactions for that account will be transferred to the issuer's primary account.  But NEM's multisig feature allows editing of the delegation of signers.  This now means that a user may then transfer all rights of their primary account over a delegate account to any third party by assigning that third party's main account to be the new 1-of-1 signer.  Once completed that third parties primary account now holds the namespace and mosaic editing rights as well as full control over all activities for that account.  
