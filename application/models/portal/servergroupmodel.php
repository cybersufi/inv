<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Servergroupmodel extends MY_Model {
	
	private $table_name 	= "servergroups";
	private $group 			= NULL;
	
	public function __construct() {
		parent::__construct();
		$this->group = (object) array(
			'id' 		=> $this->table_name.'.id',
			'name' 		=> $this->table_name.'.groupname',
			'alias' 	=> $this->table_name.'.groupalias',
			'note' 		=> $this->table_name.'.groupnote',
			'status' 	=> $this->table_name.'.status'
		);

		$keyAssoc = array (
			'id' 			=> $this->group->id,
			'groupname' 	=> $this->group->name,
			'groupalias' 	=> $this->group->alias,
			'status' 		=> $this->group->status,
			'groupnote' 	=> $this->group->note
		);

		$this->setSortFieldAssociaton($keyAssoc);
		$this->setFilterFieldAssociaton($keyAssoc);
	}

	public function get() {
		$sql = $this->db->select($this->group->id.', '.
							     $this->group->name.', '.
							     $this->group->alias.', '.
							     $this->group->note.', '.
							     $this->group->status)

 		->from($this->table_name);

 		if ($this->isFiltered()) {
			$where = $this->getFilterString();
			$this->db->where($where);
		}

		if ($this->isSorted()) {
			$sort = $this->getSortItem();			
			foreach ($sort as $property => $direction) {
				$this->db->order_by($property, $direction);
			}
			$this->db->order_by($this->group->id, 'ASC');
		}

		if ($this->isLimited()) {
			$this->db->limit($this->limit, $this->start);
		}

	 	$query = $this->db->get();

	 	//echo $this->db->last_query();

	 	if ((strlen($this->db->_error_message()) == 0) && ($query->num_rows() >= 0)) {
	 		$this->setResult(true, $query->result_array());
	 	} else {
	 		$msg = $this->db->_error_message();
	 		$num = $this->db->_error_number();
	 		$msg = "Error(".$num.") ".$msg;
	 		$this->setResult(false, $msg);
	 	}

		return $this->result;
	}

	public function add($groupname, $groupalias, $groupnote) {
    	$this->db->set($this->group->name, $groupname);
    	$this->db->set($this->group->alias, $groupalias);
    	$this->db->set($this->group->note, $groupnote);

    	$this->db->insert($this->group_table);

    	if ($this->db->affected_rows() != 0) {
    		$id = $this->db->insert_id();
    		$this->clearParameter();
    		$this->addFilter($this->group->id, $id, 'string');
    		$this->get();    		
	 	} else {
	 		$this->setResult(false, $this->db->last_query());
	 	}

	 	return $this->result;
    }

    public function addArray($ar) {
    	if (is_array($ar)) {
    		return $this->add($ar['groupname'], $ar['groupalias'], $ar['groupnote']);
    	}
    }

    public function delete($id) {

    	$this->db->delete($this->table_name, array($this->group->id => $id));

    	if (strlen($this->db->_error_message()) == 0) {
	 		$this->setResult(true, null);
	 	} else {
	 		$msg = $this->db->_error_message();
	 		$num = $this->db->_error_number();
	 		$msg = "Error(".$num.") ".$msg;
	 		$this->setResult(false, $msg);
	 	}

		return $this->result;
    }

    public function edit($id, $groupname, $groupalias, $groupnote) {

    	$param = array(
    		$this->group->name => $groupname,
    		$this->group->alias => $groupalias,
    		$this->group->note => $groupnote
    	);

    	$this->db->where($this->group->id, $id);
    	$this->db->update($this->table_name, $param);

    	if ($this->db->affected_rows() != 0) {
    		$this->clearParameter();
    		$this->addFilter($this->group->id, $id, 'string');
    		$this->get();
	 	} else {
	 		$msg = $this->db->_error_message();
	 		$num = $this->db->_error_number();
	 		$msg = "Error(".$num.") ".$msg;
	 		$this->setResult(false, $msg);
	 	}

	 	return $this->result;
    }

    public function editArray($ar) {
    	if (is_array($ar)) {
    		return $this->edit($ar['id'], $ar['groupname'], $ar['groupalias'], $ar['groupnote']);
    	}
    }

    public function getServerMember(){
    	$this->load->model('portal/servermodel','servermodel');
    	$res = $this->get();
    	$collection = array();

    	if ($res['status'] == true) {
    		$gidlist = '';
			foreach ($res['result'] as $index => $group) {
				if (strlen($gidlist) > 0) {
					$gidlist .= ',';
				}
				$gidlist .= $group['id'];
				$tmp = $group;
				$tmp['members'] = array();
				$collection[$group['id']] = $tmp;
			}

			//print_r($collection);

			$this->servermodel->addFilter('groupid', $gidlist, 'list');
			//$res = $this->servermodel->getPing();
			$res = $this->servermodel->get();

			//print_r($res);

			if ($res['status'] == true) {
				foreach ($res['result'] as $index => $server) {

					//print_r($server);

					//$status = $server['pingstatus'];
					//$collection[$server['groupid']]['status'] = ($server['pingstatus'] == 1) ? true : false; 
					array_push($collection[$server['groupid']]['members'], $server);
				}	

			} 

			$finale = array();

			foreach ($collection as $key => $value) {
				array_push($finale, $value);	
			}

			$this->setResult(true, $finale);
			
		} else {
			$this->setResult(false, $res['result']);
		}

		return $this->result;

    }

    public function getTreeStructure(){
    	$this->load->model('portal/servermodel','servermodel');
    	$res = $this->get();
    	$collection = array();

    	if ($res['status'] == true) {
    		$gidlist = '';
			foreach ($res['result'] as $index => $group) {
				if (strlen($gidlist) > 0) {
					$gidlist .= ',';
				}
				$gidlist .= $group['id'];
				$tmp['id'] = 'group-'.$group['id'];
				$tmp['name'] = $group['groupname'];
				$tmp['pingtime'] = null;
				$tmp['status'] = $group['status'];
				$tmp['iconcls'] = null;
				$tmp['children'] = array();
				$collection[$group['id']] = $tmp;
			}

			$this->servermodel->addFilter('groupid', $gidlist, 'list');
			//$res = $this->servermodel->getPing();
			$res = $this->servermodel->get();

			//print_r($res);

			if ($res['status'] == true) {
				foreach ($res['result'] as $index => $server) {

					//print_r($server);

					//$status = $server['pingstatus'];
					//$collection[$server['groupid']]['status'] = ($server['pingstatus'] == 1) ? true : false; 
					$tmp = array();
					$tmp['id'] = 'server-'.$server['id'];
					$tmp['name'] = $server['servername'];
					$tmp['pingtime'] = null;
					$tmp['status'] = $server['status'];
					$tmp['iconcls'] = null;

					array_push($collection[$server['groupid']]['children'], $tmp);
				}	

			} 

			$finale = array();

			foreach ($collection as $key => $value) {
				array_push($finale, $value);	
			}

			$this->setResult(true, $finale);
			
		} else {
			$this->setResult(false, $res['result']);
		}

		return $this->result;

    }
}

?>