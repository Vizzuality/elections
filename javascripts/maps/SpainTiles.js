  var MERCATOR_RANGE = 256;
  var hash = {};

  function CoordMapType(tileSize) {
    this.tileSize = tileSize;
  }

  CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {

    var div = ownerDocument.createElement('div');
    //div.innerHTML = coord.x +','+coord.y+','+zoom;
    div.style.width = this.tileSize.width + 'px';
    div.style.height = this.tileSize.height + 'px';
    div.setAttribute('id',coord.x+'_'+coord.y+'_'+zoom);


    hash[coord.x+'_'+coord.y+'_'+zoom] = [];
    
    var query;
    var x,y;
    
    if (zoom>9) {
      //query = 'SELECT id_4 as id,center_longitude,center_latitude from gadm4 where v_get_tile('+coord.x+','+coord.y+','+zoom+') && centre_geom_webmercator';
      
      if (zoom==12) {
        x = coord.x/2;
        y = coord.y/2;
      } else {
        x = coord.x;
        y = coord.y;
      }
      
      // query = "SELECT id_4 AS id,name_4 AS municipio,name_2 AS provincia,censo_total,((votantes_totales / censo_total) * 100)::INTEGER AS percen_participacion,primer_partido_percent,"+
      // "segundo_partido_percent,tercer_partido_percent,0 AS otros_partido_percent,(random() * 100) AS abs_value,center_longitude,center_latitude,vsm.paro_norm_1996, vsm.paro_norm_1997, vsm.paro_norm_1998,"+
      // "vsm.paro_norm_1999, vsm.paro_norm_2000, vsm.paro_norm_2001, vsm.paro_norm_2002, vsm.paro_norm_2003, vsm.paro_norm_2004, vsm.paro_norm_2005, vsm.paro_norm_2006, vsm.paro_norm_2007, vsm.paro_norm_2008, vsm.paro_norm_2009 "+
      // "FROM gadm4 AS g INNER JOIN votaciones_por_municipio AS v ON g.cartodb_id = v.gadm4_cartodb_id INNER JOIN vars_socioeco_x_municipio AS vsm ON vsm.gadm4_cartodb_id = g.cartodb_id "+
      // "where v_get_tile("+Math.floor(x)+","+y+",11) && centre_geom_webmercator and proceso_electoral_id = '73'";

      
      query = "SELECT id_4 AS id,name_4 AS municipio,name_2 AS provincia,censo_total,((votantes_totales / censo_total) * 100)::INTEGER AS percen_participacion,primer_partido_percent,"+
       "pp1.name AS primer_partido_name,segundo_partido_percent,pp2.name AS segundo_partido_name,tercer_partido_percent,pp3.name AS tercer_partido_name,"+
       "0 AS otros_partido_percent,center_longitude,center_latitude,vsm.paro_norm_1996, vsm.paro_norm_1997, vsm.paro_norm_1998, vsm.paro_norm_1999, vsm.paro_norm_2000, vsm.paro_norm_2001,"+
       "vsm.paro_norm_2002, vsm.paro_norm_2003, vsm.paro_norm_2004, vsm.paro_norm_2005, vsm.paro_norm_2006, vsm.paro_norm_2007, vsm.paro_norm_2008, vsm.paro_norm_2009 "+
       "FROM gadm4 AS g INNER JOIN votaciones_por_municipio AS v ON g.cartodb_id = v.gadm4_cartodb_id INNER JOIN vars_socioeco_x_municipio AS vsm ON vsm.gadm4_cartodb_id = v.gadm4_cartodb_id "+
       "INNER JOIN partidos_politicos AS pp1 ON pp1.cartodb_id = v.primer_partido_id INNER JOIN partidos_politicos AS pp2 ON pp2.cartodb_id = v.segundo_partido_id INNER JOIN partidos_politicos AS "+
       "pp3 ON pp3.cartodb_id = v.tercer_partido_id where v_get_tile("+x+","+y+",11) && centre_geom_webmercator and proceso_electoral_id = '73'";

      // query = "SELECT id_4 as id,name_4 as municipio,name_2 as provincia,censo_total, (votantes_totales/censo_total)*100 as percen_participacion,"+
      // "primer_partido_percent,segundo_partido_percent,tercer_partido_percent,0 as otros_partido_percent,(random()*100) as abs_value,"+
      // "center_longitude,center_latitude from gadm4 as g inner join votaciones_por_municipio as v on g.cartodb_id=v.gadm4_cartodb_id "+
      // "where v_get_tile("+x+","+y+",11) && centre_geom_webmercator and proceso_electoral_id = '73'";
      
    } else if (zoom>6 && zoom<=9) {
      query = 'SELECT id_2 as id,center_longitude,center_latitude from gadm2 where v_get_tile('+coord.x+','+coord.y+','+zoom+') && centre_geom_webmercator';
    } else {
      query = 'SELECT id_1 as id,center_longitude,center_latitude from gadm1 where v_get_tile('+coord.x+','+coord.y+','+zoom+') && centre_geom_webmercator';
    }


    $.ajax({
      method: "GET",
      dataType: 'jsonp',
      url: 'https://api.cartodb.com/v1',
      data: {sql:query,api_key:'8c587c9f93c36d146c9e66a29cc8a3499e869609'},
      success: function(data) {
        
        var pixelcoord1={x:coord.x*256,y:coord.y*256,z:zoom} ; 
        var worldcoord1 = new google.maps.Point(pixelcoord1.x/Math.pow(2,zoom),pixelcoord1.y/Math.pow(2,zoom)); 
        var projection = peninsula.getProjection(); 
        var ne = projection.fromPointToLatLng(worldcoord1); 

        var normalizedPoint = peninsula.getProjection().fromLatLngToPoint(ne);
        var scale = Math.pow(2, zoom);
        var tileCoordinate = new google.maps.Point(normalizedPoint.x * scale, normalizedPoint.y * scale);
    
        var points = data.rows;
        hash[coord.x+'_'+coord.y+'_'+zoom] = {};
        
        for (var i=0; i<points.length; i++) {
          var point_id = points[i].id;
          var percentage_participacion = parseFloat(points[i].abs_value).toFixed(2);
          
          hash[coord.x+'_'+coord.y+'_'+zoom][point_id] = points[i];
          
          var latlng = new google.maps.LatLng(points[i].center_latitude,points[i].center_longitude);
          var normalizedPoint = peninsula.getProjection().fromLatLngToPoint(latlng); // returns x,y normalized to 0~255
          var pixelCoordinate = new google.maps.Point(normalizedPoint.x * scale, normalizedPoint.y * scale);

          var left = pixelCoordinate.x - tileCoordinate.x;
          var top = pixelCoordinate.y - tileCoordinate.y;
      
          var radius;
          var lat = points[i].center_latitude;
          var lng = points[i].center_longitude;
      
          if (percentage_participacion>=0 && percentage_participacion<20) {
            radius=7;
          } else if (percentage_participacion>=20 && percentage_participacion<40) {
            radius=10;
          } else if (percentage_participacion>=40 && percentage_participacion<60) {
            radius=13;
          } else if (percentage_participacion>=60 && percentage_participacion<80) {
            radius=16;
          } else {
            radius=19;
          }

          var child = ownerDocument.createElement('div');
          child.className = "region";
          child.setAttribute('id',point_id);
          child.style.width = (radius*2) + 'px';
          child.style.height = (radius*2) + 'px';
          child.style.position = "absolute";
          child.style.padding = "0";
          child.style.margin = "0";
          child.style.left = left-radius + "px";
          child.style.top = top-radius + "px";
          child.onclick = function(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            if (!dragging) {
              var occ_id = this.getAttribute('id');
              var tile_id = this.parentNode.getAttribute('id');
              var point = hash[tile_id][occ_id];
              var height = (this.style.height.replace('px','') / 2) - 5;
              var latlng = new google.maps.LatLng(point.center_latitude,point.center_longitude);
              infowindow.setPosition(latlng,height,point); //latlng && height
            }
          }

                
          var img = ownerDocument.createElement('img');
          img.setAttribute('src', 'http://localhost:8888/images/grey_marker.png');
          img.style.padding = "0";
          img.style.margin = "0";
          img.setAttribute('width','100%');
          img.setAttribute('height','100%');
          child.appendChild(img);
          
          
          var text = ownerDocument.createElement('p');
          text.style.position = "absolute";
          text.style.zIndex = 0;
          text.style.top = "50%";
          text.style.left = "50%";
          text.style.textAlign = "center";
          text.style.zIndex = 10;
          text.style.color = "#666666";
          text.style.font = "normal 11px 'Officina Bold'";
          text.style.padding = "0";
          text.style.margin = "-6px 0 0 0";
          text.innerHTML  = "+2";
          child.appendChild(text);

          div.appendChild(child);


          var text_width = $(text).width();
          if (radius < 11) {
            text.style.display = "none";
          } else {
            text.style.margin = "-6px 0 0 -"+(text_width/2)+"px";
          }
        }
    
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
  
  
  
  
  function getActiveTiles() {
    var flat = _.reduceRight(hash,function(a,b){ return a.concat(b) },[]);
    flat = _.select(flat, function(ele){ return ele!=undefined; });
    
    _.each(flat,function(occ,key){
      var random = (Math.random()>0.5)?true:false;
      if (random) {
        $('div#'+occ.id).animate({height:"+=10",width:'+=10',top: '-=5px',left:'-=5px'},600);
      } else {
        $('div#'+occ.id).animate({height: "-=10",width:'-=10',top: '+=5px',left:'+=5px'},600);
      }
    });
  }
  