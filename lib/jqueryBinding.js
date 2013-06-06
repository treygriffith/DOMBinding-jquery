var $ = require('jquery-joules');

/**
 * DOMBinding is a genericized jQuery. This driver uses jQuery to implement
 */

/**
 * Driver for binding to the DOM
 * @param {String} html HTML with which to initialize the binding. Should be one element
 */
function DOMBinding(html) {

	this.$ = $(html);

	return this;
}

/**
 * DOM Ready Callback
 */
DOMBinding.DOMReady = function(cb) {
	$(cb);
};

/**
 * Return raw DOM Elements
 */
DOMBinding.prototype.getDOM = function() {
	return this.$.get(0);
};

/**
 * Update the DOM element's CSS
 * @param  {Object} cssMap Key-value map of css properties and values
 * @return {DOMBinding}        updated DOMBinding
 */
DOMBinding.prototype.setStyle = function(cssMap) {

	this.$.css(cssMap || {});

	return this;
};

/**
 * Return the value of an attribute on a DOM element
 * @param  {String} name Name of attribute
 * @return {String}      Attribute value
 */
DOMBinding.prototype.getAttr = function(name) {

	return this.$.attr(name);
};

/**
 * Update DOM Element attribute
 * @param  {String} name Name of the attribute
 * @param  {String} val  Value to change to
 * @return {DOMBinding}      DOMBinding updated
 */
DOMBinding.prototype.setAttr = function(name, val) {

	this.$.attr(name, val);

	return this;
};

// Replace the text in a DOM node
/**
 * Replace the text in a DOM node
 * @param  {String} text Text to insert in the node
 * @return {DOMBinding}      DOMBinding modified
 */
DOMBinding.prototype.setText = function(text) {

	this.$.text(text);

	return this;
};

/**
 * Return a form value
 * @return {String} Value of a form element
 */
DOMBinding.prototype.getFormValue = function() {

	return this.$.val();
};

/**
 * Update a form value
 * @param  {String} val New value of the form element
 * @return {DOMBinding}     DOMBinding updated
 */
DOMBinding.prototype.setFormValue = function(val) {

	this.$.val(val);

	return this;
};

DOMBinding.prototype.isSelected = function() {

	return this.$.is(':checked') || this.$.is(':selected');
};

/**
 * Append a child node to the end of this node
 * @param  {DOMBinding} db DOMBinding representing the child node to be inserted
 * @return {DOMBinding}    Node appended to
 */
DOMBinding.prototype.append = function(db) {

	this.$.append(db.$);

	return this;
};

/**
 * Insert a sibling Node after this one
 * @param  {DOMBinding} db DOMBinding representing the node that will be the sibling
 * @return {DOMBinding}    the DOMBinding
 */
DOMBinding.prototype.siblingAfter = function(db) {

	this.$.after(db.$);

	return this;
};

/**
 * Insert a sibling Node before this one
 * @param  {DOMBinding} db DOMBinding representing the node that will be the sibling
 * @return {DOMBinding}    the DOMBinding
 */
DOMBinding.prototype.siblingBefore = function(db) {

	this.$.before(db.$);

	return this;
};

/**
 * Replace this DOMBinding with another
 * @param  {DOMBinding} db DOMBinding to add to the DOM in place of the current one
 * @return {DOMBinding}    the current DOMBinding
 */
DOMBinding.prototype.replaceWith = function(db) {

	this.$.replaceWith(db.$);

	return this;
};

/**
 * remove this element from the DOM
 * @return {DOMBinding} the DOMBinding removed
 */
DOMBinding.prototype.remove = function() {

	this.$.remove();

	return this;
};

/**
 * Remove all child nodes of this DOMBinding
 * @return {DOMBinding} the DOMBinding just emptied
 */
DOMBinding.prototype.empty = function() {

	this.$.empty();

	return this;
};

/**
 * Find all descendant nodes that match a filter
 * @param  {String} filter Nodes must match the filter to be returned
 * @return {Array}        Array of DOMBindings
 */
DOMBinding.prototype.find = function(filter) {

	return $.makeArray(this.$.find(filter || '*')).map(function(elem) {
		return new DOMBinding(elem);
	});
};

/**
 * Test whether this element is in the DOM
 * @return {Boolean} True if it is in the DOM (not disconnected)
 */
DOMBinding.prototype.inDOM = function() {
	return $.contains(window.document.documentElement, this.$[0]);
};

/**
 * Register a callback on a DOM event
 * @param  {String}   evt Event to listen for in the DOM
 * @param  {Function} fn  Function to evaluate when the event is fired
 * @return {DOMBinding}       DOMBinding bound to event
 */
DOMBinding.prototype.on = function(evt, fn) {

	var db = this;

	var handler = function(e) {

		fn.call(db, e);
	};

	var events = this.$.data('DOMBinding:events') || {};

	events[evt] = events[evt] || [];

	events[evt].push(handler);

	this.$.data('DOMBinding:events', events);

	handler.originalFn = fn;

	this.$.on(evt, handler);

	return this;
};

/**
 * Remove a callback from a DOM event
 * @param  {String}   evt Event to listen for in the DOM
 * @param  {Function} fn  Optional handler to remove
 * @return {DOMBinding}       DOMBinding unbound from event
 */
DOMBinding.prototype.off = function(evt, fn) {

	var db = this;

	if(!fn) {

		this.$.off(evt);

		return this;
	}

	var events = this.$.data('DOMBinding:events') || {};

	console.log(events);

	if(events[evt]) {

		events[evt].forEach(function(handler, i) {

			console.log("checked for strict equal");
			console.log(handler);
			console.log(handler.originalFn);
			console.log(fn);
			console.log(handler.originalFn === fn);

			if(handler && handler.originalFn === fn) {

				events[evt].splice(i, 1);

				console.log("removing", handler, "for", evt);

				db.$.off(evt, handler);
			}
		});
	}

	this.$.data('DOMBinding:events', events);

	return this;
};

module.exports = DOMBinding;