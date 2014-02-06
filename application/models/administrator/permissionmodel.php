<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Permissionmodel extends CI_Model {

	function __construct() {
		parent::__construct();
	}

	public function getPermList($start=0, $limit=0, $sorter=NULL, $filters=NULL) {

		$result = array(
			'status' => false,
			'result' => null,
		);

		$perms = new Permission();

	    if ($filters != NULL) {
	    	$perms->where($filters);
	    }
    	
		if ($sorter != NULL) {
            foreach ($sorter as $sort) {
                $perms->order_by($sort['property'], $sort['direction']);
            }
		}
		
	    if ($limit > 0) {
	    	$perms->limit($limit,$start);
	    }
    	
    	$perms->get_iterated();

    	if (count($perms->error->all) == 0) {
    		$res = array();
    		foreach ($perms as $perm) {
    			$tmp = $perm->to_array();
    			array_push($res, $tmp);
    		}
    		$result['status'] = true;
    		$result['result'] = $res;
    	} else {
    		$result['status'] = false;
    		$result['result'] = $perms->error->string;
    	}
    	return $result;
	}

	public function addPerm($param) {

        $result = array (
            'status' => false,
            'result' => NULL,
        );

        $perm = new Permission();

        $perm->name = $param['name'];
        $perm->key = $param['key'];

        if ($perm->save()) {
        	$result['status'] = true;
            $result['result'] = $perm->to_array();
        } else {
            $result['status'] = false;
            $result['result'] = $link->error->string;
        }

        return $result;
    }

    public function editPerm($param) {
        $result = array (
            'status' => false,
            'result' => NULL,
        );

        $perm = new Permission();
        $perm->get_by_id($param['id']);

        $tmp = array();
        
        if (strcmp($perm->name, $param['name']) != 0) {
            $tmp['name'] = $param['name'];
        }

        if (strcmp($perm->key, $param['key']) != 0) {
            $tmp['key'] = $param['key'];
        }

        $perm->where('id', $param['id'])->update($tmp);

        if (count($perm->error->all) == 0) {
            //$perm->get_by_id($param['id']);
            $result['status'] = true;
            $result['result'] = $perm->to_array();
        } else {
            $result['status'] = false;
            $result['result'] = $link->error->string;
        }

        return $result;

    }

    public function deletePermById($id) {
        
        $result = array (
            'status' => false,
            'result' => NULL,
        );
        
        $perm = new Permission();
        $perm->get_by_id($id);

        $tmp = $perm->to_array();

        $perm->delete();

        if (count($link->error->all) > 0) {
            $result['status'] = false;
            $result['result'] = $perm->error->string;
        } else {
            $result['status'] = true;
            $result['result'] = $tmp;
        }

        return $result;

    }

    public function getModuleTree() {
        $result = array(
            'status' => false,
            'result' => null,
        );

        $cats = new ModuleCategory();
        $cats->get();

        if (count($cats->error->all) == 0) {

            $res = array();

            foreach ($cats as $cat) {
                $cat->module->get();

                if ($cat->module->result_count() > 0) {
                    $res2 = array();
                    foreach ($cat->module as $module) {
                        $tmp2 = array(
                            'id' => $module->id,
                            'name' => $module->name,
                            'description' => $module->alias,
                            'isCategory' => false,
                            'leaf' => true,
                            'children' => array()
                        );
                        array_push($res2, $tmp2);
                    }
                } else {
                    $res2 = array();
                }

                $tmp = array(
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'description' => $cat->description,
                    'isCategory' => true,
                    'expanded' => true,
                    'children' => $res2
                );

                array_push($res, $tmp);
            }

            $result['status'] = true;
            $result['result'] = $res;

        } else {
            $result['status'] = false;
            $result['result'] = $link->error->string;
        }

        return $result;
    }

    public function getPermModulList($permid, $start=0, $limit=0, $sorter=NULL, $filters=NULL, $group=NULL) {

        $result = array(
            'status' => false,
            'result' => null,
        );

        $perm = new Permission();
        $perm->get_by_id($permid);

        if ($filters != NULL) {
            $perm->module->where($filters);
        }

        if ($group != NULL) {
            $perm->module->group_by($group['property'], 'id');
            $perm->module->group_by('id');   
        }

        if ($sorter != NULL) {
            foreach ($sorter as $sort) {
                $perm->module->order_by($sort['property'], $sort['direction']);
            }
        }
        
        if ($limit > 0) {
            $perm->module->limit($limit,$start);
        }

        $perm->module->include_related('modulecategory', array('id','name'), TRUE, TRUE);
        
        $perm->module->include_join_fields()->get();

        if (count($perm->error->all) == 0) {
            $res = array();
            foreach ($perm->module as $module) {

                $permval = decbin($module->join_value);
                if (strlen($permval) < 3) {
                    $len = strlen($permval);
                    for ($i = $len; $i < 3; $i++) {
                        $permval = '0'.$permval;
                    }
                }

                $permval = str_split($permval);

                $tmp = array(
                    'id' => $module->id,
                    'name' => $module->name,
                    'category' => $module->modulecategory_id,
                    'categoryname' => $module->modulecategory_name,
                    'read' => $permval[0],
                    'write' => $permval[1],
                    'execute' => $permval[2]
                );
                array_push($res, $tmp);
            }
            $result['status'] = true;
            $result['result'] = $res;

        } else {
            $result['status'] = false;
            $result['result'] = $modules->error->string;
        }

        //$modules->check_last_query();

        return $result;
    }

    public function addModule($permid, $params) {
        $result = array (
            'status' => false,
            'result' => NULL,
        );

        $perm = new Permission();
        $perm->get_by_id($permid);

        $module = new Module();
        $module->get_by_id($params['id']);

        $key = $params['read'].$params['write'].$params['execute'];
        $value = bindec($key);

        if ($perm->save($module)) {
            $perm->set_join_field($module, 'value', $value);
            $result['status'] = true;
            $result['result'] = $module->to_array();
        } else {
            $result['status'] = false;
            $result['result'] = $perm->error->string;
        }

        return $result;
    }

    public function deleteModule($permid, $modid) {

        $result = array (
            'status' => false,
            'result' => NULL,
        );

        $perm = new Permission();
        $perm->get_by_id($permid);

        $module = new Module();
        $module->get_by_id($modid);

        if ($perm->delete($module)) {
            $result['status'] = true;
            $result['result'] = $module->to_array();
        } else {
            $result['status'] = false;
            $result['result'] = $perm->error->string;
        }

        return $result;
    }

    public function editModulePermission($permid, $params) {
        $result = array (
            'status' => false,
            'result' => NULL,
        );

        $perm = new Permission();
        $perm->get_by_id($permid);

        $read = ($params['read']) ? 1 : 0;
        $write = ($params['write']) ? 1 : 0;
        $exec = ($params['execute']) ? 1 : 0;

        $value = bindec($read.$write.$exec);

        $module = new Module();
        $module->get_by_id($params['id']);

        $perm->set_join_field($module, 'value', $value);

        if (count($perm->error->all) == 0) {
            $result['status'] = true;
            $result['result'] = $module->to_array();
        } else {
            $result['status'] = false;
            $result['result'] = $perm->error->string;
        }

        return $result;
    }

}

?>