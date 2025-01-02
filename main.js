const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdatePresets = require('./presets')
const UpdateVariableDefinitions = require('./variables')
const SVRemotePatch = require('./hive/SVRemotePatchNodeJS');

ipRegex = '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'

class HiveBeebladeInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
		this.localSVPatch = new SVRemotePatch(this);
		this.updateTimer = null;
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
			{ name: "movementspeed", type: "integer", label: "Movement Speed", min: 0, max: 100, default: 0.0, defaultstep: 1, path: `LAYER #/MOVEMENT SPEED/Value`, unit: "%" },
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
					{ value: 0, label: "Disabled" },
					{ value: 1, label: "Enabled" }
				], default: 1.0, path: `LAYER #/FRAME BLENDING/Value`, unit: ""
			},
			{ name: "transitionduration", type: "integer", label: "Transition Duration", min: 0, max: 65535, default: 0, defaultstep: 10, path: `LAYER #/TRANSITION DURATION/Value`, unit: "ms" },
			{
				name: "transitionmode", type: "select", label: "Transition Mode", options: [
					{ value: 0, label: "Alpha" },
					{ value: 1, label: "Additive" },
					{ value: 2, label: "Multiply" },
					{ value: 3, label: "Difference" },
					{ value: 4, label: "Screen" },
					{ value: 5, label: "Preserve Luma" },
					{ value: 6, label: "Rectangle Wipe" },
					{ value: 7, label: "Triangle Wipe" },
					{ value: 8, label: "Minimum" },
					{ value: 9, label: "Maximum" },
					{ value: 10, label: "Subtract" },
					{ value: 11, label: "Darken" },
					{ value: 12, label: "Lighten" },
					{ value: 13, label: "Soft Lighten" },
					{ value: 14, label: "Dark Lighten" },
					{ value: 15, label: "Exclusion" },
					{ value: 16, label: "Random" },
					{ value: 17, label: "Ripple" },
					{ value: 18, label: "Threshold" },
					{ value: 19, label: "Sine" },
					{ value: 20, label: "Invert Mask" },
					{ value: 21, label: "Noise" },
					{ value: 22, label: "Swirl" },
					{ value: 23, label: "Gradient" },
					{ value: 24, label: "Pixel Sort" },
					{ value: 25, label: "Checkerboard" },
					{ value: 26, label: "Pulse" },
					{ value: 27, label: "Hue Shift" },
					{ value: 28, label: "Fractal" },
					{ value: 29, label: "Waveform" },
					{ value: 30, label: "RGB Split" },
					{ value: 31, label: "Glitch" }

				], default: 0, path: `LAYER #/TRANSITION MODE/Value`, unit: ""
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
			vioso: null,
			playlistrow: 0,
			tiles: null
		}

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updatePresets() // export presets
		this.initializePatch(config.ip)

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

		if (this.updateTimer) {	// clear the timer
			clearInterval(this.updateTimer);
			this.updateTimer = null;
		}

		this.updateTimer = setInterval(this.updateDeiceInfo.bind(this), 2000);
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
		if (this.updateTimer) {	// clear the timer
			clearInterval(this.updateTimer);
			this.updateTimer = null;
		}
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

	updatePresets() {
		UpdatePresets(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	////////////////////// Hive Functions /////////////////////////////

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
			return this.calculateScaleFromNormalised(normalizedvalue);
		} else if (parameter.name == "playspeed") {
			return this.calculatePlaySpeedFromNormalised(normalizedvalue);
		} else {
			return this.parameterValueFromNormalised(parameter.min, parameter.max, normalizedvalue);
		}
	}

	normalisedValue(parameter, value) {
		if (parameter.name == "scale") {
			return this.normalizeScaleFromValue(value);
		} else if (parameter.name == "playspeed") {
			return this.normalizePlaySpeedFromValue(value);
		} else {
			return this.normalizeParameterValue(parameter.min, parameter.max, value);
		}
	}

	updateBlade() {
		if (!this.localSVPatch.connected) return;

		this.log('debug', 'Requesting latest data from Hive Device')

		this.localSVPatch.WatchPatchJSON("/Play List", (playlist) => {
			this.blade.playlist = playlist
			this.log('debug', 'Updated PlaylistData = ' + JSON.stringify(this.blade.playlist))
			this.setVariableValues({
				'playlistenabled': this.blade.playlist.usePlayList,
				'playlistrowcount': this.blade.playlist.list.length
			})
			this.checkFeedbacks('moduledisabled', 'moduleenabled')
		})

		this.localSVPatch.WatchPatchJSON("/Timeline", (timeline) => {
			this.blade.timeline = timeline
			this.log('debug', 'Updated TimelineData = ' + JSON.stringify(this.blade.timeline))
			this.setVariableValues({
				'timelineenabled': this.blade.timeline.useTimeline
			})
			this.checkFeedbacks('moduledisabled', 'moduleenabled')
		})

		this.localSVPatch.WatchPatchJSON("/Schedule", (schedule) => {
			this.blade.schedule = schedule
			this.log('debug', 'Updated ScheduleData = ' + JSON.stringify(this.blade.schedule))
			this.setVariableValues({
				'scheduleenabled': this.blade.schedule.useSchedule
			})
			this.checkFeedbacks('moduledisabled', 'moduleenabled')
		})

		this.localSVPatch.WatchPatchJSON("/Timecode Cue List", (timecode) => {
			this.blade.timecode = timecode
			this.log('debug', 'Updated Timecode Cue List Data = ' + JSON.stringify(this.blade.timecode))
			this.setVariableValues({
				'l1timecodeenabled': this.blade.timecode.layers[0].useCueList,
				'l2timecodeenabled': this.blade.timecode.layers[1].useCueList
			})
			this.checkFeedbacks('moduledisabled', 'moduleenabled')
		})

		this.localSVPatch.WatchPatchJSON("/Vioso WB Settings", (vioso) => {
			this.blade.vioso = vioso
			this.log('debug', 'Updated Vioso Data = ' + JSON.stringify(this.blade.vioso))
			this.setVariableValues({
				'visioenabled': this.blade.vioso.enabled,
				'viosoconfigmode': this.blade.vioso.calibrationMode
			})
			this.checkFeedbacks('moduledisabled', 'moduleenabled')
		})

		this.localSVPatch.WatchPatchJSON("/Screenberry WB Settings", (screenberry) => {
			this.blade.screenberry = screenberry
			this.log('debug', 'Updated Screenberry Data = ' + JSON.stringify(this.blade.screenberry))
			this.setVariableValues({
				'screenberryenabled': this.blade.screenberry.enabled,
				'screenberryconfigmode': this.blade.screenberry.calibrationMode
			})
			this.checkFeedbacks('moduledisabled', 'moduleenabled')
		})

		this.localSVPatch.WatchPatchDouble("/Playlist Control/Playlist Controller 1/Row Index", (r) => {
			console.log("Reading playlist row");
			this.blade.playlistrow = r;
			this.setVariableValues({
				'playlistcurrentrow': r + 1
			})
			this.checkFeedbacks('playbackrow')
		});
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

	async customCommandToDevice(cmdStr, ip) {
		if (!ip) return;

		if (!this.localSVPatch.connected) return;

		if (cmdStr === "")
			return;

		if (cmdStr.includes("GetPatch") || cmdStr.includes("SetPatch") || cmdStr.includes("UpdatePatch")) {
			try {
				var completeCmdStr = `this.localSVPatch.` + cmdStr;
				this.log("info", "Running : " + completeCmdStr);
				eval(completeCmdStr);
			} catch (err) {
				this.log("error", "Error calling custom command api call on " + ip + " : " + err);
				console.log(err);
			}
		}
		else {
			this.postSystemCommandToDevice(cmdStr, ip);
		}
	}

	async postSystemCommandToDevice(cmdStr, ip) {
		if (!ip) return;
		try {
			let jsParams = {};
			let targetAPICommand = 'http://' + ip + '/api/runSystemCommand';
			let rtnJson = await fetch(targetAPICommand,
				{
					method: 'POST',
					body: JSON.stringify({
						"method": "Nectar_run_command",
						"cmd": cmdStr
					}),
					headers: { "Content-Type": "application/json" }
				});

			if (rtnJson.cmdExecutedOK) {
				this.log("info", "Command " + cmdStr + "executed OK on " + ip);
			}
			else {
				this.log("error", "Command " + cmdStr + "executed but Failed on " + ip);
			}
		}
		catch (err) {
			this.log("error", "Error calling run command api call on " + ip + " : " + err);
			console.log(err);
		}
	}

	// utility function to generate a random number
	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	calculatePlayheadTime(playlist, currentRowIndex, timeincurrent) {
		if (currentRowIndex >= 0 && currentRowIndex < playlist.list.length) {
			var sumPreviousMediaLength = 0.0;

			for (var i = 0; i < currentRowIndex; i++) {
				var duration = this.GetMediaFileDuration(playlist, i);
				sumPreviousMediaLength += parseFloat(duration);

				if (playlist.transitionDuration > 0.0)
					sumPreviousMediaLength -= playlist.transitionDuration;
			}

			var playHeadTime = sumPreviousMediaLength + timeincurrent;

			return playHeadTime;
		}
	}

	GetMediaFileDuration(playlist, iList) {
		if (playlist.list[iList].followAction >= 8 &&
			playlist.list[iList].followAction < 15) {
			return playlist.list[iList].num;
		}

		return playlist.list[iList].duration;
	}

	CalculatePlayListDuration(playlist) {
		var duration = 0.0;

		for (var i = 0; i < playlist.list.length; i++) {
			var filename = playlist.list[i].name;

			duration += this.GetMediaFileDuration(i);
		}

		playListAutoTransitionMode = (typeof playlist.transitionDuration === "undefined" ||
			playlist.transitionDuration === 0.0) ? false : true;

		if (playListAutoTransitionMode)
			duration -= (playlist.list.length - 1) * playlist.transitionDuration;

		return duration;
	}

	async updateDeiceInfo() {
		// return if not connected to the device
		if (!this.localSVPatch.connected) return;

		// get the tile list from the server
		let tileList = await this.GetTileListFromServer();
		if (tileList == null) {
			this.log("error", "Failed to get tile list from server");
			return;
		}
		this.blade.tiles = tileList;

		let isQueen = this.blade.tiles.tileList[0].beeType === 1

		this.setVariableValues(
			{
				'softwareversion': this.blade.tiles.hiveVersion,
				'nummediafiles': this.blade.tiles.tileList[0].nFiles,
				'beetype': isQueen ? "Queen" : "Worker",
				'devicename': this.blade.tiles.tileList[0].deviceName,
				'remainingstorage': Math.ceil(this.blade.tiles.tileList[0].osSpace / 1024 / 1024 / 1024),
				'numworkers': isQueen ? this.blade.tiles.tileList.length - 1 : 0,
				'status': this.blade.tiles.tileList[0].status
			}
		)
	}

	async GetTileListFromServer() {
		var jsParams = {};

		let tileList = await this.NectarAPICommand('/api/getTileList',
			{ method: 'POST', body: JSON.stringify(jsParams) });
		return tileList;
	}

	async NectarAPICommand(apiCommand, options, ipAddress = this.config.ip) {

		try {
			var targetAPICommand = 'http://' + ipAddress + apiCommand;
			var result = await fetch(targetAPICommand, options);
			return await result.json();
		} catch (error) {
			// Handle the error here
			console.error(error);
			return null;
		}
	}
}

runEntrypoint(HiveBeebladeInstance, UpgradeScripts)
