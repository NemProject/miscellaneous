---
title: 'Updating a Node'
grand_parent: User guides
parent: 'Node Operation Guides'
nav_order: 3
taxonomy:
    category:
        - docs
---

Updating your NEM node to the latest version of the protocol is actually extremely easy:

- Stop the server by pressing ``Ctrl+C`` or killing the process.

- Remove the old package. This means all files you [installed previously](../deploying-node/docs.en.md#installation) **except** the ``*.config`` files and the ``nis/data`` folder.

- [Download latest binary](https://bob.nem.ninja) and extract it in the same folder.

- Start the server again with [the same command you used in the deployment guide](../deploying-node/docs.en.md#launch).
