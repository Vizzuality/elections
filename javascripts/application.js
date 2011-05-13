  /*Application global vars*/
  var year    = 2003;
  var compare = 'paro';
  var state   = "mapa";

  $(document).ready(function(){
    //Deep linking manage
    var route = window.location.hash.replace('#','').split('/');
    goToHash(route);
  });

  function initializeApp() {
    //initialize graph
    initializeGraph();

    //initialize header options (selects and more) and graph/map menu
    initializeOptions();

    //initialize map and map modules
    initializeMap();
  }

  function goToHash(route) {
    //Check variable application state
    if (route[0]!="mapa" && route[0]!="grafico") {
      initializeApp();
      return false;
    }

    // //Check variable of compare
    if (!$('div.option_list ul li a.'+route[5]).length) {
      initializeApp();
      return false;
    }

    // Check length of the array
    if (route.length!=8) {
      initializeApp();
      return false;
    }

    // Check provincia-autonomia-municipio
    if (route[6]!="autonomias" && route[6]!="municipios" && route[6]!="provincias") {
      initializeApp();
      return false;
    }

    //check 1-num 2-num 3-num 4-year 5-string
    if (isNaN(route[1]) || isNaN(route[2]) || isNaN(route[3]) || isNaN(route[4]) || route[4].length!=4 || !isNaN(route[5])) {
      initializeApp();
      return false;
    }

    // Check zoom
    if (route[3]>12 || route[3]<6) {
      initializeApp();
      return false;
    }

    //All ok - change variables!
    start_center = new google.maps.LatLng(parseFloat(route[1]),parseFloat(route[2]));
    start_zoom = parseInt(route[3]);
    year = parseInt(route[4]);
    state = route[0];
    $("div.year_slider").slider("value",year);
    compare = route[5];
    deep = route[6];
    name = route[7];
    var value = $('div.option_list ul li a.'+compare).text();
    $('div.option_list ul li a.'+route[5]).closest('li').addClass('selected');
    $('div.option_list ul li a.'+route[5]).closest('div.select').addClass('selected');
    $('div.option_list ul li a.'+route[5]).closest('div.select').find('span.inner_select a').text(value);

    initializeApp();
  }

  function changeHash() {
    var latlng = peninsula.getCenter();
    var zoom = peninsula.getZoom();
    window.location.hash = "#"+ state + "/" + latlng.lat().toFixed(3)+"/"+latlng.lng().toFixed(3)+"/"+zoom+"/"+year+"/"+compare+"/"+deep+"/"+name;
  }
