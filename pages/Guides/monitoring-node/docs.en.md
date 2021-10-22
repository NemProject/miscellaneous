---
title: 'Monitoring a Node'
parent: Guides
nav_order: 2
taxonomy:
    category:
        - docs
---

## Monitoring your node

NIS listens on port 7890, so a first way to monitor your node is to check that your server listens on that port.
As an example we will configure [UptimeRobot](https://uptimerobot.com/) to monitor that port. This should give you
the required information to configure any other monitoring solution.

It is possible to get information from a running nis by sending HTTP requests. Several URLS are handled.

Status URLs will give JSON-formatted answers, and their meaning is detailed in the [NIS API documentation](http://bob.nem.ninja/docs/#nemRequestResult).

Node URLs will give information on the node, such as the version that it is running.

### Status URL /heartbeat

You configure your monitoring solution to send requests to the url `http://YOUR_IP:7890/heartbeat`. A NIS instance
receiving this request will answer if the node is up and able to answer to requests.

In UptimeRobot, the form configuring a new monitor hence looks like this:
{{< figure src="/images/running_node_uptimerobot.png" title="UptimeRobot Monitor definition" >}}

### Status URL /status

The URL `/status` of your node returns a small JSON object giving some info on your node's status.
Check the NIS API documentation linked above for its meaning.

### Status URL /node/info

A request sent to that URL gets a JSON-formatted response, giving basic information on the node, such as its version
and the network it is running on (mainnet, testnet)
{{< httpie "code/running_node_info.html" >}}

### Status URL /node/extended-info

The extended-info URL gives a bit more information. Check for yourself if this is interesting to you:
{{< httpie "code/running_node_extended_info.html" >}}
