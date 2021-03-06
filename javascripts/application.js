  /*Application global vars*/
  var year           = 2011;
  var compare        = 'ninguna';
  var state          = "mapa";


  $(document).ready(function(){

    //Deep linking management
    var route = window.location.hash.replace('#','').split('/');
    goToHash(route);
  });


  function initializeApp() {
    initWelcomeWindow();
    initializeGraph();         // initialize graph
    initializeHeader();        // initialize header options (selects and more) and graph/map menu
    initializeMap();           // initialize map and map modules
    initializeKeyBindings();   // initialize key bindings
  }

  function initializeKeyBindings() {
    $(document).keyup(function(e) {
      if (e.keyCode == 27) {
        if (ie_) {
          $("#welcomewindow").hide();
        } else {
          $("#welcomewindow").fadeOut();
        }
        explanationwindow.hide();
        comparewindow.hide();
        aboutwindow.hide();
        if (state == "grafico") {
          graphBubbleInfowindow.hide();
        } else {
          infowindow.hide();
        }
      }
    });
  }

  function goToHash(route) {
    //Check variable application state
    if (route[0]!="mapa" && route[0]!="grafico") {
      initializeApp();
      return false;
    }

    // //Check variable of compare
    if (!$('div.option_list ul li a.'+route[5]).length && route[5]!="ninguna") {
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
    
    if (route[4]<1987 || route[4]>2011) {
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
    compare = route[5].replace(/_/g," ");
    deep = route[6];
    name = route[7];
    var value = $('div.option_list ul li a.'+route[5]).text();
    // Remove selected variable
    $('div.option_list ul li.selected').each(function(i,ele){$(ele).removeClass('selected');});
    $('div.select').each(function(i,ele){$(ele).removeClass('selected');});
    $('div.select span.inner_select a').each(function(i,ele){var text = $(ele).attr('title'); $(ele).text(text);});
    // Add new selected variable
    $('div.option_list ul li a.'+route[5]).closest('li').addClass('selected');
    $('div.option_list ul li a.'+route[5]).closest('div.select').addClass('selected');
    $('div.option_list ul li a.'+route[5]).closest('div.select').find('span.inner_select a').text(value);

    initializeApp();
  }

    function initWelcomeWindow() {
      $('body').click(function(event) {
        if (!$(event.target).closest('div#welcomewindow').length) {
          if (ie_) {
            $("#welcomewindow").hide();
          } else {
            $("#welcomewindow").fadeOut();
          }
          $('body').unbind('click');
        }
      });

      $("#welcomewindow a.close_info").click(function(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        if (ie_) {
          $("#welcomewindow").hide();
        } else {
          $("#welcomewindow").fadeOut();
        }
      });

      $("#welcomewindow a.start").click(function(ev) {
        ev.stopPropagation();
        ev.preventDefault();

        $("#welcomewindow").fadeOut("slow");

        if (year < 2005) { // because we don't have paro information prior 2005
          updateNewSliderValue(2000, year);
        }
        
        $("div.select div.option_list ul li a.envejecimiento").click();
        changeHash();
      });

      $("#welcomewindow a.explore").click(function(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        $("#welcomewindow").fadeOut("slow");
      });

      $("#welcomewindow a.more_info").click(function(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        $("#welcomewindow").fadeOut("slow");
        explanationwindow.show(true);
      });

      $("#welcomewindow a.know_more").click(function(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        $("#welcomewindow").fadeOut("slow");
        aboutwindow.show(true);
      });
    }

  function changeHash() {
    var latlng = peninsula.getCenter();
    var zoom = peninsula.getZoom();
    var hash = "#"+ state + "/" + latlng.lat().toFixed(3)+"/"+latlng.lng().toFixed(3)+"/"+zoom+"/"+year+"/"+compare.replace(/ /g,'_')+"/"+deep+"/"+name;
    window.location.hash = hash;
    updateWadusText();
  }
