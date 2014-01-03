<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Main extends My_Controller {

	private $out = "";

	public function __construct() {
		parent::__construct();
		$this->out = 'servmon/main_view';
		$this->load->model('servmon/servermodel', 'servmodel');
	}

	public function index() {

		$res = $this->servmodel->getPing();

		if ($res['status'] == true) {
			$data['response'] =create_result($this->getTimmingStart(), $res['result']);
		} else {
			$data['response'] =error_result($this->getTimmingStart(), $res['result']);
		}

		$this->servmodel->clearParameter();

    	$this->load->view($this->out, $data);
	}

	/*public function testGroup() {

		$this->load->model('portal/servergroupmodel', 'groupmodel');
		$res = $this->groupmodel->getServerMember();

		if ($res['status'] == true) {
			$data['response'] =create_result($this->getTimmingStart(), $res['result']);
		} else {
			$data['response'] =error_result($this->getTimmingStart(), $res['result']);
		}

		$this->load->view('portal/out_json', $data);

	}*/
}

?>