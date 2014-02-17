<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Rest extends CI_Controller {

	function __construct() {
		parent::__construct();
	}

	public function index()
	{
		$this->load->view('welcome_message');
	}
}

?>