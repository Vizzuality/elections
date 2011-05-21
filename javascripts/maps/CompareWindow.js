    var google_autocomplete;

    function CompareWindow() {
      this.create();
      this.firstZoom = 12;
      this.position = "top";
      this.deep_level;
      this.firstData = {};
      this.secondData = {};
      this.bar_width_multiplier = 140;
      this.slider_position = 0;
      this.total_variables = 10; // Calculate!! TODO
    }

    CompareWindow.prototype = {};


    CompareWindow.prototype.create = function() {
      var me = this;
      this.div = document.createElement('div');
      this.div.setAttribute('id','comparewindow');
      this.div.innerHTML =
        '<a class="close_infowindow"></a>'+
        '<div id="compare_region1" class="top">'+
          '<h2>Alaejos <a class="remove_compare" href="#eliminar">ELIMINAR</a></h2>'+
          '<p class="province">Valladolid, 11.982 habitantes.</p>'+
          '<div class="stats">'+
            '<h4>65% de participación</h4>'+
            '<div class="partido psoe"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>PSOE (61%)</p></div>'+
            '<div class="partido pp"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>PP (36%)</p></div>'+
            '<div class="partido iu"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>IU (12%)</p></div>'+
            '<div class="partido otros"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>OTROS (61%)</p></div>'+
          '</div>'+
          '<div class="summary">'+
          '<h4>Municipios en los que es el más votado...</h4>'+
          '<ul>'+
            '<li class="partido psoe bar"><strong>231</strong><span>PSOE</span></li>'+
            '<li class="partido pp bar"><strong>231</strong><span>PP</span></li>'+
            '<li class="partido iu bar"><strong>231</strong><span>IU</span></li>'+
            '<li class="partido otros"><strong>231</strong><span>OTROS</span></li>'+
          '</ul>'+
          '</div>'+
          '<div class="compare_graph">'+
            '<a href="#" class="left">left</a>'+
            '<a href="#" class="right">right</a>'+
            '<div class="outer_stats_slider">'+
              '<div class="stats_slider"></div>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div id="compare_region2" class="bottom search">'+
          '<div class="search">'+
            '<h4>Selecciona otro lugar para comparar...</h4>'+
            '<form class="search_compare">'+
              '<input class="text" type="text" value="Introduce una ubicación" id="google_compare_autocomplete" />'+
              '<input class="submit" type="submit" value=""/>'+
            '</form>'+
            '<p class="refer">¿Te refieres a... <a href="#Almendralejo">Almendralejo, Extremadura</a>?</p>'+
          '</div>'+
          '<div class="region">'+
            '<h2>Alaejos <a class="remove_compare" href="#eliminar">ELIMINAR</a></h2>'+
            '<p class="province">Valladolid, 11.982 habitantes.</p>'+
            '<div class="stats">'+
              '<h4>65% de participación</h4>'+
              '<div class="partido psoe"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>PSOE (61%)</p></div>'+
              '<div class="partido pp"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>PP (36%)</p></div>'+
              '<div class="partido iu"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>IU (12%)</p></div>'+
              '<div class="partido otros"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>OTROS (61%)</p></div>'+
            '</div>'+
            '<div class="summary">'+
            '<h4>Municipios en los que es el más votado...</h4>'+
            '<ul>'+
              '<li class="partido psoe bar"><strong>231</strong><span>PSOE</span></li>'+
              '<li class="partido pp bar"><strong>231</strong><span>PP</span></li>'+
              '<li class="partido iu bar"><strong>231</strong><span>IU</span></li>'+
              '<li class="partido otros"><strong>231</strong><span>OTROS</span></li>'+
            '</ul>'+
            '</div>'+
          '</div>'+
        '</div>';

      $('div.tabs').append(this.div);
      $(this.div).children('a.close_infowindow').click(function(ev){ev.stopPropagation();ev.preventDefault();me.hide();});
      $(this.div).draggable({containment: 'parent'});


      $('div.compare_graph a.right').click(function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        $('div.outer_stats_slider').scrollTo({top:'+=0',left:'+=299'}, 500);
      });


      $('div.compare_graph a.left').click(function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        $('div.outer_stats_slider').scrollTo( {top:'+=0',left:'-=299'}, 500);
      });

      $('form.search_compare').submit(function(ev){
        ev.stopPropagation();
        ev.preventDefault();
      });


      $('form.search_compare').submit(function(ev){
        ev.stopPropagation();
        ev.preventDefault();
      });


      $('a.remove_compare').live('click',function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        me.removeRegion($(this).closest('div').attr('class'));
      });


      $('a.resumen').live('click',function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        this.position = "up";
        $('div.outer_stats_slider').scrollTo( {top:'0px',left:'+=0'}, 500);
      });


      $('a.evolucion').live('click',function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        this.position = "down";
        $('div.outer_stats_slider').scrollTo( {top:'110px',left:'+=0'}, 500);
      });

      me.addGoogleAutocomplete();
    }


    CompareWindow.prototype.addGoogleAutocomplete = function() {
      var me = this;
      var input = document.getElementById('google_compare_autocomplete');
      var defaultBounds = new google.maps.LatLngBounds(new google.maps.LatLng(27.391278222579277, -18.45703125),new google.maps.LatLng(42.601619944327965, 4.0869140625));
      var options = {bounds: defaultBounds};
      google_autocomplete = new google.maps.places.Autocomplete(input, options);


      google.maps.event.addListener(google_autocomplete, 'place_changed', function() {
        var place = google_autocomplete.getPlace();
        comparewindow.compareSecondRegion(null,place.formatted_address);
      });
    }


    CompareWindow.prototype.drawTopBar = function(party_id, info) {

      var id        = party_id - 1;
      var positions = ["primer", "segundo", "tercer", "otros"];
      var percent   = info.data[year][positions[id]+'_partido_percent'];

      if (party_id < 4) {
        // First political party
        var partido = info['data'][year][positions[id] + '_partido_name'].toLowerCase().replace("-", "_");

        if (_.indexOf(parties, partido) !== -1) {
          $('div#comparewindow div.top div.stats div.partido:eq('+id+')').addClass(partido);
        } else {
          $('div#comparewindow div.top div.stats div.partido:eq('+id+')').addClass('par' + party_id);
        }
        bar_width = (percent*this.bar_width_multiplier)/100;
      } else {
        partido = "OTRO";
      }
      $('div#comparewindow div.top div.stats div.partido:eq('+id+') span.c').width((bar_width<2)?2:bar_width);
      $('div#comparewindow div.top div.stats div.partido:eq('+id+') p').text(partido+' ('+percent+'%)');
    }

    CompareWindow.prototype.compareFirstRegion = function(info,zoom) {
    	var me = this;
    	var div = this.div;
    	this.firstData = info;

    	if (zoom != null) {
        this.firstZoom = zoom;
    	}
    	// Reset graphs containers
      $('div.stats_slider').empty();
    	//Reset
    	this.resetSearch();
    	// Move slider to the start
    	$('div.outer_stats_slider').scrollTo({top:'0',left:'0'}, 1);
    	//Create charts
    	this.createChart(info,true);
    	this.setUpChartView();
      this.deep_level = getDeepLevelFromZoomLevel(this.firstZoom);

      if (info.name != undefined) {
        $('div#comparewindow div.top h2').html(info.name + ' <a class="remove_compare" href="#eliminar">ELIMINAR</a>');
        $('div#comparewindow div.top p.province').text(((info.provincia!=undefined)?(info.provincia+', '):'')+info['data'][year]['censo_total']+' habitantes');

        if (info.provincia != null) {
          $('div#comparewindow div.top div.stats h4').text(parseFloat(info['data'][year]['percen_participacion']).toFixed(0)+'% de participación');
        }

        // Remove previous political style bars
        $('div#comparewindow div.top div.stats div.partido').each(function(i,ele){
          $(ele).removeClass(parties.join(" ") + ' par1 par2 par3');
        });

        $('div#comparewindow div#compare_region1 div.summary li.partido').each(function(i,ele){
          $(ele).removeClass(parties.join(" ") + ' par1 par2 par3');
        });

        if (info.provincia != null) {
          this.drawTopBar(1, info);
          this.drawTopBar(2, info);
          this.drawTopBar(3, info);
          this.drawTopBar(4, info);
          $('div#comparewindow div.stats').show();
          $('div#comparewindow div#compare_region1 div.summary').hide();
        } else {
          this.drawTotalNumber(1, 1, info, false);
          this.drawTotalNumber(2, 1, info, false);
          this.drawTotalNumber(3, 1, info, false);
          this.drawTotalNumber(4, 1, info, false);
          $('div#comparewindow div#compare_region1 div.summary').show();
          $('div#comparewindow div.stats').hide();
        }
      }
      this.show();
    }

    CompareWindow.prototype.compareSecondRegion = function(info,formatted_address, region_name) {
      var me = this;
      this.cleanSecondRegion();
      var url = global_url+'/google_names_cache/'+gmaps_version+'/'+replaceWeirdCharacters(formatted_address)+'.json';

      if (info==null) {
        $.ajax({
          method: "GET",
          dataType: 'json',
          url: url,
          success: function(info) {
            if (info!=null) {
              fillData(info, region_name);
              $('div#comparewindow p.refer').hide();
            } else {
              $('div#comparewindow div.bottom').addClass('search').removeClass('region')
              $('div#comparewindow p.refer').text('No hay datos para esta localidad').show();
            }
          },
          error: function(error) {
            $('div#comparewindow div.bottom').addClass('search').removeClass('region')
            $('div#comparewindow p.refer').text('No hay datos para esta localidad').show();
          }
        });
      } else {
        fillData(info, region_name);
      }


      function fillData(info, region_name) {
        me.secondData = info;
        me.createChart(info,false);

        $('div#comparewindow div.bottom div.region h2').html(info.name + ' <a class="remove_compare" href="#eliminar">ELIMINAR</a>');
        $('div#comparewindow div.bottom div.region p.province').text(((info.provincia!=undefined)?(info.provincia+', '):'')+info['data'][year]['censo_total']+' habitantes');


        if (info.provincia != null) {
          $('div#comparewindow div.bottom div.region h4').text(parseFloat(info['data'][year]['percen_participacion']).toFixed(0)+'% de participación');
        }


        // Remove previous political style bars
        $('div#comparewindow div.bottom div.region div.stats div.partido').each(function(i,ele){
          $(ele).removeClass(parties.join(" ") + ' par1 par2 par3');
        });

        $('div#comparewindow div#compare_region2 div.summary li.partido').each(function(i,ele){
          $(ele).removeClass(parties.join(" ") + ' par1 par2 par3');
        });

        var deep_level;

        if (region_name == undefined) {
          deep_level = getDeepLevelFromZoomLevel(peninsula.getZoom());
        } else {
          deep_level = region_name;
        }

        if (info.provincia == null) {
          me.drawTotalNumber(1, 2, me.secondData, false);
          me.drawTotalNumber(2, 2, me.secondData, false);
          me.drawTotalNumber(3, 2, me.secondData, false);
          me.drawTotalNumber(4, 2, me.secondData, false);
          $('div#comparewindow div#compare_region2 div.summary').show();
          $('div#comparewindow div#compare_region2 div.stats').hide();
        } else {

          $('div#comparewindow div#compare_region2 div.summary').hide();

          var bar_width;

        // First political party
        var partido_1 = info['data'][year]['primer_partido_name'].toLowerCase().replace("-", "_");
        if (_.indexOf(parties, partido_1) !== -1) {
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(0)').addClass(partido_1);
        } else {
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(0)').addClass('par1');
        }
        bar_width = (info['data'][year]['primer_partido_percent']*200)/100;
        $('div#comparewindow div.bottom div.region div.stats div.partido:eq(0) span.c').width((bar_width<2)?2:bar_width);
        $('div#comparewindow div.bottom div.region div.stats div.partido:eq(0) p').text(info['data'][year]['primer_partido_name']+' ('+info['data'][year]['primer_partido_percent']+'%)');

        // Second political party
        var partido_2 = info['data'][year]['segundo_partido_name'].toLowerCase().replace("-", "_");
        if (_.indexOf(parties, partido_2) !== -1) {
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(1)').addClass(partido_2);
        } else {
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(1)').addClass('par2');
        }
        bar_width = (info['data'][year]['segundo_partido_percent']*200)/100;
        $('div#comparewindow div.bottom div.region div.stats div.partido:eq(1) span.c').width((bar_width<2)?2:bar_width);
        $('div#comparewindow div.bottom div.region div.stats div.partido:eq(1) p').text(info['data'][year]['segundo_partido_name']+' ('+info['data'][year]['segundo_partido_percent']+'%)');

        // Third political party
        var partido_3 = info['data'][year]['tercer_partido_name'].toLowerCase().replace("-", "_");
        if (_.indexOf(parties, partido_3) !== -1) {
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(2)').addClass(partido_3);
        } else {
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(2)').addClass('par3');
        }

        bar_width = (info['data'][year]['tercer_partido_percent']*200)/100;
        $('div#comparewindow div.bottom div.region div.stats div.partido:eq(2) span.c').width((bar_width<2)?2:bar_width);
        $('div#comparewindow div.bottom div.region div.stats div.partido:eq(2) p').text(info['data'][year]['tercer_partido_name']+' ('+info['data'][year]['tercer_partido_percent']+'%)');

        // Other
        bar_width = (info['data'][year]['otros_partido_percent']*200)/100;
        $('div#comparewindow div.bottom div.region div.stats div.partido:eq(3) span.c').width((bar_width<2)?2:bar_width);
        $('div#comparewindow div.bottom div.region div.stats div.partido:eq(3) p').text('OTROS ('+info['data'][year]['otros_partido_percent']+'%)');
        $('div#comparewindow div#compare_region2 div.stats').show();

      }
        $('div#comparewindow div.bottom').removeClass('search').addClass('region');
      }
    }

    CompareWindow.prototype.drawTotalNumber = function(party_id, region, info, animated) {

      var me = this;
      var id        = party_id - 1;
      var positions = ["primer", "segundo", "tercer", "otros"];
      var percent   = info.data[year][positions[id]+'_partido_total'];
      var clase     = "otros";
      var partido   = "otros";

      var $p = $('div#comparewindow div#compare_region'+region+' div.summary li.partido:eq('+id+')');

      if (party_id < 4) {
        partido = info.data[year][positions[id] +'_partido_name'];
        var partido_class = normalizePartyName(info.data[year][positions[id] +'_partido_name']);

        if (_.indexOf(parties, partido_class) !== -1) { clase = partido_class; } else { clase = 'par'+party_id; }
        $p.addClass(clase);
      }

      if (animated == true) {
        var old_percent = $p.find('strong').text();
        var old_party   = $p.find('span').text();

        if (old_percent != percent || (partido != null && old_party != partido)) {
          $p.find('> *').fadeOut("slow", function() { me.renderTotalNumber($p, id, percent, partido); $p.find('> *').fadeIn("slow"); });
        }
      } else {
        this.renderTotalNumber($p, id, percent, partido);
      }
    }

    CompareWindow.prototype.renderTotalNumber = function($div, id, value, name) {
      if (name != null) {
        $div.show();
        $div.find('strong').text(value);
        $div.find('span').text(name.toUpperCase());
      } else {
        $div.hide();
      }
    }

    CompareWindow.prototype.drawBar = function(party_id, level, data){
      var id = party_id - 1;
      var positions = ["primer", "segundo", "tercer"];

      if (party_id < 4) {
        var partido = normalizePartyName(data['data'][year][positions[id] + '_partido_name']);
        $('div#comparewindow div.'+level+' div.stats div.partido:eq('+id+')').removeClass(parties.join(" ") + ' par1 par2 par3');
        if (_.indexOf(parties, partido) !== -1) {
          $('div#comparewindow div.'+level+' div.stats div.partido:eq('+id+')').addClass(partido);
        } else if(this.oldPar1 != partido) {
          $('div#comparewindow div.'+level+' div.stats div.partido:eq('+id+')').addClass('par' + party_id);
        }
        bar_width = normalizeBarWidth((data['data'][year][positions[id] + '_partido_percent']*this.bar_width_multiplier)/100);
        $('div#comparewindow div.'+level+' div.stats div.partido:eq('+id+') span.c').animate({
          width: bar_width.toString() +"px"
        }, 500, 'easeOutCubic');
        $('div#comparewindow div.'+level+' div.stats div.partido:eq('+id+') p').text(data['data'][year][positions[id] + '_partido_name']+ ' ('+data['data'][year][positions[id] + '_partido_percent']+'%)');
      } else {

        bar_width = normalizeBarWidth((data['data'][year]['otros_partido_percent']*this.bar_width_multiplier)/100);
        $('div#comparewindow div.'+level+' div.stats div.partido:eq(3) span.c').width((bar_width<2)?2:bar_width);
        $('div#comparewindow div.'+level+' div.stats div.partido:eq(3) p').text('OTROS ('+data['data'][year]['otros_partido_percent']+'%)');

      }
    }

    CompareWindow.prototype.refreshChart = function(){
      if (this.firstData != null) {
        this.createChart(this.firstData, true, true);
      }
    }

    CompareWindow.prototype.updateValues = function(){
      if (this.div) {


        $('div#comparewindow div.top div.stats h4').text(parseFloat(this.firstData.data[year].percen_participacion).toFixed(0)+'% de participación');
        $('div#comparewindow div.top p.province').text(((this.firstData.provincia!=undefined)?(this.firstData.provincia+', '):'')+this.firstData['data'][year]['censo_total']+' habitantes');

        if (this.secondData.data != undefined) {
          $('div#comparewindow div.bottom div.stats h4').text(parseFloat(this.secondData.data[year].percen_participacion).toFixed(0)+'% de participación');
          $('div#comparewindow div.bottom p.province').text(((this.secondData.provincia!=undefined)?(this.secondData.provincia+', '):'')+this.secondData['data'][year]['censo_total']+' habitantes');
        }

        this.updateTotalNumber();
        this.updateBars();
      }
    }

    CompareWindow.prototype.updateTotalNumber = function() {
        $('div#comparewindow div.summary li.partido').each(function(i,ele){
          $(ele).removeClass(parties.join(" ") + ' par1 par2 par3');
        });

        for (var i = 1; i <= 4; i++) {
          this.drawTotalNumber(i, 1, this.firstData, true);

          if (this.secondData.data != undefined) {
            this.drawTotalNumber(i, 2, this.secondData, true);
          }
        }
    }

    CompareWindow.prototype.updateBars = function() {

      $('div#comparewindow div.top div.stats div.partido').each(function(i,ele){
        $(ele).removeClass(parties.join(" ") + ' par1 par2 par3');
      });

      for (var i = 1; i <= 4; i++) {
        this.drawBar(i,"top", this.firstData);

        if (this.secondData.data != undefined) {
          this.drawBar(i,"bottom", this.secondData);
        }
      }
    }

    CompareWindow.prototype.resetSearch = function() {
      $('div#comparewindow div.bottom input.text').val('Introduce una ubicación');
      $('div#comparewindow div.bottom p.refer').hide();
      $('div#comparewindow div.bottom').removeClass('region').addClass('search');
    }


    CompareWindow.prototype.show = function() {
      $(this.div).css('margin','-200px 0 0 -178px').css('top','50%').css('left','50%');
      $(this.div).fadeIn();
    }


    CompareWindow.prototype.hide = function() {
      $(this.div).fadeOut();
    }


    CompareWindow.prototype.removeRegion = function(from) {

      // Si solo hay una region -> Cerrar movideta
      if ($('div#comparewindow div.bottom').hasClass('search')) {
        this.hide();
        return false;
      }

      // Si hay los dos y cierras el de abajo -> Muestras buscador abajo
      if (from=="region") {
        // Clean graph second
        this.cleanSecondRegion();

        this.resetSearch();
        $('div#comparewindow div.bottom').addClass('search').removeClass('region');
        return false;
      }

      // Si estan los dos y cierras del de arriba -> Cambias las regions y pones buscador abajo
      if (from=="top" && $('div#comparewindow div.bottom').hasClass('region')) {
        this.firstData = this.secondData;
        this.secondData = {};
        this.compareFirstRegion(this.firstData);
        this.resetSearch();
        $('div#comparewindow div.bottom').addClass('search').removeClass('region');
        return false;
      }
    }


    CompareWindow.prototype.createChart = function(info,remove,refresh) {

      if (remove) {
        $('div#comparewindow div.stats_slider').empty();
      }

      $('div.stats_slider').width(_.size(normalization)*298);
      var width = 90;


      //Add top blocks
      _.each(normalization,function(ele,i){
        if (info.data != undefined && info.data[year][ele]!=undefined) {
          // Calculate min-max from variable
          var region_type = getDeepLevelFromZoomLevel(peninsula.getZoom());
          var max_ = max_min_avg[ele+'_'+year+'_max'];
          var min_ = max_min_avg[ele+'_'+year+'_min'];

          var max = Math.max(Math.abs(max_),Math.abs(min_));
          var bar_width = ((Math.abs(info['data'][year][ele]*width))/max);

          if (bar_width > 100) bar_width = 100;

          if ($('div.stats_slider div[alt="'+i+'"].up').length>0) {
            $('div.stats_slider div[alt="'+i+'"].up').append(
              '<span style="width:'+bar_width+'px" class="bar '+((info['data'][year][ele]>0)?'positive':'negative')+' second"></span>'+
              '<span style="'+((info['data'][year][ele]>0)?'margin:0 0 0 '+(bar_width+5)+'px':'margin:0 '+(bar_width+5)+'px 0 0')+'" class="data '+((info['data'][year][ele]>0)?'positive':'negative')+' second">'+parseFloat(info['data'][year][ele]).toFixed(2)+'%</span>'
            );
          } else {
            $('div.stats_slider').append(
              '<div alt="'+i+'" class="up block">'+
                '<h3>% '+i+'</h3>'+
                '<span style="width:'+bar_width+'px" class="bar '+((info['data'][year][ele]>0)?'positive':'negative')+' first"></span>'+
                '<span style="'+((info['data'][year][ele]>0)?'margin:0 0 0 '+(bar_width+5)+'px':'margin:0 '+(bar_width+5)+'px 0 0')+'" class="data '+((info['data'][year][ele]>0)?'positive':'negative')+' first">'+parseFloat(info['data'][year][ele]).toFixed(2)+'%</span>'+
                '<a class="evolucion" href="#ver_evolucion">ver evolución</a>'+
              '</div>'
            );
          }
        } else {
          if ($('div.stats_slider div[alt="'+i+'"].up').length==0) {
            $('div.stats_slider').append(
              '<div alt="'+i+'" class="up block">'+
                '<h3>% '+i+'</h3>'+
                '<a class="evolucion" href="#ver_evolucion">ver evolución</a>'+
                '<span class="error first">No hay datos</span>'+
              '</div>'
            );
          } else {
            $('div.stats_slider div[alt="'+i+'"].up').append(
              '<span class="error second">No hay datos</span>'
            );
          }
        }
      });

      // Add bottom blocks
      _.each(normalization,function(ele,i){
        if (info.data != undefined && info.data[year][ele]!=undefined) {
          if ($('div.stats_slider div[alt="'+i+'"].down').length>0) {
            var src = createImage(info,ele,true);

            $('div.stats_slider div[alt="'+i+'"].down').append(
              '<img class="second" src="'+src+'" title="" alt="Evolución '+year+' '+i+'"/>'+
              '<span class="name second">'+info.name+'</span>'
            );
          } else {
            var src = createImage(info,ele,false);
            $('div.stats_slider').append(
              '<div alt="'+i+'" class="down block">'+
                '<h3>% '+i+'</h3>'+
                '<a class="resumen" href="#ver_resumen">ver resumen</a>'+
                '<img class="first" src="'+src+'" />'+
                '<span class="name first">'+info.name+'</span>'+
              '</div>'
            );
          }

        } else {
          if ($('div.stats_slider div[alt="'+i+'"].down').length==0) {
            $('div.stats_slider').append(
              '<div alt="'+i+'" class="down block">'+
                '<h3>% '+i+'</h3>'+
                '<span class="error first">No hay datos</span>'+
                '<span class="name first">'+info.name+'</span>'+
                '<a class="resumen" href="#ver_resumen">ver resumen</a>'+
              '</div>'
            );
          } else {
            $('div.stats_slider div[alt="'+i+'"].down').append(
              '<span class="error second">No hay datos</span>'+
              '<span class="name second">'+info.name+'</span>'
            );
          }
        }
      });

      if (refresh && this.secondData) {
        this.createChart(this.secondData,false,false)
      }

    }


    CompareWindow.prototype.setUpChartView = function() {
      if ($('div.stats_slider div[alt="'+compare+'"].up').length) {
        setTimeout(function(){$('div.outer_stats_slider').scrollTo($('div.stats_slider div[alt="'+compare+'"].up'),1);},20);
      }
    }


    CompareWindow.prototype.isVisible = function() {
      return $('div#comparewindow').is(':visible');
    }


    CompareWindow.prototype.cleanSecondRegion = function() {
      this.secondData = {};
      $('div.stats_slider div.block').each(function(i,ele){
        $(ele).find('.second').remove();
      });
    }


    /*Auxiliar function to get evolution image */
    function createImage(info,ele,second) {
      /* create graph */
      var max = 0; var count = 0; var find = false; var find_year; var new_no_data = 0; var start = false;
      var param = "";
      var minYear = 1987; // 1987
      var maxYear = 2012; // 2012
      minGraphYear = 1987;
      var electionYears = [1987,1991,1995,1999,2003,2007,2011];
      var chartBackgroundTopPadding = 33 * _.indexOf(electionYears, minGraphYear);
      for (var i = minYear; i < maxYear; i++) {
        if (info['data'][i]!=undefined && info['data'][i][ele] != undefined) {
          if (!find) {
            if (year == i) {
              find = true;
              find_year = count;
            }
          }
          if (!start) {
            start = true;
          }
          count++;
          if (Math.abs(parseFloat(info['data'][i][ele]))>max) max = Math.ceil(Math.abs(parseFloat(info['data'][i][ele])));
          param += info['data'][i][ele] + ',';
        } else {
          if (start) {
            new_no_data ++;
          }
        }
      }
      param = param.substring(0, param.length-1);

      if (second) {
        return 'http://chart.apis.google.com/chart?chf=bg,s,FFFFFF00&chs='+(count*12)+'x60&cht=ls&chco=FF6699&chds=-'+max+','+max+'&chd=t:'+param+'&chdlp=b&chls=1&chm=o,FF6699,0,'+find_year+',5&chma=3,'+(new_no_data*12)+',3,3';
      } else {
        return 'http://chart.apis.google.com/chart?chf=bg,s,FFFFFF00&chs='+(count*12)+'x60&cht=ls&chco=666666&chds=-'+max+','+max+'&chd=t:'+param+'&chdlp=b&chls=1&chm=o,666666,0,'+find_year+',5&chma=3,'+(new_no_data*12)+',3,3';
      }
    }