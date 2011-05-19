

    function CompareWindow() {
      this.create();
      this.firstZoom = 12;
      this.firstData = {};
      this.secondData = {};
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
              '<input class="text" type="text" value="Busca una localidad..." />'+
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
          '</div>'+
        '</div>';

      $('body').append(this.div);
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

      $('form.search_compare input.text').focusin(function(){
        var value = $(this).val();
        if (value=="Busca una localidad...") {
          $(this).val('');
        }
      });

      $('form.search_compare input.text').focusout(function(){
        var value = $(this).val();
        if (value=="") {
          $(this).val('Busca una localidad...');
        }
      });

      $('form.search_compare').submit(function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        searchCompareLocation($(this).find('input.text').val());
      });

      $('a.remove_compare').live('click',function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        me.removeRegion($(this).closest('div').attr('class'));
      });


      $('a.resumen').live('click',function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        $('div.outer_stats_slider').scrollTo( {top:'0px',left:'+=0'}, 500);
      });

      $('a.evolucion').live('click',function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        $('div.outer_stats_slider').scrollTo( {top:'110px',left:'+=0'}, 500);
      });
    }


    CompareWindow.prototype.compareFirstRegion = function(info,zoom) {
    	var me = this;
    	var div = this.div;
    	this.firstData = info;
    	this.firstZoom = zoom;
    	// Reset graphs containers
      $('div.stats_slider').empty();
    	//Reset
    	this.resetSearch();
    	// Move slider to the start
    	$('div.outer_stats_slider').scrollTo({top:'0',left:'0'}, 1);
    	//Create charts
    	this.createChart(info);

      if (info.name != undefined) {
        $('div#comparewindow div.top h2').html(info.name + ' <a class="remove_compare" href="#eliminar">ELIMINAR</a>');
        $('div#comparewindow div.top p.province').text(((info.provincia!=undefined)?(info.provincia+', '):'')+info['data'][year]['censo_total']+' habitantes');
        $('div#comparewindow div.top div.stats h4').text(parseFloat(info['data'][year]['percen_participacion']).toFixed(0)+'% de participación');

        // Remove previous political style bars
        $('div#comparewindow div.top div.stats div.partido').each(function(i,ele){
          $(ele).removeClass(parties.join(" ") + ' par1 par2 par3');
        });
        var bar_width;

        // First political party
        var partido_1 = info['data'][year]['primer_partido_name'].toLowerCase().replace("-", "_");

        if (_.indexOf(parties, partido_1) !== -1) {
          $('div#comparewindow div.top div.stats div.partido:eq(0)').addClass(partido_1);
        } else {
          $('div#comparewindow div.top div.stats div.partido:eq(0)').addClass('par1');
        }
        bar_width = (info['data'][year]['primer_partido_percent']*175)/100;
        $('div#comparewindow div.top div.stats div.partido:eq(0) span.c').width((bar_width<2)?2:bar_width);
        $('div#comparewindow div.top div.stats div.partido:eq(0) p').text(info['data'][year]['primer_partido_name']+' ('+info['data'][year]['primer_partido_percent']+'%)');

        // Second political party
        var partido_2 = info['data'][year]['segundo_partido_name'].toLowerCase().replace("-", "_");
        if (_.indexOf(parties, partido_2) !== -1) {
          $('div#comparewindow div.top div.stats div.partido:eq(1)').addClass(partido_2);
        } else {
          $('div#comparewindow div.top div.stats div.partido:eq(1)').addClass('par2');
        }
        bar_width = (info['data'][year]['segundo_partido_percent']*175)/100;
        $('div#comparewindow div.top div.stats div.partido:eq(1) span.c').width((bar_width<2)?2:bar_width);
        $('div#comparewindow div.top div.stats div.partido:eq(1) p').text(info['data'][year]['segundo_partido_name']+' ('+info['data'][year]['segundo_partido_percent']+'%)');

        // Third political party
        var partido_3 = info['data'][year]['tercer_partido_name'].toLowerCase().replace("-", "_");
        if (_.indexOf(parties, partido_3) !== -1) {
          $('div#comparewindow div.top div.stats div.partido:eq(2)').addClass(partido_3);
        } else {
          $('div#comparewindow div.top div.stats div.partido:eq(2)').addClass('par3');
        }

        bar_width = (info['data'][year]['tercer_partido_percent']*175)/100;
        $('div#comparewindow div.top div.stats div.partido:eq(2) span.c').width((bar_width<2)?2:bar_width);
        $('div#comparewindow div.top div.stats div.partido:eq(2) p').text(info['data'][year]['tercer_partido_name']+' ('+info['data'][year]['tercer_partido_percent']+'%)');

        // Other
        bar_width = (info['data'][year]['otros_partido_percent']*175)/100;
        $('div#comparewindow div.top div.stats div.partido:eq(3) span.c').width((bar_width<2)?2:bar_width);
        $('div#comparewindow div.top div.stats div.partido:eq(3) p').text('OTROS ('+info['data'][year]['otros_partido_percent']+'%)');

      }

      this.show();
    }


    CompareWindow.prototype.compareSecondRegion = function(info,formatted_address) {
      var me = this;
      this.cleanSecondRegion();
      var url = global_url+'/google_names_cache/'+gmaps_version+'/'+replaceWeirdCharacters(formatted_address)+'.json';
      console.log("comparing", url);

      if (info==null) {
        $.ajax({
          method: "GET",
          dataType: 'json',
          url: url,
          success: function(info) {
            fillData(info);
          },
          error: function(error) {
            $('div#comparewindow div.bottom').addClass('search').removeClass('region')
            $('div#comparewindow p.refer').text('No hemos encontrado la localidad, prueba con otra');
          }
        });
      } else {
        fillData(info);
      }


      function fillData(info) {
        me.secondData = info;
        me.createChart(info);

        $('div#comparewindow div.bottom div.region h2').html(info.name + ' <a class="remove_compare" href="#eliminar">ELIMINAR</a>');
        $('div#comparewindow div.bottom div.region p.province').text(((info.provincia!=undefined)?(info.provincia+', '):'')+info['data'][year]['censo_total']+' habitantes');
        $('div#comparewindow div.bottom div.region h4').text(parseFloat(info['data'][year]['percen_participacion']).toFixed(0)+'% de participación');

        // Remove previous political style bars
        $('div#comparewindow div.bottom div.region div.stats div.partido').each(function(i,ele){
          $(ele).removeClass(parties.join(" ") + ' par1 par2 par3');
        });
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

        $('div#comparewindow div.bottom').removeClass('search').addClass('region');
      }
    }

    CompareWindow.prototype.updateValues = function(){

        //TODO: AÜN NO FUNCIONA

        if (this.div) {
          var partido_1 = normalizePartyName(this.firstData['data'][year]['primer_partido_name']);
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(0)').removeClass(parties.join(" ") + ' par1 par2 par3');
          if (_.indexOf(parties, partido_1) !== -1) {
            $('div#comparewindow div.bottom div.region div.stats div.partido:eq(0)').addClass(partido_1);
          } else if(this.oldPar1 != partido_1) {
            $('div#comparewindow div.bottom div.region div.stats div.partido:eq(0)').addClass('par1');
          }
          bar_width = normalizeBarWidth((this.firstData['data'][year]['primer_partido_percent']*175)/100);
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(0) span.c').animate({
            width: bar_width.toString() +"px"
          }, 500, 'easeOutCubic');
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(0) p').text(this.firstData['data'][year]['primer_partido_name']+' ('+this.firstData['data'][year]['primer_partido_percent']+'%)');


          var partido_2 = normalizePartyName(this.firstData['data'][year]['segundo_partido_name']);
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(1)').removeClass(parties.join(" ") + ' par1 par2 par3');
          if (_.indexOf(parties, partido_2) !== -1) {
            $('div#comparewindow div.bottom div.region div.stats div.partido:eq(1)').addClass(partido_2);
          } else if(this.oldPar2 != partido_2) {
            $('div#comparewindow div.bottom div.region div.stats div.partido:eq(1)').addClass('par2');
          }
          bar_width = normalizeBarWidth((this.firstData['data'][year]['segundo_partido_percent']*175)/100);
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(1) span.c').animate({
            width: bar_width.toString() +"px"
          }, 500, 'easeOutCubic');
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(1) p').text(this.firstData['data'][year]['segundo_partido_name']+' ('+this.firstData['data'][year]['segundo_partido_percent']+'%)');

          var partido_3 = normalizePartyName(this.firstData['data'][year]['tercer_partido_name']);
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(2)').removeClass(parties.join(" ") + ' par1 par2 par3');
          if (_.indexOf(parties, partido_3) !== -1) {
            $('div#comparewindow div.bottom div.region div.stats div.partido:eq(2)').addClass(partido_3);
          } else if(this.oldPar3 != partido_3) {
            $('div#comparewindow div.bottom div.region div.stats div.partido:eq(2)').addClass('par3');
          }
          bar_width = normalizeBarWidth((this.firstData['data'][year]['tercer_partido_percent']*175)/100);
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(2) span.c').animate({
            width: bar_width.toString() +"px"
          }, 500, 'easeOutCubic');
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(2) p').text(this.firstData['data'][year]['tercer_partido_name']+' ('+this.firstData['data'][year]['tercer_partido_percent']+'%)');

          bar_width = normalizeBarWidth((this.firstData['data'][year]['otros_partido_percent']*175)/100);
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(3) span.c').width((bar_width<2)?2:bar_width);
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(3) p').text('OTROS ('+this.firstData['data'][year]['otros_partido_percent']+'%)');

      	}
      }

    CompareWindow.prototype.resetSearch = function() {
      $('div#comparewindow div.bottom input.text').val('Busca una localidad...');
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


    CompareWindow.prototype.createChart = function(info) {
      $('div.stats_slider').width(_.size(normalization)*298);
      var width = 130;


      //Add top blocks
      _.each(normalization,function(ele,i){
        if (info['data'][year][ele]!=undefined) {

          // Calculate min-max from variable
          var region_type = getDeepLevelFromZoomLevel(peninsula.getZoom());
          var max_ = max_min[region_type][ele+'_'+year+'_max'];
          var min_ = max_min[region_type][ele+'_'+year+'_min'];

          var max = Math.max(Math.abs(max_),Math.abs(min_));
          var bar_width = ((Math.abs(info['data'][year][ele]*width))/max);

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
        if (info['data'][year][ele]!=undefined) {
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

      if ($('div.stats_slider div[alt="'+compare+'"].up').length) {
        setTimeout(function(){$('div.outer_stats_slider').scrollTo($('div.stats_slider div[alt="'+compare+'"].up'),1);},20);
      }
    }


    CompareWindow.prototype.isVisible = function() {
      return $('div#comparewindow').is(':visible');
    }


    CompareWindow.prototype.cleanSecondRegion = function() {
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
        return 'http://chart.apis.google.com/chart?chf=bg,s,FFFFFF00&chs='+(count*12)+'x80&cht=ls&chco=FF6699&chds=-'+max+','+max+'&chd=t:'+param+'&chdlp=b&chls=1&chm=o,FF6699,0,'+find_year+',8&chma=3,'+(new_no_data*12)+',3,3';
      } else {
        return 'http://chart.apis.google.com/chart?chf=bg,s,FFFFFF00&chs='+(count*12)+'x80&cht=ls&chco=666666&chds=-'+max+','+max+'&chd=t:'+param+'&chdlp=b&chls=1&chm=o,666666,0,'+find_year+',8&chma=3,'+(new_no_data*12)+',3,3';
      }
    }


