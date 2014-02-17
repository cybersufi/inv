<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Modulemodel extends CI_Model {
	
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

    public function test($permid) {

        $m = new Module();

        $sql = 'select * 
                from `modules` m
                left outer join (
                  select mp1.id as mpid, mp1.value, mp1.module_id
                  from modules_permissions mp1
                  where mp1.permission_id = ? ) as mp on mp.module_id = m.id;';

        $binds = array('55');


        $m->query($sql, $binds);
        
        if (count($m->error->all) == 0) {
            $temp = array();
            foreach ($m as $member) {
                $tmp = $member->to_array();
                $tmp['value'] = $member->value;
                array_push($temp, $tmp);
            }
            $this->setResult(true, $temp);
        } else {
            $this->setResult(false, $m->error->string);
        }

        //$m->check_last_query();

        return $this->result;


    }

	public function getModuleList($categoryid=NULL, $start=0, $limit=0, $sorter=NULL, $filters=NULL, $group=NULL) {

		$result = array(
			'status' => false,
			'result' => null,
		);

		$modules = new Module();
		$modules->include_related('modulecategory', array('id','name'), TRUE, TRUE);

	    if ($filters != NULL) {
	    	$modules->where($filters);
	    }

	    if ($group != NULL) {
	    	$modules->group_by($group['property'], 'id');
	    	$modules->group_by('id');	
	    }
    	
		if ($sorter != NULL) {
			$modules->order_by($sorter);
		}
		
	    if ($limit > 0) {
	    	$modules->limit($limit,$start);
	    }
    	
    	if ($categoryid != NULL) {
    		$modules->get_by_related('modulecategory', 'id', $categoryid);
    	} else {
    		$modules->get_iterated();
    	}

    	if (count($modules->error->all) == 0) {
    		$res = array();
    		foreach ($modules as $module) {
    			$tmp = $module->to_array();
    			$tmp['category'] = $module->modulecategory_id;
    			$tmp['categoryname'] = $module->modulecategory_name;
    			array_push($res, $tmp);
    		}
    		$result['status'] = true;
    		$result['result'] = $res;
    	} else {
    		$result['status'] = false;
    		$result['result'] = $modules->error->string;
    	}
    	return $result;
	}

	public function addModule($param) {

        $result = array (
            'status' => false,
            'result' => NULL,
        );

        $module = new Module();

        $module->name = $param['name'];
        $module->alias = $param['alias'];
        $module->url = $param['url'];

        $category = new ModuleCategory();
        $category->get_by_id($param['category']);

        if ($module->save($category)) {
        	$tmp = $module->to_array();
			$tmp['category'] = $category->id;
			$tmp['categoryname'] = $category->name;
            $result['status'] = true;
            $result['result'] = $tmp;
        } else {
            $result['status'] = false;
            $result['result'] = $module->error->string;
        }

        return $result;
    }

    public function editModule($param) {
        $result = array (
            'status' => false,
            'result' => NULL,
        );

        $module = new Module();
        $module->include_related('modulecategory', array('id','name'), TRUE, TRUE);
        $module->get_by_id($param['id']);

        $tmp = array();
        
        if (strcmp($module->name, $param['name']) != 0) {
            $tmp['name'] = $param['name'];
        }

        if (strcmp($module->alias, $param['alias']) != 0) {
            $tmp['alias'] = $param['alias'];
        }

        if (strcmp($module->url, $param['url']) != 0) {
            $tmp['url'] = $param['url'];
        }

        if (count($tmp) != 0) {
            $module->where('id', $param['id'])->update($tmp);
        }

        if (strcmp($module->modulecategory->id, $param['category']) != 0) {
            $category = new ModuleCategory();
            $category->get_by_id($module->modulecategory->id);
            $module->delete($category);

            $category->get_by_id($param['category']);
            $module->save($category);
        }

        if (count($module->error->all) == 0) {
            $module->get_by_id($param['id']);
            $tmp = $module->to_array();
            $tmp['category'] = $module->modulecategory_id;
            $tmp['categoryname'] = $module->modulecategory_name;
            $result['status'] = true;
            $result['result'] = $tmp;
        } else {
            $result['status'] = false;
            $result['result'] = $module->error->string;
        }
        return $result;

    }

    public function deleteModuleById($id) {
        
        $result = array (
            'status' => false,
            'result' => NULL,
        );
        
        $module = new Module();
        $module->get_by_id($id);

        $tmp = $module->to_array();
        $tmp['id'] = $module->id;
        $tmp['name'] = $module->name;

        $module->delete();

        if (count($module->error->all) > 0) {
            $result['status'] = false;
            $result['result'] = $module->error->string;
        } else {
            $result['status'] = true;
            $result['result'] = $tmp;
        }

        return $result;

    }

}

?>