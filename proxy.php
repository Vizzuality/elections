<?php
$proxy_url = isset($_GET['proxy_url'])?$_GET['proxy_url']:false;

@$data=file_get_contents($proxy_url);

if (!$data) {
    header("HTTP/1.0 404 Not Found");
} else {
    echo($data);
}
?>