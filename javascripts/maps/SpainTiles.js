  
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
    
      query = "SELECT id_4 AS id,name_4 AS municipio,name_2 AS provincia,censo_total,((votantes_totales::NUMERIC / censo_total::NUMERIC) * 100)::INTEGER AS percen_participacion,primer_partido_percent,"+
           "pp1.name AS primer_partido_name,segundo_partido_percent,pp2.name AS segundo_partido_name,tercer_partido_percent,pp3.name AS tercer_partido_name,"+
           "0 AS otros_partido_percent,center_longitude,center_latitude,vsm.paro_normalizado_1996, vsm.paro_normalizado_1997, vsm.paro_normalizado_1998, vsm.paro_normalizado_1999, vsm.paro_normalizado_2000, vsm.paro_normalizado_2001,"+
           "vsm.paro_normalizado_2002, vsm.paro_normalizado_2003, vsm.paro_normalizado_2004, vsm.paro_normalizado_2005, vsm.paro_normalizado_2006, vsm.paro_normalizado_2007, vsm.paro_normalizado_2008, vsm.paro_normalizado_2009 "+
           "FROM gadm4 AS g INNER JOIN votaciones_por_municipio AS v ON g.cartodb_id = v.gadm4_cartodb_id INNER JOIN vars_socioeco_x_municipio AS vsm ON vsm.gadm4_cartodb_id = v.gadm4_cartodb_id "+
           "INNER JOIN partidos_politicos AS pp1 ON pp1.cartodb_id = v.primer_partido_id INNER JOIN partidos_politicos AS pp2 ON pp2.cartodb_id = v.segundo_partido_id INNER JOIN partidos_politicos AS "+
           "pp3 ON pp3.cartodb_id = v.tercer_partido_id where v_get_tile("+x+","+y+",11) && centre_geom_webmercator and proceso_electoral_id = '73'";
    } else if (zoom>6 && zoom<=9) {
      //query = 'SELECT id_2 as id,center_longitude,center_latitude from gadm2 where v_get_tile('+coord.x+','+coord.y+','+zoom+') && centre_geom_webmercator';
      
      query = "SELECT id_2 AS id,name_2 AS municipio,censo_total,((votantes_totales::NUMERIC / censo_total::NUMERIC) * 100)::INTEGER AS percen_participacion, "+
      "primer_partido_percent,pp1.name AS primer_partido_name,segundo_partido_percent,pp2.name AS segundo_partido_name,tercer_partido_percent,0 AS otros_partido_percent, "+
      "center_longitude,center_latitude,vsp.paro_normalizado_1996,vsp.paro_normalizado_1997,vsp.paro_normalizado_1998,vsp.paro_normalizado_1999, "+
      "vsp.paro_normalizado_2000,vsp.paro_normalizado_2001,vsp.paro_normalizado_2002,vsp.paro_normalizado_2003,vsp.paro_normalizado_2004,vsp.paro_normalizado_2005, "+
      "vsp.paro_normalizado_2006,vsp.paro_normalizado_2007,vsp.paro_normalizado_2008,vsp.paro_normalizado_2009 FROM gadm2 AS g INNER JOIN votaciones_por_provincia AS v ON g.cartodb_id = v.gadm2_cartodb_id "+
      "INNER JOIN vars_socioeco_x_provincia AS vsp ON vsp.gadm2_cartodb_id = v.gadm2_cartodb_id INNER JOIN partidos_politicos AS pp1 ON pp1.cartodb_id = v.primer_partido_id "+
      "INNER JOIN partidos_politicos AS pp2 ON pp2.cartodb_id = v.segundo_partido_id INNER JOIN partidos_politicos AS pp3 ON pp3.cartodb_id = v.tercer_partido_id "+
      "WHERE v_get_tile("+coord.x+","+coord.y+","+zoom+") && centre_geom_webmercator AND proceso_electoral_id = '73'";
    } else {
      query = 'SELECT id_1 as id,center_longitude,center_latitude from gadm1 where v_get_tile('+coord.x+','+coord.y+','+zoom+') && centre_geom_webmercator';
      
      // query = "SELECT id_2 AS id,name_2 AS municipio,censo_total,((votantes_totales::NUMERIC / censo_total::NUMERIC) * 100)::INTEGER AS percen_participacion, "+
      // "primer_partido_percent,pp1.name AS primer_partido_name,segundo_partido_percent,pp2.name AS segundo_partido_name,tercer_partido_percent,0 AS otros_partido_percent, "+
      // "center_longitude,center_latitude,vsp.paro_normalizado_1996,vsp.paro_normalizado_1997,vsp.paro_normalizado_1998,vsp.paro_normalizado_1999, "+
      // "vsp.paro_normalizado_2000,vsp.paro_normalizado_2001,vsp.paro_normalizado_2002,vsp.paro_normalizado_2003,vsp.paro_normalizado_2004,vsp.paro_normalizado_2005, "+
      // "vsp.paro_normalizado_2006,vsp.paro_normalizado_2007,vsp.paro_normalizado_2008,vsp.paro_normalizado_2009 FROM gadm2 AS g INNER JOIN votaciones_por_provincia AS v ON g.cartodb_id = v.gadm2_cartodb_id "+
      // "INNER JOIN vars_socioeco_x_provincia AS vsp ON vsp.gadm2_cartodb_id = v.gadm2_cartodb_id INNER JOIN partidos_politicos AS pp1 ON pp1.cartodb_id = v.primer_partido_id "+
      // "INNER JOIN partidos_politicos AS pp2 ON pp2.cartodb_id = v.segundo_partido_id INNER JOIN partidos_politicos AS pp3 ON pp3.cartodb_id = v.tercer_partido_id "+
      // "WHERE v_get_tile("+coord.x+","+coord.y+","+zoom+") && centre_geom_webmercator AND proceso_electoral_id = '73'";
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


    var radius;
    if (point.percen_participacion>=0 && point.percen_participacion<20) {
      radius=7;
    } else if (point.percen_participacion>=20 && point.percen_participacion<40) {
      radius=10;
    } else if (point.percen_participacion>=40 && point.percen_participacion<60) {
      radius=13;
    } else if (point.percen_participacion>=60 && point.percen_participacion<80) {
      radius=16;
    } else {
      radius=19;
    }


    var bubble =  '<div class="bubble" id="'+point.id+'" style="width:'+(radius*2)+'px; height:'+(radius*2)+'px; left:'+(left-radius)+'px; top:'+(top-radius)+'px; ">'+
                    '<img src="/images/grey_marker.png"/>'+
                    '<p>+2</p>'+
                  '</div>';
    $(div).append(bubble);
    
    if (radius < 11) {
      $(bubble).find('p').css('display',"none");
    }
    
    
    return div;
  };
  
  
  
  
  // function getActiveTiles() {
  //   var flat = _.reduceRight(hash,function(a,b){ return a.concat(b) },[]);
  //   flat = _.select(flat, function(ele){ return ele!=undefined; });
  //   
  //   _.each(flat,function(occ,key){
  //     var random = (Math.random()>0.5)?true:false;
  //     if (random) {
  //       $('div#'+occ.id).animate({height:"+=10",width:'+=10',top: '-=5px',left:'-=5px'},600);
  //     } else {
  //       $('div#'+occ.id).animate({height: "-=10",width:'-=10',top: '+=5px',left:'+=5px'},600);
  //     }
  //   });
  // }
  