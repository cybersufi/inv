<?php if ( ! defined('APPPATH')) exit('No direct script access allowed');
	header('Cache-Control: no-cache, must-revalidate');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
	header('Content-type: application/json');

	echo json_encode($response);
?>