<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if ( ! function_exists('create_result')) {
	function create_result($timming, $result) {
		$tmp = array();

		if (is_array($result)) {
			$tmp['data'] = $result;
			$tmp['totalCount'] = count($result);
		}

		$response = array();
		$response["success"] = true;
		$response["status"] = 'ok';
		$response["response"] = $tmp;
		$response["timing"] = microtime(true) - $timming;

		return $response;

	}
}

if ( ! function_exists('create_tree_result')) {
	function create_tree_result($timming, $result) {
		$response = array();
		$response["success"] = true;
		$response["status"] = 'ok';
		$response["response"] = $result;
		$response["timing"] = microtime(true) - $timming;

		return $response;

	}
}

if ( ! function_exists('success_result')) {
	function success_result($timming, $message=null) {
		$response = array();
		$response["success"] = true;
		$response["status"] = 'ok';
		$response["response"] = array(
			'message' => $message,
		);
		$response["timing"] = microtime(true) - $timming;

		return $response;
	}
}

if ( ! function_exists('error_result')) {
	function error_result($timming, $message=null, $exception=null, $backtrace=null) {
		$response = array();
		$response["success"] = false;
		$response["status"] = 'error';
		$response["exception"] = array(
			'message' => $message,
			'exception' => $exception,
			'backtrace' => $backtrace,
		);
		$response["timing"] = microtime(true) - $timming;

		return $response;
	}
}

?>