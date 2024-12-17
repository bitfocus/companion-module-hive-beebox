module.exports = function (self) {
	self.setActionDefinitions(
		{
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
						default: 'playlist'
					},
					{
						id: 'enable',
						type: 'checkbox',
						label: 'Enable ?',
						default: true
					}
				],
				callback: async (event, context) => {
					self.log('info', "Sending enable disable command, module=" + event.options.module + " enable=" + event.options.enable)
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
						default: 'playlist'
					}
				],
				callback: async (event, context) => {
					self.log('info', "Sending toggle state command, module=" + event.options.module)
					if (!self.blade.playlist || !self.blade.timeline || !self.blade.timecode || !self.blade.schedule || !self.blade.vioso || !self.blade.screenberry) {
						self.log('error', "Missing data, please check connection")
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
		},
	)
}
