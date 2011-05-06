

    function CompareWindow() {
      this.create();
      this.firstZoom = 12;
      this.firstData = {};
      this.secondData = {};
    }
    
    CompareWindow.prototype = {};
    
    
    CompareWindow.prototype.create = function() {
      var me = this;
      this.div = document.createElement('div');
      this.div.setAttribute('id','comparewindow');
      this.div.innerHTML =
        '<a class="close_infowindow"></a>'+
        '<div class="top">'+
          '<h2>Alaejos</h2>'+
          '<p class="province">Valladolid, 11.982 habitantes.</p>'+
          '<div class="stats">'+
            '<h4>65% de participación</h4>'+
            '<div class="partido psoe"><div class="bar"><span></span></div><p>PSOE (61%)</p></div>'+
            '<div class="partido pp"><div class="bar"><span></span></div><p>PP (36%)</p></div>'+
            '<div class="partido iu"><div class="bar"><span></span></div><p>IU (12%)</p></div>'+
            '<div class="partido otros"><div class="bar"><span></span></div><p>OTROS (11%)</p></div>'+
          '</div>'+
          '<div class="compare_graph">'+
            '<a href="#" class="left">left</a>'+
            '<a href="#" class="right">right</a>'+
          '</div>'+
        '</div>'+
        '<div class="bottom search">'+
          '<div class="search">'+
            '<h4>Selecciona otro lugar para comparar...</h4>'+
            '<form class="search_compare">'+
              '<input class="text" type="text" value="Busca una localidad..." />'+
              '<input class="submit" type="submit" value=""/>'+
            '</form>'+
            '<p class="refer">¿Te refieres a... <a href="#Almendralejo">Almendralejo, Extremadura</a>?</p>'+
          '</div>'+
          '<div class="region">'+
            '<h2>Alaejos</h2>'+
            '<p class="province">Valladolid, 11.982 habitantes.</p>'+
            '<div class="stats">'+
              '<h4>65% de participación</h4>'+
              '<div class="partido psoe"><div class="bar"><span></span></div><p>PSOE (61%)</p></div>'+
              '<div class="partido pp"><div class="bar"><span></span></div><p>PP (36%)</p></div>'+
              '<div class="partido iu"><div class="bar"><span></span></div><p>IU (12%)</p></div>'+
              '<div class="partido otros"><div class="bar"><span></span></div><p>OTROS (11%)</p></div>'+
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
    }
    
    CompareWindow.prototype.compareFirstRegion = function(info,zoom) {
      //console.log(info);
    	var me = this;
    	var div = this.div;
    	this.firstZoom = zoom;
    	//Reset
    	this.resetSearch();
    	
    	if (info.municipio != undefined) {
        $('div#comparewindow div.top h2').text(info.municipio);
        $('div#comparewindow div.top p.province').text(((info.provincia!=undefined)?(info.provincia+', '):'')+info.censo_total+' habitantes');
        $('div#comparewindow div.top div.stats h4').text(parseFloat(info.percen_participacion).toFixed(0)+'% de participación');
        
        // Remove previous political style bars
        $('div#comparewindow div.top div.stats div.partido').each(function(i,ele){
          $(ele).removeClass('psoe pp iu par1 par2 par3');
        });
        var bar_width;
        
        
        // First political party
        var partido_1 = info.primer_partido_name.toLowerCase();
        if (partido_1=='psoe' || partido_1=="pp" || partido_1 == "iu") {
          $('div#comparewindow div.top div.stats div.partido:eq(0)').addClass(partido_1);
        } else {
          $('div#comparewindow div.top div.stats div.partido:eq(0)').addClass('par1');
        }
        bar_width = (info.primer_partido_percent*175)/100;
        $('div#comparewindow div.top div.stats div.partido:eq(0) span').width((bar_width<2)?2:bar_width);
        $('div#comparewindow div.top div.stats div.partido:eq(0) p').text(info.primer_partido_name+' ('+info.primer_partido_percent+'%)');

        // Second political party
        var partido_2 = info.segundo_partido_name.toLowerCase();
        if (partido_2=='psoe' || partido_2=="pp" || partido_2 == "iu") {
          $('div#comparewindow div.top div.stats div.partido:eq(1)').addClass(partido_2);
        } else {
          $('div#comparewindow div.top div.stats div.partido:eq(1)').addClass('par2');
        }
        bar_width = (info.segundo_partido_percent*175)/100;
        $('div#comparewindow div.top div.stats div.partido:eq(1) span').width((bar_width<2)?2:bar_width);
        $('div#comparewindow div.top div.stats div.partido:eq(1) p').text(info.segundo_partido_name+' ('+info.segundo_partido_percent+'%)');

        // Third political party
        var partido_3 = info.tercer_partido_name.toLowerCase();
        if (partido_3=='psoe' || partido_3=="pp" || partido_3 == "iu") {
          $('div#comparewindow div.top div.stats div.partido:eq(2)').addClass(partido_3);
        } else {
          $('div#comparewindow div.top div.stats div.partido:eq(2)').addClass('par3');
        }
        bar_width = (info.tercer_partido_percent*175)/100;
        $('div#comparewindow div.top div.stats div.partido:eq(2) span').width((bar_width<2)?2:bar_width);
        $('div#comparewindow div.top div.stats div.partido:eq(2) p').text(info.tercer_partido_name+' ('+info.tercer_partido_percent+'%)');

        // Other
        bar_width = (info.otros_partido_percent*175)/100;
        $('div#comparewindow div.top div.stats div.partido:eq(3) span').width((bar_width<2)?2:bar_width);
        $('div#comparewindow div.top div.stats div.partido:eq(3) p').text('OTROS ('+info.otros_partido_percent+'%)');
 
    	}

      this.show();
    }
    
    
    CompareWindow.prototype.compareSecondRegion = function(formatted_address) {
      var query = query_search_municipio + " WHERE g.google_maps_name = '"+formatted_address+"' AND v.proceso_electoral_id = 73 ";
      $.ajax({
        method: "GET",
        dataType: 'jsonp',
        url: 'https://api.cartodb.com/v1',
        data: {sql:query,api_key:'8c587c9f93c36d146c9e66a29cc8a3499e869609'},
        success: function(data) {
          
          var info = data.rows[0];
          $('div#comparewindow div.bottom div.region h2').text(info.municipio);
          $('div#comparewindow div.bottom div.region p.province').text(((info.provincia!=undefined)?(info.provincia+', '):'')+info.censo_total+' habitantes');
          $('div#comparewindow div.bottom div.region div.stats h4').text(parseFloat(info.percen_participacion).toFixed(0)+'% de participación');

          // Remove previous political style bars
          $('div#comparewindow div.bottom div.region div.stats div.partido').each(function(i,ele){
            $(ele).removeClass('psoe pp iu par1 par2 par3');
          });
          var bar_width;

          // First political party
          var partido_1 = info.primer_partido_name.toLowerCase();
          if (partido_1=='psoe' || partido_1=="pp" || partido_1 == "iu") {
            $('div#comparewindow div.bottom div.region div.stats div.partido:eq(0)').addClass(partido_1);
          } else {
            $('div#comparewindow div.bottom div.region div.stats div.partido:eq(0)').addClass('par1');
          }
          bar_width = (info.primer_partido_percent*175)/100;
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(0) span').width((bar_width<2)?2:bar_width);
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(0) p').text(info.primer_partido_name+' ('+info.primer_partido_percent+'%)');

          // Second political party
          var partido_2 = info.segundo_partido_name.toLowerCase();
          if (partido_2=='psoe' || partido_2=="pp" || partido_2 == "iu") {
            $('div#comparewindow div.bottom div.region div.stats div.partido:eq(1)').addClass(partido_2);
          } else {
            $('div#comparewindow div.bottom div.region div.stats div.partido:eq(1)').addClass('par2');
          }
          bar_width = (info.segundo_partido_percent*175)/100;
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(1) span').width((bar_width<2)?2:bar_width);
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(1) p').text(info.segundo_partido_name+' ('+info.segundo_partido_percent+'%)');

          // Third political party
          var partido_3 = info.tercer_partido_name.toLowerCase();
          if (partido_3=='psoe' || partido_3=="pp" || partido_3 == "iu") {
            $('div#comparewindow div.bottom div.region div.stats div.partido:eq(2)').addClass(partido_3);
          } else {
            $('div#comparewindow div.bottom div.region div.stats div.partido:eq(2)').addClass('par3');
          }

          bar_width = (info.tercer_partido_percent*175)/100;
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(2) span').width((bar_width<2)?2:bar_width);
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(2) p').text(info.tercer_partido_name+' ('+info.tercer_partido_percent+'%)');

          // Other
          bar_width = (info.otros_partido_percent*175)/100;
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(3) span').width((bar_width<2)?2:bar_width);
          $('div#comparewindow div.bottom div.region div.stats div.partido:eq(3) p').text('OTROS ('+info.otros_partido_percent+'%)');

          $('div#comparewindow div.bottom').removeClass('search').addClass('region');
        },
        error: function(error) {
          $('div#comparewindow p.refer').text('No hemos encontrado la localidad, prueba otra por favor :(');
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
 