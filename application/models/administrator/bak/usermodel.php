<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Usermodel extends MY_Model {
	
	//private $result;

	public function __construct() {
		parent::__construct();
	}
	
	/*private function setResult($status=false, $result=NULL) {
		$this->result = array(
            'status' => $status,
            'result' => $result
        );
	}*/

	public function test() {
		return "test";
	}

  	public function getUserList($start=0, $limit=0, $sorter=NULL, $filters=NULL, $groupid=NULL) {
    	
    	$users = new User();
    	$users->select('id, username, email, status, lastlogin, ipaddress, created, firstname, lastname');

	    if ($filters != NULL) {
	    	$users->where($filters);
	    }

	    if ($groupid != NULL) {
	    	$group = new Group();
	    	$group->get_by_id($groupid);
	    	$users->where_not_in_related('group', 'id', $group);
	    }
    	
		if ($sorter != NULL) {
			foreach ($sorter as $sort) {
				$users->order_by($sort['property'], $sort['direction']);
			}
		}
		
	    if ($limit > 0) {
	    	$users->limit($limit,$start);
	    }
    	
    	$users->get_iterated();
    	
    	if ($users->exists()) {
    		$res = array();
    		foreach ($users as $user) {
    			array_push($res, $user->to_array());
    		}
    		$this->setResult(true, $res);
    	} else {
    		$this->setResult(false, $users->error->string);
    	}

    	return $this->result;
  	}

  	public function getUserById($id) {
  		$user = new User();
		$user->select('id, username, email, status, lastlogin, ipaddress, created, firstname, lastname');
		$user->where('id', $id)->get();
		if ($user->exists()) {
			$this->setResult(true, array($user->to_array()));
		} else {	
			$this->setResult(false, $user->error->string);
		}

		return $this->result;
  	}
	
	public function addUser($param) {

		$user = new User();

		$user->username = $param['username'];
		$user->email = $param['email'];
		$user->firstname = $param['firstname'];
		$user->lastname = $param['lastname'];

		$user->hash = $hash = sha1(microtime());
		$user->password = sha1($hash.$param['password']);

		if ($user->save()) {
			$id = $user->id;
			$user->select('id, username, email, status, lastlogin, ipaddress, created, firstname, lastname');
			$user->get_by_id($id);
			$this->setResult(true, array($user->to_array()));
		} else {
			$this->setResult(false, $user->error->string);
		}

		return $this->result;
	}

	public function editUser($param) {
		$user = new User();
		$user->get_by_id($param['id']);

		$tmp = array();
		
		if (strcmp($user->firstname, $param['firstname']) != 0) {
			$tmp['firstname'] = $param['firstname'];
		}

		if (strcmp($user->lastname, $param['lastname']) != 0) {
			$tmp['lastname'] = $param['lastname'];
		}

		if (strcmp($user->email, $param['email']) != 0) {
			$tmp['email'] = $param['email'];
		}

		if (!empty($param['password'])) {
			$tmp['password'] = sha1($user->hash.$param['password']);
		}

		$user2 = new User();
		$user2->where('id', $param['id'])->update($tmp);

		if ($this->db->affected_rows() > 0 ) {
			$user->get_by_id($param['id']);
			$this->setResult(true, array($user->to_array()));
		} else {
			$this->setResult(false, $user2->error->string);
		}

		return $this->result;

	}

	public function deleteUserById($userid) {
		
		$user = new User();
		$user->get_by_id($userid);

		$user->group->get();
		$user->delete($user->group->all);

		$user->delete();

		if (strlen($user->error->string) == 0 ) {
			$this->setResult(true, NULL);
		} else {
			$this->setResult(false, $user->error->string);
		}

		return $this->result;
	}

  	public function getUserGroups($userid, $start=0, $limit=0, $sorter=NULL, $filters=NULL) {

  		$user = new User();
  		$user->get_by_id($userid);

  		if ($filters != NULL) {
	    	$user->group->where($filters);
	    }
    	
		if ($sorter != NULL) {
			foreach ($sorter as $sort) {
				$user->group->order_by($sort['property'], $sort['direction']);
			}
		}
		
	    if ($limit > 0) {
	    	$user->group->limit($limit,$start);
	    }

  		$user->group->include_join_fields()->get();

  		if (count($user->error->all) == 0) {
  			$res = array();
  			foreach ($user->group as $group) {
  				$tmp = array (
  					'id' => $group->id,
  					'groupname' => $group->groupname,
  					'description' => $group->description,
  					'isprimary' => $group->join_isprimary
  				);
  				array_push($res, $tmp);
  			}
  			$this->setResult(true, $res);
  		} else {
  			$this->setResult(false, $user->error->string);
  		}

  		return $this->result;
  	}

  	public function addUserGroup($userid, $params) {
  		$group = new Group();
  		$group->get_by_id($params['id']);

  		$user = new User();
  		$user->get_by_id($userid);

  		if ($user->save($group)) {
			$this->setResult(false, $group->to_array());
		} else {
			$this->setResult(false, $user->error->string);
		}

		return $this->result;
  	}

  	public function deleteUserGroup($userid, $groupid) {
  		$group = new Group();
  		$group->get_by_id($groupid);

  		$user = new User();
  		$user->get_by_id($userid);

  		if ($user->delete($group)) {
			$this->setResult(true, NULL);
		} else {
			$this->setResult(false, $user->error->string);
		}

		return $this->result;
  	}

  	public function setPrimaryGroup($userid, $params) {
  		$user = new User();
  		$user->get_by_id($userid);

  		$user->group->include_join_fields()->get();

  		foreach ($user->group as $group) {
  			$user->set_join_field($group, 'isprimary', '0');
  		}

  		$group = new Group();
  		$group->get_by_id($params['id']);

  		$user->set_join_field($group, 'isprimary', '1');

  		if ($group->exists()) {
			$this->setResult(true, array($group->to_array()));
		} else {
			$this->setResult(false, $user->error->string);
		}

		return $this->result;
  	}
}

?>