
  var global_url      = "http://ec2-50-16-13-57.compute-1.amazonaws.com/data";
  var tiles_pngs_url  = "http://rtvedata{n}.ipq.co/data/tiles/";
  var proxy_url       = "proxy.php";
  var tiles_version   = 3; //"current"; //3;
  var bubbles_version = "current"; //10;
  var gmaps_version   = "current"; //4;
  var graph_version   = "current"; //"v7";
  var ua = $.browser;
  
  if (window.location.hostname == "localhost" || window.location.hostname == "elections" || window.location.hostname == "192.168.1.147") {
    global_url = proxy_url+"?proxy_url="+global_url;
    //tiles_pngs_url = "http://rtvedata{n}.ipq.co/data/tiles/";
  } else if (window.location.hostname == "datos.rtve.es") {
    global_url = "http://datos.rtve.es/elecciones/autonomicas-municipales/data";
  }


  //Go to IE6 page
  if (ua.msie && ua.version.slice(0,3) < '7.0') {
    window.location.href = "../ie6.html";
  }
