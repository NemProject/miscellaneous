---
title: 'How Local and Delegated Havesting Work'
parent: 'Concepts'
taxonomy:
    category: docs
nav_order: 3
---

NEM has two different methods for harvesting: local and delegated harvesting. In this tutorial we will describe the differences and how each method works.

#### What is harvesting?
Harvesting in NEM is the process of generating blocks and earning the transaction fees in that block as a reward for the contributed work. The POI (Proof-of-Importance) algorithm determines who is allowed to generate a block (or more precisely: which generated block is considered as valid). To be able to harvest, the account needs a vested(!) balance of at least 10,000 XEM.  
**Note:** Every 1440 blocks 1/10th of the unvested balance is moved to the vested part.

You can compare harvesting to mining in Bitcoin, although with harvesting you don't create new XEM coins, but only earn the transaction fees.

#### Default method: local harvesting
If you didn't activate *delegated harvesting* explicitly, the default method will be used which is *local harvesting*. This method works only while your computer is running and as long as you are not using a remote NIS (NEM Infrastructure Server). (In this tutorial we will not explain in which cases it can be useful to use a remote NIS and how this can be done. Please take a look at other tutorials, if you are interested.)

When you start *local harvesting* for an account, the private key of the account is passed to your locally running NIS. This is needed because NIS needs to sign generated blocks with your private key. The private key will of course not leave your computer at any time.

#### Alternative method: delegated harvesting
If you are connected to a remotely located NIS ("remote NIS") and want to start harvesting, you cannot do this with the default method (local harvesting), because the NEM software will block this. The reason for blocking is simple: Your account's private key would be sent to the remote NIS (remember: it is needed to sign generated blocks) and this would be a serious security issue, because if somebody got ahold of your private key, that person would gain full control over your funds.

The solution is easy: Activate *delegated harvesting* before you start harvesting on a remote NIS. This step will initiate a block chain transaction and therefore costs a fee of 6 XEM. The activation has to be done only once for an account. After 360 confirmations (approx. 6 hours) the activation is complete and you can start harvesting. Once a remote NIS started harvesting, you can even shut down the NEM software on your local computer - the remote NIS will continue to harvest for your account as long as it is being operated.

For a detailed description how to start delegated harvesting, please see [here](http://nem.ghost.io/how-to-use-delegated-harvesting/).

**Note:** If you activated *delegated harvesting* for an account, this doesn't mean you can only harvest on a remote NIS. It is still possible to harvest on your local NIS if you wish to do that.
**Note 2:** You don't have to trust the remote NIS you are using. If it is acting fraudulent or it got hacked, your funds are not at risk. The worst thing a remote NIS can do is to pretend to harvest for you, but in reality it is not. If you want to know how that is possible, please read on.

#### The 'magic' behind delegated harvesting
Ok, you wanted to hear it:
If you activate *delegated harvesting*, NCC (NEM Community Client) initiates an "importance transfer" transaction that is processed on the blockchain. This creates a mapping for the importance score of the account to an empty "proxy" account (balance: 0&nbsp;XEM). When the activation of *delegated harvesting* has completed and you start harvesting on a remote NIS, the private key of the "proxy" account is then passed to the remote NIS to sign generated blocks, but the fees you earn are still directly sent to the original account. With the private key of the "proxy" account it is not possible to transfer your importance score to any other account, and because it has a balance of zero, no funds can be stolen either. Isn't that beautiful?

#### Conclusion
Practically, what this means is that users can put their main account into an offline storage and use a proxy account to harvest on behalf of the offline storage account.
For more information about how to connect to remote servers when using *delegated harvesting* please visit the tutorial on [connecting to a remote NIS](http://nem.ghost.io/connecting-to-a-remote-server/).

**Local harvesting**  
<font color="green">**+** No setup required - just click "Start local harvesting"</font>  
<font color="red">**-** Not possible if you are using a remote NIS</font>  
<font color="red">**-** No "offline harvesting", therefore higher costs for electricity if you use a regular computer</font>  

**Delegated harvesting**  
<font color="green">**+** Always harvesting - even if your computer is turned off (a remote NIS is needed to harvest on your behalf)</font>  
<font color="green">**+** Lower costs for electricity (if remote NIS runs on a VPS or micro computer like Raspberry Pi 2, Cubieboard 3 or similar)</font>  
<font color="red">**-** Setup required (activation takes approx. 6 hours and costs a fee of 6 XEM)</font>

**Note:** Your harvesting chance will be the same for both methods.

--------------------------------------------------
In conclusion, here is a little bonus tutorial material. 

Here is a community made [video example](https://www.youtube.com/watch?v=7RdUXKu2SyU) (Sr. Yuba). 

Please give it a watch. 


