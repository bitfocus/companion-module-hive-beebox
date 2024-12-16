module.exports = function (self) {
	self.setActionDefinitions(
		{
			enableplaylist: {
				name: 'Enable Playlist',
				options: [
				],
				callback: async (event, context) => {
					self.log('info', "Sending enable playlist command")
					self.setTimecodeEnable(false, 1)
					self.setTimecodeEnable(false, 2)
					self.setTimelineEnable(false)
					self.setPlayListEnable(true)

				},
			},
			enabletimeline: {
				name: 'Enable Timeline',
				options: [
				],
				callback: async (event, context) => {
					self.log('info', "Sending enable timeline command")
					self.setTimecodeEnable(false, 1)
					self.setTimecodeEnable(false, 2)
					self.setPlayListEnable(false)
					self.setTimelineEnable(true)

				},
			},
			enabletimecodelone: {
				name: 'Enable Timecode Cue List Layer 1',
				options: [
				],
				callback: async (event, context) => {
					self.log('info', "Sending enable timecode cue list layer 1 command")
					self.setTimelineEnable(false)
					self.setPlayListEnable(false)
					self.setTimecodeEnable(true, 1)

				},
			},
			enabletimecodeltwo: {
				name: 'Enable Timecode Cue List Layer 2',
				options: [
				],
				callback: async (event, context) => {
					self.log('info', "Sending enable timecode cue list layer 2 command")
					self.setTimelineEnable(false)
					self.setPlayListEnable(false)
					self.setTimecodeEnable(true, 2)

				},
			},
			disableplaylist: {
				name: 'Disable Playlist',
				options: [
				],
				callback: async (event, context) => {
					self.log('info', "Sending disable playlist command")
					self.setPlayListEnable(false)

				},
			},
			disabletimeline: {
				name: 'Disable Timeline',
				options: [
				],
				callback: async (event, context) => {
					self.log('info', "Sending disable timeline command")
					self.setTimelineEnable(false)

				},
			},
			disabletimecodelone: {
				name: 'Disable Timecode Cue List Layer 1',
				options: [
				],
				callback: async (event, context) => {
					self.log('info', "Sending disable timecode layer 1 command")
					self.setTimecodeEnable(false, 1)

				},
			},
			disabletimecodeltwo: {
				name: 'Disable Timecode Cue List Layer 2',
				options: [
				],
				callback: async (event, context) => {
					self.log('info', "Sending disable timecode layer 2 command")
					self.setTimecodeEnable(false, 2)

				},
			},
			enableschedule: {
				name: 'Enable Scheduler',
				options: [
				],
				callback: async (event, context) => {
					self.log('info', "Sending enable scheduler command")
					self.setScheduleEnable(true)


				},
			},
			disableschedule: {
				name: 'Disable Scheduler',
				options: [
				],
				callback: async (event, context) => {
					self.log('info', "Sending disable scheduler command")
					self.setScheduleEnable(false)

				},
			},
		},
	)
}
