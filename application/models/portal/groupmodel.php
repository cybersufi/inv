<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class groupmodel extends MY_Model {
	
	private $group_table 	= "group";
	private $group 			= NULL;
	
	public function __construct() {
		parent::__construct();
		$this->group = (object) array(
			'id' => $this->group_table.'.id',
			'name' => $this->group_table.'.groupname',
			'alias' => $this->group_table.'.groupalias',
			'note' => $this->group_table.'.groupnote',
			'status' => $this->group_table.'.status'
		);

		$keyAssoc = array (
			'id' => $this->group->id,
			'groupname' => $this->group->name,
			'groupalias' => $this->group->alias,
			'status' => $this->group->status
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
 		->from($this->group_table);

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

    	$this->db->delete($this->group_table, array($this->group->id => $id));

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
    	$this->db->update($this->group_table, $param);

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

}

?>