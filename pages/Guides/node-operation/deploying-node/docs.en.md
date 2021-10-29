---
title: 'Deploying a Node'
grand_parent: User guides
parent: 'Node Operation Guides'
nav_order: 1
taxonomy:
    category:
        - docs
---

This guide explains how to deploy a NIS1 node, either [manually](#manually) or [using Docker](#using-docker).

## Manually

### Prerequisites

- [Install Java JRE 8](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html).

### Installation

- [Download latest binary](https://bob.nem.ninja/nis-0.6.97.tgz).
- Decompress the file anywhere you want. It should be a drive with a few Gigabytes of spare space (Current database size is over 6GB).

### Configuration

Edit the ``nis/config.properties`` file:

- Set the ``nem.folder`` property to point to where you installed nis1 (On Windows, backslashes ``\`` need to be doubled). For example ``D:\\NEM\\nis1-home`` or ``~/nem``.
- Set ``nis.bootName`` to the name you want for your server. This is merely informational.
- Set ``nis.bootKey`` to the **private key** of the account managing this node. If you don't have such account, use the [NanoWallet](../../nanowallet/docs.en.md) to create one.

  - When performing [delegated harvesting](../../nanowallet/delegated-harvesting/docs.en.md) this is the private key of the proxy remote account. Harvesting rewards go to the linked account (this is the **recommended** setup).

  - When performing local harvesting this is directly the private key of your account (This setup is **not recommended**).

    Retrieve this private key from the NanoWallet's Account tab ([as explained here](../../nanowallet/backup-wallet/docs.en.md#backup-to-paper)).

    {% include warning.html content="**Needless to say that this key must be kept secret at all times**." %}

**Optionally**, you can download a snapshot of the database at a certain height to speed up the first run of the node:

- Go to  [https://bob.nem.ninja/](https://bob.nem.ninja/) and download any of the ``nis5_mainnet.h2-*`` files. [This is the latest one](https://bob.nem.ninja/nis5_mainnet.h2-snapshot.db.gz).
- Decompress this file inside a folder named ``nis/data`` inside the folder where you installed nis1 (this is the folder you wrote in the ``nem.folder`` property).

  You should get a file named ``{nem.folder}/nis/data/nis5_mainnet.h2.db``.

### Launch

Open a terminal and locate the appropriate command for your operating system, either:

```bash
runNis.bat
```

or

```bash
nix.runNis.sh
```

Before running them, though, edit the files:

- Increase the amount of RAM used by the client by replacing the ``-Xmx1G`` parameter with ``-Xmx4G``. If more than 4GB of RAM are available you can increase this parameter further.
- Enable the G1 Garbage collector by appending the ``-XX:+UseG1GC`` parameter for increased performance.

You can now launch the script. You will see a lot of output on the console while your new node reads the database and then synchronizes with the rest of the network. This process might take up to 12 hours.

Jump to the [last section](#next) to see the following steps.

## Using Docker

These instructions only work for Linux systems (or the Linux Subsystem for Windows).

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/).
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

### Installation

Clone the [nem-docker](https://github.com/rb2nem/nem-docker) repository:

```bash
git clone git@github.com:rb2nem/nem-docker.git
cd nem-docker
```

### Node control

To start the node:

```bash
./boot.sh
```

To stop the node:

```bash
./stop.sh
```

For additional commands read [the nem-docker GitHub project](https://github.com/rb2nem/nem-docker).

## Next

- A few minutes after launching your node it should already appear in the public list of nodes at: [nemnodes.org](https://nemnodes.org/nodes/). You will see its reported chain height increase as the node catches up with the rest of the network.

- You can also ask your node its current chain height by pointing your browser to [localhost:7890/chain/height](http://localhost:7890/chain/height).

- [**Monitor** your node](../monitoring-node/docs.en.md).

- [**Update** your node](../updating-node/docs.en.md).
