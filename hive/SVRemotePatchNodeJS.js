const WebSocket = require('ws')
const util = require('util');
var lastErrorTime = Date.now();
var lastCloseTime = Date.now();

class SVRemotePatch {
    constructor(parent) {
        this.webSocket = null;
        this.url = null;
        this.parent = parent;

        this.connected = false;
        this.reconnect = false;

        this.handlers = {};
        this.reconnectTimer = null;

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

    tryReconnect() {
        if (this.connected)
            return;

        if (!this.reconnect)
            return;
        this.parent.log('debug', 'Attempting to connect to Hive Device');
        this.connectTo(this.url);
    }

    disconnect() {
        this.parent.log('debug', 'Disconnecting from Hive Device');
        if (this.reconnectTimer != null) {
            clearInterval(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        this.reconnect = false;
        if (this.webSocket)
            this.webSocket.close();
        this.webSocket = null;
        this.connected = false;
        this.parent.log('debug', 'Disconnected');
    }


    connectTo(url) {
        if (this.webSocket)
            return;
        this.parent.log('debug', 'Connecting to Hive Device');
        this.webSocket = new WebSocket(url);
        this.url = url;
        this.reconnect = true;

        if (this.reconnectTimer != null) {
            clearInterval(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        this.reconnectTimer = setInterval(this.tryReconnect.bind(this), 5000);

        this.connectTime = Date.now();

        var self = this;

        // Log errors
        this.webSocket.onerror = function (error) {
            //console.log('this.connectTime = ' + Date.now() + " lastErrorTime = " + lastErrorTime);

            if (Date.now() - lastErrorTime > 1000) {
                lastErrorTime = Date.now();

                if (error.error && error.error.code === "ECONNREFUSED") {
                    console.log("Connection to " + self.url + " refused");
                    self.parent.log('error', "Connection to " + self.url + " refused");
                }
                else {
                    console.log('SVRemotePatch webSocket Error ' + util.inspect(error));
                    self.parent.log('error', 'SVRemotePatch webSocket Error ' + util.inspect(error));
                }
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
            self.parent.log('info', 'Connection opened to Hive Device');

            var cmd = {}
            cmd.apiVersion = 1.0;
            cmd.name = "GetAPIMethods";

            self.webSocket.send(JSON.stringify(cmd));
        }

        this.webSocket.onclose = (e) => {
            this.parent.log('info', 'Connection closed to Hive Device');
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

            //this.connectTo(this.url);
        }

        //this.webSocket.open();
    }
}

exports = module.exports = SVRemotePatch;