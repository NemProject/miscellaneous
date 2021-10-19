---
title: 'Make Multi-sig Notarizations'
parent: 'Apostille Module'
grand_parent: NanoWallet
nav_order: 6
taxonomy:
    category:
        - docs
---

**Use Case: Two-Party Contract** 

Sometimes there is a need for an extra layer of authorization. This is where an already existing multisig account comes into play.

Let's say you just signed a contract in Singapore. Your business is based in the UK, and you want to make a digital archive of that contract. However, you are not the sole business owner, and others are required to authorize it before archiving the contract. So you send them all a copy of the file to review, preferably notarized with Apostille. If you all agree that this is the file you want to archive, you will use the company multisig account to send a joint notarization.

You can do that by following these simple steps:

Go to **Create** Apostille in the **Services** tab; I also highlighted some small icons on the right. The first “Normal” button lets you upload a file to notarize as outlined above. The other “Multisig” button opens the fields as shown below.
There you can enter the name of a text document and its contents. 
NEM Apostille will make a notarized one for you. Then it will prompt to download a .zip file download.
It's quite useful for making documents on the go.
Now, please take a moment to find the **Multisig** tab just below the title "Create Apostilles."

![](Multisig%20Not1.jpg)

Click on it and you will navigate to this page. Here, the procedure of notarizing a document is almost the same, except you choose a multisig account to do the signing. Note the multisig account pays the fees. If there were more signers, each of them would also pay additional transfer fees from the notarization account.

All co-signatory rules apply in this transaction also.

![](Multisig%20Not2.jpg)

When you click send, the cosigners will get a request to authorize the transaction. When the transaction is initiated, the download will prompt.

I have compared certificates signed by my account (on the right) and signed by a multisig (on the left.)

The owner is the same, the one that issued the transaction but not the **sender** account of the notarization. This is because regardless of which account is paying the fees, the person initiating must have been an owner or at least part owner to initiate.

![](Multisig%20Not3.jpg)

_The document will always be signed using a private key from the uploader's account, even when signing with multisig. In this way, you establish the source account and original owner of the document._

In the example on the right, we can see that "from:" field contains a multisig account address.

If you were to go to a blockchain explorer and search for that account, you would see its co-signers if any.

![](Multisig%20Not4.jpg)

Also when you audit an Apostille, you can find it on the explorer by clicking on **"File successfully audited."**

There you can find the sender account and cosigners of the multisig account if it was issued from one.

![](Multisig%20Not5.jpg)
