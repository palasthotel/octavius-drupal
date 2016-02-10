(function(u) {
	"use strict";
	function Query(octavius){
		var _oc = octavius;
		var _socket = null;
		var _routes_set = false;
		/**
		 * on octavius socket ready do stuff
		 * @private
		 */
		function _socket_ready(socket){
			if(Drupal.settings.user_js_uid == 0){
				console.error("not logged in");
				return;
			}
			_socket = socket;
			_init();
		}
		_oc.hook_socket_ready(_socket_ready);

		/**
		 * init plugin
		 */
		function _init(){
			if(!_routes_set){
				_socket.on('deliver/query/update',_call_query_update);
				_routes_set = true;
			}
			_oc.hook.call('query-ready')
		}

		/**
		 * get custom results
		 */
		this.execute = function(args){
			_socket.emit('deliver/query', args);
		}
		function _call_query_update(data){
			_oc.hook.call('query-update', data);
		}

		this.on_ready = function(cb){
			_oc.hook.register('query-ready',cb);
		}
		this.on_update = function(cb){
			_oc.hook.register('query-update',cb);
		}
	}
	/**
	 * add plugin to octavius
	 */
	if(typeof window.Octavius != typeof u) window.Octavius.add_plugin('Query', Query);
})();