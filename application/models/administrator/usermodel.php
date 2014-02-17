<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Usermodel extends MY_Model {

	function __construct() {
		parent::__construct();
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
	
}

?>