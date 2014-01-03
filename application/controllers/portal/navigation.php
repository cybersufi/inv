<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Navigation extends CI_Controller {

	private $links = "";
	private $timingstart = 0;
	private $out = "";


	public function __construct() {
		parent::__construct();
		$this->out = 'portal/out_json';
		$this->timingStart = microtime(true);
	}

	public function main() {
		$links = array(
			array(
				"id" => "0",
				"linkname" => "All Group",
				"linkurl" => "group-all"
			), array(
				"id" => "1",
				"linkname" => "Alert Flag",
				"linkurl" => "group-alert"
			), array(
				"id" => "2",
				"linkname" => "Warning Flag",
				"linkurl" => "group-warning"
			), array(
				"id" => "3",
				"linkname" => "Good Flag",
				"linkurl" => "group-good"
			)
		);

		$data['response'] = create_result($this->timingStart, $links);

    	$this->load->view($this->out, $data);
	}

	public function setting() {
		$links = array(
			array(
				"id" => "1",
				"linkname" => "Add Group",
				"linkurl" => "group-add"
			)
		);

		$data['response'] = create_result($this->timingStart, $links);

    	$this->load->view($this->out, $data);
	}

	public function groupMember() {
		return null;
	}

	public function statusIcon() {
		return null;
	}

	public function index() {
		$this->load->view('portal/main');
	}
}

?>