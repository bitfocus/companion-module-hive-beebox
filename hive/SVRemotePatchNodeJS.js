const WebSocket = require('ws')
const util = require('util');
var lastErrorTime = Date.now();
var lastCloseTime = Date.now();

class SVRemotePatch {
    constructor() {
        this.webSocket = null;
        this.url = null;

        this.connected = false;

        this.handlers = {};

        this.onConnectCallback = null;
        this.onDisconnectCallback = null;
    }

    SetHandler(cmdName, handlerFunc) {
        this.handlers[cmdName] = handlerFunc;
    }

    SetOnConnectCallback(connectCallback) {
        this.onConnectCallback = connectCallback;
    }

    SetOnDisconnectCallback(disconnectCallback) {
        this.onDisconnectCallback = disconnectCallback;
    }

    connectTo(url) {
        if (this.webSocket)
            return;

        this.webSocket = new WebSocket(url);
        this.url = url;

        this.connectTime = Date.now();

        var self = this;

        // Log errors
        this.webSocket.onerror = function (error) {
            //console.log('this.connectTime = ' + Date.now() + " lastErrorTime = " + lastErrorTime);

            if (Date.now() - lastErrorTime > 1000) {
                lastErrorTime = Date.now();

                if (error.error && error.error.code === "ECONNREFUSED")
                    console.log("Connection to " + this.url + " refused");
                else
                    console.log('SVRemotePatch webSocket Error ' + util.inspect(error));
            }
        };

        //handle GetAPIMethods from the server
        this.webSocket.onmessage = function (msg) {
            var data = JSON.parse(msg.data);

            var handled = false;
            if (data.apiVersion == 1.0) {
                if (data.name == "GetAPIMethods") {
                    //expecting a string to come back
                    if (typeof (data.ret.Value) == 'string') {
                        handled = true;
                        //these two calls will fill out
                        //our 'self' (SVRemotePatch) with method
                        //definitions for all the methods on the server
                        var f = new Function('remoteMethods', data.ret.Value);

                        //one of the things this call is expected to do is
                        //re-assign the webSocket.onmessage handler to
                        //a new handler that can deal with all the potential
                        //replies the server may send back in response to
                        //the various methods called by the client
                        f(self);

                        console.log('GetAPIMethods OK, connected to remote SV patch');
                        self.connected = true;
                        if (self.onConnectCallback)
                            self.onConnectCallback();
                    }
                }
            }

            if (handled == false) {
                console.log('SVRemotePatch - unhandled server message: ' + util.inspect(data));
            }
        };

        this.webSocket.onopen = function (e) {
            //first thing to do when connected is inquire about the remote methods
            //this sends the request, the response will be handled above in 'onmessage'
            console.log('Connecting to remote SV patch');

            var cmd = {}
            cmd.apiVersion = 1.0;
            cmd.name = "GetAPIMethods";

            self.webSocket.send(JSON.stringify(cmd));
        }

        this.webSocket.onclose = (e) => {
            //forget about this closed connection
            this.webSocket = null;
            this.connected = false;

            if (this.onDisconnectCallback)
                this.onDisconnectCallback();

            //reconnect

            if (this.connectTime - lastCloseTime > 1000) {
                lastCloseTime = Date.now();
                console.log('SVRemotePatch connection closed, reconnecting to ' + this.url);
                //console.log('this.connectTime = ' + this.connectTime + " lastCloseTime = " + lastCloseTime);
            }

            this.connectTo(this.url);
        }

        //this.webSocket.open();
    }
}

exports = module.exports = SVRemotePatch;