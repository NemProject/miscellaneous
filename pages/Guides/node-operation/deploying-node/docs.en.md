---
title: 'Deploying a Node'
grand_parent: User guides
parent: 'Node Operation Guides'
nav_order: 1
taxonomy:
    category:
        - docs
---

This guide explains how to deploy a NIS1 node.

## Prerequisites

- [Install Java JRE 8](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html).

## Installation

- [Download latest binary](https://bob.nem.ninja/nis-0.6.97.tgz).
- Decompress the file anywhere you want. It should be a drive with a few Gigabytes of spare space (Current database size is over 6GB).

## Configuration

Edit the ``config.properties`` file:

- Set the ``nem.folder`` property to point to where you installed nis1 (On Windows, backslashes ``\`` need to be doubled). For example ``D:\\NEM\\nis1-home`` or ``~/nem``.
- Set ``nis.bootName`` to the name you want for your server. This is merely informational.
- Set ``nis.bootKey`` to the **private key** of the account managing this node. This is the account that will receive the harvesting rewards.

  If you don't have such account, use the [NanoWallet](../../nanowallet/docs.en.md) to create one. Once you have it, retrieve its private key from the Account tab ([As explained here](../../nanowallet/backup-wallet/docs.en.md#backup-to-paper)).

  {% include warning.html content="**Needless to say that this key must be kept secret at all times**." %}

**Optionally**, you can download a snapshot of the database at a certain height to speed up the first run of the node:

- Go to  [https://bob.nem.ninja/](https://bob.nem.ninja/) and download any of the ``nis5_mainnet.h2-*`` files. [This is the latest one](https://bob.nem.ninja/nis5_mainnet.h2-snapshot.db.gz).
- Decompress this file inside a folder named ``nis/data`` inside the folder where you installed nis1 (this is the folder you wrote in the ``nem.folder`` property).

  You should get a file named ``{nem.folder}/nis/data/nis5_mainnet.h2.db``.

## Launch

Open a terminal and run the appropriate command for your operating system, either:

```bash
runNis.bat
```

or

```bash
nix.runNis.sh
```

You will see a lot of output on the console while your new node reads the database and then synchronizes with the rest of the network. This process might take up to 12 hours.

## Next

- A few minutes after launching your node it should already appear in the public list of nodes at: [nemnodes.org](https://nemnodes.org/nodes/). You will see its reported chain height increase as the node catches up with the rest of the network.

- You can also ask your node its current chain height by pointing your browser to [localhost:7890/chain/height](http://localhost:7890/chain/height).

- [**Monitor** your node](../monitoring-node/docs.en.md).

- [**Update** your node](../updating-node/docs.en.md).
