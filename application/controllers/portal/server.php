<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Server extends MY_Controller {

	private $out = "";

	public function __construct() {
		parent::__construct();
		$this->out = 'portal/out_json';
	}

	public function rest() {
		$method = strtolower($_SERVER['REQUEST_METHOD']);
		switch ($method) {
			case 'get':
				$id = $this->uri->segment(4, -1);
				$id = ($id > 0) ? $id : $this->input->get('id');
				$this->serverList($id);
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

	private function serverList($id) {
		$this->load->model('portal/membermodel', 'member');
		$start = $this->input->get_post('start');
    	$limit = $this->input->get_post('limit');
    	$this->member->setLimit($limit, $start);

    	$filters = $this->input->get_post('filter');
    	$this->member->addFilterJSON($filters);

    	$sort = $this->input->get_post('sort');
    	$this->member->addSorterJSON($sort);

    	$query = $this->input->get_post('query');

    	if (!empty($query)) {
	    	$this->member->addFilter('membername', $query, 'string');
	    }

	    $flag = $this->input->get_post('flag');
	    if (!empty($flag) && (strcmp($flag, 'group-all') != 0)) {
	    	$flag = explode("-", $flag);
	    	$flagid = 0;
	    	switch ($flag[1]) {
	    		case 'alert': $flagid = 3; break;
	    		case 'warning': $flagid = 2; break;
	    		case 'good': $flagid = 1; break;
	    		default: $flagid = 0; break;
	    	}
	    	$this->member->addFilter('status', $flagid, 'string');
	    }

	    if (is_numeric($itemid) && ($itemid >= 0)) {
    		$this->member->addFilter('id', $itemid, 'string');
	    }

		/*$res = $this->group->get();

		if ($res['status'] == true) {
			$data['response'] =create_result($this->getTimmingStart(), $res['result']);
		} else {
			$data['response'] =error_result($this->getTimmingStart(), $res['result']);
		}

		$this->group->clearParameter();

    	$this->load->view($this->out, $data);*/
	}
}