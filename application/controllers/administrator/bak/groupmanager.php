<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class groupmanager extends CI_Controller {
	
	private $result = "";
	private $timingStart = "";
	private $sorterValidator = array( "usergroup" => "groupname" );
	private $filterValidator = array();
	
	public function __construct() {
		parent::__construct();
		$this->CI =& get_Instance();
		$this->sitename = $this->CI->config->item('site_name');
		$this->load->model('administrator/groupmodel', 'gm');
		$this->index = 'administrator/user/index';
		$this->result = 'administrator/result';
		$this->timingStart = microtime(true);
	}
	
	public function group() {
		$method = strtolower($_SERVER['REQUEST_METHOD']);
		switch ($method) {
			case 'get':
				$id = $this->uri->segment(4, -1);
				$id = ($id > 0) ? $id : $this->input->get('id');
				$this->groupList($id);
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

	private function groupList($id = null) {
		$start = $this->input->get_post('start');
		$start = empty($start) ? 0 : $start;

    	$limit = $this->input->get_post('limit');
    	$limit = empty($limit) ? 0 : $limit;


    	$filters = $this->input->get_post('filter');
		$filters = (!empty($filters)) ? filterParser($this->filtersValidator, $filters) : NULL;
	    $isFiltered = ($filters != NULL) ? true : false;

	    $sort = $this->input->get_post('sort');
	    $sort = (!empty($sort)) ? sortParser($this->sorterValidator, $sort) : NULL;
	    $isSorted = ($sort != NULL) ? true : false;

    	$query = $this->input->get_post('query');
    	if (!empty($query)) {
	    	$qs = " groupname like '%".$query."%'";
	    	if ($isFiltered) {
	    		$filters .= ' AND '.$qs;
	    	} else {
	    		$filters = $qs;
	    		$isFiltered = true;
	    	}
	    }

	    if (is_numeric($id) && ($id >= 0)) {
	    	$qs = " id = '".$id."'";
	    	if ($isFiltered) {
	    		$filters .= ' AND '.$qs;
	    	} else {
	    		$filters = $qs;
	    		$isFiltered = true;
	    	}
	    }
		
		$userid = $this->input->get_post('userid');
		$userid = (!empty($userid)) ? $userid : NULL;

	    $res = $this->gm->getGroupList($start, $limit, $sort, $filters, $userid);

	    $data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);

    	$this->load->view($this->result, $data);
	}

	private function addGroup() {
	
		$params = $this->input->getJsonParameters();
		
		$res = $this->gm->addGroup($params);
		
		$data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);
		
		$this->load->view($this->result, $data);
	}

	private function editGroup() {

		$params = $this->input->getJsonParameters();
		
		$res = $this->gm->editUser($params);

		if ($res['status'] == true) {
	    	$data['response'] = create_result($this->timingStart, $res['result']);
	    } else {
	    	$data['response'] = error_result($this->timingStart, "Unable to update the record. Please try again latter");
	    }
		
		$this->load->view($this->result, $data);
	}

	private function deleteGroup() {
		$id = $this->uri->segment(4, -1);
		$id = is_numeric($id) ? $id : null;

		$res = $this->gm->deleteGroupById($id);

		if ($res['status'] == true) {
			$data['response'] = success_result($this->timingStart, "Group '".$res['result']."' already deleted.");
		} else {
			$data['response'] = error_result($this->timingStart, $res['result']);
		}

		$this->load->view($this->result, $data);
	}

	public function groupmember() {
		$method = strtolower($_SERVER['REQUEST_METHOD']);
		switch ($method) {
			case 'get':
				$this->getGroupMembers();
				break;
			
			case 'post':
				$this->addGroupMember();
				break;

			case 'delete':
				$this->deleteGroupMember();
				break;

			case 'put':
				$this->setPrimaryGroup();
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

	private function getGroupMembers() {

		$start = $this->input->get_post('start');
    	$start = empty($start) ? 0 : $start;
    	
    	$limit = $this->input->get_post('limit');
    	$limit = empty($limit) ? 0 : $limit;


		$id = $this->uri->segment(4, -1);
		$id = ($id < 0) ? $this->input->get_post('groupid') : $id;


    	$filters = $this->input->get_post('filter');
    	$filters = (!empty($filters)) ? filterParser($this->filterValidator, $filters) : NULL;
	    $isFiltered = ($filters != NULL) ? true : false;

		$sort = $this->input->get_post('sort');
		$sort = (!empty($sort)) ? $sort = sortParser($this->sorterValidator, $sort) : NULL;
	    $isSorted = ($sort != NULL) ? true : false;

		$query = $this->input->get_post('query');

		$res = $this->gm->getGroupMember($id, $start, $limit, $sort, $filters);
	    
	    $data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);

    	$this->load->view($this->result, $data);
	}

	private function addGroupMember() {
		$id = $this->input->get_post('groupid');
		$params = $this->input->getJsonParameters();

		$res = $this->gm->addGroupMember($id, $params);

		$data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);
		
		$this->load->view($this->result, $data);
	}

	private function deleteGroupMember() {
		$userid = $this->uri->segment(4, -1);
		$userid = is_numeric($userid) ? $userid : null;
		$id = $this->input->get_post('groupid');

		$res = $this->gm->deleteUserMember($id, $userid);

		if ($res['status'] == true) {
			$data['response'] = success_result($this->timingStart, "User with ID '".$userid."' already deleted from group membership.");
		} else {
			$data['response'] = error_result($this->timingStart, $res['result']);
		}

		$this->load->view($this->result, $data);
	}

	private function setPrimaryGroup() {
		$id = $this->input->get_post('groupid');
		$params = $this->input->getJsonParameters();

		$res = $this->gm->setPrimaryGroup($id, $params);

		$data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);
		
		$this->load->view($this->result, $data);
	}
}

?>