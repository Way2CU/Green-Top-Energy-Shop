/**
 * Main JavaScript
 * Site Name
 *
 * Copyright (c) 2015. by Way2CU, http://way2cu.com
 * Authors:
 */

// create or use existing site scope
var Site = Site || {};

// make sure variable cache exists
Site.variable_cache = Site.variable_cache || {};


/**
 * Check if site is being displayed on mobile.
 * @return boolean
 */
Site.is_mobile = function() {
	var result = false;

	// check for cached value
	if ('mobile_version' in Site.variable_cache) {
		result = Site.variable_cache['mobile_version'];

	} else {
		// detect if site is mobile
		var elements = document.getElementsByName('viewport');

		// check all tags and find `meta`
		for (var i=0, count=elements.length; i<count; i++) {
			var tag = elements[i];

			if (tag.tagName == 'META') {
				result = true;
				break;
			}
		}

		// cache value so next time we are faster
		Site.variable_cache['mobile_version'] = result;
	}

	return result;
};

/**
 * Dialog system for logging in and out and as well as registering
 * new accounts on the system.
 */
Site.DialogSystem = function() {
	var self = this;

	self.message = {};
	self.sign_up = {};
	self.login = {};
	self.recovery = {};

	/**
	 * Complete object initialization.
	 */
	self._init = function() {
		// create error reporting dialog
		self.message.content = $('<div>');
		self.message.dialog = new Dialog();
		self.message.dialog
				.setSize(Site.is_mobile() ? 300 : 400, 'auto')
				.setScroll(false)
				.setClearOnClose(false)
				.setContent(self.message.content)
				.addClass('login');

		// create sign up dialog
		self.sign_up.dialog = new Dialog();
		self.sign_up.dialog.setSize(Site.is_mobile() ? 300 : 400, 'auto');
		self.sign_up.dialog.setScroll(false);
		self.sign_up.dialog.setClearOnClose(false);
		self.sign_up.dialog.setError(false);
		self.sign_up.dialog.addClass('login sign-up');

		self.sign_up.content = $('<form>');
		self.sign_up.message = $('<p>');

		self.sign_up.label_first_name = $('<label>');
		self.sign_up.input_first_name = $('<input>');

		self.sign_up.label_last_name = $('<label>');
		self.sign_up.input_last_name = $('<input>');

		self.sign_up.label_username = $('<label>');
		self.sign_up.input_username = $('<input>');

		self.sign_up.label_password = $('<label>');
		self.sign_up.input_password = $('<input>');

		self.sign_up.label_repeat_password = $('<label>');
		self.sign_up.input_repeat_password = $('<input>');

		self.sign_up.label_terms_agree = $('<label>');
		self.sign_up.input_terms_agree = $('<input>');
		self.sign_up.span_terms_agree = $('<span>');

		// configure elements
		self.sign_up.input_first_name
				.attr('name', 'first_name')
				.attr('type', 'text')
				.attr('maxlength', 100)
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleSignUpKeyPress);

		self.sign_up.input_last_name
				.attr('name', 'last_name')
				.attr('type', 'text')
				.attr('maxlength', 100)
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleSignUpKeyPress);

		self.sign_up.input_username
				.attr('name', 'username')
				.attr('type', 'email')
				.attr('maxlength', 50)
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleSignUpKeyPress);

		self.sign_up.input_password
				.attr('name', 'password')
				.attr('type', 'password')
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleSignUpKeyPress);

		self.sign_up.input_repeat_password
				.attr('name', 'repeat_password')
				.attr('type', 'password')
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleSignUpKeyPress);

		self.sign_up.input_terms_agree
				.attr('name', 'agreed')
				.attr('type', 'checkbox')
				.on('click', self._handleAgreeClick);

		// pack sign up dialog
		self.sign_up.message.appendTo(self.sign_up.content);

		self.sign_up.label_first_name
				.addClass('inline')
				.append(self.sign_up.input_first_name)
				.appendTo(self.sign_up.content);

		self.sign_up.label_last_name
				.addClass('inline')
				.append(self.sign_up.input_last_name)
				.appendTo(self.sign_up.content);

		self.sign_up.label_username
				.append(self.sign_up.input_username)
				.appendTo(self.sign_up.content);

		self.sign_up.content.append('<hr>');

		self.sign_up.label_password
				.append(self.sign_up.input_password)
				.appendTo(self.sign_up.content);

		self.sign_up.label_repeat_password
				.append(self.sign_up.input_repeat_password)
				.appendTo(self.sign_up.content);

		self.sign_up.content.append('<hr>');

		self.sign_up.label_terms_agree
				.append(self.sign_up.input_terms_agree)
				.append(self.sign_up.span_terms_agree)
				.appendTo(self.sign_up.content);

		self.sign_up.dialog.setContent(self.sign_up.content);

		// create sign up button
		self.sign_up.signup_button = $('<a>');
		self.sign_up.signup_button
				.attr('href', 'javascript:void(0);')
				.click(self._handleSignUpClick);
		self.sign_up.dialog.addControl(self.sign_up.signup_button);

		// prepare dialog
		self.login.dialog = new Dialog();
		self.login.dialog.setSize(Site.is_mobile() ? 300 : 400, 'auto');
		self.login.dialog.setScroll(false);
		self.login.dialog.setClearOnClose(false);
		self.login.dialog.setError(false);
		self.login.dialog.addClass('login');

		// create login button
		self.login.login_button = $('<a>');
		self.login.login_button
				.attr('href', 'javascript:void(0);')
				.click(self._handleLoginClick);
		self.login.dialog.addControl(self.login.login_button);

		// create login dialog content
		self.login.content = $('<form>');
		self.login.captcha_container = $('<div>');
		self.login.message = $('<p>');

		self.login.label_username = $('<label>');
		self.login.input_username = $('<input>');

		self.login.label_password = $('<label>');
		self.login.input_password = $('<input>');

		self.login.link_recovery = $('<a>');

		self.login.label_captcha = $('<label>');
		self.login.input_captcha = $('<input>');
		self.login.image_captcha = $('<img>');

		self.login.label_remember_me = $('<label>');
		self.login.input_remember_me = $('<input>');
		self.login.span_remember_me = $('<span>');

		// configure elements
		self.login.input_username
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleLoginKeyPress)
				.attr('name', 'email')
				.attr('type', 'email');

		self.login.input_password
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleLoginKeyPress)
				.attr('name', 'password')
				.attr('type', 'password');

		self.login.input_remember_me
				.attr('name', 'lasting')
				.attr('type', 'checkbox');

		self.login.link_recovery
				.click(self._showRecoveryDialog)
				.attr('href', 'javascript: void(0)');

		self.login.content
				.attr('action', '/')
				.attr('method', 'post');

		// load username if previously stored
		var cached_username = localStorage.getItem('username');
		if (cached_username)
			self.login.input_username.val(cached_username);

		// pack elements
		self.login.content.append(self.login.message);
		self.login.label_username
				.append(self.login.input_username)
				.appendTo(self.login.content);

		self.login.label_password
				.append(self.login.input_password)
				.appendTo(self.login.content);

		self.login.label_captcha
				.append(self.login.input_captcha)
				.append(self.login.image_captcha)
				.appendTo(self.login.captcha_container);

		self.login.label_remember_me
				.append(self.login.input_remember_me)
				.append(self.login.span_remember_me)
				.appendTo(self.login.content);

		self.login.captcha_container
				.addClass('captcha')
				.hide()
				.appendTo(self.login.content);

		self.login.content.append(self.login.link_recovery);
		self.login.dialog.setContent(self.login.content);

		// prepare recovery dialog
		self.recovery.dialog = new Dialog();
		self.recovery.dialog.setSize(Site.is_mobile() ? 300 : 400, 'auto');
		self.recovery.dialog.setScroll(false);
		self.recovery.dialog.setClearOnClose(false);
		self.recovery.dialog.setError(false);
		self.recovery.dialog.addClass('login recovery');

		// create recover button
		self.recovery.recover_button = $('<a>');
		self.recovery.recover_button
				.attr('href', 'javascript: void(0);')
				.click(self._handleRecoverClick);

		self.recovery.dialog.addControl(self.recovery.recover_button);

		// create recovery dialog content
		self.recovery.content = $('<div>');
		self.recovery.captcha_container = $('<div>');
		self.recovery.message = $('<p>');

		self.recovery.label_email = $('<label>');
		self.recovery.input_email = $('<input>');

		self.recovery.label_captcha = $('<label>');
		self.recovery.input_captcha = $('<input>');
		self.recovery.image_captcha = $('<img>');

		self.recovery.input_email
				.attr('name', 'email')
				.attr('type', 'text')
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleRecoveryKeyPress);

		// prepare captcha image
		var base = $('base').attr('href');

		self.recovery.input_captcha
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleRecoveryKeyPress)
				.addClass('ltr')
				.attr('maxlength', 4);

		self.login.input_captcha
				.on('focusin', self._handleFocusIn)
				.on('keyup', self._handleLoginKeyPress)
				.addClass('ltr')
				.attr('maxlength', 4);

		self.recovery.image_captcha
				.click(self._handleCaptchaClick)
				.attr('src', base + '?section=captcha&action=print_image');
		self.login.image_captcha
				.click(self._handleCaptchaClick)
				.attr('src', base + '?section=captcha&action=print_image');

		// pack elements
		self.recovery.content.append(self.recovery.message);
		self.recovery.label_email
				.append(self.recovery.input_email)
				.appendTo(self.recovery.content);

		self.recovery.label_captcha
				.append(self.recovery.input_captcha)
				.append(self.recovery.image_captcha)
				.appendTo(self.recovery.captcha_container);

		self.recovery.captcha_container
				.addClass('captcha')
				.appendTo(self.recovery.content);
		self.recovery.dialog.setContent(self.recovery.content);

		// bulk load language constants
		var constants = [
				'login', 'login_dialog_title', 'login_dialog_message', 'label_email', 'label_password',
				'label_password_recovery', 'recovery_dialog_title', 'recovery_dialog_message', 'submit',
				'label_captcha', 'captcha_message', 'signup_dialog_title', 'sign_up', 'signup_dialog_message',
				'label_repeat_password', 'label_first_name', 'label_last_name', 'label_agree_to_terms',
				'label_remember_me'
			];
		language_handler.getTextArrayAsync(null, constants, self._handleStringsLoaded);

		// connect events
		$('a.login').click(self._showLoginDialog);
		$('a.logout').click(self._handleLogout);
		$('a.sign-up').click(self._showSignUpDialog);
		$('form.sign-up input').on('focusin', self._handleFocusIn);
	}

	/**
	 * Remove invalid class on focus in.
	 *
	 * @param object event
	 */
	self._handleFocusIn = function(event) {
		$(this).removeClass('invalid');
	};

	/**
	 * Handle pressing key on input fields in login dialog.
	 *
	 * @param object event
	 */
	self._handleLoginKeyPress = function(event) {
		var key_value = event.keyCode;

		switch (key_value) {
			case 13:  // enter
				self.login.login_button.trigger('click');
				event.preventDefault();
				break;

			case 27:
				self.login.dialog.hide();
				event.preventDefault();
				break;
		}
	};

	/**
	 * Handle pressing key on input fields in recovery dialog.
	 *
	 * @param object event
	 */
	self._handleRecoveryKeyPress = function(event) {
		var key_value = event.keyCode;

		switch (key_value) {
			case 13:  // enter
				self.recovery.recover_button.trigger('click');
				event.preventDefault();
				break;

			case 27:
				self.recovery.dialog.hide();
				event.preventDefault();
				break;
		}
	};

	/**
	 * Handle pressing key on input fields in login dialog.
	 *
	 * @param object event
	 */
	self._handleSignUpKeyPress = function(event) {
		var key_value = event.keyCode;

		switch (key_value) {
			case 13:  // enter
				self.sign_up.signup_button.trigger('click');
				event.preventDefault();
				break;

			case 27:
				self.sign_up.dialog.hide();
				event.preventDefault();
				break;
		}
	};

	/**
	 * Handle clicking on agree to terms.
	 *
	 * @param object event
	 */
	self._handleAgreeClick = function(event) {
		var item = $(this);
		item.removeClass('invalid');
	};

	/**
	 * Handle loading language constants from server.
	 *
	 * @param object data
	 */
	self._handleStringsLoaded = function(data) {
		with (self.login) {
			dialog.setTitle(data['login_dialog_title']);
			message.html(data['login_dialog_message']);
			login_button.html(data['login']);

			input_username.attr('placeholder', data['label_email']);
			input_password.attr('placeholder', data['label_password']);
			input_captcha.attr('placeholder', data['label_captcha']);
			link_recovery.html(data['label_password_recovery']);
			image_captcha.attr('title', data['captcha_message']);
			span_remember_me.html(data['label_remember_me']);
		}

		with (self.recovery) {
			dialog.setTitle(data['recovery_dialog_title']);
			message.html(data['recovery_dialog_message']);
			recover_button.html(data['submit']);

			input_email.attr('placeholder', data['label_email']);
			input_captcha.attr('placeholder', data['label_captcha']);
			image_captcha.attr('title', data['captcha_message']);
		}

		with (self.sign_up) {
			dialog.setTitle(data['signup_dialog_title']);
			message.html(data['signup_dialog_message']);
			signup_button.html(data['sign_up']);

			input_first_name.attr('placeholder', data['label_first_name']);
			input_last_name.attr('placeholder', data['label_last_name']);
			input_username.attr('placeholder', data['label_email']);
			input_password.attr('placeholder', data['label_password']);
			input_repeat_password.attr('placeholder', data['label_repeat_password']);
			span_terms_agree.html(data['label_agree_to_terms']);
		}
	};

	/**
	 * Logout user and navigate to linked page.
	 *
	 * @param object event
	 */
	self._handleLogout = function(event) {
		event.preventDefault();

		// perform logout
		new Communicator('backend')
				.on_success(function(data) {
					if (!data.error)
						window.location.reload();
				})
				.get('json_logout');
	};

	/**
	 * Handle clicking on login link.
	 *
	 * @param object event
	 */
	self._showLoginDialog = function(event) {
		// prevent default link behavior
		event.preventDefault();

		// show dialog
		self.login.dialog.show();

		// focus username
		setTimeout(function() {
			self.login.input_username[0].focus();
		}, 100);
	};

	/**
	 * Show password recovery dialog.
	 *
	 * @param object event
	 */
	self._showRecoveryDialog = function(event) {
		// prevent default link behavior
		event.preventDefault();

		self.login.dialog.hide();
		self.recovery.dialog.show();

		// focus username
		setTimeout(function() {
			self.recovery.input_email[0].focus();
		}, 100);
	};

	/**
	 * Show sign up dialog when user clicks on get started link.
	 *
	 * @param object event
	 */
	self._showSignUpDialog = function(event) {
		// prevent default link behavior
		event.preventDefault();

		// show dialog
		self.sign_up.dialog.show();

		// focus username
		setTimeout(function() {
			self.sign_up.input_username[0].focus();
		}, 100);
	};

	/**
	 * Reload captcha image.
	 */
	self._handleCaptchaClick = function(event) {
		event.preventDefault();

		var base = $('base').attr('href');
		var url = base + '?section=captcha&action=print_image&' + Date.now();

		self.recovery.image_captcha.attr('src', url);
		self.login.image_captcha.attr('src', url);
	};

	/**
	 * Handle clicking on sign up button in dialog.
	 *
	 * @param object event
	 */
	self._handleSignUpClick = function(event) {
		// prevent form from submitting
		event.preventDefault();

		// check if all the fields are valid
		if (self.sign_up.input_first_name.val() == '')
			self.sign_up.input_first_name.addClass('invalid');

		if (self.sign_up.input_last_name.val() == '')
			self.sign_up.input_last_name.addClass('invalid');

		if (self.sign_up.input_username.val() == '')
			self.sign_up.input_username.addClass('invalid');

		if (self.sign_up.input_password.val() == '')
			self.sign_up.input_password.addClass('invalid');

		if (self.sign_up.input_password.val() != self.sign_up.input_repeat_password.val()) {
			self.sign_up.input_password.addClass('invalid');
			self.sign_up.input_repeat_password.addClass('invalid');
		}

		if (!self.sign_up.input_terms_agree.is(':checked'))
			self.sign_up.input_terms_agree.addClass('invalid');

		// cache objects
		var fields = self.sign_up.content.find('input');

		// collect data
		var data = {};
		fields.each(function(index) {
			var field = $(this);
			var name = field.attr('name');

			if (field.attr('type') != 'checkbox')
				data[name] = field.val(); else
				data[name] = field.is(':checked') ? 1 : 0;
		});

		// submit data
		if (fields.filter('.invalid').length == 0)
			self._performSignUp(data);
	};

	/**
	 * Perform sign up process with specified data.
	 *
	 * @param object data
	 */
	self._performSignUp = function(data) {
		// make sure user agrees
		if (data.agreed != 1)
			return;

		// fill in remaining data
		data.email = data.username;
		data.show_result = 1;

		// create new user and redirect
		new Communicator('backend')
				.on_success(self._handleSignupSuccess)
				.on_error(self._handleSignupError)
				.send('save_unpriviledged_user', data);
	};

	/**
	 * Handle successful submission of sign up data.
	 *
	 * @param object data
	 */
	self._handleSignupSuccess = function(data) {
		if (!data.error) {
			// hide signup dialog
			self.sign_up.dialog.hide();

			// successfully created new user account, reload
			self.message.dialog
					.setError(false)
					.setTitle(language_handler.getText(null, 'signup_dialog_title'));
			self.message.content.html(language_handler.getText(null, 'signup_completed_message'));
			self.message.dialog.show();

		} else {
			// hide signup dialog
			self.sign_up.dialog.hide();

			// there was a problem creating new user
			self.message.dialog
					.setError(true)
					.setTitle(language_handler.getText(null, 'signup_dialog_title'));
			self.message.content.html(data.message);
			self.message.dialog.show();
		}
	};

	/**
	 * Handle communication error during sign up process.
	 *
	 * @param object xhr
	 * @param string status_code
	 * @param string description
	 */
	self._handleSignupError = function(xhr, status_code, description) {
		// hide signup dialog
		self.sign_up.dialog.hide();

		// show error message
		self.message.dialog
				.setError(true)
				.setTitle(language_handler.getText(null, 'signup_dialog_title'));
		self.message.content.html(description);
		self.message.dialog.show();
	};

	/**
	 * Handle clicking on login button in dialog.
	 *
	 * @param object event
	 */
	self._handleLoginClick = function(event) {
		// prevent default control behavior
		event.preventDefault();

		// prepare data
		var data = {
				username: self.login.input_username.val(),
				password: self.login.input_password.val(),
				captcha: self.login.input_captcha.val()
			};

		// create communicator
		new Communicator('backend')
				.on_success(self._handleLoginSuccess)
				.on_error(self._handleLoginError)
				.get('json_login', data);
	};

	/**
	 * Handle successful login response.
	 *
	 * @param object data
	 */
	self._handleLoginSuccess = function(data) {
		if (data.logged_in) {
			// hide login dialog
			self.login.dialog.hide();

			// store username for next time
			var username = self.login.input_username.val();
			localStorage.setItem('username', username);

			// reload page on successful login
			window.location.reload();

			self.message.content.html(language_handler.getText(null, 'login_successful'));
			self.message.dialog
					.setError(false)
					.setTitle(language_handler.getText(null, 'signup_dialog_title'))
					.setCloseCallback(function() {
						window.location.reload();
						this.clearCloseCallback();
					});
			self.message.dialog.show();

		} else {
			// hide login dialog
			self.login.dialog.hide();

			// show error message
			self.message.dialog
					.setError(true)
					.setTitle(language_handler.getText(null, 'login_dialog_title'));
			self.message.content.html(data.message);
			self.message.dialog.setCloseCallback(function() {
						setTimeout(function() {
							self.login.dialog.show();
						}, 100);
					});
			self.message.dialog.show();

			// show captcha if required
			if (data.show_captcha)
				self.login.captcha_container.slideDown(); else
				self.login.captcha_container.slideUp();
		}
	};

	/**
	 * Handle communication error.
	 *
	 * @param object xhr
	 * @param string transfer_status
	 * @param string description
	 */
	self._handleLoginError = function(xhr, transfer_status, description) {
		// hide login dialog
		self.login.dialog.hide();

		// show error dialog
		self.message.dialog
				.setError(true)
				.setTitle(language_handler.getText(null, 'login_dialog_title'));
		self.message.content.html(description);
		self.message.dialog.show();
	};

	/**
	 * Handle clicking on recover button in dialog.
	 *
	 * @param object event
	 */
	self._handleRecoverClick = function(event) {
		// prevent default control behavior
		event.preventDefault();

		// prepare data
		var data = {
				username: self.recovery.input_email.val(),
				email: self.recovery.input_email.val(),
				captcha: self.recovery.input_captcha.val()
			};

		// create communicator
		new Communicator('backend')
				.on_success(self._handleRecoverSuccess)
				.on_error(self._handleRecoverError)
				.get('password_recovery', data);
	};

	/**
	 * Handle response from server for password recovery.
	 *
	 * @param object data
	 */
	self._handleRecoverSuccess = function(data) {
		if (!data.error) {
			// hide recovery dialog
			self.recovery.dialog.hide();

			// successfully created new user account, reload
			self.message.dialog
					.setError(false)
					.setTitle(language_handler.getText(null, 'recovery_dialog_title'));
			self.message.content.html(language_handler.getText(null, 'recovery_completed_message'));
			self.message.dialog.show();

		} else {
			// hide recovery dialog
			self.recovery.dialog.hide();

			// there was a problem creating new user
			self.message.dialog
					.setError(true)
					.setTitle(language_handler.getText(null, 'recovery_dialog_title'));
			self.message.content.html(data.message);
			self.message.dialog.show();
		}
	};

	/**
	 * Handle error in communication with server.
	 *
	 * @param object xhr
	 * @param string transfer_status
	 * @param string description
	 */
	self._handleRecoverError = function(xhr, transfer_status, description) {
		// hide login dialog
		self.recovery.dialog.hide();

		// show error dialog
		self.message.dialog
				.setError(true)
				.setTitle(language_handler.getText(null, 'recovery_dialog_title'));
		self.message.content.html(description);
		self.message.dialog.show();
	};

	// finalize object
	self._init();
}

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {
	if (Site.is_mobile())
		Site.mobile_menu = new Caracal.MobileMenu();

	// create user dialogs
	Site.dialog_system = new Site.DialogSystem()

	// create controls for each slide
	var slides = $('section#packages div.package');
	var control_container = $('section#packages div.controls');

	slides.each(function(index) {
		$('<a>')
			.attr('href', 'javascript: void(0);')
			.appendTo(control_container);
	});

	// create package slider
	Site.package_slider = new PageControl('section#packages', 'div.package');
	Site.package_slider
		.attachControls('section#packages div.controls a');

	// connect checkout buttons
	$('div.package a.buy').on('click', Site.handle_checkout_click);
};


// connect document `load` event with handler function
$(Site.on_load);
