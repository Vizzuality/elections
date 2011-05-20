

  var canary_island,peninsula;  // Maps
  var start_center = new google.maps.LatLng(39.67660002390679,-3.6563984375000036); // Maps center position
  var start_zoom = 6;
  var previous_zoom = 6;  // Hack for jump 10 zoom
  var canary_center = new google.maps.LatLng(28.3660940558243,-15.631496093750004);
  var projection = new MercatorProjection();
  var infowindow,comparewindow;
  var dragging = false;
  var baseUrl="http://chart.apis.google.com/chart?chs=256x256";
  var chco = "6B6A6ADF|65432100";
  var chf = "bg,s,65432100";
  var chld = "ES";
  var chd = "";
  var political_parties;



  function initializeMap() {

    var peninsula_ops = {zoom: start_zoom,center: start_center,disableDefaultUI: true,mapTypeId: google.maps.MapTypeId.ROADMAP,scrollwheel: false, minZoom: 6,maxZoom: 12, mapTypeControlOptions: {mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'rtve']}};
    var canary_ops = {zoom: 6,center: canary_center,disableDefaultUI: true,mapTypeId: google.maps.MapTypeId.ROADMAP,minZoom: 6,maxZoom: 12, mapTypeControlOptions: {mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'rtve']},draggable:false};

    peninsula = new google.maps.Map(document.getElementById("peninsula"),peninsula_ops);
    canary_island = new google.maps.Map(document.getElementById("canary_island"),canary_ops);


    //Custom styled map - custom_map_style
    var styledMapOptions = {name: "rtve"};
    var rtveMapType = new google.maps.StyledMapType(custom_map_style, styledMapOptions);
    peninsula.mapTypes.set('rtve', rtveMapType);
    peninsula.setMapTypeId('rtve');
    canary_island.mapTypes.set('rtve', rtveMapType);
    canary_island.setMapTypeId('rtve');


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
        isPng: true,
        minZoom: 6,
        maxZoom: 12,
        name: "Hide rest of countries"
    };
    var mapChartType = new google.maps.ImageMapType(mapChartOptions);
    peninsula.overlayMapTypes.insertAt(0, mapChartType);
        

    //Political tiles
    political_parties = new google.maps.ImageMapType({
       getTileUrl: function(tile, zoom) {
         var rn=Math.ceil(Math.random()*4);
         return tiles_pngs_url.replace("{n}",rn)
          +  tiles_version +"/"+ procesos_electorales[year] +"/"+ + tile.x +"_"+ tile.y +'_'+ zoom +".png";
       },
       tileSize: new google.maps.Size(256, 256),
       opacity:0.75,
       isPng: true,
       minZoom: 6,
       maxZoom: 12,
       name: "Political parties tiles",
       alt: ""
    });
    peninsula.overlayMapTypes.insertAt(1,political_parties);
    canary_island.overlayMapTypes.setAt(0,political_parties);



    /*Adding infowindow(over map), comparewindow(over dom) and explanationwindow(over dom) */
    infowindow        = new InfoWindow(new google.maps.LatLng(0,0), peninsula);
    comparewindow     = new CompareWindow();
    explanationwindow = new ExplanationWindow();

    peninsula.overlayMapTypes.setAt(2, new CoordMapType(new google.maps.Size(256, 256)));


    /* initialize search component */
    initializeSearch();

    //TODO - Review this listeners (old computers dont render ok with this stuff)
    google.maps.event.addListenerOnce(peninsula, 'tilesloaded', function() {
      changeHash();
      checkZoom();

      google.maps.event.addListener(this,'dragend',function(){changeHash();});
      google.maps.event.addListener(this,'zoom_changed',function(){changeHash(); checkZoom();});
    });


    /*Go to canary islands*/
    $('a.islas_canarias').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      peninsula.setCenter(canary_center);
      peninsula.setZoom(8);
    });

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
		$("span.slider").slider({orientation: "vertical",range: "min",min: 6,max: 10,value: 6,step: 1,
			stop: function( event, ui ) {
        if (ui.value==10) {
          peninsula.setZoom(12);
        } else if (ui.value==9) {
          peninsula.setZoom(11);
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



  function refreshTiles() {
    $('div#peninsula div').each(function(i,ele){
      if ($(ele).css('opacity')>0 && $(ele).css('opacity')<1) {
        
        // duplicate tile and add to div below current tile
        var old_image = $(ele).children('img');
        var new_image = old_image.clone();
        new_image.css('position','absolute');
        new_image.css('z-index',old_image.css('z-index') + 1);
        new_image.css('top',0);
        new_image.css('left',0);
        $(ele).prepend(new_image);
        
        // update new tile with new url
        var old_url = old_image.attr('src');
        var tm = old_url.split("/");
        var old_process = tm[tm.length-2];
        var new_url = old_url.replace('/'+old_process+'/','/'+procesos_electorales[year]+'/');
        old_image.attr('src',new_url);

        // when it loads the new image, fade out the old one
        old_image.one("load",function(){
          new_image.animate({opacity:0},{ duration: 800, queue: false ,complete: function() {
              new_image.remove();
            }
          });
          
          old_image.animate({opacity:100},{ duration: 0, queue: false})
          .each(function(){
            if(this.complete) $(this).trigger("load");
          });
        }); 
      }
    });
  }

  var loaded = false;
  function checkZoom(){
    
    //close infowindow
    infowindow.hide();

    //Jump hack
    if (peninsula.getZoom()==10 && previous_zoom<peninsula.getZoom()) {
      peninsula.setZoom(11);
      $("span.slider").slider({value: 9});
    } else if (peninsula.getZoom()==10 && previous_zoom>peninsula.getZoom()) {
      peninsula.setZoom(8);
      $("span.slider").slider({value: 8});
    } else if (peninsula.getZoom()==12) {
      $("span.slider").slider({value: 10});
    } else if (peninsula.getZoom()==11) {
      $("span.slider").slider({value: 9});
    } else if (peninsula.getZoom()==9 && previous_zoom<peninsula.getZoom()) {
        peninsula.setZoom(11);
        $("span.slider").slider({value: 9});
    } else if (peninsula.getZoom()==9 && previous_zoom>peninsula.getZoom()) {
        peninsula.setZoom(8);
        $("span.slider").slider({value: 8});
    } else {
      $("span.slider").slider({value: peninsula.getZoom()});
    }
    previous_zoom = peninsula.getZoom();
    drawNoDataBars();

    if (loaded) {
      failCircle.reset();
    } else {
      loaded = true;
    }
    
    //Show tiny Canarias map
    if (peninsula.getZoom()==6) {
      $('div.canary_island').css('z-index',2);
    } else {
      $('div.canary_island').css('z-index',0);
    }
  }
