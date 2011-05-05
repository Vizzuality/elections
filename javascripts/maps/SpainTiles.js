  
  var MERCATOR_RANGE = 256;
  var hash = {};

  function CoordMapType(tileSize) {
    this.tileSize = tileSize;
  }

  CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
    var me = this;
    
    // Create the div tile
    var div = ownerDocument.createElement('div');
    div.setAttribute('class','tile');
    div.style.width = this.tileSize.width + 'px';
    div.style.height = this.tileSize.height + 'px';
    div.setAttribute('id',coord.x+'_'+coord.y+'_'+zoom);

    // Remove hash key
    hash[coord.x+'_'+coord.y+'_'+zoom] = [];
    
    //Select query/json to take data from this tile
    var query;
    if (zoom>9) {
      var x,y;
      
      if (zoom==12) {
        x = coord.x/2;
        y = coord.y/2;
      } else {
        x = coord.x;
        y = coord.y;
      }
      
      query = query_municipio + "WHERE v_get_tile("+Math.floor(x)+","+Math.floor(y)+",11) && centre_geom_webmercator and proceso_electoral_id=73";
    } else if (zoom>6 && zoom<=9) {
      query = query_provincia + " WHERE v_get_tile("+coord.x+","+coord.y+","+zoom+") && centre_geom_webmercator AND proceso_electoral_id = '73'";
    } else {
      query = query_comunidad + " WHERE v_get_tile("+coord.x+","+coord.y+","+zoom+") && centre_geom_webmercator AND proceso_electoral_id = '73'";
    }

    // Call service
    $.ajax({
      method: "GET",
      dataType: 'jsonp',
      url: 'https://api.cartodb.com/v1',
      data: {sql:query,api_key:'8c587c9f93c36d146c9e66a29cc8a3499e869609'},
      success: function(data) {
        // Normalize latlng of the tile to transform it to point(x,y)
        var pixelcoord = {x:coord.x*256,y:coord.y*256,z:zoom} ; 
        var worldcoord = new google.maps.Point(pixelcoord.x/Math.pow(2,zoom),pixelcoord.y/Math.pow(2,zoom)); 
        var projection = peninsula.getProjection(); 
        var ne = projection.fromPointToLatLng(worldcoord); 
        var normalizedPoint = peninsula.getProjection().fromLatLngToPoint(ne);
        var scale = Math.pow(2, zoom);
        var tileCoordinate = new google.maps.Point(normalizedPoint.x * scale, normalizedPoint.y * scale);
        
        // Tile data points
        var points = data.rows;
        // Remove previous data of this tile
        delete hash[coord.x+'_'+coord.y+'_'+zoom];
        hash[coord.x+'_'+coord.y+'_'+zoom] = {};
        
        //Loop data points
        _.each(points,function(point,i){
          me.createBubble(div,point,tileCoordinate,scale,coord,zoom,ownerDocument);
        });
        
        return div;
      },
      error: function(error) {
        return div;
      }
    });
    return div;
  };



  
  CoordMapType.prototype.releaseTile = function(tile) {
    var id = tile.getAttribute('id');
    delete hash[id];
  };
  
  
  
  
  
  CoordMapType.prototype.createBubble = function(div,point,tileCoordinate,scale,coord,zoom,ownerDocument) {
    hash[coord.x+'_'+coord.y+'_'+zoom][point.id] = point;

    var latlng = new google.maps.LatLng(point.center_latitude,point.center_longitude);
    var normalizedPoint = peninsula.getProjection().fromLatLngToPoint(latlng); // returns x,y normalized to 0~255
    var pixelCoordinate = new google.maps.Point(normalizedPoint.x * scale, normalizedPoint.y * scale);

    var left = pixelCoordinate.x - tileCoordinate.x;
    var top = pixelCoordinate.y - tileCoordinate.y;

    var less = Math.floor(point[normalization[compare]+'_'+year+'_min']);
    var desv = Math.max(Math.ceil(Math.abs(point[normalization[compare]+'_'+year+'_max'])),Math.ceil(Math.abs(point[normalization[compare]+'_'+year+'_min'])))/5;
    var value = Math.abs(point[normalization[compare]+'_'+year]);
    
    var radius;
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

    var data,className;
    if (point[normalization[compare]+'_'+year]==null) {
      data = 'NF';
      className = "red";
    } else {
      data = ((point[normalization[compare]+'_'+year]>0)?('+'+Math.ceil(point[normalization[compare]+'_'+year])):(Math.floor(point[normalization[compare]+'_'+year])));
      className = (point[normalization[compare]+'_'+year]>0)?'yellow':'grey';
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
  
  
  
  
  function refreshTiles() {
    var flat = _.reduceRight(hash,function(a,b){ return a.concat(b); },[]);
    flat = _.select(flat, function(ele){ return ele!=undefined;});
    
    _.each(flat,function(occ,key){
      _.each(occ,function(ele,i){
        //console.log(ele);
        
        //close infowindow - comparewindow
        infowindow.hide();
        comparewindow.hide();
        
        //change data of the ball
        var data,className;
        if (ele[normalization[compare]+'_'+year]==null) {
          data = 'NF';
          className = "red";
        } else {
          data = ((ele[normalization[compare]+'_'+year]>0)?('+'+Math.ceil(ele[normalization[compare]+'_'+year])):(Math.floor(ele[normalization[compare]+'_'+year])));
          className = (ele[normalization[compare]+'_'+year]>0)?'yellow':'grey';
        }
        $('div#'+ele.id+' p').text(data);
        $('div#'+ele.id+' p').removeClass().addClass(className);
        
        //change color of the ball
        $('div#'+ele.id+' img').attr('src','/images/'+className+'_marker.png');
        
        //change heigth-width of the ball
        
      });
      
      // if (random) {
      //   $('div#'+occ.id).animate({height:"+=10",width:'+=10',top: '-=5px',left:'-=5px'},600);
      // } else {
      //   $('div#'+occ.id).animate({height: "-=10",width:'-=10',top: '+=5px',left:'+=5px'},600);
      // }
    });
  }
  