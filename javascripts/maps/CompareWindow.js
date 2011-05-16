

    function CompareWindow() {
      this.create();
      this.firstZoom = 12;
      this.firstData = {};
      this.secondData = {};
      this.search_url = "/json/generated_data/google_names_cache/";
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

      $('div#map').prepend(this.div);
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
    	this.firstZoom = zoom;
    	// Reset graphs containers
      $('div.stats_slider').empty();
    	//Reset
    	this.resetSearch();
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


    CompareWindow.prototype.compareSecondRegion = function(formatted_address) {
      var me = this;
      $.ajax({
        method: "GET",
        dataType: 'json',
        url: me.search_url+'/'+formatted_address+'.json',
        success: function(info) {
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
        },
        error: function(error) {
          $('div#comparewindow p.refer').text('No hemos encontrado la localidad, prueba con otra');
        }
      });
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
          var max = Math.max(Math.abs(info['data'][year][ele+'_min']),Math.abs(info['data'][year][ele+'_max']));
          
          if ($('div.stats_slider div[alt="'+i+'"].up').length>0) {
            $('div.stats_slider div[alt="'+i+'"].up').append(
              '<span style="width:'+((Math.abs(info['data'][year][ele]*width))/max)+'px" class="bar '+((info['data'][year][ele]>0)?'positive':'negative')+' second"></span>'
            );
          } else {
            $('div.stats_slider').append(
              '<div alt="'+i+'" class="up block">'+
                '<h3>% '+i+'</h3>'+
                '<span style="width:'+((Math.abs(info['data'][year][ele]*width))/max)+'px" class="bar '+((info['data'][year][ele]>0)?'positive':'negative')+' first"></span>'+
                '<a class="evolucion" href="#ver_evolucion">ver evolución</a>'+
              '</div>'
            );
          }
        } else {
          if ($('div.stats_slider div[alt="'+i+'"]').length==0) {
            $('div.stats_slider').append(
              '<div alt="'+i+'" class="up block">'+
                '<h3>% '+i+'</h3>'+
                '<a class="evolucion" href="#ver_evolucion">ver evolución</a>'+
              '</div>'
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
              '<img class="second" src="'+src+'" title="" alt="Evolución '+year+' '+i+'"/>'
            );
          } else {
            var src = createImage(info,ele,false);
            $('div.stats_slider').append(
              '<div alt="'+i+'" class="down block">'+
                '<h3>% '+i+'</h3>'+
                '<a class="resumen" href="#ver_resumen">ver resumen</a>'+
                '<img class="first" src="'+src+'" />'+
              '</div>'
            );
          }

        } else {
          if ($('div.stats_slider div[alt="'+i+'"].down').length==0) {
            $('div.stats_slider').append(
              '<div alt="'+i+'" class="down block">'+
                '<h3>% '+i+'</h3>'+
                '<a class="resumen" href="#ver_resumen">ver resumen</a>'+
              '</div>'
            );
          }
        }
      });
      
    }
    
    
    
    /*Auxiliar function to get evolution image */
    function createImage(info,ele,second) {
      /* create graph */
      var max = 0; var count = 0; var find = false; var find_year;
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
          if (Math.abs(parseFloat(info['data'][i][ele]))>max) max = Math.ceil(Math.abs(parseFloat(info['data'][i][ele])));
          param += info['data'][i][ele] + ',';
        } else {
          param += '0,';
        }
        count++;
      }
      param = param.substring(0, param.length-1);
      
      if (second) {
        return 'http://chart.apis.google.com/chart?chf=bg,s,FFFFFF00&chs=280x100&cht=ls&chco=FF6600&chds=-'+max+','+max+'&chd=t:'+param+'&chdlp=b&chls=1&chm=o,FF6600,0,'+find_year+',8&chma=3,3,3,3';
      } else {
        return 'http://chart.apis.google.com/chart?chf=bg,s,FFFFFF00&chs=280x100&cht=ls&chco=666666&chds=-'+max+','+max+'&chd=t:'+param+'&chdlp=b&chls=1&chm=o,666666,0,'+find_year+',8&chma=3,3,3,3';
      }
    }
    
    