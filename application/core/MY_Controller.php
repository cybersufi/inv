<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class MY_Controller extends CI_Controller {

	protected $result = "";
	protected $timmingStart = "";

	function __construct() {
		parent::__construct();
		$this->CI =& get_Instance();
		$this->sitename = $this->CI->config->item('site_name');
		$this->timmingStart = microtime(true);
	}

	public function getTimmingStart() {
		return $this->timmingStart;
	}

}

?>