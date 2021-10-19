---
title: Harvesting
parent: FAQ
grand_parent: 'General Information'
nav_order: 7
taxonomy:
    category:
        - docs
---

#### What is Harvesting

Harvesting is a process whereby a node will calculate blocks and add them to the blockchain.
A block contains all transactions that were sent in the last minute. In other words, a block is calculated every minute. With the help of the proof-of-importance algorithm it is decided which node is allowed to calculate a block and can keep all included transaction fees.
More info can be found [here](http://docs.nem.io/en/gen-info/how-local-delegated-harvesting-works).
#### How can I Harvest?

Requirement: The user account needs a vested balance of at least 10,000 XEM.

#### What is delegated harvesting?

Delegated harvesting is a security feature in NEM that allows a person to safely harvest using a proxy private key. This proxy private key is created by transferring the POI score of a primary account to an empty delegated account. That private key can now safely be shared with others as it doesn't actually contain any of the funds in the primary account. This allows a person with delegated harvesting activated to give their private key of the delegated account to third parties so that they can harvest with it. All funds earned from harvesting are then automatically sent back to the primary account.
More info can be found [here](http://docs.nem.io/en/gen-info/how-local-delegated-harvesting-works).
