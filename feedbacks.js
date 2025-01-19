const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		moduledisabled: {
			name: 'Module Disabled',
			type: 'boolean',
			label: 'Module Disabled',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
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
			],
			callback: (feedback) => {
				if (
					!self.blade.playlist ||
					!self.blade.timeline ||
					!self.blade.timecode ||
					!self.blade.schedule ||
					!self.blade.vioso ||
					!self.blade.screenberry
				) {
					return true
				}
				switch (feedback.options.module) {
					case 'playlist':
						return self.blade.playlist.usePlayList === 0
					case 'timeline':
						return self.blade.timeline.useTimeline === 0
					case 'tc1':
						return self.blade.timecode.layers[0].useCueList === 0
					case 'tc2':
						return self.blade.timecode.layers[1].useCueList === 0
					case 'scheduler':
						return self.blade.schedule.useSchedule === 0
					case 'screenberry':
						return self.blade.screenberry.enabled === 0
					case 'vioso':
						return self.blade.vioso.enabled === 0
					case 'screenberrycal':
						return self.blade.screenberry.calibrationMode === 0
					case 'viosocal':
						return self.blade.vioso.calibrationMode === 0
				}
			},
		},
		moduleenabled: {
			name: 'Module Enabled',
			type: 'boolean',
			label: 'Module Enabled',
			defaultStyle: {
				bgcolor: combineRgb(0, 255, 0),
				color: combineRgb(0, 0, 0),
			},
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
			],
			callback: (feedback) => {
				if (
					!self.blade.playlist ||
					!self.blade.timeline ||
					!self.blade.timecode ||
					!self.blade.schedule ||
					!self.blade.vioso ||
					!self.blade.screenberry
				) {
					return false
				}
				switch (feedback.options.module) {
					case 'playlist':
						return self.blade.playlist.usePlayList === 1
					case 'timeline':
						return self.blade.timeline.useTimeline === 1
					case 'tc1':
						return self.blade.timecode.layers[0].useCueList === 1
					case 'tc2':
						return self.blade.timecode.layers[1].useCueList === 1
					case 'scheduler':
						return self.blade.schedule.useSchedule === 1
					case 'screenberry':
						return self.blade.screenberry.enabled === 1
					case 'vioso':
						return self.blade.vioso.enabled === 1
					case 'screenberrycal':
						return self.blade.screenberry.calibrationMode === 1
					case 'viosocal':
						return self.blade.vioso.calibrationMode === 1
				}
			},
		},
	})
}
