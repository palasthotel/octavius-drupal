(function(w,d,u){
	"use strict";

	/**
	 * the octavius core object
	 */
	function Tracker(octavius){
		var self = this;
		var _oc = octavius;
		var _time_start;
		var _selectors = {
			target: "a[href], button, input[type=submit]",
			//renderedTarget: "a:not(."+config.ignore_rendered_class+")[href][data-octavius-content_id]",
			grid: ".grid",
			grid_container: ".grid-container",
			grid_slot: ".grid-slot",
			grid_box: ".grid-box",
			list: "li",
		}
		function _init(octacius){
			var links = d.querySelectorAll('a[href]');
			for(var i = 0; i < links.length; i++){
				links[i].addEventListener('click', _on_click);
			}
			_time_start = new Date().getTime();
		}
		_oc.hook_core_ready(_init);

		/**
		 * on click on link
		 */
		function _on_click(e){
			var event = {
				type: 'click',
				measured: _get_date(),
				resting_time: _get_resting_time(),
			};
			var entity = _build_entity(this);
			self.track(event,entity);
		}

		/**
		 * track data to server
		 */
		this.track = function(event,entity){
			/**
			 * hook event and entity alters
			 */
			_oc.hook.call('tracker_event_alter', event);
			_oc.hook.call('tracker_entity_alter', entity);

			/**
			 * build data object
			 * @type {{entity, event}}
			 */
			var data = {
				entity: JSON.stringify(entity),
				event: JSON.stringify(event),
			};

			/**
			 * for for manipulating data before send to server
			 */
			_oc.hook.call('tracker_data_alter', data);
			/**
			 * send the request
			 */
			_oc.ajax.post('/track',data);
		}

		/**
		 * get times
		 */
		function _get_date(){
			var d = new Date();
			/**
			 * because toISOString calculates with GTM+0
			 * so we add two hours for german time
			 */
			d = new Date(d.getTime()+(d.getTimezoneOffset()*-1)*60*1000);
			return d.toISOString().slice(0, 19).replace('T', ' ');
		}
		function _get_resting_time(){
			return new Date().getTime()-_time_start;
		}

		/**
		 * build entity
		 */
		function _build_entity(element){
			/**
			 * now get the entity datas
			 */
			var entity = {};
			/**
			 * get url if there is a href
			 * can be overwritten by
			 * data-octavius-content_url
			 */
			if( typeof element.getAttribute("href") !== typeof undefined ){
				/**
				 * distinguish extern and internal links
				 */
				if(window.location.hostname == element.hostname){
					entity["content_url"] = element.pathname;
				} else {
					entity["content_url"] = element.hostname+element.pathname;
				}
			}
			/**
			 * location path as parent url
			 */
			entity["parent_url"] = window.location.pathname;
			/**
			 * get grid values if there is a grid around
			 */
			var grid = _closest(element, _selectors.grid);
			if(grid){
				/**
				 * can be overwritten by
				 * data-octavius-grid_container_number
				 * data-octavius-grid_slot_number
				 * data-octavius-grid_box_number
				 */
				var container = _closest(element, _selectors.grid_container);
				if(container){
					entity.grid_container_number = _get_index(container)+1;
				}
				var slot = _closest(element, _selectors.grid_slot);
				if(slot){
					entity.grid_slot_number = _get_index(slot)+1;
				}
				var box = _closest(element, _selectors.grid_box);
				if(box){
					entity.grid_slot_number = _get_index(box)+1;
				}
				;
				/**
				 * wild guess for list number
				 * can be overwritten by
				 * data-octavius-list_number
				 */
				var list = _closest(element, _selectors.list);
				if(list){
					entity.list_number = _get_index(list)+1;
				}
			}
			/**
			 * calculate screen number
			 * can be overwritten by
			 * data-octavius-screen_number
			 */
			var bodyRect = document.body.getBoundingClientRect();
			var elementTopOffset = 0;
			var offsetElement = element;
			do {
				elementTopOffset += offsetElement.offsetTop  || 0;
				offsetElement = offsetElement.offsetParent;
			} while(offsetElement);
			entity["screen_number"] = Math.ceil(elementTopOffset/bodyRect.height);
			/**
			 * get parent id if implemented
			 * can be overwritten by
			 * data-octavius-parent_id
			 */
			var parent_id = _oc.getAttribute('nodeid');
			if( null != parent_id ){
				entity["parent_id"] = parent_id;
			}
			/**
			 * get pagetype if implemented
			 * can be overwritten by
			 * data-octavius-pagetype
			 */
			 var pagetype = _oc.getAttribute('pagetype');
			if( null != pagetype ){
				entity["pagetype"] = pagetype;
			}

			/**
			 * last step get all octavius attributes that are hardcoded on element
			 * those can override the wild guesses
			 */
			for (var i = element.attributes.length - 1; i >= 0; i--) {
				if( element.attributes[i].name.indexOf('data-octavius-') === 0){
					var key = element.attributes[i].name.replace('data-octavius-', "");
					entity[key] = element.attributes[i].value;
				}
			};
			return entity;
		}

		/**
		 * find closest parent with selector
		 * @param el
		 * @param selector
		 * @returns {*}
		 */
		function _closest(el, selector){
			var matchesFn = null;
			// find vendor prefix
			['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
				if (typeof document.body[fn] == 'function') {
					matchesFn = fn;
					return true;
				}
				return false;
			});
			if(matchesFn == null) return null;

			// traverse parents
			while (el!==null) {
				var parent = el.parentElement;
				if (parent!==null && parent[matchesFn](selector)) {
					return parent;
				}
				el = parent;
			}

			return null;
		}

		/**
		 * get index of node
		 */
		function _get_index(node) {
			var index = 0;
			while ( (node = node.previousSibling) ) {
				if (node.nodeType != 3 || !/^\s*$/.test(node.data)) {
					index++;
				}
			}
			return index;
		}
	}
	/**
	 * add plugin to octavius
	 */
	w.Octavius.add_plugin('Tracker',Tracker);

	w.Octavius.hook.register('tracker_data_alter',function(entity){
		entity.test = "ja";
		return true;
	});

})(window,document);