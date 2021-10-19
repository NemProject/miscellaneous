---
title: 'Create and Edit Multisig Account'
parent: 'Multisignature and Multi-User'
grand_parent: NanoWallet
nav_order: 1
taxonomy:
    category:
        - docs
---

## How to create & edit these contracts
 
Before we start; some important things to point out are:
- Once you convert an account to a multi-signature account, **you can no longer initiate transactions from that account.** All transactions **from** the multi-signature account must be initiated by one of the cosignatories.
- If you don't want to use any existing addresses as cosignatories or as a multi-signature account, you can just create new accounts, but these will need at least one tx out so that their public key is known to the blockchain.
- You can create multi-signature accounts with up to 64 signatories. You can create the multi-signature contract in such that any number of the signatories need to approve transactions. We call this m-of-n multisig, where **m** can be any number equal to or less than **n**. 
 
### Getting started
It is possible that you only have one account in your NEM wallet. If so, you will need to create at least one more account. This account will be the account that initiates the multi-signature account creation. You will also need a set of account addresses to be the additional signers. For the purpose of this tutorial, I have created three accounts, and I will refer to them as **signer1**, **signer2**, and **MSA** (short for multi-signature account). As you might have guessed the **MSA** account will be converted to the multi-signature account and I will form a contract such that the **signer1** and **signer2** accounts both need to approve expenditures from the **MSA** account.
 
### Step 1
The first step is to login into the **signer1** account from your NanoWallet. Click **Services** in the top panel and thereafter click **Convert an account to multisig** as illustrated in Figure 5.
 
![Figure 5](http://i.imgur.com/SIkDx0b.png)
 
### Step 2
The next step is to convert the **MSA** account into a multi-signature account. First, you need to put in the **private key** of the **MSA** account. Then you can add signers, I will add the addresses of the **signer1** and **signer2** accounts. I will also set the **Min. signatures** to 2, this means that both signers need to sign a transaction. Start the contract conversion by pressing **Send**.
 
![Figure 6](http://i.imgur.com/TCMOK3m.png)
 
Congratulations! We have now created a multi-signature account with two signers.
 
###Making a Multisig Account Video Tutorial
Below is a video reviewing these steps. 
[![NEM Multisig Video Tutorial](https://s25.postimg.org/pz35w7lu7/mutlisigplay.png)](https://www.youtube.com/watch?v=cLWLqRIXHNk&feature=youtu.be)
 
### Editing a multi-signature contract
The editing of a contract is straightforward. To do so you need to click on **Services** in the top panel and when the creation of the multi-signature account has been confirmed by the blockchain network, **Edit an existing contract** is enabled for you to click. You can select a contract from **Account to edit**, and edit the contract accordingly to your needs (adding/removing signers, etc.). 
![Figure 7](http://i.imgur.com/gXHgssy.png)

###Editing a Multi-signature contract video 
Below is a video reviewing these steps. 
[![NEM Multisig Video Tutorial](https://s9.postimg.org/ick598exb/Screen_Shot_2017-06-25_at_10.44.27_PM.png)](https://youtu.be/VfawLVWyFho)


## Credits
Icons made by DinosoftLabs & Freepik from www.flaticon.com, Creative Commons BY 3.0
