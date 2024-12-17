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
		this.localSVPatch = new SVRemotePatch(this);
	}

	async init(config) {
		this.config = config
		this.blade = {
			playlist: null,
			timeline: null,
			timecode: null,
			schedule: null,
			screenberry: null,
			vioso: null
		}
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
			this.localSVPatch.disconnect()
		}

		this.updateStatus(InstanceStatus.Connecting, 'Connecting');

		this.localSVPatch.SetOnConnectCallback(() => {
			this.updateStatus(InstanceStatus.Ok, 'Connected');
			// get latest data
			this.updateBlade()
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
		if (this.localSVPatch.connected) {
			this.localSVPatch.disconnect()
		}
		this.updateStatus(InstanceStatus.Disconnected, 'Disconnected');
	}

	async configUpdated(config) {
		let connect = false;
		if (this.config.ip !== config.ip) {
			connect = true;
		}
		this.config = config

		if (connect) {
			this.initializePatch(config.ip)
		}
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

	///////////////////////Hive Functions ///////////////////////////

	updateBlade() {
		if (!this.localSVPatch.connected) return;

		this.log('debug', 'Requesting latest data from Hive Device')

		this.localSVPatch.WatchPatchJSON("/Play List", (playlist) => {
			this.blade.playlist = playlist
			this.log('debug', 'Updated PlaylistData = ' + JSON.stringify(this.blade.playlist))
			this.checkFeedbacks('moduledisabled', 'moduleenabled')
		})

		this.localSVPatch.WatchPatchJSON("/Timeline", (timeline) => {
			this.blade.timeline = timeline
			this.log('debug', 'Updated TimelineData = ' + JSON.stringify(this.blade.timeline))
			this.checkFeedbacks('moduledisabled', 'moduleenabled')
		})

		this.localSVPatch.WatchPatchJSON("/Schedule", (schedule) => {
			this.blade.schedule = schedule
			this.log('debug', 'Updated ScheduleData = ' + JSON.stringify(this.blade.schedule))
			this.checkFeedbacks('moduledisabled', 'moduleenabled')
		})

		this.localSVPatch.WatchPatchJSON("/Timecode Cue List", (timecode) => {
			this.blade.timecode = timecode
			this.log('debug', 'Updated Timecode Cue List Data = ' + JSON.stringify(this.blade.timecode))
			this.checkFeedbacks('moduledisabled', 'moduleenabled')
		})

		this.localSVPatch.WatchPatchJSON("/Vioso WB Settings", (vioso) => {
			this.blade.vioso = vioso
			this.log('debug', 'Updated Vioso Data = ' + JSON.stringify(this.blade.vioso))
			this.checkFeedbacks('moduledisabled', 'moduleenabled')
		})

		this.localSVPatch.WatchPatchJSON("/Screenberry WB Settings", (screenberry) => {
			this.blade.screenberry = screenberry
			this.log('debug', 'Updated Screenberry Data = ' + JSON.stringify(this.blade.screenberry))
			this.checkFeedbacks('moduledisabled', 'moduleenabled')
		})
	}


	setPlayListEnable(enable) {
		if (this.localSVPatch.connected)
			this.localSVPatch.UpdatePatchJSON("/Play List", [{ "op": "replace", "path": "/usePlayList", "value": enable ? 1 : 0 }])
	}

	getPlayList() {
		let playlist = null
		if (this.localSVPatch.connected)
			this.localSVPatch.GetPatchJSON("/Play List", (data) => {
				playlist = data
			})
	}

	setTimelineEnable(enable) {
		if (this.localSVPatch.connected)
			this.localSVPatch.UpdatePatchJSON("/Timeline", [{ "op": "replace", "path": "/useTimeline", "value": enable ? 1 : 0 }])
	}

	setScheduleEnable(enable) {
		if (this.localSVPatch.connected)
			this.localSVPatch.UpdatePatchJSON("/Schedule", [{ "op": "replace", "path": "/useSchedule", "value": enable ? 1 : 0 }])
	}

	setTimecodeEnable(enable, layer) {
		if (layer > 0 && layer) {
			layer = layer - 1
			if (this.localSVPatch.connected)
				this.localSVPatch.UpdatePatchJSON("/Timecode Cue List", [{ "op": "replace", "path": "/layers/" + layer + "/useCueList", "value": enable ? 1 : 0 }])
		}
	}

	setViosoEnable(enable) {
		if (this.localSVPatch.connected)
			this.localSVPatch.UpdatePatchJSON("/Vioso WB Settings", [{ "op": "replace", "path": "/enabled", "value": enable ? 1 : 0 }])
	}

	setViosoCalibrationEnable(enable) {
		if (this.localSVPatch.connected)
			this.localSVPatch.UpdatePatchJSON("/Vioso WB Settings", [{ "op": "replace", "path": "/calibrationMode", "value": enable ? 1 : 0 }])
	}

	setScreenberryEnable(enable) {
		if (this.localSVPatch.connected)
			this.localSVPatch.UpdatePatchJSON("/Screenberry WB Settings", [{ "op": "replace", "path": "/enabled", "value": enable ? 1 : 0 }])
	}

	setScreenberryCalibrationEnable(enable) {
		if (this.localSVPatch.connected)
			this.localSVPatch.UpdatePatchJSON("/Screenberry WB Settings", [{ "op": "replace", "path": "/calibrationMode", "value": enable ? 1 : 0 }])
	}
}

runEntrypoint(HiveBeebladeInstance, UpgradeScripts)
