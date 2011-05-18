<?php
$proxy_url = isset($_GET['proxy_url'])?$_GET['proxy_url']:false;

@$data=file_get_contents($proxy_url);
echo($data);

?>