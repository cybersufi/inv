<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class permissionmanager extends CI_Controller {

	private $result = "";
	private $timingStart="";
	private $sorterValidator = array( "categoryname" => "modulecategory_name" );
	private $filterValidator = array();

	public function __construct() {
		parent::__construct();
		$this->CI =& get_Instance();
		//$this->load->library('acl');
		$this->sitename = $this->CI->config->item('site_name');
		$this->load->model('administrator/permissionmodel', 'pm');
		$this->index = 'administrator/user/index';
		$this->result = 'administrator/result';
		$this->timingStart = microtime(true);
	}

	public function permission() {
		$method = strtolower($_SERVER['REQUEST_METHOD']);
		switch ($method) {
			case 'get':
				$id = $this->uri->segment(4, -1);
				$id = ($id > 0) ? $id : $this->input->get('id');
				$this->getPermList($id);
				break;
			
			case 'post':
				$this->addPermission();
				break;

			case 'put':
				$this->editPermission();
				break;

			case 'delete':
				$this->deletePermission();
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

	private function getPermList() {
		$userid = $this->uri->segment(4, -1);
		$start = $this->input->get_post('start');
    	$limit = $this->input->get_post('limit');
    	$filters = $this->input->get_post('filter');
    	$query = $this->input->get_post('query');
		$sort = $this->input->get_post('sort');
    	$isFiltered = false;
		$isSorted = false;

	    $filters = (!empty($filters)) ? filterParser($this->filtersValidator, $filters) : NULL;
	    $isFiltered = ($filters != NULL) ? true : false;

		$sort = (!empty($sort)) ? $sort = sortParser($this->sorterValidator, $sort) : NULL;
	    $isSorted = ($sort != NULL) ? true : false;
    	
		$start = empty($start) ? 0 : $start;
		$limit = empty($limit) ? 0 : $limit;
		
		if (is_numeric($userid) && ($userid >= 0)) {
	    	$qs = " id = '".$userid."'";
	    	if ($isFiltered) {
	    		$filters .= ' AND '.$qs;
	    	} else {
	    		$filters = $qs;
	    		$isFiltered = true;
	    	}
	    }

	    if (!empty($query)) {
	    	$qs = " name like '%".$query."%'";
	    	if ($isFiltered) {
	    		$filters .= ' AND '.$qs;
	    	} else {
	    		$filters = $qs;
	    		$isFiltered = true;
	    	}
	    }
	    

	    $res = $this->pm->getPermList($start, $limit, $sort, $filters);
	    
	    if ($res['status'] == true) {
	    	$data['response'] = create_result($this->timingStart, $res['result']);
	    } else {
	    	$data['response'] = error_result($this->timingStart, $res['result']);
	    }

    	$this->load->view($this->result, $data);

	}
	
	private function addPermission() {
		
		$params = $this->input->getJsonParameters();

		$res = $this->pm->addPerm($params);

		if (is_array($res)) {
			$data['response'] = create_result($this->timingStart, array($res));
		} else {
			$data['response'] = error_result($this->timingStart, $res);
		}
		
		$this->load->view($this->result, $data);
	}

	private function editPermission() {

		$params = $this->input->getJsonParameters();
		
		//print_r($params);

		$res = $this->pm->editPerm($params);
		//$res = null;

		if ($res['status'] != false) {
			$data['response'] = create_result($this->timingStart, array($res['result']));
		} else {
			$data['response'] = error_result($this->timingStart, $res['result']);
		}
		
		$this->load->view($this->result, $data);
	}

	private function deletePermission() {
		$id = $this->uri->segment(4, -1);
		$id = is_numeric($id) ? $id : null;

		$res = $this->pm->deletePermById($id);

		if ($res['status'] == true) {
			$data['response'] = success_result($this->timingStart, "Permission '".$res['result']['name']."' already deleted.");
		} else {
			$data['response'] = error_result($this->timingStart, $res['result']);
		}

		$this->load->view($this->result, $data);
	}

	public function moduletree() {

		$res = $this->pm->getModuleTree();

		if ($res['status'] == true) {

			$tree = array(
                'id' => 0,
                'name' => 'Root Category',
                'description' => "",
                'isCategory' => true,
                'expanded' =>true,
                'children' => $res['result']
            );

			$data['response'] = create_tree_result($this->timingStart, $tree);
		} else {
			$data['response'] = error_result($this->timingStart, $res['result']);
		}

		$this->load->view($this->result, $data);
	}

	public function modulepermission() {

		$method = strtolower($_SERVER['REQUEST_METHOD']);
		switch ($method) {
			case 'get':
				//$id = $this->uri->segment(4, -1);
				//$id = ($id > 0) ? $id : $this->input->get('id');
				$this->moduleList();
				break;
			
			case 'post':
				$this->addModule();
				break;

			case 'put':
				$this->editModulePermission();
				break;

			case 'delete':
				$this->deleteModule();
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

	private function moduleList() {
		$id = $this->uri->segment(4, -1);
		$id = ($id < 0) ? $this->input->get_post('permission') : $id;
		$start = $this->input->get_post('start');
    	$limit = $this->input->get_post('limit');
    	$filters = $this->input->get_post('filter');
    	$query = $this->input->get_post('query');
		$sort = $this->input->get_post('sort');
		$group = $this->input->get_post('group');
    	$isFiltered = false;
		$isSorted = false;

	    $filters = (!empty($filters)) ? filterParser($this->filterValidator, $filters) : NULL;
	    $isFiltered = ($filters != NULL) ? true : false;

		$sort = (!empty($sort)) ? $sort = sortParser($this->sorterValidator, $sort) : NULL;
	    $isSorted = ($sort != NULL) ? true : false;

	    $group = (!empty($group)) ? $this->groupParser($group) : NULL;
    	
		$start = empty($start) ? 0 : $start;
		$limit = empty($limit) ? 0 : $limit;

		$res = $this->pm->getPermModulList($id, $start, $limit, $sort, $filters, $group);
	    
	    if ($res['status'] == true) {
	    	$data['response'] = create_result($this->timingStart, $res['result']);
    	} else {
			$data['response'] = error_result($this->timingStart, $res['result']);
		}

    	$this->load->view($this->result, $data);
	}

	private function addModule() {

		$id = $this->input->get_post('permission');

		$params = $this->input->getJsonParameters();

		$res = $this->pm->addModule($id, $params);

		if ($res['status'] == true) {
			$data['response'] = create_result($this->timingStart, array($res['result']));
		} else {
			$data['response'] = error_result($this->timingStart, $res['result']);
		}
		
		$this->load->view($this->result, $data);
	}

	private function deleteModule() {
		$moduleid = $this->uri->segment(4, -1);
		$moduleid = is_numeric($moduleid) ? $moduleid : null;
		$permid = $this->input->get_post('permission');

		$res = $this->pm->deleteModule($permid, $moduleid);

		if ($res['status'] == true) {
			$data['response'] = success_result($this->timingStart, "Module with ID '".$moduleid."' already removed.");
		} else {
			$data['response'] = error_result($this->timingStart, $res['result']);
		}

		$this->load->view($this->result, $data);
	}

	private function editModulePermission() {
		$params = $this->input->getJsonParameters();
		$permid = $this->input->get_post('permission');

		$res = $this->pm->editModulePermission($permid, $params);

		if ($res['status'] == true) {
	    	$data['response'] = create_result($this->timingStart, array($res['result']));
	    } else {
	    	$data['response'] = error_result($this->timingStart, "Unable to update the record. Please try again latter");
	    }
		
		$this->load->view($this->result, $data);
	}

	private function groupParser($grouper) {
		$grouper = json_decode($grouper);
		$group = NULL;

		for ($i=0; $i < count($grouper); $i++) { 
			$groupitem = $grouper[$i];
			switch ($groupitem->property) {
				case 'categoryname':
					$group['property'] = 'modulecategory_name';
					break;
				default :
					$group['property'] = $groupitem->property;
			}
			$group['direction'] = $groupitem->direction;
		}
		return $group;
	}
}

?>