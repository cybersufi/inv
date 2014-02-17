<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Usergroupmodel extends MY_Model {

	function __construct() {
		parent::__construct();
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