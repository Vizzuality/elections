  
  var canary_island,peninsula;
  var spain = new google.maps.LatLng(39.67660002390679,-3.6563984375000036);
  var canary_center = new google.maps.LatLng(28.3660940558243,-15.631496093750004);
  var allowedBounds = new google.maps.LatLngBounds(new google.maps.LatLng(41.0410955451705,-2.420436523437502),new google.maps.LatLng(39.786437168780616,-4.892360351562502));
  var projection = new MercatorProjection();
  var previous_zoom = 6;
  var infowindow,comparewindow;
  var dragging = false;
  var tileServers=["a","b","c","d"];


  function initializeMaps() {
    var peninsula_ops = {zoom: 6,center: spain,disableDefaultUI: true,mapTypeId: google.maps.MapTypeId.ROADMAP,minZoom: 6,maxZoom: 12}
    var canary_ops = {zoom: 6,center: canary_center,disableDefaultUI: true,mapTypeId: google.maps.MapTypeId.ROADMAP,minZoom: 6,maxZoom: 12}
    

    peninsula = new google.maps.Map(document.getElementById("peninsula"),peninsula_ops);
    //canary_island = new google.maps.Map(document.getElementById("canary_island"),canary_ops);
    
    var layer = new google.maps.ImageMapType({
       getTileUrl: function(tile, zoom) {
         var c=Math.pow(2,zoom);
         var d=c-1-tile.y;
         var e=tile.x%c;
    
         var rand_no = Math.floor((4)*Math.random());
         var url = this.urlPattern.replace("{n}",tileServers[rand_no]);
         
         return url+zoom+"/"+e+"/"+d+".png";
       },
       tileSize: new google.maps.Size(256, 256),
       opacity:0.65,
       isPng: true,
       urlPattern:'http://{n}.tiles.mapbox.com/vizzuality/1.0.0/election_data_816f6c/'
    });
    
    /* initialize search component */
    initializeSearch();
    
    peninsula.overlayMapTypes.setAt(0,layer);
    //canary_island.overlayMapTypes.setAt(0,layer);
    
    /*Adding infowindow(over map) and comparewindow(over dom)*/
    infowindow = new InfoWindow(new google.maps.LatLng(0,0), peninsula);
    comparewindow = new CompareWindow();
    
    peninsula.overlayMapTypes.setAt(1, new CoordMapType(new google.maps.Size(256, 256)));
    //canary_island.overlayMapTypes.setAt(1, new CoordMapType(new google.maps.Size(256, 256)));
    
    
    //TODO - Review this listeners (old computers dont render ok with this stuff)
    google.maps.event.addListenerOnce(peninsula, 'tilesloaded', function() {
      var allowedBounds = this.getBounds();
      
      google.maps.event.addListener(this,'bounds_changed',function(){changeHash();});
      //google.maps.event.addListener(this,'zoom_changed',function() {checkZoom(); checkCanaryIsland();});
      //google.maps.event.addListener(this,'center_changed',function() {checkCanaryIsland(); checkBounds(allowedBounds,this); });
    });
    // google.maps.event.addListenerOnce(canary_island, 'tilesloaded', function() { 
    //   var canaryBounds = this.getBounds();
    //   google.maps.event.addListener(this,'center_changed',function() { checkBounds(canaryBounds,this); });
    // });
    // google.maps.event.addListener(peninsula, 'dragstart', function() { 
    //   dragging = true;
    // });
    // google.maps.event.addListener(peninsula, 'dragend', function() { 
    //   dragging = false;
    // });
    
    
    /*zoom controls*/
    $('a.zoom_in').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      var zoom = peninsula.getZoom();
      peninsula.setZoom(zoom + 1);
    });
    $('a.zoom_out').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      var zoom = peninsula.getZoom();
      peninsula.setZoom(zoom - 1);
    });
    
    /*zoom slider*/
		$("span.slider").slider({
			orientation: "vertical",
			range: "min",
			min: 6,
			max: 11,
			value: 6,
			step: 1,
			stop: function( event, ui ) {
        if (ui.value==10) {
          peninsula.setZoom(11);
        } else if (ui.value==11) {
          peninsula.setZoom(12);
        } else {
          peninsula.setZoom(ui.value);
        }
        checkZoom();
			}
		});
		
		/*Click bubbles*/
		$(document).click(function(event){
		  var target = event.target || event.srcElement;
      var targetElement = target.nodeName.toLowerCase();
      
      //Clicking in first column element + Key
      if ($(target).closest('div.bubble').length>0) {
        if (!dragging) {
          var occ_id = $(target).closest('div.bubble').attr('id');
          var tile_id = $(target).closest('div.tile').attr('id');
          var point = hash[tile_id][occ_id];
          var height = ($(target).closest('div.bubble').height() / 2) - 5;
          var latlng = new google.maps.LatLng(point.center_latitude,point.center_longitude);
          infowindow.setPosition(latlng,height,point); //latlng && height
        }  
        
        if (event.preventDefault) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          event.stopPropagation();
          event.returnValue = false;
        }
      }
		});
  }
  
  
  
  function checkCanaryIsland() {
    var peninsula_bounds_ne = peninsula.getBounds().getNorthEast();
    var peninsula_bounds_sw = peninsula.getBounds().getSouthWest();

    if ((peninsula.getZoom()==6) || (peninsula_bounds_sw.lat()<36.00) || (peninsula_bounds_ne.lng()>3.10) ) {
      $('#canary_island').removeClass('left');
      $('#canary_island').css('zIndex',1);
      return false;
    }
    
    if ((peninsula.getZoom()==6) || (peninsula_bounds_sw.lng()< -9.5581) || (peninsula_bounds_ne.lat()>52) ) {
      $('#canary_island').addClass('left');
      $('#canary_island').css('zIndex',1);
      return false;
    } else {
      $('#canary_island').css('zIndex',0);
    }
  }
  
  
  function checkZoom(){
    //close infowindow
    infowindow.hide();
    
    //Jump hack
    if (peninsula.getZoom()==10 && previous_zoom<peninsula.getZoom()) {
      peninsula.setZoom(11);
      $("span.slider").slider({value: 10});
    } else if (peninsula.getZoom()==10 && previous_zoom>peninsula.getZoom()) {
      peninsula.setZoom(9);
      $("span.slider").slider({value: 9});
    } else if (peninsula.getZoom()==12) {
      $("span.slider").slider({value: 11});
    } else if (peninsula.getZoom()==11) {
      $("span.slider").slider({value: 10});
    } else {
      $("span.slider").slider({value: peninsula.getZoom()});
    }
    previous_zoom = peninsula.getZoom();
  }
  
  
  
  // Limit map area
  function checkBounds(allowedBounds,map) { 
    if(!allowedBounds.contains(map.getCenter())) {
      var C = map.getCenter();
      var X = C.lng();
      var Y = C.lat();

      var AmaxX = allowedBounds.getNorthEast().lng();
      var AmaxY = allowedBounds.getNorthEast().lat();
      var AminX = allowedBounds.getSouthWest().lng();
      var AminY = allowedBounds.getSouthWest().lat();

      if (X < AminX) {X = AminX;}
      if (X > AmaxX) {X = AmaxX;}
      if (Y < AminY) {Y = AminY;}
      if (Y > AmaxY) {Y = AmaxY;}

      map.setCenter(new google.maps.LatLng(Y,X));
    }
  }
  
  
  function changeHash() {
    
  }