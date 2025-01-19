const WebSocket = require('ws')
const util = require('util')
var lastErrorTime = Date.now()

class AutoReconnectingWebSocket {
	constructor(url, protocols, reconnectInterval = 3000, timeoutDuration = 5000, maxRetries = Infinity) {
		this.url = url
		this.protocols = protocols
		this.reconnectInterval = reconnectInterval
		this.timeoutDuration = timeoutDuration
		this.maxRetries = maxRetries

		this.websocket = null
		this.isClosed = false
		this.retries = 0
		this.timeout = null

		this.connect()
	}

	connect() {
		this.isClosed = false
		if (this.retries >= this.maxRetries) {
			console.error('Maximum reconnect attempts reached.')
			return
		}

		console.log('Attempting to connect...')
		this.websocket = new WebSocket(this.url, this.protocols)

		this.timeout = setTimeout(() => {
			if (this.websocket.readyState !== WebSocket.OPEN) {
				console.log('WebSocket connection timed out.')
				this.websocket.close() // Close the connection if timeout occurs
			}
		}, this.timeoutDuration)

		this.websocket.onopen = (event) => {
			clearTimeout(this.timeout)
			this.timeout = null
			console.log('WebSocket connected successfully.')
			this.retries = 0 // Reset retries on successful connection
			if (this.onopen) this.onopen(event)
		}

		this.websocket.onmessage = (event) => {
			if (this.onmessage) this.onmessage(event)
		}

		this.websocket.onerror = (event) => {
			clearTimeout(this.timeout)
			if (this.onerror) this.onerror(event)
		}

		this.websocket.onclose = (event) => {
			clearTimeout(this.timeout)

			if (!this.isClosed) {
				this.retries++
				console.log(`Reconnecting in ${this.reconnectInterval} ms...`)
				setTimeout(() => this.connect(), this.reconnectInterval)
			}

			if (this.onclose) this.onclose(event)
		}
	}

	reconnect() {
		if (!this.websocket) return

		if (this.timeout) {
			clearTimeout(this.timeout)
		}
		let event = {
			message: 'Network disconnect...socket connection lost',
			event: {},
		}

		this.websocket.terminate()
		this.websocket = null
		// if (this.onclose) this.onclose(event);
		this.retries = 0
		this.connect()
	}

	send(data) {
		if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
			this.websocket.send(data)
		} else {
			console.error('Cannot send data: WebSocket is not open.')
		}
	}

	close() {
		this.isClosed = true
		if (this.websocket) {
			this.websocket.close()
		}
	}
}

class SVRemotePatch {
	constructor(parent) {
		this.webSocket = null
		this.url = null
		this.parent = parent
		this.ip = ''

		this.connected = false

		this.functionsCreated = false

		this.handlers = {}

		this.onConnectCallback = null
		this.onDisconnectCallback = null
	}

	SetHandler(cmdName, handlerFunc) {
		this.handlers[cmdName] = handlerFunc
	}

	SetOnConnectCallback(connectCallback) {
		this.onConnectCallback = connectCallback
	}

	SetOnDisconnectCallback(disconnectCallback) {
		this.onDisconnectCallback = disconnectCallback
	}

	disconnect() {
		this.parent.log('debug', 'Disconnecting from Hive Device')
		if (this.webSocket) this.webSocket.close()
		this.webSocket = null
		this.connected = false
		this.parent.log('debug', 'Disconnected')
	}

	connectTo(ip) {
		if (this.webSocket) return
		this.ip = ip
		this.url = 'ws://' + this.ip + ':9002'
		this.parent.log('debug', 'Connecting to Hive Device')
		this.webSocket = new AutoReconnectingWebSocket(this.url, [], 3000, 1000)

		this.connectTime = Date.now()

		var self = this

		// Log errors
		this.webSocket.onerror = function (error) {
			if (Date.now() - lastErrorTime > 1000) {
				lastErrorTime = Date.now()

				if (error.error && error.error.code === 'ECONNREFUSED') {
					self.parent.log('error', 'Connection to ' + self.url + ' refused')
				} else {
					if (error.error.code) {
						self.parent.log('error', 'SVRemotePatch webSocket Error ' + util.inspect(error))
					} else {
						self.parent.log('debug', 'SVRemotePatch webSocket message ' + error.message)
					}
				}
			}
		}

		//handle GetAPIMethods from the server
		this.webSocket.onmessage = function (msg) {
			var data = JSON.parse(msg.data)

			var handled = false
			if (data.apiVersion == 1.0) {
				if (data.name == 'GetAPIMethods') {
					//expecting a string to come back
					if (typeof data.ret.Value == 'string') {
						handled = true
						//these two calls will fill out
						//our 'self' (SVRemotePatch) with method
						//definitions for all the methods on the server
						var f = new Function('remoteMethods', data.ret.Value)

						//one of the things this call is expected to do is
						//re-assign the webSocket.onmessage handler to
						//a new handler that can deal with all the potential
						//replies the server may send back in response to
						//the various methods called by the client
						f(self)

						console.log('GetAPIMethods OK, connected to remote SV patch')
						self.connected = true
						this.functionsCreated = true
						if (self.onConnectCallback) self.onConnectCallback()
					}
				}
			}

			if (handled == false) {
				console.log('SVRemotePatch - unhandled server message: ' + util.inspect(data))
			}
		}

		this.webSocket.onopen = function (e) {
			//first thing to do when connected is inquire about the remote methods
			//this sends the request, the response will be handled above in 'onmessage'
			console.log('Connecting to remote SV patch')
			self.parent.log('info', 'Connection opened to Hive Device')
			if (!this.functionsCreated) {
				var cmd = {}
				cmd.apiVersion = 1.0
				cmd.name = 'GetAPIMethods'
				self.webSocket.send(JSON.stringify(cmd))
			} else {
				self.connected = true
				if (self.onConnectCallback) self.onConnectCallback()
			}
		}

		this.webSocket.onclose = (e) => {
			if (this.connected === true) {
				this.parent.log('info', 'Connection closed to Hive Device')
				this.connected = false
			}

			if (this.onDisconnectCallback) this.onDisconnectCallback()
		}
	}
}

exports = module.exports = SVRemotePatch
