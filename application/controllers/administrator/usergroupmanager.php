<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Usergroupmanager extends MY_Controller {

	function __construct() {
		parent::__construct();

		$this->load->model('administrator/usergroupmodel', 'ugm');
		$this->result = 'administrator/result';

		$this->sorterValidator = array( "isprimary" => "join_isprimary" );
		$this->filterValidator = array();
	}

	protected function get() {
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
    	
		$res = $this->ugm->getUserGroups($userid, $start, $limit, $sort, $filters);
	    $data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);
    	$this->load->view($this->result, $data);
	}

	protected function post() {
		$userid = $this->input->get_post('userid');
		$params = $this->input->getJsonParameters();

		$res = $this->ugm->addUserGroup($userid, $params);

		$data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);
		
		$this->load->view($this->result, $data);
	}

	protected function put() {
		$userid = $this->input->get_post('userid');
		$params = $this->input->getJsonParameters();

		$res = $this->ugm->setPrimaryGroup($userid, $params);

		$data['response'] = ($res['status'] == true) ? create_result($this->timingStart, $res['result']) : error_result($this->timingStart, $res['result']);
		
		$this->load->view($this->result, $data);
	}

	protected function delete() {
		$groupid = $this->uri->segment(4, -1);
		$groupid = is_numeric($groupid) ? $groupid : null;
		$userid = $this->input->get_post('userid');

		$res = $this->ugm->deleteUserGroup($userid, $groupid);

		if ($res['status'] == true) {
			$data['response'] = success_result($this->timingStart, "Group with ID '".$userid."' already deleted.");
		} else {
			$data['response'] = error_result($this->timingStart, $res['result']);
		}

		$this->load->view($this->result, $data);
	}
}

?>