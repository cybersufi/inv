<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class categorymanager extends CI_Controller {
	
	private $result = "";
	private $timingStart = "";
	
	public function __construct() {
		parent::__construct();
		$this->CI =& get_Instance();
		$this->sitename = $this->CI->config->item('site_name');
		$this->load->model('administrator/categorymodel', 'cm');
		$this->index = 'administrator/user/index';
		$this->result = 'administrator/user/result';
		$this->timingStart = microtime(true);
	}

	public function category() {
		$method = strtolower($_SERVER['REQUEST_METHOD']);
		switch ($method) {
			case 'get':
				$id = $this->uri->segment(4, -1);
				$id = ($id > 0) ? $id : $this->input->get('id');
				$this->categoryList($id);
				break;
			
			case 'post':
				$this->addCategory();
				break;

			case 'put':
				$this->editCategory();
				break;

			case 'delete':
				$this->deleteCategory();
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

	private function categoryList($id = null) {
		$start = $this->input->get_post('start');
    	$limit = $this->input->get_post('limit');
    	$filters = $this->input->get_post('filter');
    	$query = $this->input->get_post('query');
		$sort = $this->input->get_post('sort');
    	$isFiltered = false;
		$isSorted = false;

	    $filters = (!empty($filters)) ? $this->filterParser($filters) : NULL;
	    $isFiltered = ($filters != NULL) ? true : false;

		$sort = (!empty($sort)) ? $sort = $this->sortParser($sort) : NULL;
	    $isSorted = ($sort != NULL) ? true : false;
    	
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

	    $res = $this->cm->getCatgoryList($start, $limit, $sort, $filters);
	    
	    if ($res['status'] == true) {
	    	$data['response'] = create_result($this->timingStart, $res['result']);
	    } else {
	    	$data['response'] = error_result($this->timingStart, $res['result']);
	    }

    	$this->load->view($this->result, $data);
	}

	private function addCategory() {
		
		$params = $this->input->getJsonParameters();

		$res = $this->cm->addCategory($params);

		if ($res['status'] == true) {
			$data['response'] = create_result($this->timingStart, array($res['result']));
		} else {
			$data['response'] = error_result($this->timingStart, $res['result']);
		}
		
		$this->load->view($this->result, $data);
	}

	private function editCategory() {

		$params = $this->input->getJsonParameters();
		
		$res = $this->cm->editCategory($params);

		if ($res['status'] == true) {
			$data['response'] = create_result($this->timingStart, array($res['result']));
		} else {
			$data['response'] = error_result($this->timingStart, "Unable to update the record. Please try again latter");
		}
		
		$this->load->view($this->result, $data);
	}

	private function deleteCategory() {
		$id = $this->uri->segment(4, -1);
		$id = is_numeric($id) ? $id : null;

		$res = $this->cm->deleteCategoryById($id);

		if ($res['status'] == true) {
			$data['response'] = success_result($this->timingStart, "Category '".$res['result']."' already deleted.");
		} else {
			$data['response'] = error_result($this->timingStart, $res['result']);
		}

		$this->load->view($this->result, $data);
	}

	public function getAllCategories() {

		$res = $this->cm->getCategoryTree();
					
		$data['response'] = create_result($this->timingStart, $res);
		$this->load->view($this->result, $data);
	}

	private function sortParser($sorter) {
		$sorter = json_decode($sorter);
		$sort = NULL;
		for ($i=0; $i < count($sorter); $i++) { 
			$sortitem = $sorter[$i];
			switch ($sortitem->property) {
				default :
					$sort['property'] = $sortitem->property;
			}
			$sort['direction'] = $sortitem->direction;
		}
		return $sort;
	}
	
	private function filterParser($filters) {
		$filters = json_decode($filters);
		$where = '';
		$qs = '';
		
		if (is_array($filters)) {
   			for ($i=0;$i<count($filters);$i++) {
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