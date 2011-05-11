
  var canary_island,peninsula;
  var start_center = new google.maps.LatLng(39.67660002390679,-3.6563984375000036);
  var start_zoom = 6;
  var canary_center = new google.maps.LatLng(28.3660940558243,-15.631496093750004);
  var allowedBounds = new google.maps.LatLngBounds(new google.maps.LatLng(41.0410955451705,-2.420436523437502),new google.maps.LatLng(39.786437168780616,-4.892360351562502));
  var projection = new MercatorProjection();
  var previous_zoom = 6;
  var infowindow,comparewindow;
  var dragging = false;
  var tileServers=["a","b","c","d"];
  var baseUrl="http://chart.apis.google.com/chart?chs=256x256";
  var chco = "6B6A6ADF|65432100";
  var chf = "bg,s,65432100";
  var chld = "ES";
  var chd = "";



  function initializeMap() {

    var peninsula_ops = {zoom: start_zoom,center: start_center,disableDefaultUI: true,mapTypeId: google.maps.MapTypeId.ROADMAP,minZoom: 6,maxZoom: 12, mapTypeControlOptions: {mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'rtve']}};
    // var canary_ops = {zoom: 6,center: canary_center,disableDefaultUI: true,mapTypeId: google.maps.MapTypeId.ROADMAP,minZoom: 6,maxZoom: 12};

    peninsula = new google.maps.Map(document.getElementById("peninsula"),peninsula_ops);
    //canary_island = new google.maps.Map(document.getElementById("canary_island"),canary_ops);


    //Custom styled map - custom_map_style
    var styledMapOptions = {name: "rtve"};
    var rtveMapType = new google.maps.StyledMapType(custom_map_style, styledMapOptions);
    peninsula.mapTypes.set('rtve', rtveMapType);
    peninsula.setMapTypeId('rtve');


    var mapChartOptions = {
        getTileUrl: function(coord, zoom) {
            var lULP = new google.maps.Point(coord.x*256,(coord.y+1)*256);
            var lLRP = new google.maps.Point((coord.x+1)*256,coord.y*256);
            var projectionMap = new MercatorProjection();
            var lULg = projectionMap.fromDivPixelToLatLng(lULP, zoom);
            var lLRg = projectionMap.fromDivPixelToLatLng(lLRP, zoom);
            return baseUrl+"&chd="+chd+"&chco="+chco+"&chld="+chld+"&chf="+chf+"&cht=map:fixed="+
               lULg.lat() +","+ lULg.lng() + "," + lLRg.lat() + "," + lLRg.lng();
        },
        tileSize: new google.maps.Size(256, 256),
        isPng: true
    };
    var mapChartType = new google.maps.ImageMapType(mapChartOptions);
    peninsula.overlayMapTypes.insertAt(0, mapChartType);

    //Political tiles
    var political_parties = new google.maps.ImageMapType({
       getTileUrl: function(tile, zoom) {
         return this.urlPattern+tile.x+"_"+tile.y+'_'+zoom+"_"+procesos_electorales[year]+".png";
       },
       tileSize: new google.maps.Size(256, 256),
       opacity:0.65,
       isPng: true,
       urlPattern:'/tiles/'
    });
    peninsula.overlayMapTypes.setAt(1,political_parties);
    //canary_island.overlayMapTypes.setAt(0,political_parties);



    /*Adding infowindow(over map), comparewindow(over dom) and explanationwindow(over dom) */
    infowindow        = new InfoWindow(new google.maps.LatLng(0,0), peninsula);
    comparewindow     = new CompareWindow();
    explanationwindow = new ExplanationWindow();

    peninsula.overlayMapTypes.setAt(2, new CoordMapType(new google.maps.Size(256, 256)));
    //canary_island.overlayMapTypes.setAt(2, new CoordMapType(new google.maps.Size(256, 256)));



    /* initialize search component */
    initializeSearch();

    //TODO - Review this listeners (old computers dont render ok with this stuff)
    google.maps.event.addListenerOnce(peninsula, 'tilesloaded', function() {
      changeHash();
      checkZoom();
      var allowedBounds = this.getBounds();

      google.maps.event.addListener(this,'dragend',function(){changeHash();});
      google.maps.event.addListener(this,'zoom_changed',function(){changeHash(); checkZoom();});
      //google.maps.event.addListener(this,'zoom_changed',function() {checkCanaryIsland();});
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


