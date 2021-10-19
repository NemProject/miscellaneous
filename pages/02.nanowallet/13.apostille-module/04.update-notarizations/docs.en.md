---
title: 'Update Notarizations'
parent: 'Apostille Module'
grand_parent: NanoWallet
nav_order: 4
taxonomy:
    category:
        - docs
---

## How to Update Notarizations
With the previous example, it's clear that tampering with a file's content will cause it to fail the content's hash check when we try to verify it on Apostille. This is an amazing security feature that protects against unauthorized edits to a file. However, **authorized** updates by the owner (or group of owners) to a document are possible, and they leave a transparent audit trail.

The file below was modified as you can see from its date and does not pass an audit. 
It's my file from before, and I need to update the changes... 

![](Update%20Notarizations1.jpg)

On the Services page select Apostille History and you should find your document there along with the Update button. Note that there are two publicly notarized files, which don't have any buttons. The reason for this is because these files were publicly notarized and transferred to a public sync account so they cannot be updated or transferred.

![](Update%20Notarizations2.jpg)

Enter your password and upload a new version of the file with the original filename. You will be prompted to download your updated Apostille.

![](Update%20Notarizations3.jpg)

If you go to your Apostille history again, you will see the updated notarization on top of the list, with a new file hash.

![](Update%20Notarizations4.jpg)