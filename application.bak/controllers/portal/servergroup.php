<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Servergroup extends MY_Controller {

	private $out = NULL;

	public function __construct() {
		parent::__construct();
		$this->out = 'portal/out_json';
	}

	public function index() {
		$this->load->view('portal/main');
	}

	public function items() {
		$method = strtolower($_SERVER['REQUEST_METHOD']);
		switch ($method) {
			case 'get':
				$id = $this->uri->segment(4, -1);
				$id = ($id > 0) ? $id : $this->input->get('id');
				$this->itemList($id);
				break;
			
			case 'post':
				$this->addItem();
				break;

			case 'put':
				$this->editItem();
				break;

			case 'delete':
				$this->deleteItem();
				break;

			default:
				$error_code = "404";
                $error_message = $error_code;
                $error_message .= " Unsupported method: ";
                $error_message .= $method;
                show_error($error_message, $error_code);
				break;
		}
		
	}
}

?>