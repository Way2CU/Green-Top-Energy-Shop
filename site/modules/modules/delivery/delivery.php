<?php

/**
 * Green Tops Energy - Free Delivery Method
 *
 * Author: Mladen Mijatov
 */
use Core\Module;

require_once('units/interval_manager.php');
require_once('units/time_manager.php');


class delivery extends Module {
	private static $_instance;

	/**
	 * Constructor
	 */
	protected function __construct() {
		global $section;

		parent::__construct(__FILE__);

		// register delivery method and create menu items
		if (class_exists('backend') && class_exists('shop')) {
			require_once('units/method.php');
			Free_DeliveryMethod::getInstance($this);
		}
	}

	/**
	 * Public function that creates a single instance
	 */
	public static function getInstance() {
		if (!isset(self::$_instance))
			self::$_instance = new self();

		return self::$_instance;
	}

	/**
	 * Transfers control to module functions
	 *
	 * @param array $params
	 * @param array $children
	 */
	public function transferControl($params=array(), $children=array()) {
	}

	/**
	 * Event triggered upon module initialization
	 */
	public function onInit() {
	}

	/**
	 * Event triggered upon module deinitialization
	 */
	public function onDisable() {
	}
}
