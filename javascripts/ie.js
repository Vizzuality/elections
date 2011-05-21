

    $(document).ready(function(){
      resizeMap();
      $(window).resize(function(){
        resizeMap();
      })
    });
    
    function resizeMap() {
      $('div#map').width($(window).width());
      $('div#map').height($('div.tabs').height());
    }