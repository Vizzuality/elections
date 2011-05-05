
  /*Application global vars*/
  var year = 2011;
  var compare = 'paro';


  jQuery(function($) {

    //Control tab menu - map or graph
    $('div#tab_menu a').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      var className = ($(this).hasClass('map'))?'map':'graph';
      if (!$(this).hasClass('selected')) {
        $('div#tab_menu a').removeClass('selected');
        if (className=='map') {
          $('div#map').css('zIndex',10);
          $('div#graph').css('zIndex',0);
        } else {
          restartGraph();
          $('div#map').css('zIndex',0);
          $('div#graph').css('zIndex',10);
        }
        $(this).addClass('selected')
      }
    });
    

    
    //------------------------ TEST!!!!!!!   HEADER!
    
    var route = window.location.hash.replace('#','').split('_');
    goToHash(route);
    
    /*-------------------------------------*/
    $("div.year_slider").slider({
      range: "min",
      min: 1987,
      max: 2011,
      value: 2011,
      step: 1,
      create: function(event,ui) {
        $(this).find('a.ui-slider-handle').text('2011');
      },
      slide: function( event, ui ) {
        $(this).find('a.ui-slider-handle').text(ui.value);
      },
      stop: function( event, ui ) {
        //Change bubbles!!
      }
    });
    
    /*SELECTS*/
    /*Select event*/
    $('div.select div.outer_select').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      
      $('div.select').each(function(i,ele){$(ele).removeClass('opened');});
      if (!$(this).closest('div.select').hasClass('opened')) {
        if ($(this).parent().find('li.selected').length) {
          var index = $(this).parent().find('li.selected').index();
          $(this).parent().find('div.option_list').css('top',-(index*24)+'px');
        } else {
          $(this).parent().find('div.option_list').css('top','0px');
        }
        $(this).closest('div.select').addClass('opened');
      } else {
        $(this).closest('div.select').removeClass('opened');
      }
      
      $('body').click(function(event) {
        if (!$(event.target).closest('div.option_list').length) {
          $('div.select').each(function(i,ele){$(ele).removeClass('opened');});
          $('body').unbind('click');
        };
      });
    });
    
    /*List events*/
    $('div.option_list ul li a').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      
      var value = $(this).text();
      
      if (!$(this).parent().hasClass('selected')) {
        $('div.select span.inner_select a').each(function(i,ele){$(this).text($(this).closest('div.select').find('img').attr('alt'));});
        $('div.option_list ul li').each(function(i,ele){$(ele).removeClass('selected');});
        $('div.select').each(function(i,ele){$(ele).removeClass('selected');});
        
        $(this).parent().addClass('selected');
        $(this).closest('div.select').addClass('selected').removeClass('opened');
        $(this).closest('div.select').find('span.inner_select a').text(value);
        $('body').unbind('click');
      } 
    });
    /*---------------END TEST HEADER & START DEEP LINKING----------------------*/
    
    
    
    //initialize map and map modules
    initializeMaps();
    
    //initialize graph
    initializeGraph();
    
  });
  
  
  function goToHash(route) {
    // Check length of the array
    if (route.length!=5) {
      return false;
    }
    
    //check 1-num 2-num 3-num 4-year 5-string
    if (isNaN(route[0]) || isNaN(route[1]) || isNaN(route[2]) || isNaN(route[3]) || route[3].length!=4 || !isNaN(route[4])) {
      return false;
    }
    
    //Check variable of compare
    
    
    // Check latlng is in Spain bounds
    

    // Check zoom
    if (route[2]>12 || route[2]<6) {
      return false;
    }
    
    //All ok - change variables!
    start_center = new google.maps.LatLng(parseFloat(route[0]),parseFloat(route[1]));
    start_zoom = parseInt(route[2]);
    year = parseInt(route[3]);
    compare = route[4];
  }
  