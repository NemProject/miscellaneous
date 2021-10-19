---
title: 'Voting Module'
parent: NanoWallet
nav_order: 12
taxonomy:
    category:
        - docs
has_children: true
---

The NEM voting platform is a NanoWallet module that allows anyone to create and vote on polls stored on the NEM blockchain. The vote counting is done by the client with open source code so it is completely transparent. All the information is publicly available to everybody.

To create a poll, log into your NanoWallet and click on the Services tab at the top of the page.

Scroll down until you see the Voting Module and select Create Poll.
![](Poll.PNG)

This opens the Create a Poll page. Here you can name your poll, describe the rules, set an end date, and create the various options people will be voting on. Once you have defined all your parameters, enter your password and press the Create button to start the poll.

![](Poll2.PNG)

**Technical Details**

Account Structure of The module. Colored arrows are messages.
![](1-kQh38bgPVUgQ1XUeZwpcMg.png)

There are 4 main concepts on the data structure of the module:
1. Poll Index Account (PI)
2. Poll Account (PA)
3. Option Account (OA)
4. Voter Account (V)

When a poll is created the first thing that happens is the creation of a poll account. Then the creator sends all the poll information to the poll account as messages in NEM transactions. This information includes things like the title, the type, the description, etc.

Next, an option account is created for each of the options the poll has. A message is then sent to the poll account containing the addresses of all the option accounts, together with their descriptions.

If the previous steps have succeeded, now the poll is correctly formed and can start receiving votes, but first we will add it to a poll index. This is done by sending the index account some information abut the poll, but not all, so that it can be loaded faster. We call this the poll header, and it contains the address of the poll account, the title, the type, etc.

Now, after waiting for the message confirmations, the poll Is correctly formed and can be displayed and found on the poll index. You can now vote on it.

Each vote is sent as an empty NEM transaction to the chosen option account. The transaction doesn’t send any XEM or message, the cost of a vote is simply the fee (1 xem for normal votes, 7 xem for multisig votes.)

Anyone can create a new poll index. When creating a poll index a new NEM account is created, and two messages are sent by the creator. The first message is to the poll index, declaring it as such and sending information to it. Poll index information designates whether it is a private index, and if so, it has the address of the creator. 

The second message is sent to the creator account from itself containing the index’s address, so a user can find all the polls created by him/herself by looking at the self-sent messages.

Private indexes can be created, where only the creator of the index account can submit polls, and when seeing the poll list from such an index, all polls not created by the index owner will be ignored.

While the voting is still ongoing a temporary result is calculated pulling data from the current block in the blockchain. Once the poll ends the result is calculated from historical blockchain data.

**Additional Comments**

NEM plans to implement another type of vote counting in the future which will use mosaics to weight the votes. This will introduce interesting ways to create votes. For example if you have a company and you want to have an internal vote you can create a mosaic and distribute it. You could even send more mosaics to more important figures on the company. You could also have POS (proof of stake) counting by using XEM as the mosaic.

Special thanks to the whole Atraura team for helping with the development of the project.