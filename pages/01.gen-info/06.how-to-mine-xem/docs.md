---
title: 'How to "Mine" XEM'
parent: 'General Information'
taxonomy:
    category: docs
nav_order: 6
---

Do you want to mine XEM? Fortunately NEM uses a new and improved consensus method called POI that is ultra-light and energy efficient.  For more about havesting on NEM (NEM's version of mining) please visit the following blogs. 

* [What is Proof-of-Importance (POI) and Why Is It Better, and What Is Vesting?](http://blog.nem.io/what-are-poi-and-vesting/)
* [How do I get importance and make more blocks on NEM?](https://blog.nem.io/how-do-i-get-importance-on-the-nem-blockchain/)
* [How to Enroll and Participate in Supernodes](http://blog.nem.io/supernodes/)

But some people like the original POW style of mining. As mentioned above, NEM uses [harvesting](http://blog.nem.io/how-local-and-delegated-harvesting-works/) which works from an accounts importance, but if you are still interested in POW style mining with video cards or ASICs what you can do, however, is mine other altcoins and move them to XEM at their exchange rates automatically.

This has two main advantages for both you and the NEM ecosystem.

You take advantage of NEM’s relatively stable/rising price for your asset holding.
You slowly but surely increase the NEM market cap from the exchange rate of whatever coin to XEM.

So, without further ado, let’s get started switching your mining rigs to XEM.

## Sign Up for Minergate

[Signup Link](http://bit.ly/xemminer): Note that Minergate/Changelly are not endorsed by the NEM developers, use at your own risk.

This service allows you to mine directly to Changelly, one of the exchanges with whom you can exchange NEM. This makes it so that you can withdraw your mining profits in XEM without having to sign up for another exchange!

This is perfect for people who don’t want to sign up for an exchange but want XEM. Now it’s possible to mine to your NEM wallet.

## CPU Mining

Don’t have a GPU? No problem. You can download the MinerGate client from their website and turn on smart mining. It will automatically mine the coin that’s most profitable at the moment, so there’s nothing else to worry about.

![Miner Smart Mining](https://static.minergate.com/99184f5e3bdb0df0d5a6d9c8317fbf02.png)

Happy CPU mining. Skip ahead in the article for information on how you can withdraw to your XEM wallet.

## JavaScript Mining

Don’t want to download anything? Just head over to the “Web Mining” tab of MinerGate and turn on Monero mining. At the time of writing this, it is the most profitable CPU coin. You’ll notice your shares to go up, and all you have to do to keep mining is keep the page open.

![Web Miner](http://i.imgur.com/PaKTx5U.png)

Happy JavaScript/web mining! Skip ahead in the article for information on how you can withdraw to your NEM wallet.

## GPU Mining

If you already have GPU mining rigs, this is where the real profit’s at. Chances are that you already are mining Ethereum, so all you need to do at that point is point your miners to minergate.

Ethminer: `ethminer -C -F http://eth.pool.minergate.com:55751/YOUR_EMAIL --disable-submit-hashrate` (GetWork)

Genoil OpenCL: `ethminer -G -S eth.pool.minergate.com:45791 -O YOUR_EMAIL` (Stratum)

Genoil CUDA: `ethminer -U -S eth.pool.minergate.com:45791 -O YOUR_EMAIL` (Stratum)

If you already have GPU mining rigs but want a GUI for some reason, just follow the CPU mining instructions, but the GUI will mine with your GPU in smart mining.

## Withdraw to XEM

Alright, you’ve mined some coin, so now all you need to do is go sign up for [Changelly](https://changelly.com/) and tell them how much you want to withdraw to XEM. Then click through the prompts that ask where you want the XEM sent, etc. On the sending step, just click the minergate invoice button.

![MinerGate Invoice Button](http://i.imgur.com/jL76bZW.png)

Then just hit confirm, and you’ll receive your XEM shortly.

*The NEM team would like to thank Nikhil J for this tutorial.*
