

  var canary_island,peninsula;  // Maps
  var start_center = new google.maps.LatLng(39.67660002390679,-3.6563984375000036); // Maps center position
  var start_zoom = 6;
  var previous_zoom = 6;  // Hack for jump 10 zoom
  var canary_center = new google.maps.LatLng(28.3660940558243,-15.631496093750004);
  var peninsula_center = new google.maps.LatLng(39.67660002390679,-3.6563984375000036);
  var projection = new MercatorProjection();
  var infowindow,comparewindow;
  var dragging = false;
  var baseUrl="http://chart.apis.google.com/chart?chs=256x256";
  var chco = "6B6A6ADF|65432100";
  var chf = "bg,s,65432100";
  var chld = "ES";
  var chd = "";
  var political_parties;
  var custom_map_style = [{featureType:"administrative.country",elementType:"all",stylers:[{saturation:-100},{visibility:"off"}]},{featureType:"administrative.province",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"administrative.locality",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"road.arterial",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"all",stylers:[{lightness:7},{saturation:-91}]},{featureType:"all",elementType:"all",stylers:[]}];



  function initializeMap() {

    var peninsula_ops = {zoom: start_zoom,center: start_center,disableDefaultUI: true,mapTypeId: google.maps.MapTypeId.ROADMAP,scrollwheel: false, minZoom: 6,maxZoom: 12, mapTypeControlOptions: {mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'rtve']}};

    peninsula = new google.maps.Map(document.getElementById("peninsula"),peninsula_ops);


    //Custom styled map - custom_map_style
    var styledMapOptions = {name: "rtve"};
    var rtveMapType = new google.maps.StyledMapType(custom_map_style, styledMapOptions);
    peninsula.mapTypes.set('rtve', rtveMapType);
    peninsula.setMapTypeId('rtve');


    // var mapChartOptions = {
    //     getTileUrl: function(coord, zoom) {
    //         var lULP = new google.maps.Point(coord.x*256,(coord.y+1)*256);
    //         var lLRP = new google.maps.Point((coord.x+1)*256,coord.y*256);
    //         var projectionMap = new MercatorProjection();
    //         var lULg = projectionMap.fromDivPixelToLatLng(lULP, zoom);
    //         var lLRg = projectionMap.fromDivPixelToLatLng(lLRP, zoom);
    //         return baseUrl+"&chd="+chd+"&chco="+chco+"&chld="+chld+"&chf="+chf+"&cht=map:fixed="+
    //            lULg.lat() +","+ lULg.lng() + "," + lLRg.lat() + "," + lLRg.lng();
    //     },
    //     tileSize: new google.maps.Size(256, 256),
    //     isPng: true,
    //     minZoom: 6,
    //     maxZoom: 12,
    //     name: "Hide rest of countries"
    // };
    // var mapChartType = new google.maps.ImageMapType(mapChartOptions);
    // peninsula.overlayMapTypes.insertAt(0, mapChartType);
        

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
    peninsula.overlayMapTypes.insertAt(0,political_parties);



    /*Adding infowindow(over map), comparewindow(over dom), explanationwindow(over dom) and aboutwindow(over dom)*/
    infowindow        = new InfoWindow(new google.maps.LatLng(0,0), peninsula);

    comparewindow     = new CompareWindow();
    explanationwindow = new ExplanationWindow();
    aboutwindow 			= new AboutWindow();

    peninsula.overlayMapTypes.setAt(1, new CoordMapType(new google.maps.Size(256, 256)));


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
    $('a.islas_canarias').live('click',function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      peninsula.setCenter(canary_center);
      peninsula.setZoom(6);
      changeHash();
    });
    
    $('a.peninsula').live('click',function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      peninsula.setCenter(peninsula_center);
      peninsula.setZoom(6);
      changeHash();
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
          var tile_id = $(target).closest('div.bubble').parent().attr('id');  // closest('div.tile') doesnt work in ie7 :|
          
          var point = hash[tile_id][occ_id];
          var height = ($(target).closest('div.bubble').height() / 2) - 5;
          var latlng = new google.maps.LatLng(point.center_latitude,point.center_longitude);
          infowindow.setPosition(latlng,height,point);
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


  var tileOverlayHolder = [];
  function refreshTiles() {
    simpleRefreshTiles();
    // // nuke old overlay tiles that may not have been removed yet due to network speed
    // _.each(tileOverlayHolder, function(ele,i){
    //   $(ele).remove();
    //   delete tileOverlayHolder[i];      
    // });
    // tileOverlayHolder = _.compact(tileOverlayHolder) 
    // 
    // 
    // $('div#peninsula div').each(function(i,ele){
    //   if ($(ele).css('opacity')>0 && $(ele).css('opacity')<1 && $(ele).children('img').length>0) {            
    // 
    //     //work out old and new urls
    //     var old_image = $(ele).children('img');
    //     var old_url = old_image.attr('src');
    //     var tm = old_url.split("/");
    //     var old_process = tm[tm.length-2];
    //     var new_url = old_url.replace('/'+old_process+'/','/'+procesos_electorales[year]+'/');
    //     
    //     // only add if new URL is different from old one
    //     if (new_url != old_url){
    // 
    //       // duplicate tile and add to div above current tile
    //       var new_image = old_image.clone();
    //       var zindex    = old_image.css('z-index') + 1
    //       new_image.css({'position':'absolute', 'z-index':zindex, 'top':0, 'left':0});
    //       tileOverlayHolder.push(new_image);
    //       $(ele).prepend(new_image);
    //     
    //       // update new tile with new url
    //       old_image.attr('src',new_url);
    // 
    //       // when it loads the new image, fade out the old one
    //       old_image.unbind("load");
    //       old_image.one("load",function(){
    //         new_image.animate({opacity:0},{ duration: 800, queue: false ,complete: function() {
    //             $(new_image).remove();
    //           }
    //         });          
    //       });
    //       if(old_image.complete) $(this).trigger("load");          
    //     }        
    //   }
    // });
  }


  function simpleRefreshTiles() {  
    $('div#peninsula div').each(function(i,ele){
      if ($(ele).css('opacity')>0 && $(ele).css('opacity')<1) {
        var old_image = $(ele).children('img');        
        var old_url = old_image.attr('src');
        var tm = old_url.split("/");
        var old_process = tm[tm.length-2];
        var new_url = old_url.replace('/'+old_process+'/','/'+procesos_electorales[year]+'/');
        old_image.attr('src',new_url);
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
    
    if (comparewindow.isVisible()) {
      comparewindow.refreshBottom();
    }

    if (loaded) {
      failCircle.reset();
    } else {
      loaded = true;
    }
  }
