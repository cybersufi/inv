<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Usermanager extends MY_Controller {

	function __construct() {
		parent::__construct();

		$this->load->model('administrator/groupmodel', 'um');
		$this->result = 'administrator/result';

		$this->sorterValidator = array();
		$this->filterValidator = array();

	}

	protected function get() {

	}

	protected function post() {


	}

	protected function put() {

	}

	protected function delete() {


	}

}