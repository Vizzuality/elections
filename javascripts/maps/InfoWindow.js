

    function InfoWindow(latlng, map) {
      this.latlng_ = latlng;
    	this.information = {};
    	this.spain_id = 0;
    	this.map_ = map;
      this.offsetVertical_ = -276;
      this.offsetHorizontal_ = -127;
      this.height_ = 289;
      this.width_ = 254;
      this.setMap(map);
    }


    InfoWindow.prototype = new google.maps.OverlayView();


    InfoWindow.prototype.draw = function() {
				
      var me = this;
    	var num = 0;

      var div = this.div_;
      if (!div) {
        div = this.div_ = document.createElement('div');
        div.setAttribute('id','infowindow');


        // Inner HTML
        var inner_infowindow =
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
          '</div>'+
          '<div class="bottom">'+
            '<p class="info">Su población es <strong>8 años mas jóven</strong> que la media de edad nacional</p>'+
            '<img src="http://chart.apis.google.com/chart?chf=bg,s,FFFFFF00&chs=205x22&cht=ls&chco=8B1F72&chds=-80,97.828&chd=t:97.277,-48.793,58.405,97.828,94.565&chdlp=b&chls=1&chm=o,8B1F72,0,5,10" class="sparklines" />'+
            '<a class="compare">Comparar</a>'+
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
      }
    };

    InfoWindow.prototype.remove = function() {
      if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
      }
    };

    

    InfoWindow.prototype.setPosition = function(latlng,occ_offset,info) {
      //console.log(info);
      comparewindow.hide();
    	var me = this;
    	var div = this.div_;
    	this.latlng_ = latlng;
    	this.information = info;
    	
    	
    	if (info.municipio != undefined) {
        $('div#infowindow h2').text(info.municipio);
        $('div#infowindow p.province').text(((info.provincia!=undefined)?(info.provincia+', '):'')+info.censo_total+' habitantes');
        $('div#infowindow div.stats h4').text(parseFloat(info.percen_participacion).toFixed(0)+'% de participación');
        
        // Remove previous political style bars
        $('div#infowindow div.stats div.partido').each(function(i,ele){
          $(ele).removeClass('psoe pp iu par1 par2 par3');
        });
        var bar_width;
        
        
        // First political party
        var partido_1 = info.primer_partido_name.toLowerCase();
        if (partido_1=='psoe' || partido_1=="pp" || partido_1 == "iu") {
          $('div#infowindow div.stats div.partido:eq(0)').addClass(partido_1);
        } else {
          $('div#infowindow div.stats div.partido:eq(0)').addClass('par1');
        }
        bar_width = (info.primer_partido_percent*175)/100;
        $('div#infowindow div.stats div.partido:eq(0) span').width((bar_width<2)?2:bar_width);
        $('div#infowindow div.stats div.partido:eq(0) p').text(info.primer_partido_name+' ('+info.primer_partido_percent+'%)');

        // Second political party
        var partido_2 = info.segundo_partido_name.toLowerCase();
        if (partido_2=='psoe' || partido_2=="pp" || partido_2 == "iu") {
          $('div#infowindow div.stats div.partido:eq(1)').addClass(partido_2);
        } else {
          $('div#infowindow div.stats div.partido:eq(1)').addClass('par2');
        }
        bar_width = (info.segundo_partido_percent*175)/100;
        $('div#infowindow div.stats div.partido:eq(1) span').width((bar_width<2)?2:bar_width);
        $('div#infowindow div.stats div.partido:eq(1) p').text(info.segundo_partido_name+' ('+info.segundo_partido_percent+'%)');

        // Third political party
        var partido_3 = info.tercer_partido_name.toLowerCase();
        if (partido_3=='psoe' || partido_3=="pp" || partido_3 == "iu") {
          $('div#infowindow div.stats div.partido:eq(2)').addClass(partido_3);
        } else {
          $('div#infowindow div.stats div.partido:eq(2)').addClass('par3');
        }

        bar_width = (info.tercer_partido_percent*175)/100;
        $('div#infowindow div.stats div.partido:eq(2) span').width((bar_width<2)?2:bar_width);
        $('div#infowindow div.stats div.partido:eq(2) p').text(info.tercer_partido_name+' ('+info.tercer_partido_percent+'%)');

        // Other
        bar_width = (info.otros_partido_percent*175)/100;
        $('div#infowindow div.stats div.partido:eq(3) span').width((bar_width<2)?2:bar_width);
        $('div#infowindow div.stats div.partido:eq(3) p').text('OTROS ('+info.otros_partido_percent+'%)');
        
        var max = 0; var count = 0; var find = false;
        var paro = "";
        for (var i=1996; i<2010; i++) {
          if (info[normalization[compare]+'_'+i]!=undefined) {
            if (!find) {
              if (year==i) {
                find = true;
              }
              count++;
            }
            if (Math.abs(parseFloat(info[normalization[compare]+'_'+i]))>max) max = Math.ceil(Math.abs(parseFloat(info[normalization[compare]+'_'+i])));

            paro += info[normalization[compare]+'_'+i] + ',';
          }
        }
        paro = paro.substring(0, paro.length-1);

        
        $('img.sparklines').attr('src','http://chart.apis.google.com/chart?chf=bg,s,FFFFFF00&chs=205x22&cht=ls&chco=8B1F72&chds=-'+max+','+max+'&chd=t:'+paro+'&chdlp=b&chls=1&chm=o,8B1F72,0,'+count+',6&chma=3,3,3,3');
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
    
    
    InfoWindow.prototype.openCompare = function() {
      this.hide();
      comparewindow.compareFirstRegion(this.information);
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
	
    	if ((pixPosition.y + this.offsetVertical_ - 30) < 0) {
    		top = (pixPosition.y + this.offsetVertical_ - 30);
    	}
	
    	this.map_.panBy(left,top);
    }
