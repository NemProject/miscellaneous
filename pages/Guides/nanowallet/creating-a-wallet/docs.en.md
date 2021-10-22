---
title: 'Creating a Wallet'
parent: NanoWallet
grand_parent: User guides
nav_order: 2
taxonomy:
    category:
        - docs
---

## Creating a Wallet

From the NanoWallet starting interface, select "SIGN UP."

![](Sign%20Up.png)

In this guide, we will create a simple wallet. If you want to learn about the different wallet types, it's covered later in this guide.

1. Make sure the Simple Wallet tab is selected.
2. Enter a wallet name. Example: LonsFirstWallet
3. Choose a network. Mainnet is recommended for most users. (Testnet is for software testing only. Mijin is for permissioned chains.)
4. Enter a password. Example: correcthorsebatterystaple
5. Press "Create simple wallet" button.
![](Signup.PNG)

### Simple wallet

When you create a simple wallet, the NanoWallet will create a *yourwallet.wlt* file which contains your private key. The file is encrypted with your password. If you want to import the wallet to another computer, you need the .wlt file **AND** the password.

Simple wallets are more convenient than other wallet types because it's easy to import a simple wallet to a new computer just by adding the .wlt file to the new installation. Use a simple wallet if you are just getting started or if you want a wallet that's a little easier to transfer to new devices.

### Brain wallet

A brain wallet is a good choice for someone who doesn't want to write down or record a password in any way. Everything you need is memorized and stored in your brain. This provides added security provided you can remember your passphrase with 100% reliability.

When you create a brain wallet, the NanoWallet will create a private key which is derived directly from your passphrase. As the name suggests, a brainwallet is meant to be only secured by a password/passphrase which can be remembered without further backups. You can log into a brain wallet from any NanoWallet on any computer; a .wlt file is **NOT** needed, nor is the private key ever stored in the wallet file as it will be derived each time independently.

**Because of that reason, we recommend an extra long passphrase, e.g., at least 12 random words.**

### Private key wallet

A private key wallet can only be created if you already have a private key for a previously created NEM address.

You should use this wallet type if you need to import an old account or paperwallet to a new NanoWallet.

**Keep your private key secure. If someone gains access to it, they could gain control of your account.**
