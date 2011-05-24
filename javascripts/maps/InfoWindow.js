
    function InfoWindow(latlng, map) {
      this.latlng_ = latlng;
      this.information = {};
      this.spain_id = 0;
      this.map_ = map;
      this.offsetVertical_ = -276;
      this.offsetHorizontal_ = -127;
      this.bar_width_multiplier = 140;
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
            '<p class="no_data">Lo sentimos, no tenemos datos de resultados para este municipio. Puedes verlos en la <a href="http://resultados2011.mir.es/99MU/DMU99000PR_L1.htm" target="_blank">web ministerio</a>.</p>'+
            '<div class="stats">'+
              '<h4>65% de participación</h4>'+
              '<div class="partido psoe"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>PSOE (61%)</p></div>'+
              '<div class="partido pp"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>PP (36%)</p></div>'+
              '<div class="partido iu"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>IU (12%)</p></div>'+
              '<div class="partido otros"><p><a href="http://resultados-elecciones.rtve.es/municipales/" target="_blank">OTROS DATOS  (61%)</a></p></div>'+
            '</div>'+
            '<div class="summary">'+
            '<h4>Municipios en los que es el más votado...</h4>'+
            '<ul>'+
              '<li class="partido psoe bar"><strong>00</strong><span>PSOE</span></li>'+
              '<li class="partido pp bar"><strong>00</strong><span>PP</span></li>'+
              '<li class="partido iu bar"><strong>00</strong><span>IU</span></li>'+
            '</ul>'+
            '</div>'+
          '</div>'+
          '<div class="bottom">'+
          '  <div class="tooltip"><span></span><div class="tip"></div></div>'+
            '<p class="info">La region tiene <strong></strong> de la media en España.</p>'+
            '<div class="chart">'+
              '<img title="" alt="Chart de región" />'+
            '</div>'+
            '<a href="#ver_provincias" class="goTo">Ver provincias</a>'+
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
        $('div#infowindow').delegate('.why_no_data','click',function(ev){ev.preventDefault(); try{ev.stopPropagation();}catch(e){event.cancelBubble=true;}; me.hide(); explanationwindow.show();});
        $('div#infowindow').delegate('.goTo','click',function(ev){
          ev.preventDefault();
          try{ev.stopPropagation();}catch(e){event.cancelBubble=true;};
          peninsula.panTo(me.latlng_);
          setTimeout(function(){
            var zoom = peninsula.getZoom();
            if (zoom==6) {
              peninsula.setZoom(7);
            } else if (zoom==7 || zoom==8) {
              peninsula.setZoom(11);
            }
          },500);
        });

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


    InfoWindow.prototype.drawTotalNumber = function(party_id, info, animated) {
      var me        = this;
      var id        = party_id - 1;
      var positions = ["primer", "segundo", "tercer", "otros"];
      var percent   = info.data[year][positions[id]+'_partido_total'];
      var partido   = "otros";
      var clase     = "otros";
      var $p = $('div#infowindow div.summary li.partido:eq('+id+')');

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


    InfoWindow.prototype.renderTotalNumber = function($div, id, value, name) {
      if (name != null) {
        $div.show();
        $div.find('strong').text(value);
        $div.find('span').text(name.toUpperCase());
      } else {
        $div.hide();
      }
    }


    InfoWindow.prototype.drawPartyBar = function(party_id, info) {
      var id = party_id - 1;
      var positions = ["primer", "segundo", "tercer"];
      var bar_width;
      var partido = "otros";
      
      if (party_id < 4) {
        if (info['data'][year][positions[id] +'_partido_name']!=undefined && info['data'][year][positions[id] +'_partido_name']!=null && info['data'][year][positions[id] +'_partido_name']!='null') {
          partido = info['data'][year][positions[id] +'_partido_name'];

          if (partido.length>13) {
            partido= partido.substr(0,10) + "...";
          }

          var partido_class = normalizePartyName(info['data'][year][positions[id] +'_partido_name']);

          if (_.indexOf(parties, partido_class) !== -1) {
            $('div#infowindow div.stats div.partido:eq('+id+')').addClass(partido_class);
          } else {
            $('div#infowindow div.stats div.partido:eq('+id+')').addClass('par'+party_id);
          }
          bar_width = normalizeBarWidth((info['data'][year][positions[id] + '_partido_percent']*this.bar_width_multiplier)/100);
          $('div#infowindow div.stats div.partido:eq('+id+') span.c').width((bar_width<2)?2:bar_width);
          $('div#infowindow div.stats div.partido:eq('+id+') p').text(partido+' ('+info['data'][year][positions[id]+'_partido_percent']+'%)');
          $('div#infowindow div.stats div.partido:eq('+id+')').show();
        } else {
          $('div#infowindow div.stats div.partido:eq('+id+')').hide();
        }

      } else {
        if (year>2006) {
          if (info.lavinia_url!=undefined) {
            var lavinia = (info.lavinia_url).split('|');
            $('div#infowindow div.stats div.partido:eq('+id+') p a').attr('href','http://resultados-elecciones.rtve.es/municipales/'+lavinia[0]+'/provincias/'+lavinia[1]+'/municipios/'+lavinia[2]+'/');
          } else {
            $('div#infowindow div.stats div.partido:eq('+id+') p a').attr('href','http://resultados-elecciones.rtve.es/');
          }
          $('div#infowindow div.stats div.partido:eq('+id+') p a').text('OTROS DATOS');
          $('div#infowindow div.stats div.partido:eq('+id+')').show();
        } else {
          $('div#infowindow div.stats div.partido:eq('+id+')').hide();
        }
      }

    }


    InfoWindow.prototype.setPosition = function(latlng,occ_offset,info) {
      var me = this;
      var div = this.div_;
      this.latlng_ = latlng;
      this.information = info;
      this.actualZoom = peninsula.getZoom();
      this.deep_level = getDeepLevelFromZoomLevel(this.actualZoom);

      //Hide char image.
      $('div#infowindow div.chart img').hide();

      $('div#infowindow h2').html(info.name);
      $('div#infowindow p.province').text(((info.provincia!=undefined)?(info.provincia+', '):'') + ((info['data'][year]['censo_total']!=undefined)?info['data'][year]['censo_total']+' habitantes':' '));


      if (info['data'][year]['primer_partido_name']!=undefined || info['data'][year]['primer_partido_name']!=null) {

        if (this.deep_level == "municipios") {
          $('div#infowindow div.stats h4').text(parseFloat(info['data'][year]['percen_participacion']).toFixed(0)+'% de participación, '+ graph_hack_year[year]);
        }

        // Remove previous political styles
        $('div#infowindow div.stats div.partido').each(function(i,ele){
          $(ele).removeClass(parties.join(" ") + ' par1 par2 par3');
        });

        $('div#infowindow div.summary li.partido').each(function(i,ele){
          $(ele).removeClass(parties.join(" ") + ' par1 par2 par3');
        });

        if (this.deep_level == "municipios") {

          for (var i = 1; i <= 4; i++) {
            this.drawPartyBar(i, info);
          }

          $('div#infowindow div.stats').show();
          $('div#infowindow div.summary').hide();
        } else {
          for (var i = 1; i <= 4; i++) {
            this.drawTotalNumber(i, info);
          }

          $('div#infowindow div.summary').show();
          $('div#infowindow div.stats').hide();
        }
        $('div#infowindow p.no_data').hide();
      } else {
        $('div#infowindow p.no_data').show();
        $('div#infowindow div.stats').hide();
      }

      if (info['data'][year][normalization[compare]]!=null) {
        $('div#infowindow div.chart').show();
        var statImage = this.generateStatImage();
        $('div#infowindow div.chart img').attr('src',statImage.url);
        $('div#infowindow div.chart img').css({margin:'0 '+(statImage.new_no_data*7)+'px 0 0'});
        $('div#infowindow div.chart img').show();

        var selected_value  = parseFloat(info['data'][year][normalization[compare]]).toFixed(2);
        var comparison_variable = normalization[compare];
        var info_text = textInfoWindow[comparison_variable];
        var sign = (selected_value < 0) ? "negative" : "positive";

        var text = info_text["before_"+sign] + " <strong>"+Math.abs(selected_value)+"</strong>" + info_text["after_" + sign];

        if (compare=="lineas adsl" || compare=="consumo prensa" || compare=="consumo tv") {
          if (max_min_avg[(normalization[compare])+'_'+year+'_avg']!=undefined) {
            var media = parseFloat(max_min_avg[(normalization[compare])+'_'+year+'_avg']).toFixed(2);
          } else {
            var media = parseFloat(max_min_avg[(normalization[compare])+'_'+lastAvailableYear()+'_avg']).toFixed(2);
          }
        } else {
          if (max_min_avg[(normalization[compare]).replace('_normalizado','')+'_'+year+'_avg']!=undefined) {
            var media = parseFloat(max_min_avg[(normalization[compare]).replace('_normalizado','')+'_'+year+'_avg']).toFixed(2);
          } else {
            var media = parseFloat(max_min_avg[(normalization[compare]).replace('_normalizado','')+'_'+lastAvailableYear()+'_avg']).toFixed(2);
          }
        }

        var last_year = lastAvailableYear();
        text = _.template(text)({media:media, yearSim: (last_year<year)?last_year:year});

        text = text + "<sup class='help'>1</sup>";

        $('div#infowindow div.chart').show();
        $('div#infowindow p.info').html(text);

        $('div#infowindow p.info').html(text);

        $('div#infowindow p.info sup.help').unbind('mouseenter').unbind('mouseleave');
        $('div#infowindow p.info sup.help').mouseenter(function(ev){

          var top = $('div#infowindow p.info sup.help').position().top;
          var left = $('div#infowindow p.info sup.help').position().left;
          var deep_text = {autonomias:"las autonomías", provincias:"las provincias", municipios:"los municipios"}

          var zoomLevelName = getDeepLevelFromZoomLevel(peninsula.getZoom());
          $('div#infowindow div.tooltip').css("top", top - 60);
          $('div#infowindow div.tooltip').css("left", left - 70);
          $('div#infowindow div.tooltip span').text("Desviación respecto a la media de " + deep_text[zoomLevelName]);
          $('div#infowindow div.tooltip').show();
        });
        $('div#infowindow p.info sup.help').mouseleave(function(ev){
          $('div#infowindow div.tooltip').hide();
        });

      } else {
				var msg = "";
				if (compare != "ninguna") {
					msg = 'No hay datos sobre '+ compare + ' en ';
					var zoomLevelName = getDeepLevelFromZoomLevel(peninsula.getZoom());
					if (zoomLevelName == 'autonomias') {
						msg += 'esta autonomía';
					} else if (zoomLevelName == 'provincias') {
						msg += 'esta provincia';
					} else {
						msg += 'este municipio';
					}
					msg += '. <a class="why_no_data" href="#porque">¿Por qué?</a>';
				} else {
				  msg = "Selecciona una variable en la zona superior para compararla con los datos electorales";
				}
        $('div#infowindow p.info').html(msg);
        $('div#infowindow div.chart').hide();
      }


      if (this.deep_level=="municipios") {
        $('div.infowindow a.goTo').hide();
      } else if (this.deep_level=="provincias") {
        $('div.infowindow a.goTo').text('Ver municipios');
        $('div.infowindow a.goTo').attr('href','#ver_municipios');
        $('div.infowindow a.goTo').show();
        $('div#infowindow div.summary').show();
      } else {
        $('div.infowindow a.goTo').text('Ver provincias');
        $('div.infowindow a.goTo').attr('href','#ver_provincias');
        $('div.infowindow a.goTo').show('Ver provincias');
        $('div#infowindow div.summary').show();
      }


      var pixPosition = me.getProjection().fromLatLngToDivPixel(me.latlng_);
      me.offsetVertical_ = - $('div#infowindow div.bottom').height() - $('div#infowindow div.footer').height() - $('div#infowindow div.top').height() - 10;

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
       if (ie_) {
         $(div).css({"visibility": "hidden"});
        } else {
          $(div).stop().animate({
            top: '+=' + 10 + 'px',
            opacity: 0
          }, 100, 'swing', function(ev){
            div.style.visibility = "hidden";
          });
        }
      }
    }


    InfoWindow.prototype.show = function() {
      if (this.div_) {
        var div = this.div_;
        if (ie_) {
          $(div).css({"visibility": "visible"});
        } else {
          $(div).css({opacity:0});
          div.style.visibility = "visible";

          $(div).stop().animate({
            top: '-=' + 10 + 'px',
            opacity: 1
          }, 250, 'swing');
        }


      }
    }


    InfoWindow.prototype.isOpen = function() {
      return this.div_.style.visibility == "visible";
    }


    InfoWindow.prototype.updateValues = function() {

      if (this.div_) {

        if (this.deep_level != "municipios") {

          $('div#infowindow div.summary li.partido').each(function(i,ele){
            $(ele).removeClass(parties.join(" ") + ' par1 par2 par3');
          });

          this.drawTotalNumber(1, this.information, true);
          this.drawTotalNumber(2, this.information, true);
          this.drawTotalNumber(3, this.information, true);
          this.drawTotalNumber(4, this.information, true);
        }

        else {
          $('div#infowindow p.province').text(((this.information.provincia!=undefined)?(this.information.provincia+', '):'')+ ((this.information['data'][year]['censo_total']!=undefined)?this.information['data'][year]['censo_total']+' habitantes':''));

          if (this.information['data'][year]['primer_partido_name']!=undefined && this.information['data'][year]['primer_partido_name']!=null && this.information['data'][year]['primer_partido_name']!='null') {
            $('div#infowindow div.stats h4').text(parseFloat(this.information['data'][year]['percen_participacion']).toFixed(0)+'% de participación, '+ graph_hack_year[year]);

            if (this.information['data'][year]['primer_partido_name']!=undefined && this.information['data'][year]['primer_partido_name']!=null && this.information['data'][year]['primer_partido_name']!='null') {
              var partido_1 = normalizePartyName(this.information['data'][year]['primer_partido_name']);
              $('div#infowindow div.stats div.partido:eq(0)').removeClass(parties.join(" ") + ' par1 par2 par3');
              if (_.indexOf(parties, partido_1) !== -1) {
                $('div#infowindow div.stats div.partido:eq(0)').addClass(partido_1);
              } else if(this.oldPar1 != partido_1) {
                $('div#infowindow div.stats div.partido:eq(0)').addClass('par1');
              }
              bar_width = normalizeBarWidth((this.information['data'][year]['primer_partido_percent']*this.bar_width_multiplier)/100);
              $('div#infowindow div.stats div.partido:eq(0) span.c').animate({
                width: bar_width.toString() +"px"
              }, 500, 'easeOutCubic');
              $('div#infowindow div.stats div.partido:eq(0) p').text(this.information['data'][year]['primer_partido_name']+' ('+this.information['data'][year]['primer_partido_percent']+'%)');
              $('div#infowindow div.stats div.partido:eq(0)').show();
            } else {
              $('div#infowindow div.stats div.partido:eq(0)').hide();
            }            
            
            
            if (this.information['data'][year]['segundo_partido_name']!=undefined && this.information['data'][year]['segundo_partido_name']!=null && this.information['data'][year]['primer_partido_name']!='null') {
              var partido_2 = normalizePartyName(this.information['data'][year]['segundo_partido_name']);
              $('div#infowindow div.stats div.partido:eq(1)').removeClass(parties.join(" ") + ' par1 par2 par3');
              if (_.indexOf(parties, partido_2) !== -1) {
                $('div#infowindow div.stats div.partido:eq(1)').addClass(partido_2);
              } else if(this.oldPar2 != partido_2) {
                $('div#infowindow div.stats div.partido:eq(1)').addClass('par2');
              }
              bar_width = normalizeBarWidth((this.information['data'][year]['segundo_partido_percent']*this.bar_width_multiplier)/100);
              $('div#infowindow div.stats div.partido:eq(1) span.c').animate({
                width: bar_width.toString() +"px"
              }, 500, 'easeOutCubic');
              $('div#infowindow div.stats div.partido:eq(1) p').text(this.information['data'][year]['segundo_partido_name']+' ('+this.information['data'][year]['segundo_partido_percent']+'%)');
              $('div#infowindow div.stats div.partido:eq(1)').show();
            } else {
              $('div#infowindow div.stats div.partido:eq(1)').hide();
            }


            if (this.information['data'][year]['tercer_partido_name']!=undefined && this.information['data'][year]['tercer_partido_name']!=null && this.information['data'][year]['primer_partido_name']!='null') {
              var partido_3 = normalizePartyName(this.information['data'][year]['tercer_partido_name']);
              $('div#infowindow div.stats div.partido:eq(2)').removeClass(parties.join(" ") + ' par1 par2 par3');
              if (_.indexOf(parties, partido_3) !== -1) {
                $('div#infowindow div.stats div.partido:eq(2)').addClass(partido_3);
              } else if(this.oldPar3 != partido_3) {
                $('div#infowindow div.stats div.partido:eq(2)').addClass('par3');
              }
              bar_width = normalizeBarWidth((this.information['data'][year]['tercer_partido_percent']*this.bar_width_multiplier)/100);
              $('div#infowindow div.stats div.partido:eq(2) span.c').animate({
                width: bar_width.toString() +"px"
              }, 500, 'easeOutCubic');
              $('div#infowindow div.stats div.partido:eq(2) p').text(this.information['data'][year]['tercer_partido_name']+' ('+this.information['data'][year]['tercer_partido_percent']+'%)');
              $('div#infowindow div.stats div.partido:eq(2)').show();
            } else {
              $('div#infowindow div.stats div.partido:eq(2)').hide();
            }

            if (year>2006) {
              if (this.information.lavinia_url!=undefined) {
                var lavinia = (this.information.lavinia_url).split('|');
                $('div#infowindow div.stats div.partido:eq(3) p a').attr('href','http://resultados-elecciones.rtve.es/municipales/'+lavinia[0]+'/provincias/'+lavinia[1]+'/municipios/'+lavinia[2]+'/');
              } else {
                $('div#infowindow div.stats div.partido:eq(3) p a').attr('href','http://resultados-elecciones.rtve.es/');
              }
              $('div#infowindow div.stats div.partido:eq(3) p a').text('OTROS DATOS');
              $('div#infowindow div.stats div.partido:eq(3)').show();
            } else {
              $('div#infowindow div.stats div.partido:eq(3)').hide();
            }

            $('div#infowindow p.no_data').hide();
            $('div#infowindow div.stats').show();
          } else {
            $('div#infowindow p.no_data').show();
            $('div#infowindow div.stats').hide();
          }
        }

        if (this.information['data'][year][normalization[compare]]!=null) {
          var selected_value  = parseFloat(this.information['data'][year][normalization[compare]]).toFixed(2);
          var comparison_variable = normalization[compare];
          var info_text = textInfoWindow[comparison_variable];
          var sign = (selected_value < 0) ? "negative" : "positive";
          var text = info_text["before_"+sign] + " <strong>"+Math.abs(selected_value)+"</strong>" + info_text["after_" + sign];


          if (compare=="lineas adsl" || compare=="consumo prensa" || compare=="consumo tv") {
            if (max_min_avg[(normalization[compare])+'_'+year+'_avg']!=undefined) {
              var media = parseFloat(max_min_avg[(normalization[compare])+'_'+year+'_avg']).toFixed(2);
            } else {
              var media = parseFloat(max_min_avg[(normalization[compare])+'_'+lastAvailableYear()+'_avg']).toFixed(2);
            }
          } else {
            if (max_min_avg[(normalization[compare]).replace('_normalizado','')+'_'+year+'_avg']!=undefined) {
              var media = parseFloat(max_min_avg[(normalization[compare]).replace('_normalizado','')+'_'+year+'_avg']).toFixed(2);
            } else {
              var media = parseFloat(max_min_avg[(normalization[compare]).replace('_normalizado','')+'_'+lastAvailableYear()+'_avg']).toFixed(2);
            }
          }

          var last_year = lastAvailableYear();
          text = _.template(text)({media : media, yearSim: (last_year<year)?last_year:year});
          // Change image url
          var statImage = this.generateStatImage();
          $('div#infowindow img').attr('src',statImage.url);
          $('div#infowindow div.chart').show();
        } else {
          var msg = "";
  				if (compare != "ninguna") {
  					msg = 'No hay datos sobre '+ compare + ' en ';
  					var zoomLevelName = getDeepLevelFromZoomLevel(peninsula.getZoom());
  					if (zoomLevelName == 'autonomias') {
  						msg += 'esta autonomía';
  					} else if (zoomLevelName == 'provincias') {
  						msg += 'esta provincia';
  					} else {
  						msg += 'este municipio';
  					}
  					msg += '. <a class="why_no_data" href="#porque">¿Por qué?</a>';
  				} else {
  				  msg = "Selecciona una variable en la zona superior para compararla con los datos electorales";
  				}
          $('div#infowindow p.info').html(msg);
          $('div#infowindow div.chart').hide();
        }

        $('div#infowindow p.info').html(text);

        var div = this.div_;
        var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
        this.offsetVertical_ = - $('div#infowindow div.bottom').height() - $('div#infowindow div.footer').height() - $('div#infowindow div.top').height() - 10;

        if (pixPosition) {
          div.style.left = (pixPosition.x + this.offsetHorizontal_) + "px";
          div.style.top = (pixPosition.y + this.offsetVertical_ - 15) + "px";
        }
      }
    }

    InfoWindow.prototype.openCompare = function() {
      this.hide();
      if (comparewindow.isVisible()) {
        comparewindow.compareSecondRegion(this.information, this.information.name);
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


    InfoWindow.prototype.generateStatImage = function() {
      var info = this.information;
      var max = 0; var count = 0; var find = false; var find_year; var new_no_data = 0; var start = false;
      var paro = "";

      var minYear = 1987; // 1987
      var maxYear = 2012; // 2012

      minGraphYear = 1987;
      var electionYears = [1987,1991,1995,1999,2003,2007,2011];

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

      return {'url':'http://chart.apis.google.com/chart?chf=bg,s,FFFFFF00&chs='+((count*8)+10)+'x22&cht=ls&chco=8B1F72&chds=-'+max+','+max+'&chd=t:'+paro+'&chdlp=b&chls=1&chm=o,8B1F72,0,'+find_year+',5&chma=5,0,5,0',
              'new_no_data': new_no_data};
    }
