/**
 * Checkout JavaScript
 * Green Top Energy
 *
 * Copyright (c) 2016. by Way2CU, http://way2cu.com
 * Authors: Mladen Mijatov
 */

// create or use existing site scope
var Site = Site || {};


Site.CartItemView = function(item) {
	var self = this;

	self.item = item;
	self.container = null;
	self.count_label = null;
	self.invalid_item = false;

	/**
	 * Complete object initialization.
	 */
	self._init = function() {
	};

	/**
	 * Finalize user interface initialization after all the data has
	 * been set.
	 */
	self._init_user_interface = function() {
		// make sure we don't look for container more than once
		if (self.container !== null || self.invalid_item)
			return;

		// find item container
		var cid = self.item.uid + '/' + self.item.variation_id;
		self.container = $('div.related_item[data-cid="' + cid + '"]');

		if (self.container.length > 0) {
			// find labels
			self.count_label = self.container.find('span.count');

		} else {
			// mark item as invalid so it's not updated in the future
			self.invalid_item = true;
		}
	};

	/**
	 * Handler externally called when item count has changed.
	 */
	self.handle_change = function() {
		// create interface if needed
		self._init_user_interface();

		// skip updating invalid items
		if (self.invalid_item)
			return;

		// update item count display
		self.count_label.text(self.item.count);
	};

	/**
	 * Handle shopping cart currency change.  * * @param string currency
	 * @param float rate
	 */
	self.handle_currency_change = function(currency, rate) {
	};

	/**
	 * Handler externally called before item removal.
	 */
	self.handle_remove = function() {
		self.count_label.text('');
	};

	// finalize object
	self._init();
}


Site.CheckoutPages = function() {
	var self = this;

	self.current_selection_page = null;
	self.related_items_page = null;
	self.property = null;
	self.currents = new Array();
	self.cart = null;
	self.package_name = null;
	self.limit = 1;
	self.inputs = $();
	self.totals = null;

	self.validator = {};
	self.handler = {};
	self.current_limits = {
			basic: 3,
			renewable: 6,
			business: 12,
			industry: 12
		};

	/**
	 * Complete object initialization.
	 */
	self._init = function() {
		// find pages
		self.current_selection_page = $('div#current_selection');
		self.related_items_page = $('div#related_products');

		// assign validators
		self.current_selection_page.data('validator', self.validator.current_selection_page);
		self.related_items_page.data('validator', self.validator.related_items_page);

		// create local cart
		self.cart = new Caracal.Shop.Cart();
		self.cart.add_item_view(Site.CartItemView);

		// connect all control events
		$('div.item_controls a').on('click', self.handler.control_click);

		// get package name from location
		self.package_name = window.location.pathname.split('/').pop();
		if (self.package_name in self.current_limits)
			self.limit = self.current_limits[self.package_name];

		// load electrict current
		self._load_current();

		// add package to the cart
		self._set_cart_content();
	};

	/**
	 * Set content of shopping cart to package with specified name.
	 */
	self._set_cart_content = function() {
		var data = {
				uid: self.package_name,
				count: 1
			};

		new Communicator('shop')
			.send('json_set_item_as_cart', data);
	};

	/**
	 * Load current selection data from the server.
	 */
	self._load_current = function() {
		var data = {
				item_uid: self.package_name,
				text_id: 'currents'
			};

		new Communicator('shop')
			.on_success(self.handler.current_load)
			.on_error(self.handler.current_load_error)
			.get('json_get_property', data);
	};

	/**
	 * Create user interface for selecting currents.
	 */
	self._create_current_selection_ui = function() {
		var values = self.property.value;
		var container = self.current_selection_page.find('div.container');

		// create range selection for each current
		for (index in values) {
			var value = values[index];
			var label = $('<label>');
			var input = $('<input>');
			var span = $('<span>');
			var span_counter = $('<span>');

			// configure checkbox
			input
				.attr('type', 'range')
				.attr('min', 0)
				.attr('max', self.limit)
				.attr('value', 0)
				.data('value', value)
				.on('change', self.handler.selection_change)

			span
				.addClass('text')
				.text(value);

			span_counter
				.addClass('counter')
				.text(0);

			label
				.append(span)
				.append(input)
				.appendTo(container);

			// add input to the set we'll later use
			self.inputs = self.inputs.add(input);
		}

		// create totals label
		self.totals = self.current_selection_page.find('div.total span');
		self.totals.text('0/' + self.limit.toString());
	};

	/**
	 * Get number of currents selected. If specified parameter `input` will be
	 * excluded from calculation.
	 *
	 * @param object input
	 * @return integer
	 */
	self._get_total_currents_selected = function(input) {
		var result = 0;
		var elements = self.inputs;
		if (input !== undefined)
			elements = elements.not(input);

		// get number of selected currents
		elements.each(function() {
			result += parseInt($(this).val());
		});

		return result;
	};

	/**
	 * Handle changing number on input element for electric current selection.
	 *
	 * @param object event
	 */
	self.handler.selection_change = function(event) {
		var input = $(this);
		var current_value = parseInt(input.val());
		var selected = 0;
		var total = 0;

		// get number of selected currents
		selected = self._get_total_currents_selected(input);

		// check if currents are out of limit
		if (current_value > self.limit - selected) {
			total = self.limit;
			input.val(self.limit - selected);

		} else {
			total = current_value + selected;
		}

		// update total selection
		self.totals.text(total.toString() + '/' + self.limit.toString());
	};

	/**
	 * Increase or decrease related item count.
	 *
	 * @param integer amount
	 */
	self.handler.control_click = function(event) {
		var control = $(this);
		var cid = control.closest('div.related_item').data('cid');
		var amount = control.data('amount');

		// prevent default link behavior
		event.preventDefault();

		// increase count
		self.cart.alter_item_count_by_cid(cid, amount);
	};

	/**
	 * Handle loading current data from the server.
	 *
	 * @param object data
	 */
	self.handler.current_load = function(data) {
		// no property was found, bail
		if (data === false) {
			return;

		} else {
			self.property = data;
			self._create_current_selection_ui();
		}
	};

	/**
	 * Handle error on server side or communication problem.
	 *
	 * @param object xhr
	 * @param string transfer_status
	 * @param string error_description
	 */
	self.handler.current_load_error = function(xhr, transfer_status, error_description) {
		alert('Error loading electric current selection menu. Reload the page and try again!');
	};

	/**
	 * Validate proper current selection on checkout page.
	 *
	 * @return boolean
	 */
	self.validator.current_selection_page = function() {
		// we require at least one current to be selected
		var result = self._get_total_currents_selected() == self.limit;

		// save selection if it's valid before switching to another page
		if (result) {
			var remark = '';
			for (var index in self.currents)
				remark += self.currents[index] + '\n';

			new Communicator('shop')
				.set_asynchronous(false)
				.use_cache(false)
				.send('json_save_remark', {remark: remark});
		}

		return result;
	};

	/**
	 * Validate proper selection of related products on checkout page.
	 *
	 * @return boolean
	 */
	self.validator.related_items_page = function() {
		return true;
	};

	// finalize object
	self._init();
}

$(function() {
	// create checkout pages only if form is present
	if ($('div#input_details form').length > 0)
		Site.checkout_pages = new Site.CheckoutPages();
});
