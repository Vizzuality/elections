
  var global_url      = "http://datos.rtve.es/elecciones/autonomicas-municipales/data";
  var tiles_pngs_url  = "http://datos{n}.rtve.es/elecciones/autonomicas-municipales/data/tiles/";
  //var global_url = "http://ec2-50-16-13-57.compute-1.amazonaws.com/data"
  //var tiles_pngs_url  = "http://ec2-50-16-13-57.compute-1.amazonaws.com/data/tiles/";
  var proxy_url       = "proxy.php";
  var tiles_version   = "live"; //"current"; //3;
  var bubbles_version = "current"; //10;
  var gmaps_version   = "current"; //4;
  var graph_version   = "live"; //"current"; //"v7";
  var ua              = $.browser;
  var ie_             = false;
  
  
  if (window.location.hostname == "localhost" || window.location.hostname == "elections" || window.location.hostname == "192.168.1.147") {
    global_url = proxy_url+"?proxy_url="+global_url;
    //tiles_pngs_url = "http://rtvedata{n}.ipq.co/data/tiles/";
  } else if (window.location.hostname == "datos.rtve.es") {
    global_url = "http://datos.rtve.es/elecciones/autonomicas-municipales/data";
  }


  //Go to IE6 page
  if (ua.msie) {
    if (ua.version.slice(0,3) < '7.0') {
      window.location.href = "http://cartodb.com/";
    } else if (ua.version.slice(0,3) < '9.0') {
      ie_ = true;
    }
  }

