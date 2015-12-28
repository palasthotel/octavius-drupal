(function(w,d,u){
	"use strict";

	/**
	 * the octavius core object
	 */
	function Tracker(octavius){
		var _oc = octavius;
		this.init = function(octacius){
			console.log('init tracker!');
			var links = d.querySelectorAll('a');
			console.log(links);
		}
	}
	/**
	 * add plugin to octavius
	 */
	w.Octavius.add_plugin('Tracker',Tracker);

})(window,document);