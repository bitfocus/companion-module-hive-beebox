module.exports = function (self) {
	let paramOptions = []
	self.paramDescriptors.forEach((param) => {
		paramOptions.push({ id: param.name, label: param.label })
	})

	let playmodeOptions = []
	self.paramDescriptors
		.find((param) => param.name === 'playmode')
		.options.forEach((par) => {
			playmodeOptions.push({ id: par.value, label: par.label })
		})

	let framingmodeOptions = []
	self.paramDescriptors
		.find((param) => param.name === 'framingmode')
		.options.forEach((par) => {
			framingmodeOptions.push({ id: par.value, label: par.label })
		})

	let blendmodeOptions = []
	self.paramDescriptors
		.find((param) => param.name === 'blendmode')
		.options.forEach((par) => {
			blendmodeOptions.push({ id: par.value, label: par.label })
		})

	let frameblendingOptions = []
	self.paramDescriptors
		.find((param) => param.name === 'frameblending')
		.options.forEach((par) => {
			frameblendingOptions.push({ id: par.value, label: par.label })
		})

	let transitionmodeOptions = []
	self.paramDescriptors
		.find((param) => param.name === 'transitionmode')
		.options.forEach((par) => {
			transitionmodeOptions.push({ id: par.value, label: par.label })
		})

	self.setActionDefinitions({
		enabledisablemodule: {
			name: 'Enable/Disable Module',
			options: [
				{
					id: 'module',
					type: 'dropdown',
					label: 'Select module',
					choices: [
						{ id: 'playlist', label: 'Playlist' },
						{ id: 'timeline', label: 'Timeline' },
						{ id: 'tc1', label: 'Timecode Cue List Layer 1' },
						{ id: 'tc2', label: 'Timecode Cue List Layer 2' },
						{ id: 'scheduler', label: 'Scheduler' },
						{ id: 'timeline', label: 'Timeline' },
						{ id: 'screenberry', label: 'Screenberry Mapping' },
						{ id: 'vioso', label: 'Vioso Mapping' },
						{ id: 'screenberrycal', label: 'Screenberry Calibration Mode' },
						{ id: 'viosocal', label: 'Vioso Calibration Mode' },
					],
					default: 'playlist',
				},
				{
					id: 'enable',
					type: 'checkbox',
					label: 'Enable ?',
					default: true,
				},
			],
			callback: async (event, context) => {
				self.log(
					'info',
					'Sending enable disable command, module=' + event.options.module + ' enable=' + event.options.enable,
				)
				switch (event.options.module) {
					case 'playlist':
						if (event.options.enable) {
							self.setTimecodeEnable(false, 1)
							self.setTimecodeEnable(false, 2)
							self.setTimelineEnable(false)
							self.setPlayListEnable(true)
						} else {
							self.setPlayListEnable(false)
						}
						break
					case 'timeline':
						if (event.options.enable) {
							self.setTimecodeEnable(false, 1)
							self.setTimecodeEnable(false, 2)
							self.setPlayListEnable(false)
							self.setTimelineEnable(true)
						} else {
							self.setTimelineEnable(false)
						}
						break
					case 'tc1':
						if (event.options.enable) {
							self.setTimelineEnable(false)
							self.setPlayListEnable(false)
							self.setTimecodeEnable(true, 1)
						} else {
							self.setTimecodeEnable(false, 1)
						}
						break
					case 'tc2':
						if (event.options.enable) {
							self.setTimelineEnable(false)
							self.setPlayListEnable(false)
							self.setTimecodeEnable(true, 2)
						} else {
							self.setTimecodeEnable(false, 2)
						}
						break
					case 'scheduler':
						self.setScheduleEnable(event.options.enable)
						break
					case 'screenberry':
						if (event.options.enable) {
							self.setViosoEnable(false)
							self.setScreenberryEnable(true)
						} else {
							self.setScreenberryEnable(false)
						}
						break
					case 'vioso':
						if (event.options.enable) {
							self.setScreenberryEnable(false)
							self.setViosoEnable(true)
						} else {
							self.setViosoEnable(false)
						}
						break
					case 'screenberrycal':
						if (event.options.enable) {
							self.setViosoCalibrationEnable(false)
							self.setScreenberryCalibrationEnable(true)
						} else {
							self.setScreenberryCalibrationEnable(false)
						}
						break
					case 'viosocal':
						if (event.options.enable) {
							self.setScreenberryCalibrationEnable(false)
							self.setViosoCalibrationEnable(true)
						} else {
							self.setViosoCalibrationEnable(false)
						}
						break
				}
			},
		},
		togglemodule: {
			name: 'Toggle Module State',
			options: [
				{
					id: 'module',
					type: 'dropdown',
					label: 'Select module',
					choices: [
						{ id: 'playlist', label: 'Playlist' },
						{ id: 'timeline', label: 'Timeline' },
						{ id: 'tc1', label: 'Timecode Cue List Layer 1' },
						{ id: 'tc2', label: 'Timecode Cue List Layer 2' },
						{ id: 'scheduler', label: 'Scheduler' },
						{ id: 'timeline', label: 'Timeline' },
						{ id: 'vioso', label: 'Vioso Mapping' },
						{ id: 'screenberry', label: 'Screenberry Mapping' },
						{ id: 'viosocal', label: 'Vioso Calibration Mode' },
						{ id: 'screenberrycal', label: 'Screenberry Calibration Mode' },
					],
					default: 'playlist',
				},
			],
			callback: async (event, context) => {
				self.log('info', 'Sending toggle state command, module=' + event.options.module)
				if (
					!self.blade.playlist ||
					!self.blade.timeline ||
					!self.blade.timecode ||
					!self.blade.schedule ||
					!self.blade.vioso ||
					!self.blade.screenberry
				) {
					self.log('error', 'Missing data, please check connection')
					return
				}
				switch (event.options.module) {
					case 'playlist':
						if (!self.blade.playlist.usePlayList) {
							self.setTimecodeEnable(false, 1)
							self.setTimecodeEnable(false, 2)
							self.setTimelineEnable(false)
							self.setPlayListEnable(true)
						} else {
							self.setPlayListEnable(false)
						}
						break
					case 'timeline':
						if (!self.blade.timeline.useTimeline) {
							self.setTimecodeEnable(false, 1)
							self.setTimecodeEnable(false, 2)
							self.setPlayListEnable(false)
							self.setTimelineEnable(true)
						} else {
							self.setTimelineEnable(false)
						}
						break
					case 'tc1':
						if (!self.blade.timecode.layers[0].useCueList) {
							self.setTimelineEnable(false)
							self.setPlayListEnable(false)
							self.setTimecodeEnable(true, 1)
						} else {
							self.setTimecodeEnable(false, 1)
						}
						break
					case 'tc2':
						if (!self.blade.timecode.layers[1].useCueList) {
							self.setTimelineEnable(false)
							self.setPlayListEnable(false)
							self.setTimecodeEnable(true, 2)
						} else {
							self.setTimecodeEnable(false, 2)
						}
						break
					case 'scheduler':
						self.setScheduleEnable(!self.blade.schedule.useSchedule)
						break
					case 'screenberry':
						if (!self.blade.screenberry.enabled) {
							self.setViosoEnable(false)
							self.setScreenberryEnable(true)
						} else {
							self.setScreenberryEnable(false)
						}
						break
					case 'vioso':
						if (!self.blade.vioso.enabled) {
							self.setScreenberryEnable(false)
							self.setViosoEnable(true)
						} else {
							self.setViosoEnable(false)
						}
						break
					case 'screenberrycal':
						if (!self.blade.screenberry.calibrationMode) {
							self.setViosoCalibrationEnable(false)
							self.setScreenberryCalibrationEnable(true)
						} else {
							self.setScreenberryCalibrationEnable(false)
						}
						break
					case 'viosocal':
						if (!self.blade.vioso.calibrationMode) {
							self.setScreenberryCalibrationEnable(false)
							self.setViosoCalibrationEnable(true)
						} else {
							self.setViosoCalibrationEnable(false)
						}
						break
				}
			},
		},
		loadmoduledata: {
			name: 'Load Module Data',
			options: [
				{
					id: 'module',
					type: 'dropdown',
					label: 'Select module',
					choices: [
						{ id: 'playlist', label: 'Playlist' },
						{ id: 'timeline', label: 'Timeline' },
						{ id: 'timecode', label: 'Timecode Cue List' },
						{ id: 'scheduler', label: 'Scheduler' },
						{ id: 'mapping', label: 'Mapping' },
						{ id: 'settings', label: 'System Settings' },
					],
					default: 'playlist',
				},
				{
					id: 'instructions0',
					type: 'static-text',
					label: 'Instructions:',
					value:
						'To set the data for a module in Hive you need to enter the data that you want to set in the text box below. This must be in JSON format and be formatted correctly for the module that it is intended for. This can be done in one of 2 ways :',
				},
				{
					id: 'instructions1',
					type: 'static-text',
					label: 'Learn The Data:',
					value:
						'The easiest way to get this data is to create the playlist / timeline/schedule/timecode cue list in the device and then press the "Learn" button in this panel, that will grab the data from the device and store it in this action, you can then change the settings on the device and learn those to another action etc..',
				},
				{
					id: 'instructions1',
					type: 'static-text',
					label: 'Get Data From Export:',
					value:
						'The other way to get this data is to export the settings from the appropriate module (by clicking export in the appropriate tab in the GUI) and then copying the contents of the downloaded file into the text box below.',
				},
				{
					id: 'instructions2',
					type: 'static-text',
					label: 'Export Example:',
					value:
						'If you want to load a playlist, create the playlist in the playlist tab in the Hive GUI, then click export in the top right - this will download a file called Hive_Playlist.json, now open this file in a text editor and copy all the contents to the clipboard, finally paste that content into the box below. Whenever you activate this action that playlist will get loaded into the playlist module.',
				},
				{
					id: 'data',
					type: 'textinput',
					label: 'Paste JSON data here',
					required: true,
					default: '',
				},
			],
			learn: (action) => {
				if (
					!self.blade.playlist ||
					!self.blade.timeline ||
					!self.blade.timecode ||
					!self.blade.schedule ||
					!self.blade.vioso ||
					!self.blade.screenberry ||
					!self.blade.settings ||
					!self.blade.mapping
				) {
					self.log('error', 'Missing data, please check connection')
					return false
				}

				let newData = {}
				switch (action.options.module) {
					case 'playlist':
						newData = JSON.stringify(self.blade.playlist)
						break
					case 'timeline':
						newData = JSON.stringify(self.blade.timeline)
						break
					case 'timecode':
						newData = JSON.stringify(self.blade.timecode)
						break
					case 'scheduler':
						newData = JSON.stringify(self.blade.schedule)
						break
					case 'mapping':
						newData = JSON.stringify(self.blade.mapping)
						break
					case 'settings':
						newData = JSON.stringify(self.blade.settings)
						break
				}
				return {
					...action.options,
					data: newData,
				}
			},
			callback: async (event, context) => {
				self.log('info', 'Loading data for module, module=' + event.options.module)
				if (event.options.data === '') {
					self.log('error', 'No data provided')
					return
				}

				let dataObj = {}
				try {
					dataObj = JSON.parse(event.options.data)
				} catch (e) {
					self.log('error', 'Data is not valid JSON')
					return false
				}

				if (self.localSVPatch.connected === false) {
					self.log('error', 'Not connected to device')
					return
				}

				switch (event.options.module) {
					case 'playlist':
						self.localSVPatch.SetPatchJSON('/Play List', dataObj)
						break
					case 'timeline':
						self.localSVPatch.SetPatchJSON('/Timeline', dataObj)
						break
					case 'timecode':
						self.localSVPatch.SetPatchJSON('/Timecode Cue List', dataObj)
						break
					case 'scheduler':
						self.localSVPatch.SetPatchJSON('/Schedule', dataObj)
						break
					case 'mapping':
						self.localSVPatch.SetPatchJSON('/Output Mapping', dataObj)
						break
					case 'mapping':
						self.localSVPatch.SetPatchJSON('/System Settings', dataObj)
						break
				}
			},
		},
		setparameter: {
			name: 'Set Parameter Value',
			options: [
				{
					id: 'parameter',
					type: 'dropdown',
					label: 'Select parameter',
					choices: paramOptions,
					default: 'file',
				},
				{
					id: 'layer',
					type: 'dropdown',
					label: 'Select Layer',
					choices: [
						{ id: '1', label: 'Layer 1' },
						{ id: '2', label: 'Layer 2' },
					],
					default: '1',
				},
				{
					id: 'int1000',
					type: 'number',
					label: 'Value (0 - 1000)',
					default: 0,
					min: 0,
					max: 1000,
					isVisible: (options, data) => {
						let show = options.parameter === 'file' || options.parameter === 'folder'
						return show
					},
				},
				{
					id: 'int100',
					type: 'number',
					label: 'Value (0 - 100)',
					default: 0,
					min: 0,
					max: 100,
					isVisible: (options, data) => {
						let show = options.parameter === 'lut' || options.parameter === 'movementspeed'
						return show
					},
				},
				{
					id: 'inframe',
					type: 'number',
					label: 'In Frame',
					default: 0,
					min: 0,
					max: 9999999,
					isVisible: (options, data) => {
						let show = options.parameter === 'inframe'
						return show
					},
				},
				{
					id: 'outframe',
					type: 'number',
					label: 'Out Frame',
					default: 9999999,
					min: 0,
					max: 9999999,
					isVisible: (options, data) => {
						let show = options.parameter === 'outframe'
						return show
					},
				},
				{
					id: 'hour',
					type: 'number',
					label: 'Value (0 - 23)',
					default: 0,
					min: 0,
					max: 23,
					isVisible: (options, data) => {
						let show = options.parameter === 'tchour'
						return show
					},
				},
				{
					id: 'minsec',
					type: 'number',
					label: 'Value (0 - 59)',
					default: 0,
					min: 0,
					max: 59,
					isVisible: (options, data) => {
						let show = options.parameter === 'tcminute' || options.parameter === 'tcsecond'
						return show
					},
				},
				{
					id: 'frame',
					type: 'number',
					label: 'Valuwe (0 - 29)',
					default: 0,
					min: 0,
					max: 29,
					isVisible: (options, data) => {
						let show = options.parameter === 'tcframe'
						return show
					},
				},
				{
					id: 'pos',
					type: 'number',
					label: 'Value (-100 - 100)',
					default: 0,
					min: -100,
					max: 100,
					range: true,
					isVisible: (options, data) => {
						let show = options.parameter === 'posx' || options.parameter === 'posy' || options.parameter === 'posz' || options.parameter === 'red' || options.parameter === 'green' || options.parameter === 'blue' || options.parameter === 'alpha' || options.parameter === 'contrast' || options.parameter === 'saturation'
						return show
					},
				},
				{
					id: 'rot',
					type: 'number',
					label: 'Value (-1440 - 1440)',
					default: 0,
					min: -1440,
					max: 1440,
					range: true,
					isVisible: (options, data) => {
						let show = options.parameter === 'rotx' || options.parameter === 'roty' || options.parameter === 'rotz'
						return show
					},
				},
				{
					id: 'scale',
					type: 'number',
					label: 'Value (0 - 1000)',
					default: 100,
					min: 0,
					max: 1000,
					range: true,
					isVisible: (options, data) => {
						let show = options.parameter === 'scale'
						return show
					},
				},
				{
					id: 'transitionduration',
					type: 'number',
					label: 'Set Transition Duration In Milliseconds',
					default: 0,
					min: 0,
					max: 65535,
					isVisible: (options, data) => {
						let show = options.parameter === 'transitionduration' || options.parameter === 'file'
						return show
					},
				},
				{
					id: 'level',
					type: 'number',
					label: 'Value (0 - 100)',
					default: 100,
					min: 0,
					max: 100,
					range: true,
					isVisible: (options, data) => {
						let show = options.parameter === 'intensity' || options.parameter === 'aspect' || options.parameter === 'hue' || options.parameter === 'strobe' || options.parameter === 'volume'
						return show
					},
				},
				{
					id: 'playspeed',
					type: 'number',
					label: 'Value (0 - 1000)',
					default: 100,
					min: 0,
					max: 1000,
					range: true,
					isVisible: (options, data) => {
						let show = options.parameter === 'playspeed'
						return show
					},
				},
				{
					id: 'playmode',
					type: 'dropdown',
					label: 'Select Playmode',
					choices: playmodeOptions,
					default: 2,
					isVisible: (options, data) => {
						let show = options.parameter === 'playmode'
						return show
					},
				},
				{
					id: 'framingmode',
					type: 'dropdown',
					label: 'Select Framing Mode',
					choices: framingmodeOptions,
					default: 0,
					isVisible: (options, data) => {
						let show = options.parameter === 'framingmode'
						return show
					},
				},
				{
					id: 'blendmode',
					type: 'dropdown',
					label: 'Select Blend Mode',
					choices: blendmodeOptions,
					default: 0,
					isVisible: (options, data) => {
						let show = options.parameter === 'blendmode'
						return show
					},
				},
				{
					id: 'frameblending',
					type: 'dropdown',
					label: 'Select Frameblending Mode',
					choices: frameblendingOptions,
					default: 1,
					isVisible: (options, data) => {
						let show = options.parameter === 'frameblending'
						return show
					},
				},
				{
					id: 'transitionmode',
					type: 'dropdown',
					label: 'Select Transition Mode',
					choices: transitionmodeOptions,
					default: 0,
					isVisible: (options, data) => {
						let show = options.parameter === 'transitionmode' || options.parameter === 'file'
						return show
					},
				},
			],
			callback: (action) => {
				if (action.options.parameter === null) {
					self.log('error', 'Parameter not found')
					return
				}

				let par = self.paramDescriptors.find((param) => param.name === action.options.parameter)

				if (par === undefined) {
					self.log('error', 'Parameter not found')
					return
				}

				let value = 0
				let layer = action.options.layer
				let path = par.path
				path = path.replace('#', layer)

				switch (par.type) {
					case 'integer':
						if (par.min === 0 && par.max == 1000) {
							value = action.options.int1000
						} else if (par.min === 0 && par.max == 100) {
							value = action.options.int100
						} else if (par.name === 'inframe') {
							value = action.options.inframe
						} else if (par.name === 'outframe') {
							value = action.options.outframe
						} else if (par.name === 'tchour') {
							value = action.options.hour
						} else if (par.name === 'tcminute' || par.name === 'tcsecond') {
							value = action.options.minsec
						} else if (par.name === 'tcframe') {
							value = action.options.frame
						} else if (par.name === 'transitionduration') {
							value = action.options.transitionduration
						}
						break
					case 'range':
						if (par.min === -100 && par.max == 100) {
							value = action.options.pos
						} else if (par.min === -1440 && par.max == 1440) {
							value = action.options.rot
						} else if (par.min === 0 && par.max == 100) {
							value = action.options.level
						} else if (par.name === 'playspeed') {
							value = action.options.playspeed
						} else if (par.min === 0 && par.max == 1000) {
							value = action.options.scale
						}
						break
					case 'select':
						if (par.name === 'playmode') {
							value = action.options.playmode
						} else if (par.name === 'framingmode') {
							value = action.options.framingmode
						} else if (par.name === 'blendmode') {
							value = action.options.blendmode
						} else if (par.name === 'frameblending') {
							value = action.options.frameblending
						} else if (par.name === 'transitionmode') {
							value = action.options.transitionmode
						}
						break
				}

				if (value < par.min || value > par.max) {
					self.log('error', 'Value out of range')
					return
				}

				let outVal = value
				if (par.type === 'range') {
					outVal = self.normalisedValue(par, value)
				}

				self.log('info', 'Setting parameter ' + action.options.parameter + ' to ' + outVal)

				// now finally actually set the value
				if (self.localSVPatch.connected) {
					if (par.name === 'file') {
						let transitiondurationpath = self.paramDescriptors.find((param) => param.name === 'transitionduration').path
						let transitionmodepath = self.paramDescriptors.find((param) => param.name === 'transitionmode').path
						transitiondurationpath = transitiondurationpath.replace('#', layer)
						transitionmodepath = transitionmodepath.replace('#', layer)
						self.localSVPatch.SetPatchDouble(transitiondurationpath, action.options.transitionduration)
						self.localSVPatch.SetPatchDouble(transitionmodepath, action.options.transitionmode)
						self.localSVPatch.SetPatchDouble(path, outVal)
					} else {
						self.localSVPatch.SetPatchDouble(path, outVal)
					}
				}
			}
		},
		sendcommand: {
			name: 'Send Command',
			options: [
				{
					id: 'instructions0',
					type: 'static-text',
					label: 'Instructions:',
					value:
						'This action allows you to send a command to the Hive device, this can either be a data command using one of the data update functions (SetPatchDouble, SetPatchString, SetPatchJSON etc...) details of which can be found in the UDP Command List on our website, or a linux shell command that will be executed on the device directly.',
				},
				{
					id: 'command',
					type: 'textinput',
					label: 'Enter command text here:',
					required: true,
					default: '',
				},
			],
			callback: async (event, context) => {
				self.log('info', 'Sending device command, command=' + event.options.command)
				if (event.options.ip === '') {
					self.log('error', 'No valid command provided')
					return
				}
				self.customCommandToDevice(event.options.command, self.config.ip)
			},
		},
		playlistaction: {
			name: 'Playlist Action',
			options: [
				{
					id: 'action',
					type: 'dropdown',
					label: 'Select action:',
					choices: [
						{ id: 'playnext', label: 'Play Next' },
						{ id: 'playprevious', label: 'Play Previous' },
						{ id: 'playrandom', label: 'Play Random' },
						{ id: 'playfirst', label: 'Play First' },
						{ id: 'playlast', label: 'Play Last' },
						{ id: 'playrowx', label: 'Play Row [parameter]' },
						{ id: 'pause', label: 'Pause' },
						{ id: 'play', label: 'Play' },
						{ id: 'nextmarker', label: 'Goto Next Marker' },
						{ id: 'previousmarker', label: 'Goto Previous Marker' },
						{ id: 'randommarker', label: 'Goto Random Marker' },
						{ id: 'firstmarker', label: 'Goto First Marker' },
						{ id: 'lastmarker', label: 'Goto Last Marker' },
						{ id: 'markerx', label: 'Goto Marker [parameter]' },
					],
					default: 'playnext',
				},
				{
					id: 'parameter',
					type: 'number',
					label: 'Parameter',
					default: 0,
					min: 0,
					max: 1000,
					isVisible: (options, data) => {
						let show = options.action === 'playrowx' || options.action === 'markerx'
						return show
					},
				},
			],
			callback: async (event, context) => {
				if (self.localSVPatch.connected === false) {
					self.log('error', 'Not connected to device')
					return
				}
				self.log('info', 'Sending playlist command, command=' + event.options.action)

				let thePlaylist = self.blade.playlist
				let currentrow = self.blade.playlistrow
				if (!thePlaylist) {
					self.log('error', 'No playlist loaded')
					return
				}

				switch (event.options.action) {
					case 'playnext':
						if (thePlaylist.list.length < 2) return
						let next = (currentrow + 1) % thePlaylist.list.length
						self.localSVPatch.SetPatchDouble(`/Playlist Control/Playlist Controller 1/Play List Next`, next)
						break

					case 'playprevious':
						if (thePlaylist.list.length < 2) return
						let previous = currentrow - 1
						if (previous < 0) previous = thePlaylist.list.length - 1
						self.localSVPatch.SetPatchDouble(`/Playlist Control/Playlist Controller 1/Play List Next`, previous)
						break

					case 'playfirst':
						if (thePlaylist.list.length < 2) return
						self.localSVPatch.SetPatchDouble(`/Playlist Control/Playlist Controller 1/Play List Next`, 0)
						break

					case 'playlast':
						if (thePlaylist.list.length < 2) return
						self.localSVPatch.SetPatchDouble(
							`/Playlist Control/Playlist Controller 1/Play List Next`,
							thePlaylist.list.length - 1,
						)
						break

					case 'playrandom':
						if (thePlaylist.list.length < 2) return
						let random = self.getRandomInt(0, thePlaylist.list.length - 1)
						self.localSVPatch.SetPatchDouble(`/Playlist Control/Playlist Controller 1/Play List Next`, random)
						break

					case 'playrowx':
						if (thePlaylist.list.length < 2) return
						let x = parseInt(event.options.parameter)
						if (x > thePlaylist.list.length || x < 1) return
						self.localSVPatch.SetPatchDouble(`/Playlist Control/Playlist Controller 1/Play List Next`, x - 1)
						break

					case 'pause':
						self.localSVPatch.SetPatchDouble(`/Playlist Control/Playlist Controller 1/Play Mode Next`, 0)
						break

					case 'play':
						self.localSVPatch.SetPatchDouble(`/Playlist Control/Playlist Controller 1/Play Mode Next`, 1)
						break

					case 'nextmarker':
						if (thePlaylist.markers.length < 2) return

						thePlaylist.markers.sort(function (a, b) {
							return a.time - b.time
						})

						var filename = ''

						if (thePlaylist.list.length > 0) filename = thePlaylist.list[currentrow].name

						if (filename.substring(filename.length - 4) === '.htl') {
							self.localSVPatch.GetPatchDouble(`/Timeline Patch/TimelineManager/Playhead Time`, (time) => {
								let currentTime = self.calculatePlayheadTime(thePlaylist, currentrow, time)

								let filtered = thePlaylist.markers.filter((m) => m.time > currentTime)
								if (filtered.length > 0) {
									self.localSVPatch.SetPatchDouble(
										`/Playlist Control/Playlist Controller 1/Play List Seek`,
										filtered[0].time,
									)
								} else {
									self.localSVPatch.SetPatchDouble(
										`/Playlist Control/Playlist Controller 1/Play List Seek`,
										thePlaylist.markers[0].time,
									)
								}
							})
						} else {
							self.localSVPatch.GetPatchDouble(
								`/Playlist Control/Playlist Controller 1/Time Since Media Advance`,
								(time) => {
									let currentTime = self.calculatePlayheadTime(thePlaylist, currentrow, time)

									let filtered = thePlaylist.markers.filter((m) => m.time > currentTime)
									if (filtered.length > 0) {
										self.localSVPatch.SetPatchDouble(
											`/Playlist Control/Playlist Controller 1/Play List Seek`,
											filtered[0].time,
										)
									} else {
										self.localSVPatch.SetPatchDouble(
											`/Playlist Control/Playlist Controller 1/Play List Seek`,
											thePlaylist.markers[0].time,
										)
									}
								},
							)
						}
						break
					case 'previousmarker':
						if (thePlaylist.markers.length < 2) return

						thePlaylist.markers.sort(function (a, b) {
							return a.time - b.time
						})

						var filename = ''

						if (thePlaylist.list.length > 0) filename = thePlaylist.list[currentrow].name

						if (filename.substring(filename.length - 4) === '.htl') {
							self.localSVPatch.GetPatchDouble(`/Timeline Patch/TimelineManager/Playhead Time`, (time) => {
								let currentTime = self.calculatePlayheadTime(thePlaylist, currentrow, time)

								let filtered = thePlaylist.markers.filter((m) => m.time < currentTime)
								if (filtered.length > 0) {
									self.localSVPatch.SetPatchDouble(
										`/Playlist Control/Playlist Controller 1/Play List Seek`,
										filtered[filtered.length - 1].time,
									)
								} else {
									self.localSVPatch.SetPatchDouble(
										`/Playlist Control/Playlist Controller 1/Play List Seek`,
										thePlaylist.markers[thePlaylist.markers.length - 1].time,
									)
								}
							})
						} else {
							self.localSVPatch.GetPatchDouble(
								`/Playlist Control/Playlist Controller 1/Time Since Media Advance`,
								(time) => {
									let currentTime = self.calculatePlayheadTime(thePlaylist, currentrow, time)

									let filtered = thePlaylist.markers.filter((m) => m.time < currentTime)
									if (filtered.length > 0) {
										self.localSVPatch.SetPatchDouble(
											`/Playlist Control/Playlist Controller 1/Play List Seek`,
											filtered[filtered.length - 1].time,
										)
									} else {
										self.localSVPatch.SetPatchDouble(
											`/Playlist Control/Playlist Controller 1/Play List Seek`,
											thePlaylist.markers[thePlaylist.markers.length - 1].time,
										)
									}
								},
							)
						}
						break
					case 'randommarker':
						if (thePlaylist.markers.length < 2) return
						let markerrandom = self.getRandomInt(0, thePlaylist.markers.length - 1)
						self.localSVPatch.SetPatchDouble(
							`/Playlist Control/Playlist Controller 1/Play List Seek`,
							thePlaylist.markers[markerrandom].time,
						)
						break

					case 'firstmarker':
						if (thePlaylist.markers.length < 1) return
						self.localSVPatch.SetPatchDouble(
							`/Playlist Control/Playlist Controller 1/Play List Seek`,
							thePlaylist.markers[0].time,
						)
						break

					case 'lastmarker':
						if (thePlaylist.markers.length < 1) return
						self.localSVPatch.SetPatchDouble(
							`/Playlist Control/Playlist Controller 1/Play List Seek`,
							thePlaylist.markers[thePlaylist.markers.length - 1].time,
						)
						break

					case 'markerx':
						if (thePlaylist.markers.length < 1) return
						let xm = parseInt(event.options.parameter)
						if (xm > thePlaylist.markers.length || xm < 1) return
						self.localSVPatch.SetPatchDouble(
							`/Playlist Control/Playlist Controller 1/Play List Seek`,
							thePlaylist.markers[xm - 1].time,
						)
						break
				}
			},
		},
		regionmedia: {
			name: 'Set Region Media',
			options: [
				{
					id: 'instructions0',
					type: 'static-text',
					label: 'Instructions:',
					value:
						'This action allows you to set the media that is played inside a media file region, the region must be set as a Media File region in the mapping tab of the Hive GUI. The media file must be present in the media folder on the device. The media file name should be exactly the same as the full filename shown in media manager (including underscores) and is case sensitive. The region name should match exactly the region name displayed in the Hive GUI and is also case sensitive',
				},
				{
					id: 'regionname',
					type: 'textinput',
					label: 'Enter name of region here:',
					required: true,
					default: '',
				},
				{
					id: 'mediafile',
					type: 'textinput',
					label: 'Enter media filename in full here:',
					required: true,
					default: '',
				},
			],
			callback: async (event, context) => {
				if (self.localSVPatch.connected === false) {
					self.log('error', 'Not connected to device')
					return
				}
				self.log('info', 'Setting media on region:' + event.options.regionname + ' to ' + event.options.mediafile)

				let map = self.blade.mapping

				let regionIndex = map.regions.findIndex((region) => region.name === event.options.regionname)
				if (regionIndex === -1) {
					self.log('error', 'Region not found')
					return
				}
				let region = map.regions[regionIndex]
				if (region.source !== 'mediaFile') {
					self.log('error', 'Region is not a media file region')
					return
				}

				region.mediaFilename = event.options.mediafile

				map.regions[regionIndex] = region

				//self.localSVPatch.SetPatchJSON("/Output Mapping", map)
				self.localSVPatch.SetPatchString(
					'/Mapping/RegionPatches/' + event.options.regionname + '/mediaFilename/Text',
					event.options.mediafile,
				)
			},
		},
	})
}
