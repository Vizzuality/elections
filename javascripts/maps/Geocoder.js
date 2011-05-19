    
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
      // var defaultBounds = new google.maps.LatLngBounds(new google.maps.LatLng(27.391278222579277, -18.45703125),new google.maps.LatLng(42.601619944327965, 4.0869140625));
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
    

    
    function searchCompareLocation(location) {
      location += ', España';
      geocoder.geocode( { 'address': location}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var short_formatted_address;
          if (results[0].formatted_address.length>45) {
            short_formatted_address = results[0].formatted_address.substr(0,45)+'...';
          } else {
            short_formatted_address = results[0].formatted_address;
          }
          $('div#comparewindow p.refer').html('¿Te refieres a... <a href="#'+short_formatted_address+'">'+short_formatted_address+'</a>?');
          $('div#comparewindow p.refer a').unbind('click');
          $('div#comparewindow p.refer a').click(function(ev){
            ev.stopPropagation();
            ev.preventDefault();
            comparewindow.compareSecondRegion(null,results[0].formatted_address);
          });
          $('div#comparewindow p.refer').stop(true).show();
        } else {
          $('div#comparewindow p.refer').html('No hemos encontrado nada con ese criterio...');
          $('div#comparewindow p.refer').show().delay(4000).fadeOut();
        }
      });
    }
    
    
    function searchAndShow(formatted_address) {
      $.ajax({
        method: "GET",
        dataType: 'json',
        url: global_url+'/google_names_cache/'+gmaps_version+'/'+replaceWeirdCharacters(formatted_address)+'.json',
        success: function(info) {
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
        },
        error: function(error) {}
      });
    }
    
    