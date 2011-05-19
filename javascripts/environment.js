
  var global_url      = "http://ec2-50-16-13-57.compute-1.amazonaws.com/data";
  var tiles_pngs_url  = "http://datos.rtve.es/elecciones/autonomicas-municipales/data/tiles/";
  var proxy_url       = "proxy.php";
  var tiles_version   = "current"; //3;
  var bubbles_version = "current"; //10;
  var gmaps_version   = "current"; //4;
  var graph_version   = "current"; //"v7";
  
  
  
  if (window.location.hostname == "localhost" || window.location.hostname == "elections") {
    global_url = proxy_url+"?proxy_url="+global_url;
  } else if (window.location.hostname == "datos.rtve.es") {
    global_url = "http://datos.rtve.es/elecciones/autonomicas-municipales/data";
  }
