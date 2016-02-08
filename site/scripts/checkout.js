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
		self.container = $('div.related_item[data-uid="' + self.item.uid + '"]');
		self.count_label = self.container.find('span.count');
	};

	/**
	 * Handler externally called when item count has changed.
	 */
	self.handle_change = function() {
		if (self.container === null)
			self._init_user_interface();

		self.count_label.text(self.item.count);
	};

	/**
	 * Handle shopping cart currency change.
	 *
	 * @param string currency
	 * @param float rate
	 */
	self.handle_currency_change = function(currency, rate) {
	};

	/**
	 * Handler externally called before item removal.
	 */
	self.handle_remove = function() {
		self.count_label.text('0');
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

	self.validator = {};
	self.handler = {};

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

		// load current
		self._load_current();
	};

	/**
	 * Load current selection data from the server.
	 */
	self._load_current = function() {
		var item_id = window.location.pathname.split('/').pop();
		var data = {
				item_uid: item_id,
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

		for (index in values) {
			var value = values[index];
			var label = $('<label>');
			var input = $('<input>');
			var span = $('<span>');

			// configure checkbox
			input
				.attr('type', 'checkbox')
				.data('value', value)
				.on('toggle', self.handler.current_checkbox_toggle);

			span.text(value);

			label
				.append(input)
				.append(span)
				.appendTo(self.current_selection_page.find('div.container'));
		}
	};

	/**
	 * Increase related item count.
	 *
	 * @param string uid
	 */
	self.increase_related_count = function(uid) {
	};

	/**
	 * Decrease related item count.
	 *
	 * @param string uid
	 */
	self.decrease_related_count = function(uid) {
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
	};

	/**
	 * Handle toggling current selection.
	 *
	 * @param object event
	 */
	self.handler.current_checkbox_toggle = function(event) {
		// prevent selecting more than three
		if (self.currents.length == 3) {
			event.preventDefault();
			return;
		}

		// update current selection array
		var input = $(this);
		var value = input.data('value');
		var index = self.currents.indexOf(value);

		if (input.is(':checked') && index == -1) {
			self.currents.push(value);

		} else if (!input.is(':checked') && index > -1) {
			self.currents.splice(index, 1);
		}
	};

	/**
	 * Validate proper current selection on checkout page.
	 *
	 * @return boolean
	 */
	self.validator.current_selection_page = function(params) {
		// we require at least one current to be selected
		var result = self.currents.length > 0;

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
	 * @retun boolean
	 */
	self.validator.related_items_page = function(params) {
		return true;
	};

	// finalize object
	self._init();
}

$(function() {
	Site.checkout_pages = new Site.CheckoutPages();
});
