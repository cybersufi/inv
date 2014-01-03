<?php if ( ! defined('APPPATH')) exit('No direct script access allowed'); ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
	"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Welcome to Server Monitoring</title>
	<link rel="stylesheet" type="text/css" href="frontend/servmon/css/servmon.css"/>
</head>
<body>

<div id="container">
	<h1>Welcome to Server Monitoring Portal!</h1>

	<div id="body">
		<p>Overview: </p>

		<?php 

			if (strcmp($response['status'],'ok') == 0) {
				$res = $response['response'];
				$data = $res['data'];
				foreach ($data as $server) {
					if ($server['pingstatus'] == true){
						echo '<div class="success"> Server: '.$server['servername'].' ('. $server['serverip'] .') is UP </div>';
					} else {
						echo '<div class="error"> Server: '.$server['servername'].' ('. $server['serverip'] .') is Down from here</div>';
					}
				}
			} else {
				$ex = $response['exception'];
				echo '<div class="error">'.$ex['message'].'</div>';
			}

		?>

		<p>The page you are looking at is crude version of server monitoring by ping.</p>
		<p>If you would like to contribute to this page feel free to ask UNIX team</p>
	</div>

	<p class="footer">Page rendered in <strong>{elapsed_time}</strong> seconds</p>
</div>

</body>
</html>