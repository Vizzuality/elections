    
    var geocoder = new google.maps.Geocoder();

    // Search map module with dom bind events
    function initializeSearch() { 
      $('form.search input.text').focusin(function(){
        var value = $(this).val();
        if (value=="Busca un lugar...") {
          $(this).val('');
        }
      });
      
      $('form.search input.text').focusout(function(){
        var value = $(this).val();
        if (value=="") {
          $(this).val('Busca un lugar...');
        }
      });
      
      $('form.search').submit(function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        searchLocation($(this).find('input.text').val());
      });
      
      $('div.search_error a.close').click(function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        $(this).parent().fadeOut();
      });
    }
    
    
    function searchLocation(location) {
      location += ', España';
      geocoder.geocode( { 'address': location}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          $('div.search_error').fadeOut();
          peninsula.fitBounds(results[0].geometry.bounds);
        } else {
          $('div.search_error').fadeIn();
        }
      });
    }
    
    
    function searchCompareLocation(location) {
      location += ', España';
      geocoder.geocode( { 'address': location}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          alert('ehheheheheheh!');
          //$('div.search_error').fadeOut();
          //peninsula.fitBounds(results[0].geometry.bounds);
        } else {
          //$('div.search_error').fadeIn();
        }
      });
    }