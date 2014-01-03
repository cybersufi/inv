<?php  
if(!defined('BASEPATH')) exit('No direct script access allowed');

/*
    Native / Database hybrid
    Code Igniter
    Citrusmedia - Matthew Lymer
*/


class Serverutils {

	function ping($host, $port, $timeout) {
		$fP = @fSockOpen($host, $port, $errno, $errstr, $timeout); 
		if (!$fP) {  
			return false; 
		} else {
			return true;
		}
	}
}