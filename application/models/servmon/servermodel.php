<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

class Servermodel extends MY_Model {
	
	private $table_name		= "servers";
	private $server			= NULL;
	
	public function __construct() {
		parent::__construct();
		$this->server = (object) array(
			'id' 		=> $this->table_name.'.id',
			'name' 		=> $this->table_name.'.servername',
			'ip' 		=> $this->table_name.'.serverip',
			'note' 		=> $this->table_name.'.servernote',
		);

		$keyAssoc = array (
			'id' 				=> $this->server->id,
			'servername' 		=> $this->server->name,
			'serverip' 			=> $this->server->ip,
			'servernote' 		=> $this->server->note,
		);

		$this->setSortFieldAssociaton($keyAssoc);
		$this->setFilterFieldAssociaton($keyAssoc);
	}

	public function get() {
		$sql = $this->db->select($this->server->id.', '.
							     $this->server->name.', '.
							     $this->server->ip.', '.
							     $this->server->note)
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

	public function getPing() {
		$this->load->library('serverutils');
		$res 		= $this->get();
		$collection = array();

		if ($res['status'] == true) {
			//print_r($res['result']);
			foreach ($res['result'] as $index => $server) {
				$temp = $server;
				//print_r($server);
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