

    function CompareWindow() {
      this.create();
      this.firstZoom = 12;
      this.firstData = {};
      this.secondData = {};
      this.search_url = "/json/generated_data/google_names_cache/";
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
            '<div class="stats_slider">'+
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
    }


    CompareWindow.prototype.compareFirstRegion = function(info,zoom) {
      //console.log(info);
    	var me = this;
    	var div = this.div;
    	this.firstZoom = zoom;
    	//Reset
    	this.resetSearch();
      
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