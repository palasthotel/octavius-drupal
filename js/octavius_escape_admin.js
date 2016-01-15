(function(u) {
	"use strict";
	function OctaviusEscapeAdmin(octavius){
		var _oc = octavius;
		function _ready(){
			if(Drupal.settings.user_js_uid != 0){
				console.log('ADMIN');
				_oc.hook.register('tracker_do_tracking',_do_tracking);
			}
		}
		_oc.hook_core_ready(_ready);
		function _do_tracking(data){
			data.do_track = false;
		}
	}
	/**
	 * add plugin to octavius
	 */
	if(typeof window.Octavius != typeof u) window.Octavius.add_plugin('OctaviusEscapeAdmin', OctaviusEscapeAdmin);
})();