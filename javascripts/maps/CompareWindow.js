

  function CompareWindow(latlng, map) {
    this.latlng_ = latlng;
  	this.information = {};
  	this.spain_id = 0;
  	this.map_ = map;
    this.offsetVertical_ = -353;
    this.offsetHorizontal_ = -178;
    this.height_ = 365;
    this.width_ = 356;
    this.setMap(map);
  }


  CompareWindow.prototype = new google.maps.OverlayView();


  CompareWindow.prototype.draw = function() {
		
    var me = this;
  	var num = 0;

    var div = this.div_;
    if (!div) {
      div = this.div_ = document.createElement('div');
      div.setAttribute('id','comparewindow');


      // Inner HTML
      var inner_comparewindow =
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
          '<p class="info">Su población es <a href="#">8 años mas jóven</a> que la media de edad nacional</p>'+
          '<img src="http://chart.apis.google.com/chart?chf=bg,s,FFFFFF00&chs=205x22&cht=ls&chco=8B1F72&chds=-80,97.828&chd=t:97.277,-48.793,58.405,97.828,94.565&chdlp=b&chg=0,50,0,0&chls=1" class="sparklines" />'+
          '<a class="compare">Comparar</a>'+
        '</div>';
      div.innerHTML = inner_comparewindow;
    

      var panes = this.getPanes();
      panes.floatPane.appendChild(div);
    
      /*Infowindow events*/
      $('a.close_infowindow').click(function(ev){try{ev.stopPropagation();}catch(e){event.cancelBubble=true;};me.hide();});
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

  CompareWindow.prototype.remove = function() {
    if (this.div_) {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }
  };



  CompareWindow.prototype.setPosition = function(latlng,occ_offset,info) {
  	var me = this;
  	var div = this.div_;
  	this.latlng_ = latlng;
	
  	if (info.municipio != undefined) {
      $('div#infowindow h2').text(info.municipio);
      $('div#infowindow p.province').text(info.provincia+', '+info.censo_total+' habitantes');
      $('div#infowindow div.stats h4').text(info.abs_value+'% de participación');
    
      $('div#infowindow div.stats div.partido:eq(0) span').width((info.primer_partido_percent*175)/100);
      $('div#infowindow div.stats div.partido:eq(0) p').text('--- ('+info.primer_partido_percent+'%)');

      $('div#infowindow div.stats div.partido:eq(1) span').width((info.segundo_partido_percent*175)/100);
      $('div#infowindow div.stats div.partido:eq(1) p').text('--- ('+info.segundo_partido_percent+'%)');

      $('div#infowindow div.stats div.partido:eq(2) span').width((info.tercer_partido_percent*175)/100);
      $('div#infowindow div.stats div.partido:eq(2) p').text('--- ('+info.tercer_partido_percent+'%)');

      $('div#infowindow div.stats div.partido:eq(3) span').width((info.otros_partido_percent*175)/100);
      $('div#infowindow div.stats div.partido:eq(3) p').text('--- ('+info.otros_partido_percent+'%)');
    
      //$('div#infowindow div.sparklines').empty();
      $('img.sparklines')
        .attr('src','http://chart.apis.google.com/chart?chxl=0:|x|x|x|x|x|x|1:|100|50|0&chxt=x,y&chs=205x20&cht=lc&chd=s:AA,ASms297wzuowqytmbSKA&chg=25,50&chls=0.75,-1,-1|2,4,1&chm=o,FF9900,1,-2,8|b,3399CC44,0,1,0');
  	}

	
	
    var pixPosition = me.getProjection().fromLatLngToDivPixel(me.latlng_);
    if (pixPosition) {
  	  div.style.left = (pixPosition.x + me.offsetHorizontal_) + "px";
  	  div.style.top = (pixPosition.y + me.offsetVertical_ - occ_offset) + "px";
    }
    this.moveMaptoOpen();	
  	this.show();
  }


  CompareWindow.prototype.hide = function() {
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


  CompareWindow.prototype.show = function() {
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


  CompareWindow.prototype.moveMaptoOpen = function() {
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
