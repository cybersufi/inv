<?php  
if(!defined('BASEPATH')) exit('No direct script access allowed');

class MY_Model extends CI_Model {

	protected $result 			= NULL;
	protected $sortField 		= array();
	protected $filterField	 	= array();
	protected $sorter 			= array();
	protected $filter 			= array();
	protected $limit 			= NULL;
	protected $start 			= NULL;

	private $filterArray 		= array('field', 'value', 'type');
	private $sorterArray 		= array('property', 'direction');

	protected $join_tables		= array();

	public function __construct() {
		parent::__construct();
	}

	public function addJoinTable($table_name, $source_column, $dest_column){
		$this->join_tables[$table_name] = (object) array (
			'table_name' => $table_name,
			'source_column' => $source_column,
			'dest_column' => $table_name.".".$dest_column
		);
	}

	public function getJoinTable($table_name=NULL) {
		if ($table_name != NULL) {
			if (array_key_exists($table_name, $this->join_tables)) {
				return $this->join_tables[$table_name];
			}
		} else {
			return $this->join_tables;
		}
		return null;
	}
	
	public function setResult($status=false, $result=NULL) {
		$this->result = array(
            'status' => $status,
            'result' => $result
        );
	}

	public function clearParameter() {
		$this->sorter 			= array();
		$this->filter 			= array();
		$this->limit 			= NULL;
		$this->start 			= NULL;
	}

	public function isFiltered() {
		return (count($this->filter) > 0) ? true : false;
	}

	public function isSorted() {
		return (count($this->sorter) > 0) ? true : false;
	}

	public function isLimited() {
		return ($this->limit > 0) ? true : false;
	}

	public function addSortFieldAssociaton($baseField, $targetField) {
		if (!array_key_exists($targetField, $this->sortField)) {
			$this->sortField[$targetField] = $baseField;
		}
	}

	public function setSortFieldAssociaton($keyArray) {
		if (is_array($keyArray)) {
			foreach ($keyArray as $baseKey => $targetKey) {
				$this->addSortFieldAssociaton($baseKey, $targetKey);
			}
		}
	}

	public function addFilterFieldAssociaton($baseField, $targetField) {
		if (!array_key_exists($targetField, $this->filterField)) {
			$this->filterField[$targetField] = $baseField;
		}
	}

	public function setFilterFieldAssociaton($keyArray) {
		if (is_array($keyArray)) {
			foreach ($keyArray as $baseKey => $targetKey) {
				$this->addFilterFieldAssociaton($baseKey, $targetKey);
			}
		}
	}

	public function addSorter($property, $direction) {
		if ((count($this->sortField) > 0) && array_key_exists($property, $this->sortField)) {
			$property = $this->sortField[$property];
		} 

		if (!array_key_exists($property, $this->sorter)) {
			$this->sorter[$property] = $direction;
		}
	}

	public function addSorterArray($sorterArray) {
		if (is_array($sorterArray)) {
			foreach ($sorterArray as $sortItem) {
				if ($this->check2DArray($this->sorterArray, $sortItem)) {
					$this->addSorter($sortItem['property'], $sortItem['direction']);
				}
			}
		}
	}

	public function addSorterJSON($sorterJSON) {
		$sorter = json_decode($sorterJSON, true);
		if (!is_null($sorter)) {
			$this->addSorterArray($sorter);
		}
	}

	public function getSortItem() {
		return $this->sorter;
	}

	public function addFilter($field, $value, $type, $compare=NULL) {
		if ((count($this->filterField) > 0) && array_key_exists($field, $this->filterField)) {
			$field = $this->filterField[$field];
		}

		$temp = array(
			"field" => $field, 
			"value" => $value,
			"type" => $type,
			"compare" => $compare
		);

		if (!array_key_exists($field, $this->filter)) {
			$this->filter[$field] = json_encode($temp);
		}
	}

	public function addFilterArray($filterArray) {
		if (is_array($filterArray)) {
			foreach ($filterArray as $filterItem) {
				if ($this->check2DArray($this->filterArray, $filterItem)) {
					$compare = isset($filterItem['compare']) ? $filterItem['compare'] : NULL;
					$this->addFilter($filterItem['field'], $filterItem['value'], $filterItem['type'], $compare);
				}
			}
		}
	}

	public function addFilterJSON($filterJSON) {
		$filters = json_decode($filterJSON, true);

		if (!is_null($filters)) {
   			$this->addFilterArray($filters);
		}
	}

	public function setLimit($limit, $start) {
		if (is_numeric($limit) && ($limit >= 0)) {
	    	$this->limit = $limit;
	    } else {
	    	$this->limit = 0;
	    }

	    if (is_numeric($start) && ($start >= 0)) {
	    	$this->start = $start;
	    } else {
	    	$this->limit = 0;
	    }
	}

	public function getFilterString() {
		$where = "";

		if (count($this->filter) > 0) {
			foreach ($this->filter as $filterValue) {
				if (strlen($where) > 0) {
					$where .= " AND ";
				}

				$value = json_decode($filterValue);
				$where .= $this->filterString($value->field, $value->value, $value->type, $value->compare);
			}
		}

		return $where;
	}

	public function getLastQuery() {
		return $this->db->last_query();
	}

	private function filterString($field, $value, $type, $compare) {
		$qs = '';

		switch($type){
			case 'string' : $qs .= $field." LIKE '%".$value."%'"; break;
			case 'list' :
				if (strstr($value,',')) {
					$fi = explode(',',$value);
					for ($q=0;$q<count($fi);$q++) {
						$fi[$q] = "'".$fi[$q]."'";
					}
					$value = implode(',',$fi);
					$qs .= $field." IN (".$value.")";
				} else {
					$qs .= $field." = '".$value."'";
				}
			break;
			case 'boolean' : 
				if (!is_numeric($value)) {
		 			$value = (strstr($value, "yes")) ? 1 : 0;
		 		}
				$qs .= $field." = ".($value); 
			break;
			case 'numeric' :
				switch ($compare) {
					case 'eq' : $qs .= $field." = ".$value; break;
					case 'lt' : $qs .= $field." < ".$value; break;
					case 'gt' : $qs .= $field." > ".$value; break;
				}
			break;
			case 'date' :
				switch ($compare) {
					case 'eq' : $qs .= $field." = '".date('Y-m-d',strtotime($value))."'"; break;
					case 'lt' : $qs .= $field." < '".date('Y-m-d',strtotime($value))."'"; break;
					case 'gt' : $qs .= $field." > '".date('Y-m-d',strtotime($value))."'"; break;
				}
			break;
		}

		return $qs;
	}

	private function check2DArray($baseArray, $targetArray) {
		$keys = array_keys($targetArray);
		$bool = false;

		if (count($keys) == count($baseArray)) {
			foreach ($baseArray as $baseKey) {
				$bool = in_array($baseKey, $keys);
			}
		} 

		return $bool;
	}

}

?>