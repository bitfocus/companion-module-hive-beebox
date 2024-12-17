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
		// array of parameter descriptor objects
		// info calculated from HiveBuzzParameters.js on Hive Device version 1.0.308
		this.paramDescriptors = [
			{ name: "file", label: "File", type: "integer", min: 0, max: 1000, default: 0, defaultstep: 1, path: `LAYER #/FILE SELECT/Value`, unit: "" },
			{ name: "folder", label: "Folder", type: "integer", min: 0, max: 1000, default: 0.0, defaultstep: 1, path: `LAYER #/FOLDER SELECT/Value`, unit: "" },
			{ name: "intensity", label: "Intensity", type: "range", min: 0, max: 100, default: 1.0, defaultstep: 10, path: `LAYER #/INTENSITY/Value`, unit: "%" },
			{ name: "inframe", label: "In Frame", type: "integer", min: 0, max: 9999999, default: 0.0, defaultstep: 30, path: `LAYER #/IN FRAME/Value`, unit: "" },
			{ name: "outframe", label: "Out Frame", type: "integer", min: 0, max: 9999999, default: 9999999.0, defaultstep: 30, path: `LAYER #/OUT FRAME/Value`, unit: "" },
			{
				name: "playmode", type: "select", label: "Playmode", options: [
					{ value: 0, label: "In Frame" },
					{ value: 1, label: "Out Frame" },
					{ value: 2, label: "Loop Forwards" },
					{ value: 3, label: "Loop Reverse" },
					{ value: 4, label: "Play Once Forwards" },
					{ value: 5, label: "Play Once Reverse" },
					{ value: 6, label: "Stop" },
					{ value: 7, label: "Pause" },
					{ value: 8, label: "Bounce" },
					{ value: 9, label: "Take Over Frame" },
					{ value: 10, label: "Loop Forward Pause I=0" },
					{ value: 11, label: "Loop Reverse Pause I=0" },
					{ value: 12, label: "Play Once Forward Pause I=0" },
					{ value: 13, label: "Play Once Reverse Pause I=0" },
					{ value: 15, label: "Bounce Pause I=0" },
					{ value: 20, label: "Timecode Sync" },
					{ value: 40, label: "Loop Forward Re-Trigger I>0" },
					{ value: 41, label: "Loop Reverse Re-Trigger I>0" },
					{ value: 42, label: "Play Once Forward Re-Trigger I>0" },
					{ value: 43, label: "Play Once Reverse Re-Trigger I>0" },
					{ value: 45, label: "Bounce Re-Trigger I>0" }
				], default: 2, path: `LAYER #/PLAY MODE/Value`, unit: ""
			},
			{
				name: "framingmode", type: "select", label: "Framing Mode", options: [
					{ value: 0, label: "Letterbox" },
					{ value: 1, label: "Crop" },
					{ value: 2, label: "Stretch" },
					{ value: 3, label: "Multi Letterbox" },
					{ value: 4, label: "Centred" }
				], default: 0, path: `LAYER #/FRAMING MODE/Value`, unit: ""
			},
			{
				name: "blendmode", type: "select", label: "Blend Mode", options: [
					{ value: 0, label: "Alpha" },
					{ value: 1, label: "Additive" },
					{ value: 2, label: "Multiply" },
					{ value: 3, label: "Difference" },
					{ value: 4, label: "Screen" },
					{ value: 5, label: "Preserve Luma" },
					{ value: 6, label: "Rectangle Wipe" },
					{ value: 7, label: "Triangle Wipe" }
				], default: 0, path: `LAYER #/BLEND MODE/Value`, unit: ""
			},
			{ name: "lut", type: "integer", label: "L,U,T Select", min: 0, max: 100, default: 0.0, defaultstep: 1, path: `LAYER #/LUT/Value`, unit: "" },
			{ name: "playspeed", type: "range", label: "Play Speed", min: 0, max: 1000, default: 0.5, defaultstep: 10, path: `LAYER #/PLAY SPEED/Value`, unit: "%" },
			{ name: "movementspeed", type: "range", label: "Movement Speed", min: 0, max: 100, default: 0.0, defaultstep: 1, path: `LAYER #/MOVEMENT SPEED/Value`, unit: "%" },
			{ name: "tchour", type: "integer", label: "Timecode Hour", min: 0, max: 23, default: 0.0, defaultstep: 1, path: `LAYER #/MTC HOUR/Value`, unit: "hr" },
			{ name: "tcminute", type: "integer", label: "Timecode Minute", min: 0, max: 59, default: 0.0, defaultstep: 1, path: `LAYER #/MTC MINUTE/Value`, unit: "min" },
			{ name: "tcsecond", type: "integer", label: "Timecode Second", min: 0, max: 59, default: 0.0, defaultstep: 1, path: `LAYER #/MTC SECOND/Value`, unit: "sec" },
			{ name: "tcframe", type: "integer", label: "Timecode Frame", min: 0, max: 29, default: 0.0, defaultstep: 1, path: `LAYER #/MTC FRAME/Value`, unit: "fr" },
			{ name: "scale", type: "range", label: "Scale", min: 0, max: 1000, default: 0.5, defaultstep: 10, path: `LAYER #/SCALE/Value`, unit: "%" },
			{ name: "aspect", type: "range", label: "Aspect", min: 0, max: 100, default: 0.0, defaultstep: 1, path: `LAYER #/ASPECT RATIO/Value`, unit: "" },
			{ name: "posx", type: "range", label: "X Position", min: -100, max: 100, default: 0.5, defaultstep: 10, path: `LAYER #/POSITION X/Value`, unit: "%" },
			{ name: "posy", type: "range", label: "Y Position", min: -100, max: 100, default: 0.5, defaultstep: 10, path: `LAYER #/POSITION Y/Value`, unit: "%" },
			{ name: "rotx", type: "range", label: "X Rotation", min: -1440, max: 1440, default: 0.5, defaultstep: 10, path: `LAYER #/ROTATION X/Value`, unit: "deg" },
			{ name: "roty", type: "range", label: "Y Rotation", min: -1440, max: 1440, default: 0.5, defaultstep: 10, path: `LAYER #/ROTATION Y/Value`, unit: "deg" },
			{ name: "rotz", type: "range", label: "Z Rotation", min: -1440, max: 1440, default: 0.5, defaultstep: 10, path: `LAYER #/ROTATION Z/Value`, unit: "deg" },
			{ name: "red", type: "range", label: "Red", min: -100, max: 100, default: 0.5, defaultstep: 10, path: `LAYER #/RED/Value`, unit: "%" },
			{ name: "green", type: "range", label: "Green", min: -100, max: 100, default: 0.5, defaultstep: 10, path: `LAYER #/GREEN/Value`, unit: "%" },
			{ name: "blue", type: "range", label: "Blue", min: -100, max: 100, default: 0.5, defaultstep: 10, path: `LAYER #/BLUE/Value`, unit: "%" },
			{ name: "hue", type: "range", label: "HUE", min: 0, max: 100, default: 0.0, defaultstep: 1, path: `LAYER #/HUE/Value`, unit: "" },
			{ name: "saturation", type: "range", label: "Saturation", min: -100, max: 100, defaultstep: 1, default: 0.5, path: `LAYER #/SATURATION/Value`, unit: "" },
			{ name: "contrast", type: "range", label: "Contrast", min: -100, max: 100, default: 0.5, defaultstep: 1, path: `LAYER #/CONTRAST/Value`, unit: "" },
			{ name: "strobe", type: "range", label: "Strobe", min: 0, max: 100, default: 0.0, defaultstep: 10, path: `LAYER #/STROBE/Value`, unit: "" },
			{ name: "volume", type: "range", label: "Volume", min: 0, max: 100, default: 1.0, defaultstep: 10, path: `LAYER #/VOLUME/Value`, unit: "%" },
			{
				name: "frameblending", type: "select", label: "Frame Blending", options: [
					{ value: 0, label: "Enabled" },
					{ value: 1, label: "Disabled" }
				], default: 1.0, path: `LAYER #/FRAME BLENDING/Value`, unit: ""
			},
		];
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



	normalizeScaleFromValue(scale) {
		let newVal = 0.0;
		if (scale <= 100)
			newVal = (scale / 100.0) * 0.5; // 0 -> 0.5
		else
			newVal = 0.5 + (((scale - 100) / 900.0) * 0.5); // 0.5 -> 1.0

		return newVal;
	}

	calculateScaleFromNormalised(scalenormalised) {
		let newVal = 0.0;

		if (scalenormalised < 0.5)
			newVal = scalenormalised * 200.0; // 0..100
		else
			newVal = 100.0 + (((scalenormalised - 0.5) / 0.5) * 900.0); // 100.. 1000

		return Math.round(newVal);
	}

	normalizePlaySpeedFromValue(playspeed) {
		let newVal = 0.0;

		if (playspeed <= 100)
			newVal = (playspeed / 100.0) * 0.5; // 0 -> 0.5
		else
			newVal = 0.5 + (((playspeed - 100.0) / 900.0) * 0.5); // 0.5 -> 1.0

		return newVal;
	}

	calculatePlaySpeedFromNormalised(playspeednormalised) {
		var newVal = 0.0;

		if (playspeednormalised < 0.5)
			newVal = playspeednormalised * 200.0; // 0..100
		else
			newVal = 100.0 + (((playspeednormalised - 0.5) / 0.5) * 900.0); // 100.. 1000

		return Math.round(newVal);
	}

	normalizeParameterValue(min, max, value) {
		return (value - min) / (max - min);
	}

	parameterValueFromNormalised(min, max, normalisedvalue) {
		return Math.round((normalisedvalue * (max - min)) + min);
	}

	valueFromNormalised(parameter, normalizedvalue) {
		if (parameter.name == "scale") {
			return CalculateScaleFromNormalised(normalizedvalue);
		} else if (parameter.name == "playspeed") {
			return CalculatePlaySpeedFromNormalised(normalizedvalue);
		} else {
			return ParameterValueFromNormalised(parameter.min, parameter.max, normalizedvalue);
		}
	}

	normalisedValue(parameter, value) {
		if (parameter.name == "scale") {
			return NormalizeScaleFromValue(value);
		} else if (parameter.name == "playspeed") {
			return NormalizePlaySpeedFromValue(value);
		} else {
			return NormalizeParameterValue(parameter.min, parameter.max, value);
		}
	}

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
