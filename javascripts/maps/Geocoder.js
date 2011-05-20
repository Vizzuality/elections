    
    var geocoder = new google.maps.Geocoder();
    var autocomplete;
    var searchInterval;
    var searchCount;

    // Search map module with dom bind events
    function initializeSearch() { 
      //Add the autocomplete functionality to inputs
      
      $('div.secondContainer form.search').submit(function(ev){
        ev.stopPropagation();
        ev.preventDefault();
      });
      addAutocompleteFunctionsToInputs();
    }
    
    
    function addAutocompleteFunctionsToInputs() {
      var input = document.getElementById('headerSearchInput');
      var defaultBounds = new google.maps.LatLngBounds(new google.maps.LatLng(41.0410955451705,-2.420436523437502),new google.maps.LatLng(39.786437168780616,-4.892360351562502));
      var options = {bounds: defaultBounds};
      autocomplete = new google.maps.places.Autocomplete(input, options);
      
      
      google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        if (place.geometry.viewport) {
          peninsula.setCenter((place.geometry.viewport).getCenter());
          peninsula.setZoom(11);
        } else {
          peninsula.setCenter(place.geometry.location);
          peninsula.setZoom(11);
        }
        searchAndShow(place.formatted_address);
        $('a.map').trigger('click');
      });
    }


    
    function searchAndShow(formatted_address) {
      $.ajax({
        method: "GET",
        dataType: 'json',
        url: global_url+'/google_names_cache/'+gmaps_version+'/'+replaceWeirdCharacters(formatted_address)+'.json',
        success: function(info) {
          if (info!=null) {
            if (searchInterval!=null) {
              clearInterval(searchInterval);
            }
            searchCount = 0;
            searchInterval = setInterval(function(){
              if ($('div#'+info.id).length==0) {
                searchCount++;
                if (searchCount>5) {
                  clearInterval(searchInterval);
                }
              } else {
                $('div#'+info.id).trigger('click');
                clearInterval(searchInterval);
              }
            },500);
          }
      },
        error: function(error) {}
      });
    }
    
    