<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Servermodel1 extends MY_Model {
	
	private $table_name		= "server";
	private $server			= NULL;
	
	public function __construct() {
		parent::__construct();
		$this->server = (object) array(
			'id' 		=> $this->table_name.'.id',
			'name' 		=> $this->table_name.'.membername',
			'alias' 	=> $this->table_name.'.memberalias',
			'ip' 		=> $this->table_name.'.memberip',
			'note' 		=> $this->table_name.'.membernote',
			'path'		=> $this->table_name.'.memberpath',
			'status' 	=> $this->table_name.'.status',
			'groupid'	=> $this->table_name.'.groupid',
		);

		$keyAssoc = array (
			'id' 			=> $this->server->id,
			'servername' 	=> $this->server->name,
			'serveralias' 	=> $this->server->alias,
			'serverip' 		=> $this->server->ip,
			'servernote'	=> $this->server->note,
			'serverpath'	=> $this->server->path,
			'status' 		=> $this->server->status,
			'groupid'		=> $this->server->groupid
		);

		$this->setSortFieldAssociaton($keyAssoc);
		$this->setFilterFieldAssociaton($keyAssoc);
	}

	public function get() {
		$sql = $this->db->select($this->server->id.', '.
							     $this->server->name.', '.
							     $this->server->alias.', '.
							     $this->server->note.', '.
							     $this->server->ip.', '.
							     $this->server->path.', '.
							     $this->server->status)
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
		$this->db->set($this->server->name, 	$name);
    	$this->db->set($this->server->alias, 	$alias);
    	$this->db->set($this->server->alias, 	$ip);
    	$this->db->set($this->server->alias, 	$path);
    	$this->db->set($this->server->note, 	$note);

    	$this->db->insert($this->table_name);

    	if ($this->db->affected_rows() != 0) {
    		$id = $this->db->insert_id();
    		$this->clearParameter();
    		$this->addFilter($this->server->id, $id, 'string');
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
    		return $this->add($ar['servername'], $ar['serveralias'], $ar['ip'], $ar['path'], $ar['servernote']);
    	}
    }

	public function edit($name, $alias, $ip, $path, $note) {
		$param = array(
    		$this->server->name => $name,
    		$this->server->alias => $alias,
    		$this->server->ip => $ip,
    		$this->server->path => $path,
    		$this->server->note => $note
    	);

    	$this->db->where($this->server->id, $id);
    	$this->db->update($this->table_name, $param);

    	if ($this->db->affected_rows() != 0) {
    		$this->clearParameter();
    		$this->addFilter($this->server->id, $id, 'string');
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
    		return $this->edit($ar['id'], $ar['servername'], $ar['serveralias'], $ar['serverip'], $ar['serverpath'], $ar['servernote']);
    	}
    }

	public function del($id) {
		$this->db->delete($this->table_name, array($this->server->id => $id));

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

	public function getPing() {
		$this->load->library('serverutils');
		$res 		= $this->get();
		$collection = array();

		if ($res['status'] == true) {
			foreach ($res['result'] as $index => $server) {
				$temp = $server;
				$temp['pingstatus'] = $this->serverutils->ping($server['serverip'], 22, 2);
				array_push($collection, $temp);
			}
			$this->setResult(true, $collection);
		} else {
			$this->setResult(false, $res['result']);
		}

		return $this->result;
	}	
}

?>