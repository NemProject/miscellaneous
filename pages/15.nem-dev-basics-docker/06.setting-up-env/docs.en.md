---
title: 'Setting up Environment'
parent: 'NEM Dev Basics (Docker)'
nav_order: 6
taxonomy:
    category:
        - docs
---

In this chapter we'll start a NIS instance on the testnet, and we'll send it some requests. Let's start!

## Using the docker container

As explained in the description of the docker image, we can start it with this command
``` bash
nem:~$ ndev
```

We enter the container running NIS with

``` bash
nem:~$ ndev -c nis bash
```

This drops you in a bash shell running in the container, where a NIS instance has been started on the testnet. You can validate that NIS 
is running fine by running the command `ps aux` in the container. You should get an output similar to this:
~~~ text
root@adc93b7773f6:/# ps aux 
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.4  0.0  18240  3332 ?        Ss   13:09   0:00 bash
root        18  0.1  0.4  56200 15436 ?        Ss   13:09   0:00 /usr/bin/python /usr/bin/supervisord -c /etc/supervisord.conf
nem         23  305  8.3 3608648 320760 ?      Sl   13:09   0:15 java -Xms512M -Xmx1G -cp .:./*:../libs/* org.nem.deploy.CommonStarter
root        41  0.0  0.0  34424  2784 ?        R+   13:09   0:00 ps aux
~~~

This shows that NIS is running (this is the `java -Xms512M -Xmx1G ...` process).

You can access the logs of NIS at `/var/log/nis-stderr.log`. Running `tail /var/log/nis-stderr.log  -f` should give you
the latest logs of the NIS instance, with the ouput regularly updated with new log messages. The output should be similar 
to this:

``` text
root@adc93b7773f6:/# tail /var/log/nis-stderr.log  -f
2017-04-01 13:26:22.571 INFO synchronizing with Node [TD52ELTYWFPK5F3ZXPOCH3UNJLF7YKA6JQKLO5O6 <TD52ELTYWFPK5F3ZXPOCH3UNJLF7YKA6JQKLO5O6>] @ [31.172.137.115] finished (org.nem.peer.services.NodeSynchronizer b)
2017-04-01 13:26:25.572 INFO synchronizing with Node [Hi, I am MedAlice2 <TALIC37AGCDGQIBK3Y2IPFHSRAJ4HLJPNJDTSTJ7>] @ [23.228.67.85] (org.nem.peer.services.NodeSynchronizer b)
2017-04-01 13:26:27.737 INFO received 400 blocks (11 transactions) in 892 ms from remote (81090 ?s/tx) (org.nem.nis.sync.BlockChainUpdater c)
2017-04-01 13:26:27.958 INFO clustering completed: { clusters: 1 (average size: 5.00), hubs: 0, outliers: 255 } (org.nem.nis.pox.poi.PoiContext$AccountProcessor dh)
2017-04-01 13:26:27.960 INFO Iterations required: 4; converged?: true (org.nem.nis.cx.na.rgm run)
2017-04-01 13:26:27.960 INFO POI iterator needed 1ms. (org.nem.nis.pox.poi.PoiImportanceCalculator c)
2017-04-01 13:26:28.036 INFO validated 400 blocks (11 transactions) in 296 ms (26909 ?s/tx) (org.nem.nis.sync.BlockChainUpdateContext fz)
2017-04-01 13:26:28.036 INFO new block's score: 6066380584749751 (org.nem.nis.sync.BlockChainUpdateContext a)
2017-04-01 13:26:28.208 INFO chain update of 400 blocks (11 transactions) needed 172 ms (15636 ?s/tx) (org.nem.nis.sync.BlockChainUpdateContext fz)
2017-04-01 13:26:28.223 INFO synchronizing with Node [Hi, I am MedAlice2 <TALIC37AGCDGQIBK3Y2IPFHSRAJ4HLJPNJDTSTJ7>] @ [23.228.67.85] finished (org.nem.peer.services.NodeSynchronizer b)
2017-04-01 13:26:31.223 INFO synchronizing with Node [Hi, I am BigAlice2 <TALICEQPBXSNJCZBCF7ZSLLXUBGUESKY5MZIA2IY>] @ [104.128.226.60] (org.nem.peer.services.NodeSynchronizer b)
2017-04-01 13:26:32.152 INFO received 400 blocks (0 transactions) in 407 ms from remote (0 ?s/tx) (org.nem.nis.sync.BlockChainUpdater c)
2017-04-01 13:26:32.344 INFO clustering completed: { clusters: 1 (average size: 5.00), hubs: 0, outliers: 255 } (org.nem.nis.pox.poi.PoiContext$AccountProcessor dh)
2017-04-01 13:26:32.345 INFO Iterations required: 4; converged?: true (org.nem.nis.cx.na.rgm run)
2017-04-01 13:26:32.345 INFO POI iterator needed 0ms. (org.nem.nis.pox.poi.PoiImportanceCalculator c)
2017-04-01 13:26:32.436 INFO validated 400 blocks (0 transactions) in 281 ms (0 ?s/tx) (org.nem.nis.sync.BlockChainUpdateContext fz)
2017-04-01 13:26:32.436 INFO new block's score: 5957781278529360 (org.nem.nis.sync.BlockChainUpdateContext a)
2017-04-01 13:26:32.600 INFO chain update of 400 blocks (0 transactions) needed 164 ms (0 ?s/tx) (org.nem.nis.sync.BlockChainUpdateContext fz)
2017-04-01 13:26:32.618 INFO synchronizing with Node [Hi, I am BigAlice2 <TALICEQPBXSNJCZBCF7ZSLLXUBGUESKY5MZIA2IY>] @ [104.128.226.60] finished (org.nem.peer.services.NodeSynchronizer b)

```
We see here that our NIS instance is communicating with other instances (`synchronizing with Node [Hi, I am MedAlice2...`), downloading blocks (`received 400 blocks`), validating downloaded blocks (`validated 400 blocks`), updating the blockchain with validated blocks (`chain update of 400 blocks`), etc


> Should you wish to start the containers without starting NIS, you can do that by passing `--no-nis` as first argument to the ndev command.



## First request

As our NIS instance is up and running, we can send our first request to it. We can send request to the NIS instance on port 7890 of localhost, 
from the host or from the tools container.

We'll use [httpie](https://httpie.org/), which is already installed in the tools.
Our first request will be to [get the status](http://bob.nem.ninja/docs/#status-request)  of the NIS instance with a `GET` request to `/status`. Here's the result:

```http
$ http :7890/status

GET /status HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:7890
User-Agent: HTTPie/0.9.2

HTTP/1.1 200 OK
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Origin: *
Content-Encoding: gzip
Content-Type: application/json
Server: Jetty(9.2.11.v20150529)
Transfer-Encoding: chunked
Vary: Accept-Encoding, User-Agent

{
    "code": 5, 
    "message": "status", 
    "type": 4
}
```

As usual, this excerpt shows the command executed a well as the request and response headers and body (this will not be repeated in the rest of the document).
The request is sent to `:7890/status`, which is an httpie shortcut for path `/status` on port `7890` of `localhost`.
We get code 5, meaning the node is booted. Other possible [codes are described in the API reference documentation](http://bob.nem.ninja/docs/#status-request).
