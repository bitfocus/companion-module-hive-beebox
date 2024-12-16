const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const SVRemotePatch = require('./hive/SVRemotePatchNodeJS');

ipRegex = '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'



class HiveBeebladeInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
		this.localSVPatch = new SVRemotePatch();
	}

	async init(config) {
		this.config = config
		this.initializePatch(config.ip)
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}

	initializePatch(ip) {

		//ip = "1.6.7";

		if (!ip || ip === '') {
			this.updateStatus(InstanceStatus.BadConfig, 'Missing device IP address');
			return;
		}

		if (!ip.match(new RegExp(ipRegex))) {
			this.updateStatus(InstanceStatus.BadConfig, 'Invalid or missing IP address');
			return;
		}

		if (this.localSVPatch.connected) {
			this.localSVPatch.webSocket.close();
		}

		this.updateStatus(InstanceStatus.Connecting, 'Connecting');

		this.localSVPatch.SetOnConnectCallback(() => {
			this.updateStatus(InstanceStatus.Ok, 'Connected');

		});

		this.localSVPatch.SetOnDisconnectCallback(() => {
			this.updateStatus(InstanceStatus.Disconnected, 'Disconnected');
		});

		this.log('debug', 'Connecting to ' + ip)

		this.localSVPatch.connectTo('ws://' + ip + ':9002');
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'ip',
				label: 'Device IP Address',
				tooltip: 'The IP address of the Beeblade or Beebox device',
				width: 8,
				regex: Regex.IP,
			}
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(HiveBeebladeInstance, UpgradeScripts)
