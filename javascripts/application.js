
  /*Application global vars*/
  var year = 2009;
  var compare = 'paro';


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
    if (route.length!=5) {
      return false;
    }
    
    //check 1-num 2-num 3-num 4-year 5-string
    if (isNaN(route[0]) || isNaN(route[1]) || isNaN(route[2]) || isNaN(route[3]) || route[3].length!=4 || !isNaN(route[4])) {
      return false;
    }
    
    // Check latlng is in Spain bounds
    

    // Check zoom
    if (route[2]>12 || route[2]<6) {
      return false;
    }
    //All ok - change variables!
    start_center = new google.maps.LatLng(parseFloat(route[0]),parseFloat(route[1]));
    start_zoom = parseInt(route[2]);
    year = parseInt(route[3]);
    $("div.year_slider").slider("value",[year]);
    compare = route[4];
    var value = $('div.option_list ul li a.'+route[4]).text();
    $('div.option_list ul li a.'+route[4]).closest('li').addClass('selected');
    $('div.option_list ul li a.'+route[4]).closest('div.select').addClass('selected');
    $('div.option_list ul li a.'+route[4]).closest('div.select').find('span.inner_select a').text(value);
  }
  
  
  
  function changeHash() {
    var latlng = peninsula.getCenter();
    var zoom = peninsula.getZoom();
    window.location.hash = "#" + latlng.lat().toFixed(3)+"_"+latlng.lng().toFixed(3)+"_"+zoom+"_"+year+"_"+compare;
  }
  