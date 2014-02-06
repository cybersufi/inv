<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Usermanager extends MY_Controller {

	function __construct() {
		parent::__construct();

		$this->load->model('administrator/usermodel', 'um');
		$this->result = 'administrator/result';

		$this->sorterValidator = array();
		$this->filterValidator = array();

	}

	public function test() {
		echo "test <br>";
		$test = $this->input->get(NULL, TRUE);
		print_R($test);
	}

	protected function get(){

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

		$id = $this->uri->segment(4, -1);
		$id = ($id > 0) ? $id : $this->input->get('id');

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

	protected function post() { 

		$params = $this->input->getJsonParameters();

		$res = $this->um->addUser($params);

		$data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);
		
		$this->load->view($this->result, $data);

	}

	protected function put() {

		$params = $this->input->getJsonParameters();
		
		$res = $this->um->editUser($params);

		$data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);

		$this->load->view($this->result, $data);

	}

	protected function delete() {

		$userid = $this->uri->segment(4, -1);
		$userid = is_numeric($userid) ? $userid : null;

		$res = $this->um->deleteUserById($userid);

		$data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);

		$this->load->view($this->result, $data);

	}
}

?>