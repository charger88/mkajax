<?php
	if (isset($_GET['delay'])){
		sleep(min(2,intval(abs($_GET['delay']))));
		echo 'Request: '.date('Y-m-d H:i:s').'. Link '.(isset($_GET['link']) ? intval($_GET['link']) : 0).'. Some random data: '.rand(10000,99999);
	} else {
		sleep(1);
		echo '<dl>';
		if ($_REQUEST){
			foreach($_REQUEST as $key => $value){
				echo '<dt><b>'.htmlspecialchars($key).'</b></dt>';
				echo '<dd>'.htmlspecialchars(is_array($value) ? '['.implode('], [',$value).']' : $value).'</dd>';
			}
		}
		echo '</dl>';
	}
?>