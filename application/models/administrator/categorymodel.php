<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Categorymodel extends CI_Model {
	
    private $result;

	public function __construct() {
		parent::__construct();
	}

    private function setResult($status=false, $result=NULL) {
        $this->result = array(
            'status' => $status,
            'result' => $result
        );
    }

	public function getCatgoryList($start=0, $limit=0, $sorter=NULL, $filters=NULL) {
        
        $categories = new ModuleCategory();

        if ($filters != NULL) {
            $categories->where($filters);
        }
        
        if ($sorter != NULL) {
            $categories->order_by($sorter['property'], $sorter['direction']);
        }
        
        if ($limit > 0) {
            $categories->limit($limit,$start);
        }
        
        $categories->get_iterated();
        
        if (count($categories->error->all) == 0) {
            $res = array();
            $res[] = array('id' => 0, 'name' => 'All Modules');
            foreach ($categories as $category) {
                array_push($res, $category->to_array());
            }
            $result['status'] = true;
            $result['result'] = $res;
        } else {
            $result['status'] = false;
            $result['result'] = $categories->error->string;
        }

        return $result;
    }
    
    public function addCategory($param) {

        $result = array (
            'status' => false,
            'result' => NULL,
        );

        $category = new ModuleCategory();

        $category->name = $param['name'];
        $category->description = $param['description'];

        if ($category->save()) {
            $result['status'] = true;
            $result['result'] = $category->to_array();
        } else {
            $result['status'] = false;
            $result['result'] = $category->error->string;
        }

        return $result;
    }

    public function editCategory($param) {

        $result = array(
            'status' => false,
            'result' => NULL,
        );

        $category = new ModuleCategory();
        $category->get_by_id($param['id']);

        $tmp = array();
        
        if (strcmp($category->name, $param['name']) != 0) {
            $tmp['name'] = $param['name'];
        }

        if (strcmp($category->description, $param['description']) != 0) {
            $tmp['description'] = $param['description'];
        }

        $cat = new ModuleCategory();
        $cat->where('id', $param['id'])->update($tmp);

        if ($this->db->affected_rows() > 0 ) {
            $result['status'] = true;
            $result['result'] = $cat->to_array();
        } else {
            $result['status'] = false;
            $result['result'] = $cat->error->string;
        }
        return $result;
    }

    public function deleteCategoryById($id) {
        
        $result = array(
            'status' => false,
            'result' => NULL
        );

        $category = new ModuleCategory();
        $category->get_by_id($id);

        $categoryName = $category->name;

        $defcategory = new ModuleCategory();
        $defcategory->where('name', 'Default Category')->get();
        
        $category->module->get();

        if (count($category->module->all) > 0) {
            foreach ($category->module as $module) {
                $category->delete($module);

                if ($defcategory->exists()) {
                    $defcategory->save($module);
                }
            }
        }

        $category->delete();

        if (count($category->error->all) == 0 ) {
            $result['status'] = true;
            $result['result'] = $categoryName;
        } else {
            $result['status'] = false;
            $result['result'] = $category->error->string;
        }

        return $result;

    }
}

?>