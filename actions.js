module.exports = function (self) {
	self.setActionDefinitions(
		{
			enableplaylist: {
				name: 'Enable Playlist',
				options: [
				],
				callback: async (event, context) => {
					self.log('info', "Sending enable playlist command")
					self.localSVPatch.UpdatePatchJSON("/Play List", [{ "op": "replace", "path": "/usePlayList", "value": 1 }])

				},
			},
			disableplaylist: {
				name: 'Disable Playlist',
				options: [
				],
				callback: async (event, context) => {
					self.log('info', "Sending disable playlist command")
					self.localSVPatch.UpdatePatchJSON("/Play List", [{ "op": "replace", "path": "/usePlayList", "value": 0 }])

				},
			},
		},
	)
}
