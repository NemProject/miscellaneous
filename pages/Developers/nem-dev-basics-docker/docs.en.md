---
title: 'NEM Dev Basics (Docker)'
parent: Developer resources
nav_order: 15
has_children: true
has_toc: false
taxonomy:
    category:
        - docs
---

This guide is a work in progress, and its organisation might evolve significantly. This page should however give an up to date
overview of to use it.

## Help improve the guide

Every page of this guide is editable by everyone in the web browser on Github thanks to the link "Edit this page" in the upper right corner.
Clicking this link will lead you to Github, asking you to [fork the repository](https://help.github.com/articles/fork-a-repo/) to edit the page.
After you save your changes in your own copy
of the repository, you can send a [pull request](https://help.github.com/articles/about-pull-requests/) to have your changes included in the guide.
Help us improve this guide!

## Tools

Here are the tools we will use in this guide. They are all integrated in the Docker image accompanying this guide.

### httpie
We will use [httpie](https://httpie.org/) to interact with the NEM Infrastructure Server. It provides easy specification of
[query string parameters](https://httpie.org/doc#querystring-parameters), [URL shortcuts for localhost](https://httpie.org/doc#url-shortcuts-for-localhost)
 (which will shorten your typing if your NIS is listening on localhost, as it is the case if you use the guide's docker image described below) and
many other goodies. Check its [documentation](https://httpie.org/doc) for more details.

httpie also outputs colored and readable information about the request and its response. Example in this guide will include httpie's output
when relevant. As an example, here is the output when querying google.com, where you can see the first line is the command executed, then comes the request, followed by the response headers and the response body:

```http
$ http google.com

GET / HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: google.com
User-Agent: HTTPie/0.9.2

HTTP/1.1 302 Found
Cache-Control: private
Content-Length: 256
Content-Type: text/html; charset=UTF-8
Date: Thu, 30 Mar 2017 19:14:26 GMT
Location: http://www.google.be/?gfe_rd=cr&ei=ElndWMabDZPVXuW1j5AG

<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>302 Moved</TITLE></HEAD><BODY>
<H1>302 Moved</H1>
The document has moved
<A HREF="http://www.google.be/?gfe_rd=cr&amp;ei=ElndWMabDZPVXuW1j5AG">here</A>.
</BODY></HTML>
```

> You can pass POST data on the command line as key-value pairs. For string value, separate key and value with `=`, for non-string values like integer, use `:=`.


### Insomnia

[Insomnia](https://insomnia.rest/) is a great cross platform graphical REST client. Check it out, it might help you greatly in your development workflow.

### nodejs and nem-sdk

[nem-sdk](https://github.com/QuantumMechanics/NEM-sdk) is a javascript Nem library.

### Typescript and nem-library

[nem-library](https://nemlibrary.com/) is an abstraction for NEM Blockchain using a Reactive approach for creating Blockchain applications. It is included in the tools container. Just open the Typescript repl with `./ndev ts-node`.

An incompatibility between ts-node and typescript currently requires you to initialise an variable `exports` to and empty hash like so:
```
exports = {}
```
I have also discovered the need to have `import` instructions consist of only one line.
This will work
```
import {Account, MultisigTransaction, TimeWindow, Transaction, TransactionTypes} from "nem-library";
```
but this won't (in ts-node):
```
import {Account, MultisigTransaction, TimeWindow, 
        Transaction, TransactionTypes} from "nem-library";
```

You can also use tsc inside the container to compile your typescript to javascript and then run it with nodejs:
```
tsc mycode.ts
node mycode.js
```


### jq

[jq](https://stedolan.github.io/jq/) is a command line JSON processor. It comes very handy for scripting and quick validations.

### mitmproxy
[mitmproxy](https://mitmproxy.org/) is a intercept and inspect traffic flows. [mitmweb](http://docs.mitmproxy.org/en/stable/mitmweb.html) provides a web interface providing easy access to information required in debugging sessions.

## Docker config

Two containers are accompanying this developer guide, one running only NIS on the testnet, the other proposing all other tools like mitm and nem-sdk.
As both containers are meant to always run together, a [docker-compose configuration file](https://github.com/rb2nem/nem-dev-guide/blob/master/docker/docker-compose.yml) is available. 
Both images are based on Ubuntu.

In the NIS container, NIS is started by [supervisord](http://www.supervisord.org). The NIS data is stored under /var/lib/nem, and the logs are available at 
`/var/log/nis-stderr.log` and `/var/log/nis-stdout.log`.

### Using the docker config

A helper script `ndev` [is available](https://github.com/rb2nem/nem-dev-guide/blob/master/docker/ndev). This section will give an overview on its usage.

Start by downloading the script in a working directory, for example `nem-dev`, and make it executable:

```
mkdir nem-dev
cd nem-dev
curl -q https://raw.githubusercontent.com/rb2nem/nem-dev-guide/master/docker/ndev > ndev
chmod +x ndev
```

Running the script with `--help` will give you an overview of all its options. We'll take a look at the most used options.

Before running the script, create a directory where the container will store its persistent data. This is needed to 
avoid a full blockchain download at every update of the image. This directory will also hold the network traces automatically
captured with tcpdump in the nis container.

The first time you run the script, it will:

* check if its settings.sh file exists, and create it if needed. The user is prompted for values to be provided.
* check if the required docker-compose.yml file is present, and download it [from github](https://github.com/rb2nem/nem-dev-guide/blob/master/docker/docker-compose.yml) if needed
* Download docker [images from the DockerHub](https://hub.docker.com/r/rb2nem/nem-dev-guide/)

If you run the script without any argument, it will start the containers in background.

To check that the containers are running, you use `./ndev --status`.
You can also run a command in the containers, by passing the command as argument to `ndev`. By default, commands are executed 
in the tools container, where mitm is running.
Open a shell in the tools container: `ndev bash`.
You can select the container in which to run the command with the option `-c` or `--container`. To open a shell in the NIS container,
simply run `ndev -c nis bash`.

Processes in the containers are managed with [supervisord](http://supervisord.org/). You can manually control NIS. For example, to stop
nis, simply issue `ndev -c nis supervisorctl start nis`. To get an overview of the processes running in a container, user the command 
`supervisorctl status`, for example:

```
$ ./ndev -c nis supervisorctl status
nis                              RUNNING   pid 109, uptime 0:01:03
```
Only the tools container has ports mapped to the host. Port 7890 is mapped to the mitmweb process, which then sends the requests to 
the NIS process running in the other container. This makes it possible to inspect requests, as mitmweb exposes a web interface on 
port 8081 of the host, accessible at [http://127.0.0.1:8081](http://127.0.0.1:8081). If you get a blank page with Google Chrome, try with 
[Firefox](http://www.getfirefox.com).

You stop and remove the containers with `ndev --shutdown`. Be sure to copy any data you want to keep out of the cointainers before running this command!
