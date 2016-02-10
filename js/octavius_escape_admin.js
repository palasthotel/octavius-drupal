(function(u) {
	"use strict";
	function OctaviusEscapeAdmin(octavius){
		var _oc = octavius;
		function _ready(){
			if(Drupal.settings.user_js_uid != 0){
				_oc.setAttribute('no_tracking', true);
				_oc.hook.register('tracker_do_track',_do_tracking);
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