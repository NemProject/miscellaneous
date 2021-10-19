---
title: 'Create a Poll'
parent: 'Voting Module'
grand_parent: NanoWallet
nav_order: 2
taxonomy:
    category:
        - docs
---

**How to Use the NEM Voting Module**

You will find two options on the services tab on NanoWallet: See Polls and Create Poll. Let’s walk through their features.

**Creating a Poll**

Example of a poll creation form on the testnet:
![](1-5ehVC2Lx2tsVEglO-4kGfg.png)

On the Create poll option you will find a form with all the information needed for a poll to be created. There is a small description for each field.

The fields that define a poll are:

* Title: This is a short title people will see on the poll index and when opening the poll.
* Description: The description’s purpose is to explain what the poll is about and to include relevant information. The description field is not required but it is strongly encouraged so people know exactly what they are voting on.
* Poll Index: The address of the index account to send the poll. By default a public one is set.
* Date of Ending: The date and time the poll will end and no more votes will be counted.
* Multiple: you can choose whether or not the vote will allow multiple options. In this case vote weights will be split between the different options a voter chooses.
* Type: The type of vote counting (details below.)
* Options: The options voters will be able to choose from.
* Whitelist: This is only used for white list polls, where only votes from the specified addresses will be accepted.

When creating a poll the user can specify the way votes will be weighted. Currently there are two options:
* POI: Proof of Importance is a great tool for weighing the votes on polls, especially those that affect the NEM community. In the voting platform we make it possible to use the importance score, intrinsic to NEM, to weight votes in a simple way.
* White List: On simple polls every vote counts the same. A whitelist is required for this type since anybody can create as many NEM accounts as they want.
