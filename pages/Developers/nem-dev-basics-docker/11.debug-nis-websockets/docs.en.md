---
title: 'Debugging NIS and Websockets'
parent: 'NEM Dev Basics (Docker)'
grand_parent: Developer resources
nav_order: 11
taxonomy:
    category:
        - docs
---

## Debugging REST API requests
The docker environment accompanying this guide provides [mitmweb](http://docs.mitmproxy.org/en/stable/mitmweb.html) to inspect requests sent to
the NIS instance running in the container. This section will show how to use it.

We will send requests to out NIS in the [ruby language](http://www.ruby-lang.org), using the [rest-client gem](http://www.rubydoc.info/github/rest-client/rest-client).
We will try to get the block at the current height, which, as we have already seen, is obtained by sending a POST request to `/block/public/at` with 
a JSON payload telling the height of the block we want to retrieve. 

According to the documentation of rest-client this is done easily. We will do it in the interactive ruby interpreter that can be
started with the command `irb` in the tools container. Once in the interpreter, we type

``` ruby
require 'rest-client'
RestClient.post 'http://localhost:7890/block/at/public', {'height': '243'}
```

This however returns an error message:

```
RestClient::InternalServerError: 500 Internal Server Error
	from /var/lib/gems/2.3.0/gems/rest-client-2.0.2/lib/restclient/abstract_response.rb:223:in `exception_with_response'
	from /var/lib/gems/2.3.0/gems/rest-client-2.0.2/lib/restclient/abstract_response.rb:103:in `return!'
	from /var/lib/gems/2.3.0/gems/rest-client-2.0.2/lib/restclient/request.rb:809:in `process_result'
	from /var/lib/gems/2.3.0/gems/rest-client-2.0.2/lib/restclient/request.rb:725:in `block in transmit'
	from /usr/lib/ruby/2.3.0/net/http.rb:853:in `start'
	from /var/lib/gems/2.3.0/gems/rest-client-2.0.2/lib/restclient/request.rb:715:in `transmit'
	from /var/lib/gems/2.3.0/gems/rest-client-2.0.2/lib/restclient/request.rb:145:in `execute'
	from /var/lib/gems/2.3.0/gems/rest-client-2.0.2/lib/restclient/request.rb:52:in `execute'
	from /var/lib/gems/2.3.0/gems/rest-client-2.0.2/lib/restclient.rb:71:in `post'
	from (irb):2
	from /usr/bin/irb:11:in `<main>'
```

This error message is not very helpful, so we might want to take a look at the mitmweb page available at [http://localhost:8081](http://localhost:8081) 
after you start containers with the script `ndev` [as explained ealier](/03-setting-up-environment).

Opening Mitmweb in your browser (use Firefox if you get a blank page in Google Chrome), and selecting the last request in the list,
you should see a page similar to this:
![](https://rb2nem.github.io/nem-dev-guide/images/debugging_mitmweb_overview.png)

The left pane lists the requests it has been intercepted (2 in this case), and
the right pane gives you a detailed view of the request and response headers.
The User-Agent header shows this request has been sent by rest-client to the
host nemdevnis (the container running our NIS instance) with a content type
header `application/x-www-form-urlencoded`.

Clicking on the Response link of the right tab shows this:
![](https://rb2nem.github.io/nem-dev-guide/images/debugging_mitmweb_step1_response.png)
This is already much more informative. It means our request sent its data in an encoding not supported
by the server.

We can fix this by setting the content type header to json and ensure we send a json payload:
``` ruby
require 'rest-client'
require 'json'
RestClient.post 'http://localhost:7890/block/at/public', {'height': '243'}.to_json, {content_type: :json, accept: :json}
```
This still yields an error in  ruby, which is not much clearer:
```
RestClient::InternalServerError: 500 Internal Server Error
	from /var/lib/gems/2.3.0/gems/rest-client-2.0.2/lib/restclient/abstract_response.rb:223:in `exception_with_response'
	from /var/lib/gems/2.3.0/gems/rest-client-2.0.2/lib/restclient/abstract_response.rb:103:in `return!'
	from /var/lib/gems/2.3.0/gems/rest-client-2.0.2/lib/restclient/request.rb:809:in `process_result'
	from /var/lib/gems/2.3.0/gems/rest-client-2.0.2/lib/restclient/request.rb:725:in `block in transmit'
	from /usr/lib/ruby/2.3.0/net/http.rb:853:in `start'
	from /var/lib/gems/2.3.0/gems/rest-client-2.0.2/lib/restclient/request.rb:715:in `transmit'
	from /var/lib/gems/2.3.0/gems/rest-client-2.0.2/lib/restclient/request.rb:145:in `execute'
	from /var/lib/gems/2.3.0/gems/rest-client-2.0.2/lib/restclient/request.rb:52:in `execute'
	from /var/lib/gems/2.3.0/gems/rest-client-2.0.2/lib/restclient.rb:71:in `post'
	from (irb):10
	from /usr/bin/irb:11:in `<main>'
```

![](https://rb2nem.github.io/nem-dev-guide/images/debugging_mitmweb_response_property_value.png)
It reports a incompatible value for the property height. Looking at the request details, we have:
![](https://rb2nem.github.io/nem-dev-guide/images/debugging_mitmweb_request_details.png)
We see at the bottom that the text passed as value is valid JSON. If we don't see what's wrong here, 
we can send the same request with a tool that gave a succesful response. In our case, this is [a request
we already sent](/04-blockchain-requests/#getting-a-block-at-height-post-block-at-public) with httpie.
We know that issuing the command `http :7890/block/at/public height:=243` yields a successful result.
Let's just issue that command and look at the request headers. Here are the details of the request sent by
httpie:
![](https://rb2nem.github.io/nem-dev-guide/images/debugging_mitmweb_httpie_request.png)
Did you spot the difference? Httpie sent
``` json
{
    "height": 243
}
```
while with rest-client we sent:
``` json
{
    "height": "243"
}
```
We send the value of the `height` property as a string, whereas it should be an integer.
Let's see if this fixes our problem:
``` ruby
require 'rest-client'
require 'json'
resp=RestClient.post 'http://localhost:7890/block/at/public', {'height': 243}.to_json, {content_type: :json, accept: :json}
=> <RestClient::Response 200 "{\"timeStamp...">
```
Sure enough! We now successfully debugged and sent a request from Ruby.

## Debugging Websockets
Debugging websockets is not as accessible as debugging your HTTP requests. There's no perfect solution, and we will debug 
websocket connections with the Google Chrome console, as well as with Wireshark. None of these is great to debug websockets,
but combining both tools might help you get forward.

In this section, we will not open websocket connections ourselves, but we will see how to observe the traffic on the websocket
connections opened by the NanoWallet.

### With Google Chrome

You can open the Google Chrome inspctor by pressing CTRL-SHIFT-I. In the Inspector, select the `Network` tab (surrounded in screenshot), and select to only 
display websockets by clicking on `WS` (indicated by the red arrow in the screenshot).
If you open the inpector on a page that is loaded, you will have to reload the page as indicated:
![Chrome Inspector Overview](https://rb2nem.github.io/nem-dev-guide/images/debugging_chrome_inspector.png)

When you login to the NanoWallet with the Inspector open and with the filter displaying only websocket connections, you will see
a websocket connection established:

![Websocket Connection opened](https://rb2nem.github.io/nem-dev-guide/images/debugging_ws_open.png)

By selecting the connection in the list, you can take a closer look to the connection. By default,
the detailed view of the connection open on the headers tab showing all headers of the connection, both for request and response:

![Websocket Connection Headers](https://rb2nem.github.io/nem-dev-guide/images/debugging_ws_headers.png)

The websocket connection is a persistent connection over which multiple data frames are exchanged. Luckily, the inspector lets
us take a close look at the frames exchanged. Selecting the Frames tab gives you a list of frames exchanged over the connection.
This list is updated automatically as new frames are exchanged:

![Websocket Connection Frames](https://rb2nem.github.io/nem-dev-guide/images/debugging_ws_frames.png)

Let's focus a bit on the frames list after opening a wallet in the NanoWallet client:
![Websocket Connection Frames List](https://rb2nem.github.io/nem-dev-guide/images/debugging_ws_frames_list.png)

Outgoing messages have a light-green background, incoming messages have a white background. WebSocket opcodes are light-yellow
and errors are light-red (from the [Google Chrome documentation](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference#frames)).

We see that we send a frame to connected, and we get confirmation that we have successfully connected.

After that, the NanoWallet client subscribes to multiple notifications. We see a total of 9 subscriptions
(sub-0 to sub-9) for information regarding the account `TA6XFSJYZYAIYP7FL7X2RL63647FRMB65YC6CO3G` like
transactions, mosaics, namespaces. There are also global subscriptions for errors and new blocks. Subscription
related information have been highlighted in red in the screenshot.

In addition to subscriptions, some other frames are sent to request information about the account. Subscriptions
will only get messages sent when an update is available, but the NanoWallet client needs to retrieve that information
to display the current status of the account. This is done by sending SEND command messages. The information regarding these 
requests are highlighted in blue in the screenshot. We see that the information requested covers the account details, 
the transactions of that account, as well as the mosaics and namespaces.

Following that are some frames received in relation with the 9 subscriptions just created. The first MESSAGE
received is part of `sub-0`

Selecting a frame in that list will display its content:
![Websocket Frame Details](https://rb2nem.github.io/nem-dev-guide/images/debugging_ws_details.png)

But here is the result is far from great. The frame's content is just displayed on one line, which does not ease 
reading and analysing the frame....

Advanced socket information can be gathered from the Google Chrome internal socket details available 
at [chrome://net-internals/#sockets](chrome://net-internals/#sockets), but this is out of scope for this guide.

### With Wireshark

The container nis container provided with this guide automatically collects traces of the network traffic to and from
the NIS instance it runs. The traces are stored in the `traces` subdirectory of the directory you configured as the location
for the persistent data. See the variable `persistent_location` in the file `settings.sh` in the same location as the `ndev` 
executable used to control the containers.

Two traces are captured: `nis.pcap` for traffic on port 7890 (http requests) and `ws.pcap` for traffic on port 7778 (websockets).
We will use the ws.pcap file to observe websocket traffic.

A great tool to analyse the traces captured is [Wireshark](https://www.wireshark.org/), and this is what we will use.
It is free software, available for Linux, Mac and Windows.

When you start Wireshark, you will not start a live capture but open the existing capture file available in the persistent
location you configured. But as that file is continuously updated, you will git this error:
![Wireshark Warning](https://rb2nem.github.io/nem-dev-guide/images/debugging_wireshark_truncated_file.png)

This is not a problem for our analysis, it just means that we have openen a file in which the last packet was not completely
written to disk. All packets in the trace are usable though, and will give us a detailed view on the websocket traffic.

When you open the traces file, you get something like this:
![Wireshark Window](https://rb2nem.github.io/nem-dev-guide/images/debugging_wireshark_overview.png)
Each line is a TCP packet, and aggregated views for supported protocols (like HTTP, websocket, etc)  also have a line displayed.
We are only interested in websocket traffic, so we can filter to only display the lines of interest. Enter `websocket` in the
text field at the top of the list and press enter:
![Wireshark Filter](https://rb2nem.github.io/nem-dev-guide/images/debugging_wireshark_websocket_filter.png)
This result in the list only displaying websocket protocol information, offering a higher level view than the TCP packets,
in which we are not interested for our analysis.

As in our analysis with Google Chrome, we see the CONNECT packet sent by our browser:
![Websocket CONNECT](https://rb2nem.github.io/nem-dev-guide/images/debugging_wireshark_connect.png)
We know that this frame is sent by our client, so we deduce that the server address is 172.18.0.3, and the client address
is 172.18.0.2.
Following by the CONNECT request, we receive a CONNECTED message confirming our websocket connection is successfully established:
![Websocket CONNECTED](https://rb2nem.github.io/nem-dev-guide/images/debugging_wireshark_connected.png)

We also see the subscription request being sent:

![Websocket Connection Frames List](https://rb2nem.github.io/nem-dev-guide/images/debugging_wireshark_subscribe_one.png)

The first request is displayed individually, but the other subscription requests are grouped in one entry:
![Websocket Connection Frames List](https://rb2nem.github.io/nem-dev-guide/images/debugging_wireshark_subscribe_multiple.png)

After that are the SEND command sent by the client:
![Websocket SEND commands](https://rb2nem.github.io/nem-dev-guide/images/debugging_wireshark_send.png)
and the MESSAGEs received from the server:
![Websocket MESSAGE answers](https://rb2nem.github.io/nem-dev-guide/images/debugging_wireshark_message.png)

But here again, the display is not perfect, but this description should help you get up to speed regarding the debugging of
your websocket requests.
