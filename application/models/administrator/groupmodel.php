<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Groupmodel extends CI_Model {
	
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
	
	public function getGroupList($start=0, $limit=0, $sorter=NULL, $filters=NULL, $userid=NULL) {
    	
		$groups = new Group();
    	$groups->select('id, groupname, description');

	    if ($filters != NULL) {
	    	$groups->where($filters);
	    }

	    if ($userid != NULL) {
	    	$user = new User();
	    	$user->get_by_id($userid);
	    	$groups->where_not_in_related('user', 'id', $user);
	    }
    	
		if ($sorter != NULL) {
			foreach ($sorter as $sort) {
				$groups->user->order_by($sort['property'], $sort['direction']);
			}
		}
		
	    if ($limit > 0 ) {
	    	$groups->limit($limit,$start);
	    }
    	
    	$groups->get_iterated();

    	if (count($groups->error->all) == 0) {
    		$res = array();
    		foreach ($groups as $group) {
    			array_push($res, $group->to_array());
    		}

    		$this->setResult(true, $res);

    	} else {
    		$this->setResult(false, $group->error->string);
    	}

    	return $this->result;
  	}

  	public function getGroupById($id) {

  		$group = new Group();
		$group->select('id, groupname, description');
		$group->where('id', $id)->get();

		if ($group->exists()) {
			$this->setResult(true, $group->to_array());
		} else {
			$this->setResult(false, $group->error->string);
		}

		return $this->result;
  	}
	
	public function addGroup($param) {

		$group = new Group();

		$group->groupname = $param['groupname'];
		$group->description = $param['description'];

		if ($group->save()) {
			$id = $group->id;
			$group->select('id, groupname, description');
			$group->get_by_id($id);
			$this->setResult(true, array($group->to_array()));
		} else {
			$this->setResult(false, $group->error->string);
		}

		return $this->result;
	}

	public function editGroup($param) {
		
		$group = new Group();
		$group->get_by_id($param['id']);

		$tmp = array();
		
		if (strcmp($group->groupname, $param['groupname']) != 0) {
			$tmp['groupname'] = $param['groupname'];
		}

		if (strcmp($user->description, $param['description']) != 0) {
			$tmp['description'] = $param['description'];
		}

		$group2 = new Group();
		$group2->where('id', $param['id'])->update($tmp);

		if ($this->db->affected_rows() > 0 ) {
			$group->get_by_id($param['id']);
			$this->setResult(true, array($group->to_array()));
		} else {
			$this->setResult(false, $group2->error->string);
		}

		return $this->result;
	}

	public function deleteGroupById($id) {
		
		$group = new Group();
		$group->get_by_id($id);

		$groupname = $group->name;

		$group->user->get();
		$group->delete($group->user->all);

		$group->delete();

		if (count($group->error->all) == 0 ) {
			$this->setResult(true, $groupname);
        } else {
        	$this->setResult(false, $category->error->string);
        }

		return $this->result;

	}

	public function getGroupMember($id, $start=0, $limit=0, $sorter=NULL, $filters=NULL) {

  		$group = new Group();
  		$group->get_by_id($id);

  		if ($filters != NULL) {
	    	$group->user->where($filters);
	    }
    	
		if ($sorter != NULL) {
			foreach ($sorter as $sort) {
				$group->user->order_by($sort['property'], $sort['direction']);
			}
		}
		
	    if ($limit > 0) {
	    	$group->user->limit($limit,$start);
	    }

  		$group->user->include_join_fields()->get();

  		if (count($group->error->all) == 0) {
  			$res = array();
  			foreach ($group->user as $user) {
  				$tmp = array (
  					'id' => $user->id,
  					'username' => $user->username,
  					'firstname' => $user->firstname,
  					'lastname' => $user->lastname,
  					'isprimary' => $user->join_isprimary
  				);
  				array_push($res, $tmp);
  			}
  			$this->setResult(true, $res);
  		} else {
  			$this->setResult(false, $group->error->string);
  		}

  		return $this->result;

  	}

  	public function addGroupMember($id, $params) {
  		$user = new User();
  		$user->get_by_id($params['id']);

  		$group = new Group();
  		$group->get_by_id($id);

  		if ($group->save($user)) {
			$this->setResult(true, array($user->to_array()));
		} else {
			$this->setResult(false, $group->error->string);
		}

		return $this->result;
  	}

  	public function deleteUserMember($id, $userid) {
  		$user = new User();
  		$user->get_by_id($userid);

  		$group = new Group();
  		$group->get_by_id($id);

  		if ($group->delete($user)) {
			$this->setResult(true, array($user->to_array()));
		} else {
			$this->setResult(false, $group->error->string);
		}

		return $this->result;
  	}

  	public function setPrimaryGroup($id, $params) {
  		$user = new User();
  		$user->get_by_id($params['id']);

  		$user->group->include_join_fields()->get();

  		foreach ($user->group as $group) {
  			$user->set_join_field($group, 'isprimary', '0');
  		}

  		$group = new Group();
  		$group->get_by_id($id);

  		$user->set_join_field($group, 'isprimary', '1');

  		if ($user->exists()) {
  			$this->setResult(true, array($user->to_array()));
		} else {
			$this->setResult(false, $user->error->string);
		}

		return $this->result;
  	} 
}

?>