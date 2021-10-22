---
title: 'Transaction Components'
parent: 'Concepts'
nav_order: 9
taxonomy:
    category:
        - docs
---

In this chapter we will take a closer look at transactions.
Transactions can be seen as actions taken on the blockchain, changing the state of the block chain.

From the NEM API documentation:

``` text
Once a transaction is initiated, it is still unconfirmed and thus not yet
accepted by the network. At this point it is not yet clear if it will get
included in a block. Never rely on a transaction which has the state
'unconfirmed'. Once it is included in a block, the transaction gets processed
and, in case of a transfer transaction, the amount stated in the transaction
gets transferred from the sender's account to the recipient's account.
Additionally the transaction fee is deducted from the sender's account. The
transaction is said to have 0 confirmations at this point. When another block
is added to the block chain the transaction has 1 confirmation. The next block
added to the chain will give it 2 confirmations and so on.

Crypto currencies have the ability to roll back part the block chain. This is
essential for being able to resolve forks of the block chain. There is however
a maximum number of blocks that can be rolled back, this is called the rewrite
limit. Hence forks can only be resolved up to a certain depth too. NEM has a
rewrite limit of 360 blocks. Once a transaction has more than 360
confirmations, it cannot be reversed. In real life, forks that are deeper than
20 blocks do not happen, unless there was some severe problem with the block
chain due to a bug in the code or an attack of some kind.
```

As different actions can be taken, different transaction types have been defined.
Transaction types are grouped by kind. For example all multisig transactions are of the same kind, but
still have a differrent type according to their effect like adding a cosignatory or signing a pending multisig transaction.
 Some kinds have multiple transaction types, others only have one.

Each transaction kind has a base id, from which the id of their transaction types are derived. For example, the transfer kind has base id `0x100`,
and a mosaic transfer type has id `0x101`. If one days it is decided that NEM needs a new transfer type, it would be assigned the id `0x102`, which
today is not used.

Here are the transfer kinds and their respective types, each with their id noted in hexadecimal and decimal notation, as extracted 
[from the code](https://github.com/NemProject/nem.core/blob/master/src/main/java/org/nem/core/model/TransactionTypes.java):

|Transaction  | Kind         | Type                       | ID            |
|-------------|--------------|----------------------------|---------------|
|Transfer     | 0x100, 256   | Mosaic transfer            | 0x101, 257    |
|Importance   | 0x800, 2048  | Importance transfer        | 0x801, 2049   |
|Multisig     | 0x1000, 4096 | Multisig change            | 0x1001, 4097  |
|             |              | Multisig sign              | 0x1002, 4098  |
|             |              | Multisig tx                | 0x1004, 4100  |
|Namespace    | 0x2000, 8192 | Provision ns               | 0x2001, 8193  |
|Mosaic       | 0x4000, 16384| Mosaic definition creation | 0x4001, 16385 |
|             |              | Mosaic supply change       | 0x4002, 16386 |

Keep this as a reference for when we'll monitor or create transactions.

Just for the completeness, there are gaps in the numbers because some of them have been 
assigned to kinds and types that were never used in the end. Here they are:

|Transaction  | Kind         | Type                           | ID            |
|-------------|--------------|--------------------------------|---------------|
|~~Asset~~    | 0x200, 512   | ~~Asset new~~                  | 0x201, 513    |
|             |              | ~~Asset ask~~                  | 0x202, 514    |
|             |              | ~~Asset bid~~                  | 0x203, 515    |
|~~Snapshot~~ | 0x400, 1024  | ~~Snapshot~~                   | 0x241, 1025   |
