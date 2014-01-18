<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Servergroup extends MY_Controller {

	private $out = NULL;

	public function __construct() {
		parent::__construct();
		$this->out = 'portal/out_json';
	}

	public function grouplist() {
		$this->load->model('portal/servergroupmodel', 'group');
		$method = strtolower($_SERVER['REQUEST_METHOD']);
		switch ($method) {
			case 'get':
				$id = $this->uri->segment(4, -1);
				$id = ($id > 0) ? $id : $this->input->get('id');
				$this->getGroup($id);
				break;
			
			case 'post':
				$this->addGroup();
				break;

			case 'put':
				$this->editGroup();
				break;

			case 'delete':
				$this->deleteGroup();
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

	private function getGroup($itemid) {
		$start = $this->input->get_post('start');
    	$limit = $this->input->get_post('limit');
    	$this->group->setLimit($limit, $start);

    	$filters = $this->input->get_post('filter');
    	$this->group->addFilterJSON($filters);

    	$sort = $this->input->get_post('sort');
    	//echo $sort;
    	$this->group->addSorterJSON($sort);

    	$query = $this->input->get_post('query');

    	if (!empty($query)) {
	    	$this->group->addFilter('groupname', $query, 'string');
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
	    	$this->group->addFilter('status', $flagid, 'string');
	    }

	    if (is_numeric($itemid) && ($itemid >= 0)) {
    		$this->group->addFilter('id', $itemid, 'string');
	    }

		$res = $this->group->get();

		if ($res['status'] == true) {
			$data['response'] =create_result($this->getTimmingStart(), $res['result']);
		} else {
			$data['response'] =error_result($this->getTimmingStart(), $res['result']);
		}

		$this->group->clearParameter();

    	$this->load->view($this->out, $data);
	}

	private function addGroup() {
		$params = $this->input->getJsonParameters();

		$res = $this->group->addArray($params);

		if ($res['status'] == true) {
			$data['response'] = create_result($this->getTimmingStart(), $res['result']);
		} else {
			$data['response'] = error_result($this->getTimmingStart(), $res['result']);
		}
		
		$this->load->view($this->out, $data);
	}

	private function editGroup() {
		$params = $this->input->getJsonParameters();
		
		$res = $this->group->editArray($params);

		if ($res['status'] == true) {
			$data['response'] = create_result($this->getTimmingStart(), $res['result']);
		} else {
			$data['response'] = error_result($this->getTimmingStart(), $res['result']);
		}
		
		$this->load->view($this->out, $data);
	}

	private function deleteGroup() {
		$id = $this->uri->segment(4, -1);
		$id = is_numeric($id) ? $id : null;

		$res = $this->group->delete($id);

		if ($res['status'] == true) {
			$data['response'] = success_result($this->getTimmingStart(), "Item already deleted.");
		} else {
			$data['response'] = error_result($this->getTimmingStart(), $res['result']);
		}

		$this->load->view($this->out, $data);
	}


	public function groupmember() {
		$this->load->model('portal/servermodel', 'server');
		$method = strtolower($_SERVER['REQUEST_METHOD']);
		switch ($method) {
			case 'get':
				$id = $this->uri->segment(4, -1);
				$id = ($id > 0) ? $id : $this->input->get('id');
				$this->getMember($id);
				break;
			
			case 'post':
				$this->addMember();
				break;

			case 'put':
				$this->editMember();
				break;

			case 'delete':
				$this->deleteMember();
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

	private function getMember($groupid) {
		$start = $this->input->get_post('start');
    	$limit = $this->input->get_post('limit');
    	$this->server->setLimit($limit, $start);

    	$filters = $this->input->get_post('filter');
    	$this->server->addFilterJSON($filters);

    	$sort = $this->input->get_post('sort');
    	//echo $sort;
    	$this->server->addSorterJSON($sort);

    	$query = $this->input->get_post('query');

    	if (!empty($query)) {
	    	$this->server->addFilter('servername', $query, 'string');
	    }

	    $flag = $this->input->get_post('flag');
	    if (!empty($flag) && (strcmp($flag, 'server-all') != 0)) {
	    	$flag = explode("-", $flag);
	    	$flagid = 0;
	    	switch ($flag[1]) {
	    		case 'alert': $flagid = 3; break;
	    		case 'warning': $flagid = 2; break;
	    		case 'good': $flagid = 1; break;
	    		default: $flagid = 0; break;
	    	}
	    	$this->server->addFilter('status', $flagid, 'string');
	    }

	    if (is_numeric($groupid) && ($groupid >= 0)) {
    		$this->server->addFilter('groupid', $groupid, 'string');
	    }

		$res = $this->server->get();

		if ($res['status'] == true) {
			$data['response'] =create_result($this->getTimmingStart(), $res['result']);
		} else {
			$data['response'] =error_result($this->getTimmingStart(), $res['result']);
		}

		$this->server->clearParameter();

    	$this->load->view($this->out, $data);
	}

	private function addMember() {
		return null;
	}

	private function editMember() {
		return null;
	}

	private function deleteMember() {
		return null;
	}

	public function grouptree() {
		$this->load->model('portal/servergroupmodel', 'group');
		$res = $this->group->getTreeStructure();

		if ($res['status'] == true) {
			$data['response'] =create_result($this->getTimmingStart(), $res['result']);
		} else {
			$data['response'] =error_result($this->getTimmingStart(), $res['result']);
		}

    	$this->load->view($this->out, $data);
	}

}

?>