module.exports = function (self) {
	self.setActionDefinitions({
		enableplaylist: {
			name: 'Enable Playlist',
			options: [
			],
			callback: async (event, context) => {
				self.log('debug', "Sending:  stuff")
				//this.log('debug', 'doingit');
				//this.localSVPatch.UpdatePatchJSON("/Play List", [{ "op": "replace", "path": "/usePlayList", "value": 1 }])

			},
		},
	})
}
