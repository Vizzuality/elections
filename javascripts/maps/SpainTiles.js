
  var MERCATOR_RANGE = 256;
  var hash = {};

  function CoordMapType(tileSize) {
    this.tileSize = tileSize;
    this.json_tile_url = "/json/generated_data/tiles/";
  }

  CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
    var me = this;

    // Create the div tile
    var div = ownerDocument.createElement('div');
    div.setAttribute('class','tile');
    //div.innerHTML= coord.x+"_"+coord.y+"_"+zoom;
    div.style.zIndex = 0;
    div.style.width = this.tileSize.width + 'px';
    div.style.height = this.tileSize.height + 'px';
    div.setAttribute('id',coord.x+'_'+coord.y+'_'+zoom);
    

    // Remove hash key
    hash[coord.x+'_'+coord.y+'_'+zoom] = [];

    //Select query/json to take data from this tile
    var x,y;

    if (zoom>9) {
      if (zoom==12) {
        x = coord.x/2;
        y = coord.y/2;
      } else {
        x = coord.x;
        y = coord.y;
      }
      z = 11;
    } else if (zoom>6 && zoom<=9) {
      if (zoom>7) {
        var difference = (zoom - 7)*2;
        x = coord.x/difference;
        y = coord.y/difference;
      } else {
        x = coord.x;
        y = coord.y;
      }
      z = 7;
    } else {
      x = coord.x;
      y = coord.y;
      z = 6;
    }

    if (x==undefined || ((x%1==0) && (y%1==0))) {

      // Call service
      $.ajax({
        method: "GET",
        dataType: 'json',
        url: me.json_tile_url+z+'_'+x+'_'+y+'.json',
        success: function(points) {
          // Normalize latlng of the tile to transform it to point(x,y)
          var pixelcoord = {x:coord.x*256,y:coord.y*256,z:zoom} ;
          var worldcoord = new google.maps.Point(pixelcoord.x/Math.pow(2,zoom),pixelcoord.y/Math.pow(2,zoom));
          var projection = peninsula.getProjection();
          var ne = projection.fromPointToLatLng(worldcoord);
          var normalizedPoint = peninsula.getProjection().fromLatLngToPoint(ne);
          var scale = Math.pow(2, zoom);
          var tileCoordinate = new google.maps.Point(normalizedPoint.x * scale, normalizedPoint.y * scale);

          // Remove previous data of this tile
          delete hash[coord.x+'_'+coord.y+'_'+zoom];
          hash[coord.x+'_'+coord.y+'_'+zoom] = {};

          //Loop data points
          _.each(points,function(point,i){
            me.createBubble(div,point,tileCoordinate,scale,coord,zoom,ownerDocument);
          });

          return div;
        },
        error: function(e) {
          return div;
        }
      });
    }


    return div;
  };




  CoordMapType.prototype.releaseTile = function(tile) {
    var id = tile.getAttribute('id');
    delete hash[id];
  };


  CoordMapType.prototype.createBubble = function(div,point,tileCoordinate,scale,coord,zoom,ownerDocument) {
    hash[coord.x+'_'+coord.y+'_'+zoom][point.id] = point;

    var latlng          = new google.maps.LatLng(point.center_latitude,point.center_longitude);
    var normalizedPoint = peninsula.getProjection().fromLatLngToPoint(latlng); // returns x,y normalized to 0~255
    var pixelCoordinate = new google.maps.Point(normalizedPoint.x * scale, normalizedPoint.y * scale);

    var left = pixelCoordinate.x - tileCoordinate.x;
    var top = pixelCoordinate.y - tileCoordinate.y;


    var radius;
    if (point['data'][year]!=undefined) {
      var less = Math.floor(point['data'][year][normalization[compare]+'_min']);
      var desv = Math.max(Math.ceil(Math.abs(point['data'][year][normalization[compare]+'_max'])),Math.ceil(Math.abs(point['data'][year][normalization[compare]+'_min'])))/5;
      var value = Math.abs(point['data'][year][normalization[compare]]);
      
      if ((desv*0)>=value && value<(desv*1)) {
        radius=7;
      } else if ((desv*1)>=value && value<(desv*2)) {
        radius=10;
      } else if ((desv*2)>=value && value<(desv*3)) {
        radius=13;
      } else if ((desv*3)>=value && value<(desv*4)) {
        radius=16;
      } else {
        radius=19;
      }
    } else {
      radius = 8;
    }

    var data,className;
    if (point['data'][year]==undefined || point['data'][year][normalization[compare]]==undefined) {
      data = '';
      className = "red";
    } else {
      data = ((point['data'][year][normalization[compare]]>0)?('+'+Math.ceil(point['data'][year][normalization[compare]])):(Math.floor(point['data'][year][normalization[compare]])));
      className = (point['data'][year][normalization[compare]]>0)?'yellow':'grey';
    }

    var bubble =  '<div class="bubble" id="'+point.id+'" style="width:'+(radius*2)+'px; height:'+(radius*2)+'px; left:'+(left-radius)+'px; top:'+(top-radius)+'px; ">'+
                    '<img src="/images/'+className+'_marker.png"/>'+
                    '<p class="'+className+'">'+data+'</p>'+
                  '</div>';
    $(div).append(bubble);

    if (radius < 11) {
      $(bubble).find('p').css('display',"none");
    }

    return div;
  };




  function refreshBubbles() {
    var flat = _.reduceRight(hash,function(a,b){ return a.concat(b); },[]);
    flat = _.select(flat, function(ele){ return ele!=undefined;});

    _.each(flat,function(occ,key){
      _.each(occ,function(ele,i){

        //close infowindow - comparewindow
        infowindow.hide();
        comparewindow.hide();

        //change data of the ball
        var data,className;
        if (ele['data'][year]==undefined || ele['data'][year][normalization[compare]]==undefined) {
          data = '';
          className = "red";
        } else {
          data = ((ele['data'][year][normalization[compare]]>0)?('+'+Math.ceil(ele['data'][year][normalization[compare]])):(Math.floor(ele['data'][year][normalization[compare]])));
          className = (ele['data'][year][normalization[compare]]>0)?'yellow':'grey';
        }
        $('div#'+ele.id+' p').text(data);
        $('div#'+ele.id+' p').removeClass().addClass(className);

        //change color of the ball
        $('div#'+ele.id+' img').attr('src','/images/'+className+'_marker.png');

        //change heigth-width of the ball
        var radius;
        if (ele['data'][year]!=undefined) {
          var less = Math.floor(ele['data'][year][normalization[compare]+'_min']);
          var desv = Math.max(Math.ceil(Math.abs(ele['data'][year][normalization[compare]+'_max'])),Math.ceil(Math.abs(ele['data'][year][normalization[compare]+'_min'])))/5;
          var value = Math.abs(ele['data'][year][normalization[compare]]);

          if ((desv*0)>=value && value<(desv*1)) {
            radius=7;
          } else if ((desv*1)>=value && value<(desv*2)) {
            radius=10;
          } else if ((desv*2)>=value && value<(desv*3)) {
            radius=13;
          } else if ((desv*3)>=value && value<(desv*4)) {
            radius=16;
          } else {
            radius=19;
          }
        } else {
          radius = 8;
        }
        
        var old_radius = ($('div#'+ele.id).width()/2);
        var top = old_radius + parseFloat(($('div#'+ele.id).css('top')).replace('px',''));
        var left = old_radius + parseFloat(($('div#'+ele.id).css('left')).replace('px',''));

        $('div#'+ele.id).animate({width:radius*2+'px',height:radius*2+'px',top:top-radius+'px',left:left-radius+'px'},{duration:500,queue:true});
      });
    });
  }

