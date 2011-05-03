    
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
    }
    
    
    function searchLocation(location) {
      location += ', España';
      geocoder.geocode( { 'address': location}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          peninsula.fitBounds(results[0].geometry.bounds);
        } else {
          alert('TODO - Tooltip city not found');
        }
      });
    }