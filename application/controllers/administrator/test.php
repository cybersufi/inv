<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');

//require_once APPPATH.'CORE/MY_RestController.php';

//class test extends CI_Controller {
class test extends MY_Controller {

	function __construct() {
		parent::__construct();
		
		//$this->load->model('administrator/user');
	}

	public function index() {

		echo "Test World <br>";
		echo $this->um->test();
	}

	public function get() {
		return null;
	}

	public function post() {
		return null;
	}

	public function put() {
		return null;
	}

	public function delete() {
		return null;
	}

	/*public function index() {


		$permval = decbin(3);
		$permval2 = $permval;
        $permval = str_split($permval);
        print_r($permval);
        
        if (strlen($permval2) < 3) {
            $len = strlen($permval2);
            for ($i = $len; $i < 3; $i++) {
                $permval2 = '0'.$permval2;
            }
        }

        $permval2 = str_split($permval2);
        print_r($permval2);



		/*$this->load->model('administrator/usermodel','um');
		$res = $this->um->getUserList();
		echo json_encode($res);




		/*$u = new User();
		$u->get();

		//echo '<pre>';
		//print_r($u->to_array());
		//echo '</pre>';

		foreach ($u as $user ) {
			echo '<pre>';
			//print_r($user->stored);
			//echo json_encode($user->stored);
			//var_dump($user);
			print_r($user->to_array());
			echo '</pre>';
			//echo '<hr>';
			//echo $user->id.'<br>';
			//echo $user->hash.'<br>';
		}
	}*/
}

?>