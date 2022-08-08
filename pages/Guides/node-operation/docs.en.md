---
title: 'Node Operation Guides'
parent: User guides
nav_order: 2
taxonomy:
    category:
        - docs
---

- TOC
{:toc}

## Deploying a node

This guide explains how to deploy a NEM node, either [manually](#manually) or [using Docker](#using-docker).

### Manually

#### Prerequisites
{:.no_toc}

- [Install Java JRE 8](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html).

#### Installation
{:.no_toc}

- [Download latest binary](https://bob.nem.ninja/nis-0.6.100.tgz).
- Decompress the file anywhere you want. It should be a drive with a few dozen Gigabytes of spare space (Current database size is over 20GB).

#### Configuration
{:.no_toc}

Edit the ``nis/config.properties`` file:

- Set the ``nem.folder`` property to point to where you installed NIS1 Client (On Windows, backslashes ``\`` need to be doubled). For example ``D:\\NEM\\nis1-home`` or ``~/nem``.
- Set ``nis.bootName`` to the name you want for your server. This is merely informational.
- Set ``nis.bootKey`` to the **private key** of the account managing this node. If you don't have such account, use the [NanoWallet](/nem-docs/pages/Guides/nanowallet/docs.en.html) to create one.

  - When performing [delegated harvesting](/nem-docs/pages/Guides/nanowallet/docs.en.html) this is the private key of the proxy remote account. Harvesting rewards go to the linked account (this is the **recommended** setup).

  - When performing local harvesting this is directly the private key of your account (This setup is **not recommended**).

    Retrieve this private key from the NanoWallet's Account tab ([as explained here](/nem-docs/pages/Guides/nanowallet/backup-wallet/docs.en.html)).

    {% include warning.html content="**Needless to say that this key must be kept secret at all times**." %}

**Optionally**, you can download a snapshot of the database at a certain height to speed up the first run of the node:

- Go to  [https://bob.nem.ninja/](https://bob.nem.ninja/) and download any of the ``nis5_mainnet-*.mv.db`` files. [This is the latest one](https://bob.nem.ninja/nis5_mainnet-3_500_060.mv.db.gz).
- Decompress this file inside a folder named ``nis/data`` inside the folder where you installed NIS1 Client (this is the folder you wrote in the ``nem.folder`` property).

  You should get a file named ``{nem.folder}/nis/data/nis5_mainnet.mv.db``.

#### Launch
{:.no_toc}

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

Launch now the script and you will see a lot of output on the console indicating that the node is running.

### Using Docker

These instructions only work for Linux systems (or the Linux Subsystem for Windows).

#### Prerequisites
{:.no_toc}

- [Docker](https://docs.docker.com/get-docker/).
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

#### Installation
{:.no_toc}

Clone the [nem-docker](https://github.com/rb2nem/nem-docker) repository:

```bash
git clone git@github.com:rb2nem/nem-docker.git
cd nem-docker
```

#### Node control
{:.no_toc}

To start the node:

```bash
./boot.sh
```

To stop the node:

```bash
./stop.sh
```

For additional commands read [the nem-docker GitHub project](https://github.com/rb2nem/nem-docker).

### Synchronization

The first thing the node will do is either download the whole blockchain from its peers, or, if you installed the optional database snapshot, read the database and the download the rest of blocks. At any rate, this is a long process that might take up to 12 hours.

Meanwhile, you can check:

- A few minutes after launching your node it should already appear in the public list of nodes at: [nemnodes.org](https://nemnodes.org/nodes/). You will see its reported chain height increase as the node catches up with the rest of the network.

- You can also ask your node its current chain height by pointing your browser to [localhost:7890/chain/height](http://localhost:7890/chain/height).

## Monitoring a node

NIS listens on port 7890, so a first way to monitor your node is to check that your server listens on that port.
You can configure [UptimeRobot](https://uptimerobot.com/) to monitor that port, for example. This page should give you
the required information to configure any other monitoring solution.

It is possible to get information from a running nis by sending HTTP requests. Several URLS are handled.

Status URLs will give JSON-formatted answers, and their meaning is detailed in the [NIS API documentation](http://bob.nem.ninja/docs/#nemRequestResult).

Node URLs will give information on the node, such as the version that it is running.

### Status URL /heartbeat
{:.no_toc}

You configure your monitoring solution to send requests to the url `http://YOUR_IP:7890/heartbeat`. A NIS instance
receiving this request will answer if the node is up and able to answer to requests.

### Status URL /status
{:.no_toc}

The URL `/status` of your node returns a small JSON object giving some info on your node's status.
Check the NIS API documentation linked above for its meaning.

### Status URL /node/info
{:.no_toc}

A request sent to that URL gets a JSON-formatted response, giving basic information on the node, such as its version
and the network it is running on (mainnet, testnet)

### Status URL /node/extended-info
{:.no_toc}

The extended-info URL gives a bit more information. Check for yourself if this is interesting to you:

## Updating a node

Updating your NIS1 Client to the latest version of the protocol is actually extremely easy:

- Stop the server by pressing ``Ctrl+C`` or killing the process.

- Remove the old package. This means all files you [installed previously](#installation) **except** the ``*.config`` files and the ``nis/data`` folder.

- [Download latest binary](https://bob.nem.ninja) and extract it in the same folder.

- Start the server again with [the same command you used in the deployment guide](#launch).
