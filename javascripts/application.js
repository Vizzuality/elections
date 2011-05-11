
  /*Application global vars*/
  var year = 2009;
  var compare = 'paro';
  var state = "map";


  $(document).ready(function(){
    //Deep linking manage
    var route = window.location.hash.replace('#','').split('_');
    goToHash(route);
    
    //initialize header options (selects and more) and graph/map menu
    initializeOptions();
    
    //initialize map and map modules
    initializeMap();
    
    //initialize graph
    initializeGraph();
  });
  
  
  
  
  
  function goToHash(route) {
    //Check variable of compare
    if (!$('div.option_list ul li a.'+route[4]).length) {
      $('div.option_list ul li a.paro').closest('div.select').find('span.inner_select a').text('Tasa de paro');
      $('div.option_list ul li a.paro').closest('li').addClass('selected');
      $('div.option_list ul li a.paro').closest('div.select').addClass('selected');
      return false;
    }
    
    // Check length of the array
    if (route.length!=6) {
      return false;
    }
    
    // Check provincia-autonomia-municipio
    if (route[5]!="autonomia" && route[5]!="municipio" && route[5]!="provincia") {
      return false;
    }
    
    //check 1-num 2-num 3-num 4-year 5-string
    if (isNaN(route[0]) || isNaN(route[1]) || isNaN(route[2]) || isNaN(route[3]) || route[3].length!=4 || !isNaN(route[4])) {
      return false;
    }
    
    // Check latlng is in Spain bounds // lat - lng
    
    // Ea: 44.38622285113468
    // Fa: 5.0576171875
    // 
    // Ea: 34.34289460173804
    // Fa: -10.455078125
    // peninsula
    // --------------------------------
    // canary
    // Ea: 30.070903366702098
    // Fa: -12.795166015625
    // 
    // Ea: 26.70822759363471
    // Fa: -18.9090576171875
    //
    //
    // Spain latlngbounds
    
    

    // Check zoom
    if (route[2]>12 || route[2]<6) {
      return false;
    }
    //All ok - change variables!
    start_center = new google.maps.LatLng(parseFloat(route[0]),parseFloat(route[1]));
    start_zoom = parseInt(route[2]);
    year = parseInt(route[3]);
    $("div.year_slider").slider("value",year);
    compare = route[4];
    var value = $('div.option_list ul li a.'+route[4]).text();
    $('div.option_list ul li a.'+route[4]).closest('li').addClass('selected');
    $('div.option_list ul li a.'+route[4]).closest('div.select').addClass('selected');
    $('div.option_list ul li a.'+route[4]).closest('div.select').find('span.inner_select a').text(value);
  }
  
  
  
  function changeHash() {
    var latlng = peninsula.getCenter();
    var zoom = peninsula.getZoom();
    if (zoom==6) {
      level = "autonomia";
    } else if (zoom>6 && zoom<10) {
      level = "provincia";
    } else {
      level = "municipio";
    }
    window.location.hash = "#" + latlng.lat().toFixed(3)+"_"+latlng.lng().toFixed(3)+"_"+zoom+"_"+year+"_"+compare+"_"+level;
  }
  