<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class modulemanager extends CI_Controller {
	
	private $result = "";
	private $timingStart = "";
	
	public function __construct() {
		parent::__construct();
		$this->CI =& get_Instance();
		$this->sitename = $this->CI->config->item('site_name');
		$this->load->model('administrator/modulemodel', 'mm');
		$this->index = 'administrator/user/index';
		$this->result = 'administrator/user/result';
		$this->timingStart = microtime(true);
	}

	public function test() {
		$result = $this->mm->test("55");
	    
	    if ($result['status'] == true) {
	    	$data['response'] = create_result($this->timingStart, $result['result']);
	    } else {
	    	$data['response'] = error_result($this->timingStart, $result['result']);
	    }

    	$this->load->view($this->result, $data);
	}

	public function module() {
		$method = strtolower($_SERVER['REQUEST_METHOD']);
		switch ($method) {
			case 'get':
				$id = $this->uri->segment(4, -1);
				$id = ($id > 0) ? $id : $this->input->get('id');
				$this->moduleList($id);
				break;
			
			case 'post':
				$this->addModule();
				break;

			case 'put':
				$this->editModule();
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

	private function moduleList($id = null) {

		$start = $this->input->get_post('start');
    	$limit = $this->input->get_post('limit');
    	$group = $this->input->get_post('group');
    	$filters = $this->input->get_post('filter');
    	$query = $this->input->get_post('query');
		$sort = $this->input->get_post('sort');
		$categoryid = $this->input->get_post('category');
		$isFiltered = false;
		$isSorted = false;

	    $filters = (!empty($filters)) ? $this->filterParser($filters) : NULL;
	    $isFiltered = ($filters != NULL) ? true : false;

		$sort = (!empty($sort)) ? $this->sortParser($sort) : NULL;
    	
	    $group = (!empty($group)) ? $this->groupParser($group) : NULL;

	    $categoryid = (is_numeric($categoryid)) ? $categoryid : NULL;
	    $categoryid = ($categoryid == 0) ? NULL : $categoryid;

		$start = empty($start) ? 0 : $start;
		$limit = empty($limit) ? 0 : $limit;
		
		if (is_numeric($id) && ($id >= 0)) {
	    	$qs = " id = '".$id."'";
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
	    
	    $result = $this->mm->getModuleList($categoryid, $start, $limit, $sort, $filters, $group);
	    
	    if ($result['status'] == true) {
	    	$data['response'] = create_result($this->timingStart, $result['result']);
	    } else {
	    	$data['response'] = error_result($this->timingStart, $result['result']);
	    }

    	$this->load->view($this->result, $data);
	}

	private function addModule() {
		
		$params = $this->input->getJsonParameters();

		$res = $this->mm->addModule($params);

		if ($res['status'] == true) {
			$data['response'] = create_result($this->timingStart, array($res['result']));
		} else {
			$data['response'] = error_result($this->timingStart, $res['result']);
		}
		
		$this->load->view($this->result, $data);
	}

	private function editModule() {

		$params = $this->input->getJsonParameters();
		
		$res = $this->mm->editModule($params);

		if (is_array($res)) {
			$data['response'] = create_result($this->timingStart, array($res));
		} else {
			$data['response'] = error_result($this->timingStart, "Unable to update the record. Please try again latter");
		}
		
		$this->load->view($this->result, $data);
	}

	private function deleteModule() {
		$id = $this->uri->segment(4, -1);
		$id = is_numeric($id) ? $id : null;

		$res = $this->mm->deleteModuleById($id);

		if ($res['status'] == true) {
			$data['response'] = success_result($this->timingStart, "Module with ID '".$res['result']['id']."' already deleted.");
		} else {
			$data['response'] = error_result($this->timingStart, $res['result']);
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

	private function sortParser($sorter) {
		$sorter = json_decode($sorter);
		$sort = "";
		for ($i=0; $i < count($sorter); $i++) { 
			$sortitem = $sorter[$i];
			$temp = NULL;
			switch ($sortitem->property) {
				case 'categoryname':
					$temp['property'] = 'modulecategory_name';
					break;
				default :
					$temp['property'] = $sortitem->property;
			}
			$temp['direction'] = $sortitem->direction;
			
			$tmp = $temp['property']." ".$temp['direction'];
			$sort .= ($sort != null) ? ', '. $tmp : $tmp;
		}
		return $sort;
	}
	
	private function filterParser($filters) {
		$filters = json_decode($filters);
		$where = ' "0" = "0" ';
		$qs = '';
		
		if (is_array($filters)) {
   			for ($i=0;$i<count($filters);$i++){
            		$filter = $filters[$i]; 
            		$field = '';
  
  				switch ($filter->field) {
    				default : {
      					$field = $filter->field;
    				}
				}
  
  				if ($filter->type == 'boolean') {
					$value = (strstr($filter->value, "yes")) ? 1 : 0;
            		} else {
            			$value = $filter->value;
				}
						
           		$compare = isset($filter->comparison) ? $filter->comparison : null;
            		$filterType = $filter->type;
    
            		switch($filterType){
                		case 'string' : $qs .= " AND ".$field." LIKE '%".$value."%'"; break;
 					case 'list' :
						if (strstr($value,',')){
	    						$fi = explode(',',$value);
						    	for ($q=0;$q<count($fi);$q++) {
						        	$fi[$q] = "'".$fi[$q]."'";
					    		}
    							$value = implode(',',$fi);
   							$qs .= " AND ".$field." IN (".$value.")";
						} else {
    							$qs .= " AND ".$field." = '".$value."'";
					     }
				 	break;
				 	case 'boolean' : $qs .= " AND ".$field." = ".($value); break;
				 	case 'numeric' :
						switch ($compare) {
						    	case 'eq' : $qs .= " AND ".$field." = ".$value; break;
						   	case 'lt' : $qs .= " AND ".$field." < ".$value; break;
						    	case 'gt' : $qs .= " AND ".$field." > ".$value; break;
				     	}
				 	break;
					case 'date' :
						switch ($compare) {
							case 'eq' : $qs .= " AND ".$field." = '".date('Y-m-d',strtotime($value))."'"; break;
							case 'lt' : $qs .= " AND ".$field." < '".date('Y-m-d',strtotime($value))."'"; break;
							case 'gt' : $qs .= " AND ".$field." > '".date('Y-m-d',strtotime($value))."'"; break;
						}
					break;
				}
   			}
   			$where .= $qs;
		}
    
		return $where;
	}

}

?>