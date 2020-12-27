// START BRIDGE SERVER
var exec = require('child_process').execFile;

var fun =function(){
   console.log("Bridge server started...");
   exec(__dirname + '/modules/nem-ledger-bridge/nem-ledger-bridge', function(err, data) {
        console.log(err)
        console.log(data.toString());
    });
}

fun();

// OPEN BROWSER
var opn = require('opn');

// opens the url in the default browser
opn(__dirname + '/start.html');
