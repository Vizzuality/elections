

    function InfoWindow(latlng, map) {
      this.latlng_ = latlng;
    	this.information = {};
    	this.spain_id = 0;
    	this.map_ = map;
      this.offsetVertical_ = -266;
      this.offsetHorizontal_ = -127;
      this.height_ = 289;
      this.width_ = 254;
      this.setMap(map);
      this.oldPar1 = "";
      this.oldPar2 = "";
      this.oldPar3 = "";
    }


    InfoWindow.prototype = new google.maps.OverlayView();


    InfoWindow.prototype.draw = function() {

      var me = this;
    	var num = 0;

      var div = this.div_;
      if (!div) {
        div = this.div_ = document.createElement('div');
        div.setAttribute('id','infowindow');
        div.setAttribute('class','infowindow');


        // Inner HTML
        var inner_infowindow =
          '<a class="close_infowindow"></a>'+
          '<div class="top">'+
            '<h2>Alaejos</h2>'+
            '<p class="province">Valladolid, 11.982 habitantes.</p>'+
            '<div class="stats">'+
              '<h4>65% de participación</h4>'+
              '<div class="partido psoe"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>PSOE (61%)</p></div>'+
              '<div class="partido pp"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>PP (36%)</p></div>'+
              '<div class="partido iu"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>IU (12%)</p></div>'+
              '<div class="partido otros"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>OTROS (61%)</p></div>'+
            '</div>'+
          '</div>'+
          '<div class="bottom">'+
            '<p class="info">La region tiene <strong></strong> de la media en España.</p>'+
            '<div class="chart">'+
              '<img title="" alt="Chart de región" />'+
            '</div>'+
            '<a class="compare">Comparar</a>'+
          '</div>'+
          '<div class="footer">'+
          '</div>';

        div.innerHTML = inner_infowindow;


        var panes = this.getPanes();
		    panes.floatPane.appendChild(div);

		    /*Infowindow events*/
		    $('div#infowindow a.close_infowindow').click(function(ev){try{ev.stopPropagation();}catch(e){event.cancelBubble=true;};me.hide();});
		    $('div#infowindow a.compare').click(function(ev){try{ev.stopPropagation();}catch(e){event.cancelBubble=true;};me.openCompare();});


        google.maps.event.addDomListener(div,'mousedown',function(ev){
          try { ev.stopPropagation(); } catch(e) { event.cancelBubble=true; };
        });
        google.maps.event.addDomListener(div,'click',function(ev){
          try { ev.stopPropagation(); } catch(e) { event.cancelBubble=true; };
        });
        google.maps.event.addDomListener(div,'dbclick',function(ev){
          try { ev.stopPropagation(); } catch(e) { event.cancelBubble=true; };
        });
      }

    	var pixPosition = me.getProjection().fromLatLngToDivPixel(me.latlng_);
      if (pixPosition) {
    	  div.style.width = me.width_ + 'px';
    	  div.style.left = (pixPosition.x + me.offsetHorizontal_) + 'px';
    	  div.style.height = me.height_ + 'px';
    	  div.style.top = (pixPosition.y + me.offsetVertical_ - (($(div).css('opacity') == 1)? 10 : 0)) + 'px';
    	  console.log(div.style.top);
      }
    };


    InfoWindow.prototype.remove = function() {
      if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
      }
    };


    InfoWindow.prototype.setPosition = function(latlng,occ_offset,info) {
    	var me = this;
    	var div = this.div_;
    	this.latlng_ = latlng;
    	this.information = info;
    	this.actualZoom = peninsula.getZoom();

    	//Hide char image.
    	$('div#infowindow div.chart img').hide();

    	if (info['data'][year][normalization[compare]]!=null) {
    	  //Set dimensions and bkg first
    	  this.offsetVertical_ = -266;
        this.offsetHorizontal_ = -127;
        this.height_ = 289;
        this.width_ = 254;
        $('div#infowindow').css({background:'none'});
        $('div#infowindow div.top').css({background:'url("images/infowindow_top.png") no-repeat 0 0'});
      } else {
        this.offsetVertical_ = -236;
        this.offsetHorizontal_ = -127;
        this.height_ = 269;
        this.width_ = 254;
        $('div#infowindow').css({background:'url("images/infowindow_error_bkg.png") no-repeat 0 0'});
      }


      $('div#infowindow h2').html(info.name + " <span class='year'>"+year+"</span>");
      $('div#infowindow p.province').text(((info.provincia!=undefined)?(info.provincia+', '):'')+info['data'][year]['censo_total']+' habitantes');
      $('div#infowindow div.stats h4').text(parseFloat(info['data'][year]['percen_participacion']).toFixed(0)+'% de participación');

      // Remove previous political style bars
      $('div#infowindow div.stats div.partido').each(function(i,ele){
        $(ele).removeClass(parties.join(" ") + ' par1 par2 par3');
      });
      var bar_width;

      // First political party
      var partido_1 = normalizePartyName(info['data'][year]['primer_partido_name']);
      if (_.indexOf(parties, partido_1) !== -1) {
        $('div#infowindow div.stats div.partido:eq(0)').addClass(partido_1);
        this.oldPar1 = partido_1;
      } else {
        $('div#infowindow div.stats div.partido:eq(0)').addClass('par1');
        this.oldPar1 = "par1";
      }
      bar_width = normalizeBarWidth((info['data'][year]['primer_partido_percent']*175)/100);
      $('div#infowindow div.stats div.partido:eq(0) span.c').width((bar_width<2)?2:bar_width);
      $('div#infowindow div.stats div.partido:eq(0) p').text(info['data'][year]['primer_partido_name']+' ('+info['data'][year]['primer_partido_percent']+'%)');

      // Second political party
      var partido_2 = normalizePartyName(info['data'][year]['segundo_partido_name']);
      if (_.indexOf(parties, partido_2) !== -1) {
        $('div#infowindow div.stats div.partido:eq(1)').addClass(partido_2);
        this.oldPar2 = partido_2;
      } else {
        $('div#infowindow div.stats div.partido:eq(1)').addClass('par2');
        this.oldPar2 = "par2";
      }
      bar_width = normalizeBarWidth((info['data'][year]['segundo_partido_percent']*175)/100);
      $('div#infowindow div.stats div.partido:eq(1) span.c').width((bar_width<2)?2:bar_width);
      $('div#infowindow div.stats div.partido:eq(1) p').text(info['data'][year]['segundo_partido_name']+' ('+info['data'][year]['segundo_partido_percent']+'%)');

      // Third political party
      var partido_3 = normalizePartyName(info['data'][year]['tercer_partido_name']);
      if (_.indexOf(parties, partido_3) !== -1) {
        $('div#infowindow div.stats div.partido:eq(2)').addClass(partido_3);
        this.oldPar3 = partido_3;
      } else {
        $('div#infowindow div.stats div.partido:eq(2)').addClass('par3');
        this.oldPar3 = "par3";
      }

      bar_width = normalizeBarWidth((info['data'][year]['tercer_partido_percent']*175)/100);
      $('div#infowindow div.stats div.partido:eq(2) span.c').width((bar_width<2)?2:bar_width);
      $('div#infowindow div.stats div.partido:eq(2) p').text(info['data'][year]['tercer_partido_name']+' ('+info['data'][year]['tercer_partido_percent']+'%)');

      // Other
      bar_width = normalizeBarWidth((info['data'][year]['otros_partido_percent']*175)/100);
      $('div#infowindow div.stats div.partido:eq(3) span.c').width((bar_width<2)?2:bar_width);
      $('div#infowindow div.stats div.partido:eq(3) p').text('OTROS ('+info['data'][year]['otros_partido_percent']+'%)');


      if (info['data'][year][normalization[compare]]!=null) {
    	  var max = 0; var count = 0; var find = false; var find_year; var new_no_data = 0; var start = false;
        var paro = "";

        var minYear = 1987; // 1987
        var maxYear = 2012; // 2012

        minGraphYear = 1987;
        var electionYears = [1987,1991,1995,1999,2003,2007,2011];
        var chartBackgroundTopPadding = 33 * _.indexOf(electionYears, minGraphYear);

        for (var i = minYear; i < maxYear; i++) {
          if (info['data'][i]!=undefined && info['data'][i][normalization[compare]] != undefined) {
            if (!find) {
              if (year == i) {
                find = true;
                find_year = count;
              }
            }
            if (!start) {
              start = true;
            }
            if (Math.abs(parseFloat(info['data'][i][normalization[compare]]))>max) max = Math.ceil(Math.abs(parseFloat(info['data'][i][normalization[compare]])));
            paro += info['data'][i][normalization[compare]] + ',';
            count++;
          } else {
            if (start) {
              new_no_data ++;
            }
          }
        }

        paro = paro.substring(0, paro.length-1);
        var selected_value  = Math.abs(parseFloat(info['data'][year][normalization[compare]]).toFixed(2));
        var comparison_variable = normalization[compare];
        var info_text = textInfoWindow[comparison_variable];
        var sign = (selected_value < 0) ? "negative" : "positive";
        var text = info_text["before_"+sign] + " <strong>"+Math.abs(selected_value)+"</strong>" + info_text["after_" + sign];

        text = _.template(text)({media : '42'}); // TODO: change with the real media

        $('div#infowindow div.chart').show();
        $('div#infowindow div.chart').css("backgroundPosition", "0 -" + chartBackgroundTopPadding + "px");
        $('div#infowindow div.chart img').attr('src','http://chart.apis.google.com/chart?chf=bg,s,FFFFFF00&chs='+((count*8)+10)+'x22&cht=ls&chco=8B1F72&chds=-'+max+','+max+'&chd=t:'+paro+'&chdlp=b&chls=1&chm=o,8B1F72,0,'+find_year+',6&chma=5,0,5,0');
        $('div#infowindow div.chart img').css({margin:'0 '+(new_no_data*7)+'px 0 0'});
        $('div#infowindow div.chart img').show();
        $('div#infowindow p.info').html(text);
      } else {
        $('div#infowindow p.info').html('No hay datos sobre '+ compare + ' en este municipio. <a href="#">¿Por qué?</a>');
        $('div#infowindow div.chart').hide();
      }


      var pixPosition = me.getProjection().fromLatLngToDivPixel(me.latlng_);
      if (pixPosition) {
    	  div.style.left = (pixPosition.x + me.offsetHorizontal_) + "px";
    	  div.style.top = (pixPosition.y + me.offsetVertical_ - occ_offset) + "px";
      }
      this.moveMaptoOpen();
    	this.show();
    }


    InfoWindow.prototype.hide = function() {
      if (this.div_) {
        var div = this.div_;
        $(div).stop().animate({
          top: '+=' + 10 + 'px',
          opacity: 0
        }, 100, 'swing', function(ev){
    			div.style.visibility = "hidden";
    		});
      }
    }


    InfoWindow.prototype.show = function() {
      if (this.div_) {
        var div = this.div_;
    		$(div).css({opacity:0});
    		div.style.visibility = "visible";

        $(div).stop().animate({
          top: '-=' + 10 + 'px',
          opacity: 1
        }, 250, 'swing');
    	}
    }

    InfoWindow.prototype.isOpen = function() {
      return this.div_.style.visibility == "visible";
  	}


    //TODO: ANIMAR EL CAMBIO EN LAS BARRAS
    InfoWindow.prototype.updateValues = function() {

      if (this.div_) {
        var partido_1 = normalizePartyName(this.information['data'][year]['primer_partido_name']);
        $('div#infowindow div.stats div.partido:eq(0)').removeClass(parties.join(" ") + ' par1 par2 par3');
        if (_.indexOf(parties, partido_1) !== -1) {
          $('div#infowindow div.stats div.partido:eq(0)').addClass(partido_1);
        } else if(this.oldPar1 != partido_1) {
          $('div#infowindow div.stats div.partido:eq(0)').addClass('par1');
        }
        bar_width = normalizeBarWidth((this.information['data'][year]['primer_partido_percent']*175)/100);
        $('div#infowindow div.stats div.partido:eq(0) span.c').animate({
          width: bar_width.toString() +"px"
        }, 500, 'easeOutCubic');
        $('div#infowindow div.stats div.partido:eq(0) p').text(this.information['data'][year]['primer_partido_name']+' ('+this.information['data'][year]['primer_partido_percent']+'%)');


        var partido_2 = normalizePartyName(this.information['data'][year]['segundo_partido_name']);
        $('div#infowindow div.stats div.partido:eq(1)').removeClass(parties.join(" ") + ' par1 par2 par3');
        if (_.indexOf(parties, partido_2) !== -1) {
          $('div#infowindow div.stats div.partido:eq(1)').addClass(partido_2);
        } else if(this.oldPar2 != partido_2) {
          $('div#infowindow div.stats div.partido:eq(1)').addClass('par2');
        }
        bar_width = normalizeBarWidth((this.information['data'][year]['segundo_partido_percent']*175)/100);
        $('div#infowindow div.stats div.partido:eq(1) span.c').animate({
          width: bar_width.toString() +"px"
        }, 500, 'easeOutCubic');
        $('div#infowindow div.stats div.partido:eq(1) p').text(this.information['data'][year]['segundo_partido_name']+' ('+this.information['data'][year]['segundo_partido_percent']+'%)');

        var partido_3 = normalizePartyName(this.information['data'][year]['tercer_partido_name']);
        $('div#infowindow div.stats div.partido:eq(2)').removeClass(parties.join(" ") + ' par1 par2 par3');
        if (_.indexOf(parties, partido_3) !== -1) {
          $('div#infowindow div.stats div.partido:eq(2)').addClass(partido_3);
        } else if(this.oldPar3 != partido_3) {
          $('div#infowindow div.stats div.partido:eq(2)').addClass('par3');
        }
        bar_width = normalizeBarWidth((this.information['data'][year]['tercer_partido_percent']*175)/100);
        $('div#infowindow div.stats div.partido:eq(2) span.c').animate({
          width: bar_width.toString() +"px"
        }, 500, 'easeOutCubic');
        $('div#infowindow div.stats div.partido:eq(2) p').text(this.information['data'][year]['tercer_partido_name']+' ('+this.information['data'][year]['tercer_partido_percent']+'%)');

        bar_width = normalizeBarWidth((this.information['data'][year]['otros_partido_percent']*175)/100);
        $('div#infowindow div.stats div.partido:eq(3) span.c').width((bar_width<2)?2:bar_width);
        $('div#infowindow div.stats div.partido:eq(3) p').text('OTROS ('+this.information['data'][year]['otros_partido_percent']+'%)');

        var selected_value  = Math.abs(parseFloat(this.information['data'][year][normalization[compare]]).toFixed(2));
        var comparison_variable = normalization[compare];
        var info_text = textInfoWindow[comparison_variable];
        var sign = (selected_value < 0) ? "negative" : "positive";
        var text = info_text["before_"+sign] + " <strong>"+Math.abs(selected_value)+"</strong>" + info_text["after_" + sign];

        //TODO: FALTA CAMBIAR LA BOLITA DE POSICIÓN

        $('div#infowindow p.info').html(text);

    	}
    }


    InfoWindow.prototype.openCompare = function() {
      this.hide();
      if (comparewindow.isVisible()) {
        comparewindow.compareSecondRegion(this.information,this.actualZoom);
      } else {
        comparewindow.compareFirstRegion(this.information,this.actualZoom);
      }
    }


    InfoWindow.prototype.moveMaptoOpen = function() {
    	var left = 0;
    	var top = 0;

      var pixPosition = this.getProjection().fromLatLngToContainerPixel(this.latlng_);

    	if ((pixPosition.x + this.offsetHorizontal_) < 0) {
    		left = (pixPosition.x + this.offsetHorizontal_ - 20);
    	}

    	if ((pixPosition.x - this.offsetHorizontal_) >= ($('div#peninsula').width())) {
    		left = (pixPosition.x - this.offsetHorizontal_ - $('div#peninsula').width() + 20);
    	}

    	if ((pixPosition.y + this.offsetVertical_ - 40) < 0) {
    		top = (pixPosition.y + this.offsetVertical_ - 40);
    	}

    	this.map_.panBy(left,top);
    }
