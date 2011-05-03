
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
    
    //initialize map and map modules
    initializeMaps();
    
    //initialize graph
    initializeGraph();
  });
  