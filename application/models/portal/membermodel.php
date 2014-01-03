<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class groupmodel extends MY_Model {
	
	private $member_table	= "member";
	private $member			= NULL;
	
	public function __construct() {
		parent::__construct();
		$this->member = (object) array(
			'id' 		=> $this->member_table.'.id',
			'name' 		=> $this->member_table.'.membername',
			'alias' 	=> $this->member_table.'.memberalias',
			'ip' 		=> $this->member_table.'.memberip',
			'note' 		=> $this->member_table.'.membernote',
			'path'		=> $this->member_table.'.memberpath',
			'status' 	=> $this->member_table.'.status',
			'groupid'	=> $this->member_table.'.groupid',
		);

		$keyAssoc = array (
			'id' 			=> $this->group->id,
			'membername' 	=> $this->member->name,
			'memberalias' 	=> $this->member->alias,
			'memberip' 		=> $this->member->ip,
			'membernote'	=> $this->member->note,
			'memberpath'	=> $this->member->path,
			'status' 		=> $this->member->status,
			'groupid'		=> $this->member->groupid
		);

		$this->setSortFieldAssociaton($keyAssoc);
		$this->setFilterFieldAssociaton($keyAssoc);
	}

	public function get() {
		$sql = $this->db->select($this->member->id.', '.
							     $this->member->name.', '.
							     $this->member->alias.', '.
							     $this->member->note.', '.
							     $this->member->ip.', '.
							     $this->member->path.', '.
							     $this->member->status)
 		->from($this->member_table);

 		if ($this->isFiltered()) {
			$where = $this->getFilterString();
			$this->db->where($where);
		}

		if ($this->isSorted()) {
			$sort = $this->getSortItem();			
			foreach ($sort as $property => $direction) {
				$this->db->order_by($property, $direction);
			}
			$this->db->order_by($this->member->id, 'ASC');
		}

		if ($this->isLimited()) {
			$this->db->limit($this->limit, $this->start);
		}

	 	$query = $this->db->get();

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

	public function add($name, $alias, $ip, $path, $note) {
		$this->db->set($this->member->name, 	$name);
    	$this->db->set($this->member->alias, 	$alias);
    	$this->db->set($this->member->alias, 	$ip);
    	$this->db->set($this->member->alias, 	$path);
    	$this->db->set($this->member->note, 	$note);

    	$this->db->insert($this->member_table);

    	if ($this->db->affected_rows() != 0) {
    		$id = $this->db->insert_id();
    		$this->clearParameter();
    		$this->addFilter($this->member->id, $id, 'string');
    		$this->get();    		
	 	} else {
	 		$msg = $this->db->_error_message();
	 		$num = $this->db->_error_number();
	 		$msg = "Error(".$num.") ".$msg;
	 		$this->setResult(false, $msg);
	 	}

	 	return $this->result;
	}

	public function addArray($ar) {
    	if (is_array($ar)) {
    		return $this->add($ar['membername'], $ar['memberalias'], $ar['ip'], $ar['path'], $ar['membernote']);
    	}
    }

	public function edit($name, $alias, $ip, $path, $note) {
		$param = array(
    		$this->member->name => $name,
    		$this->member->alias => $alias,
    		$this->member->ip => $ip,
    		$this->member->path => $path,
    		$this->member->note => $note
    	);

    	$this->db->where($this->member->id, $id);
    	$this->db->update($this->member_table, $param);

    	if ($this->db->affected_rows() != 0) {
    		$this->clearParameter();
    		$this->addFilter($this->member->id, $id, 'string');
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
    		return $this->edit($ar['id'], $ar['membername'], $ar['memberalias'], $ar['memberip'], $ar['memberpath'], $ar['membernote']);
    	}
    }

	public function delete(id) {
		$this->db->delete($this->member_table, array($this->member->id => $id));

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
}

?>