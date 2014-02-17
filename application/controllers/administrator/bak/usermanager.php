<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class usermanager extends CI_Controller {
	
	private $result = "";
	private $timingStart = "";
	private $sorterValidator = array( "isprimary" => "join_isprimary" );
	private $filterValidator = array();
	
	public function __construct() {
		parent::__construct();
		$this->CI =& get_Instance();
		$this->sitename = $this->CI->config->item('site_name');
		$this->load->model('administrator/usermodel', 'um');
		$this->index = 'administrator/user/index';
		$this->result = 'administrator/result';
		$this->timingStart = microtime(true);
	}

	public function user() {
		$method = strtolower($_SERVER['REQUEST_METHOD']);
		switch ($method) {
			case 'get':
				$id = $this->uri->segment(4, -1);
				$id = ($id > 0) ? $id : $this->input->get('id');
				$this->userList($id);
				break;
			
			case 'post':
				$this->addUser();
				break;

			case 'put':
				$this->editUser();
				break;

			case 'delete':
				$this->deleteUser();
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

	private function userList($id) {
		$start = $this->input->get_post('start');
		$start = empty($start) ? 0 : $start;

    	$limit = $this->input->get_post('limit');
    	$limit = empty($limit) ? 0 : $limit;

    	$filters = $this->input->get_post('filter');
    	$filters = (!empty($filters)) ? filterParser($this->filterValidator, $filters) : NULL;
	    $isFiltered = ($filters != NULL) ? true : false;
    	
		$sort = $this->input->get_post('sort');
		$sort = (!empty($sort)) ? sortParser($this->sorterValidator, $sort) : NULL;
		$isSorted = ($sort != NULL) ? true : false;

		$query = $this->input->get_post('query');
		if (!empty($query)) {
	    	$qs = " username like '%".$query."%'";
	    	if ($isFiltered) {
	    		$filters .= ' AND '.$qs;
	    	} else {
	    		$filters = $qs;
	    		$isFiltered = true;
	    	}
	    }

		$groupid = $this->input->get_post('groupid');
		$groupid = empty($groupid) ? 0 : $groupid;

	    if (is_numeric($id) && ($id >= 0)) {
	    	$qs = " id = '".$id."'";
	    	if ($isFiltered) {
	    		$filters .= ' AND '.$qs;
	    	} else {
	    		$filters = $qs;
	    		$isFiltered = true;
	    	}
	    }

	    $res = $this->um->getUserList($start, $limit, $sort, $filters, $groupid);
	    
	    $data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);

    	$this->load->view($this->result, $data);
	}
	
	private function addUser() {
		
		$params = $this->input->getJsonParameters();

		$res = $this->um->addUser($params);

		$data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);
		
		$this->load->view($this->result, $data);
	}

	private function editUser() {

		$params = $this->input->getJsonParameters();
		
		$res = $this->um->editUser($params);

		$data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);

		$this->load->view($this->result, $data);
	}

	private function deleteUser() {
		$userid = $this->uri->segment(4, -1);
		$userid = is_numeric($userid) ? $userid : null;

		$res = $this->um->deleteUserById($userid);

		$data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);

		$this->load->view($this->result, $data);
	}

	public function usergroups() {
		$method = strtolower($_SERVER['REQUEST_METHOD']);
		switch ($method) {
			case 'get':
				$this->getusergroups();
				break;
			
			case 'post':
				$this->postusergroups();
				break;

			case 'put':
				$this->putusergroups();
				break;

			case 'delete':
				$this->deleteusergroups();
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

	private function getusergroups() {
		$userid = $this->uri->segment(4, -1);
		$userid = ($userid < 0) ? $this->input->get_post('userid') : $userid;

		$start = $this->input->get_post('start');
		$start = empty($start) ? 0 : $start;

    	$limit = $this->input->get_post('limit');
    	$limit = empty($limit) ? 0 : $limit;

    	$filters = $this->input->get_post('filter');
		$filters = (!empty($filters)) ? filterParser($this->filterValidator, $filters) : NULL;
	    $isFiltered = ($filters != NULL) ? true : false;

	    $sort = $this->input->get_post('sort');
	    $sort = (!empty($sort)) ? $sort = sortParser($this->sorterValidator, $sort) : NULL;
	    $isSorted = ($sort != NULL) ? true : false;

    	$query = $this->input->get_post('query');
    	
		$res = $this->um->getUserGroups($userid, $start, $limit, $sort, $filters);
	    $data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);
    	$this->load->view($this->result, $data);
	}

	private function postusergroups() {
		$userid = $this->input->get_post('userid');
		$params = $this->input->getJsonParameters();

		$res = $this->um->addUserGroup($userid, $params);

		$data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);
		
		$this->load->view($this->result, $data);
	}

	private function putusergroups() {
		$userid = $this->input->get_post('userid');
		$params = $this->input->getJsonParameters();

		$res = $this->um->setPrimaryGroup($userid, $params);

		$data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);
		
		$this->load->view($this->result, $data);
	}

	private function deleteusergroups() {
		$groupid = $this->uri->segment(4, -1);
		$groupid = is_numeric($groupid) ? $groupid : null;
		$userid = $this->input->get_post('userid');

		$res = $this->um->deleteUserGroup($userid, $groupid);

		if ($res['status'] == true) {
			$data['response'] = success_result($this->timingStart, "Group with ID '".$userid."' already deleted.");
		} else {
			$data['response'] = error_result($this->timingStart, $res['result']);
		}

		$this->load->view($this->result, $data);
	}
}

?>