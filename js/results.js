(function(u) {
	"use strict";
	function Results(octavius){
		var _oc = octavius;
		var _query = null;
		var $div = null;
		/**
		 * on octavius ready do stuff
		 * @private
		 */
		function _core_ready(){
			_query = _oc.get_plugin('Query');
			_query.on_update(_render_results);
			_query.on_ready( _query_ready);
			$div = jQuery("#octavius-results");
		}
		_oc.hook_core_ready(_core_ready);

		function _query_ready(){
			_query.execute({
				step: "minutes_5",
				group:['timestamp'],
				order:[{field: 'timestamp'}],
			});
		}

		function _render_results(data){
			console.log("Render results");
			$div.html(JSON.stringify(data));
		}


	}
	/**
	 * add plugin to octavius
	 */
	if(typeof window.Octavius != typeof u) window.Octavius.add_plugin('Results', Results);
})();