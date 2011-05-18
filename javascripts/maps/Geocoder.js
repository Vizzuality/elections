    
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
    }
    
    
    function searchLocation(location) {
      location += ', España';
      geocoder.geocode( { 'address': location}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          $('div.search_error').fadeOut();
          peninsula.fitBounds(results[0].geometry.bounds);
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
        error: function(error) {
          console.log(error);
        }
      });
    }
    
    