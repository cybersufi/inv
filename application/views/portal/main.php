<?php if ( ! defined('APPPATH')) exit('No direct script access allowed'); ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
	"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<title>Server Status Portal</title>
		
		<!-- Include the ExtJS CSS Theme -->
		<link rel="stylesheet" type="text/css" href="frontend/portal/js/Ext.ux/statusbar/css/statusbar.css"/>
		<link rel="stylesheet" type="text/css" href="frontend/portal/css/admin-theme.css"/>
		<link rel="stylesheet" type="text/css" href="frontend/portal/css/portal.css"/>
		<link rel="stylesheet" type="text/css" href="frontend/portal/extjs.ux/CheckHeader.css"/>
		
		<link rel="icon" href="favicon.ico"/>
		
		<script type="text/javascript">
			window.parameters = {
				"basePath":"<?php echo base_url('portal'); ?>",
				"baseResource":"<?php echo base_url('frontend/portal/'); ?>",
				"doctrine_orm_version":"2.2.2",
				"doctrine_dbal_version":"2.2.2",
				"doctrine_common_version":"2.2.2",
				"php_version":"5.3.8",
				"maxUploadSize":8388608,
			};
		</script>
		
		<!-- Include the ExtJS JavaScript Library -->
		<!-- <script type="text/javascript" src="frontend/administrator/extjs/bootstrap.js"></script> -->
		<script type="text/javascript" src="frontend/portal/extjs/ext-all-debug.js"></script>
		<!-- <script type="text/javascript" src="frontend/administrator/js/Ext.ux/Ext.ux.formatter-all.js"></script> -->
		<script type="text/javascript" src="frontend/portal/js/org.phpjs.lib/php.default.min.js"></script>
		<script type="text/javascript" src="frontend/portal/js/app/portal.js"></script>
	</head>
	<body>
		<div id="loading"><span class="logo"></span></div>
	</body>
</html>