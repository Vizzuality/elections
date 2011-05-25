    
    var geocoder = new google.maps.Geocoder();
    var autocomplete;
    var searchInterval;
    var searchCount;

    // Search map module with dom bind events
    function initializeSearch() { 
      //Add the autocomplete functionality to inputs
      $('form.search input.text').focusin(function(){
        var value = $(this).val();
        if (value=="Introduce una ubicación") {
          $(this).val('');
        }
      });
      
      $('form.search input.text').focusout(function(){
        var value = $(this).val();
        if (value=="") {
          $(this).val('Introduce una ubicación');
        }
      });
      
      
      $('div.secondContainer form.search').submit(function(ev){
        ev.stopPropagation();
        ev.preventDefault();
      });
      addAutocompleteFunctionsToInputs();
    }
    
    
    function addAutocompleteFunctionsToInputs() {
      $( "#headerSearchInput" ).autocomplete({
        source: function( request, response ) {
          				$.ajax({
          					url: "http://munifinder.heroku.com",
          					dataType: "jsonp",
          					data: {
          						term: request.term
          					},
          					jsonpCallback:"callback",
          					success: function( data ) {
          						response( $.map( data, function( item ) {
          							return {
          								label: item.n,
          								la: item.a,
          								lo: item.o,
          								id: item.id
          							}
          						}));
          					}
          				});
        },
      autoFocus:'true', minLength:2, appendTo: "div.secondContainer form.search",
      select:function(event,ui){
        peninsula.setCenter(new google.maps.LatLng(ui.item.la,ui.item.lo));
        peninsula.setZoom(11);
        searchAndShow(ui.item.id);
        $('a.map').trigger('click');
      }});
    }


    
    function searchAndShow(cartodb_id) {

      if (searchInterval!=null) {
        clearInterval(searchInterval);
      }
      searchCount = 0;
      searchInterval = setInterval(function(){
        if ($('div#'+cartodb_id).length==0) {
          searchCount++;
          if (searchCount>5) {
            clearInterval(searchInterval);
          }
        } else {
          $('div#'+cartodb_id).trigger('click');
          clearInterval(searchInterval);
        }
      },500);
    }
    
    