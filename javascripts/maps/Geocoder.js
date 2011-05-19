    
    var geocoder = new google.maps.Geocoder();

    // Search map module with dom bind events
    function initializeSearch() { 
      $('form.search input.text').focusin(function(){
        var value = $(this).val();
        if (value=="Busca un lugar en el mapa...") {
          $(this).val('');
        }
      });
      
      $('form.search input.text').focusout(function(){
        var value = $(this).val();
        if (value=="") {
          $(this).val('Busca un lugar en el mapa...');
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
      
      //Add the autocomplete functionality to inputs
      addAutocompleteFunctionsToInputs();
      
    }
    
    function addAutocompleteFunctionsToInputs() {
      var input = document.getElementById('headerSearchInput');
      var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(27.391278222579277, -18.45703125),
        new google.maps.LatLng(42.601619944327965, 4.0869140625));
      var options = {
        bounds: defaultBounds
      };
      map_autocomplete = new google.maps.places.Autocomplete(input, options);
      map_autocomplete.setTypes(['geocode']);
    }
    
    
    function searchLocation(location) {
      location += ', España';
      geocoder.geocode( { 'address': location}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          $('div.search_error').fadeOut();
          var bounds = results[0].geometry.bounds;
          peninsula.setCenter(bounds.getCenter());
          peninsula.setZoom(11);
          searchAndShow(results[0].formatted_address);
          $('a.map').trigger('click');
        } else {
          $('div#header div.left div.search_error').fadeIn();
        }
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
          //$('div.search_error').fadeIn();
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
          setTimeout(function(){$('div#'+info.id).trigger('click')},1000);
        },
        error: function(error) {}
      });
    }
    
    