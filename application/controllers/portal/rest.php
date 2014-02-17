<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Rest extends CI_Controller {

	private $resources = array();

	public function __construct() {
		parent::__construct();
		
		$this->resources = array(
			'Servergroup' => array(
				
			),
			'Servers'
		);

	}

	public function index() {
		$method = strtolower($_SERVER['REQUEST_METHOD']);
		switch ($method) {
			case 'get':
				$id = $this->uri->segment(4, -1);
				$id = ($id > 0) ? $id : $this->input->get('id');
				$this->itemList($id);
				break;
			
			case 'post':
				$this->add();
				break;

			case 'put':
				$this->edit();
				break;

			case 'delete':
				$this->delete();
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