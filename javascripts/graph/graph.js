
    // Graph global vars {#}
    var deep = "autonomias";
    var name = "España";
    var bar_width_multiplier = 140;
    var bar_min_size = 7;

    //Vars determining the center of the graph
    var offsetScreenX = 510;
    var offsetScreenY = 265;

    var graph_bubble_index = 100;
    var valuesHash = {};
    var possibleValues = {};
    var nBubbles = 0;

    var selectedBubble;

    var axisLegend, graphLegend, graphBubbleInfowindow, graphBubbleTooltip;

    jQuery.easing.def = "easeInOutCubic";

    function initializeGraph() {

      $(".innerBubble").live({
        mouseenter: function () {
          var radius = $(this).height()/2;
          var top = $(this).parent().css('top').replace('px','') - radius - 21;
          var left = $(this).parent().css('left').replace('px','');
          var text = $(this).parent().attr('id');
          graphBubbleTooltip.show(left,top,text);

          if (!$.browser.msie ) {
            $(this).parent().css('zIndex',graph_bubble_index++);
          }

          $(this).parent().children('.outerBubble').css("background","#333333");

          if (!graphBubbleInfowindow.isOpen() && selectedBubble !== $(this).parent().attr("id")) {
            $("div#" + selectedBubble + " div.outerBubble").css("background", "rgba(255,255,255,0.5)");
          }
        },
        mouseleave: function () {
          if (selectedBubble !== $(this).parent().attr("id")) {
            $(this).parent().children('.outerBubble').css("background","rgba(255,255,255,0.5)");
          }
          graphBubbleTooltip.hide();
        },
        click: function() {

          var radius = $(this).height()/2;
          var top  = $(this).parent().offset().top - 260;
          var left = $(this).parent().offset().left - 118;

          if (selectedBubble !== $(this).parent().attr("id")) {
            $("div#" + selectedBubble + " div.outerBubble").css("background", "rgba(255,255,255,0.5)");
          }

          selectedBubble = $(this).parent().attr("id");
          $("div#" + selectedBubble + " div.outerBubble").css("background", "#333");

          graphBubbleTooltip.hide();
          graphBubbleInfowindow.change(left,top,$(this).parent().attr('id'));
        }
      });

      // Bubble graph infowindow
      graphBubbleInfowindow = (function() {
        var open = false;

        //Create infowindow and add it to DOM
        $('body').append(
          '<div class="infowindow" id="graph_infowindow" style="visibility:hidden; z-index:1000">'+
          '  <a class="close_infowindow"></a>'+
          '  <div class="top">'+
          '    <h2>Alaejos</h2>'+
          '    <p class="province">11.982 habitantes.</p>'+
          '    <div class="stats">'+
          '      <h4>65% de participación</h4>'+
          '      <div class="partido"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>PSOE (61%)</p></div>'+
          '      <div class="partido"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>PP (36%)</p></div>'+
          '      <div class="partido"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>IU (12%)</p></div>'+
          '      <div class="partido otros"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>OTROS (11%)</p></div>'+
          '    </div>'+
          '  </div>'+
          '  <div class="bottom">'+
          '    <p class="info">Su población es <strong>8 años mas jóven</strong> que la media de edad nacional</p>'+
            '<div class="chart">'+
          '    <img src="http://chart.apis.google.com/chart?chf=bg,s,FFFFFF00&chs=205x22&cht=ls&chco=8B1F72&chds=-80,97.828&chd=t:97.277,-48.793,58.405,97.828,94.565&chdlp=b&chls=1&chm=o,8B1F72,0,5,6&chma=3,3,3,3" class="sparklines" />'+
          '  </div>'+
          '    <a class="more">Ver más</a>'+
          '    <a class="compare">Comparar</a>'+
          '  </div>'+
          '</div>');

          bindEvents();

        function isOpen() {
          return open;
        }

        function refreshInfowindow() {
          $('div#graph_infowindow').css({opacity:1,visibility:'visible'});
        }

        function showInfowindow(left, top) {
           if ( $.browser.msie ) {
             $('div#graph_infowindow').css({visibility:'visible',left:left+'px',top:top+'px'});
             $('div#graph_infowindow').show();
             open = true;
           } else {
             $('div#graph_infowindow').css({opacity:0,visibility:'visible',left:left+'px',top:top+'px'});
             $('div#graph_infowindow').stop().animate({ top: '-=' + 10 + 'px', opacity: 1 }, 250, 'swing', function(ev) {open = true;});
           }
        }

        function hideInfowindow() {
          if (isOpen()) {
           if ( $.browser.msie ) {

            $('div#graph_infowindow').hide();
             open = false;
             return;
           }

            $('div#graph_infowindow').stop().animate({ top: '+=' + 10 + 'px',
              opacity: 0
            }, 100, 'swing', function(ev){
              $('div#graph_infowindow').css({visibility:"hidden"});
              open = false;
            });
          }
        }

        function changeData(left,top,data_id) {
          if ($("#graph_infowindow").attr('alt')==data_id && isOpen()) {
            return false;
          }

          $("#graph_infowindow").attr('alt',data_id);
          $("#graph_infowindow").find(".top").find("h2").empty();
          $("#graph_infowindow").find(".top").find("h2").append(data_id.replace(/_/g,' '));

          $("#graph_infowindow a.more").show();

          if (deep == "autonomias") {
            $("#graph_infowindow a.more").text("Ver provincias");
          } else if (deep == "provincias") {
            $("#graph_infowindow a.more").text("Ver municipios");
          } else {
            $("#graph_infowindow a.more").hide();
          }

          $("#graph_infowindow").find(".top").find(".province").empty();
          $("#graph_infowindow").find(".top").find(".province").append(valuesHash[data_id]["censo_total"] + " habitantes");
          $("#graph_infowindow").find(".top").find(".stats").find("h4").empty();
          $("#graph_infowindow").find(".top").find(".stats").find("h4").append(Math.floor(parseInt(valuesHash[data_id]["porcentaje_participacion"])) + "% de participación");

          // First political party
          var partido_1 = normalizePartyName(valuesHash[data_id].partido_1[0]);
          c1 = $('div#graph_infowindow div.top div.stats div.partido:eq(0)').attr('class').split(" ");
          $.each(c1, function(c){
            if(c1[c] != "partido"){
              $('div#graph_infowindow div.top div.stats div.partido:eq(0)').removeClass(c1[c]);
            }
          })

          if (_.indexOf(parties, partido_1) !== -1) {
            $('div#graph_infowindow div.top div.stats div.partido:eq(0)').addClass(partido_1);
          } else {
            $('div#graph_infowindow div.top div.stats div.partido:eq(0)').addClass('par1');
          }
          bar_width = (valuesHash[data_id].partido_1[1]*bar_width_multiplier)/100;
          bar_width = (bar_width < bar_min_size && bar_width > 1) ? bar_min_size : bar_width;
          $('div#graph_infowindow div.top div.stats div.partido:eq(0) span').width((bar_width<2)?2:bar_width);
          $('div#graph_infowindow div.top div.stats div.partido:eq(0) p').text(valuesHash[data_id]["partido_1"][0]+' ('+(valuesHash[data_id]["partido_1"][1]*bar_width_multiplier)/100+'%)');

          // Second political party
          var partido_2 = normalizePartyName(valuesHash[data_id].partido_2[0]);
          c2 = $('div#graph_infowindow div.top div.stats div.partido:eq(1)').attr('class').split(" ");
          $.each(c2, function(c){
            if(c2[c] != "partido"){
              $('div#graph_infowindow div.top div.stats div.partido:eq(1)').removeClass(c2[c]);
            }
          })
          if (_.indexOf(parties, partido_2) !== -1) {
            $('div#graph_infowindow div.top div.stats div.partido:eq(1)').addClass(partido_2);
          } else {
            $('div#graph_infowindow div.top div.stats div.partido:eq(1)').addClass('par2');
          }
          bar_width = (valuesHash[data_id].partido_2[1]*bar_width_multiplier)/100;
          bar_width = (bar_width < bar_min_size && bar_width > 1) ? bar_min_size : bar_width;
          $('div#graph_infowindow div.top div.stats div.partido:eq(1) span').width((bar_width<2)?2:bar_width);
          $('div#graph_infowindow div.top div.stats div.partido:eq(1) p').text(valuesHash[data_id]["partido_2"][0]+' ('+(valuesHash[data_id]["partido_2"][1]*bar_width_multiplier)/100+'%)');

          // Third political party
          var partido_3 = normalizePartyName(valuesHash[data_id].partido_3[0]);
          c3 = $('div#graph_infowindow div.top div.stats div.partido:eq(2)').attr('class').split(" ");
          $.each(c3, function(c){
            if(c3[c] != "partido"){
              $('div#graph_infowindow div.top div.stats div.partido:eq(2)').removeClass(c3[c]);
            }
          })
          if (_.indexOf(parties, partido_3) !== -1) {
            $('div#graph_infowindow div.top div.stats div.partido:eq(2)').addClass(partido_3);
          } else {
            $('div#graph_infowindow div.top div.stats div.partido:eq(2)').addClass('par3');
          }
          bar_width = (valuesHash[data_id].partido_3[1]*bar_width_multiplier)/100;
          bar_width = (bar_width < bar_min_size && bar_width > 1) ? bar_min_size : bar_width;
          $('div#graph_infowindow div.top div.stats div.partido:eq(2) span').width((bar_width<2)?2:bar_width);
          $('div#graph_infowindow div.top div.stats div.partido:eq(2) p').text(valuesHash[data_id]["partido_3"][0]+' ('+(valuesHash[data_id]["partido_3"][1]*bar_width_multiplier)/100+'%)');

          // Other political party
          bar_width = (valuesHash[data_id].resto_partidos_percent * bar_width_multiplier)/100;
          bar_width = (bar_width < bar_min_size && bar_width > 1) ? bar_min_size : bar_width; $('div#graph_infowindow div.stats div.partido:eq(3) span').width((bar_width<2)?2:bar_width);
          $('div#graph_infowindow div.stats div.partido:eq(3) p').text('OTROS ('+valuesHash[data_id]["resto_partidos_percent"]+'%)');


          var data = valuesHash[data_id].evolution.split(",");
          console.log(data);
          var max = 0; var count = 0; var find = false; var find_year; var chartDataString = "";
          var minYear = 1975; var maxYear = 2011;

          var electionYears = [1987,1991,1995,1999,2003,2007,2011];

          var firstYearData = _.detect(data, function(num){ return num != 0; }); // index of the first year with information
          var firstYearIndex = _.indexOf(data, firstYearData); // first year with information
          var firstYear = 1975 + firstYearIndex; // first year with information

          var nextElectionYear = _.detect(electionYears, function(num){ return firstYear < num; }); // next election year to the firstYear
          var nextElectionYearIndex = _.indexOf(electionYears, nextElectionYear);                   // index of the next election year to the firstYear
          var startYearIndex = nextElectionYearIndex - 1;

          var chartBackgroundTopPadding = 33 * startYearIndex;

          for (var i = firstYearIndex; i <= data.length; i++) {
            if (data[i]!=undefined) {
              if (!find) {
                if (year - 1975 == i - 1 ) {
                  find = true;
                  find_year = count;
                }
              }
              if (Math.abs(parseFloat(data[i]))>max) max = Math.ceil(Math.abs(parseFloat(data[i])));
              chartDataString += data[i]+ ',';
            } else {
              chartDataString += '0,';
            }
            count++;
          }
          if (find_year == undefined && year == 2011) {
            find_year = count;
          }
          chartDataString = chartDataString.substring(0, chartDataString.length-1);

          $('div#graph_infowindow div.chart').css("backgroundPosition", "0 -" + chartBackgroundTopPadding + "px");
          $('div#graph_infowindow div.chart img').attr('src','http://chart.apis.google.com/chart?chf=bg,s,FFFFFF00&chs=205x22&cht=ls&chco=8B1F72&chds=-'+max+','+max+'&chd=t:' + chartDataString + '&chdlp=b&chls=1&chm=o,8B1F72,0,'+find_year+',6&chma=3,3,3,3');
          $('div#graph_infowindow div.chart img').show();

          showInfowindow(left,top);
        }

        function bindEvents() {

          $('div#graph_infowindow a.compare').click(function(ev){
            try{
              ev.stopPropagation();
            }
            catch(e){
              event.cancelBubble=true;
            };
            hideInfowindow();
          });

          $('div#graph_infowindow a.more').click(function(ev){
            ev.stopPropagation();
            ev.preventDefault();

            graphBubbleTooltip.hide();
            graphBubbleInfowindow.hide();

            var $selectedBubble = $("div#" + selectedBubble);
            var url = valuesHash[$selectedBubble.attr('id')].children_json_url;
            if (url == null) {
              return false;
            } else {
              goDeeper(url);
            }
          });

          $('div#graph_infowindow a.close_infowindow').click(function(ev){
            ev.stopPropagation();
            ev.preventDefault();
            hideInfowindow();

            if (selectedBubble !== undefined) {
              var $b = $("div#" + selectedBubble + " div.innerBubble");
              var radius = $b.height()/2;
              var top    = $b.parent().css('top').replace('px','') - radius - 21;
              var left   = $b.parent().css('left').replace('px','');
              var text   = $b.parent().attr('id');
              graphBubbleTooltip.show(left,top,text);
            }
          });
        }

        return {
          show: showInfowindow,
          hide: hideInfowindow,
          refresh: refreshInfowindow,
          change: changeData,
          isOpen: isOpen
        }
      }());

      // Tooltip when mouseover some bubble
      graphBubbleTooltip = (function() {
        // Create the element - add it to DOM
    	  $('div#graph_container').append('<p class="graph_bubble_tooltip">Comunidad de Madrid</p>');

    	  function hideTooltip() {
          $('p.graph_bubble_tooltip').hide();
    	  }

    	  function showTooltip(left,top,text) {
    	    $('p.graph_bubble_tooltip').text(text.replace(/_/g,' '));
    	    var offset = $('p.graph_bubble_tooltip').width()/2;
    	    $('p.graph_bubble_tooltip').css('left',left-offset+10+'px');
    	    $('p.graph_bubble_tooltip').css('top',top+'px');

    	    $('p.graph_bubble_tooltip').css('zIndex',graph_bubble_index);
          $('p.graph_bubble_tooltip').show();
    	  }

    	  return {
    	    hide: hideTooltip,
    	    show: showTooltip
    	  }
    	}());

      axisLegend = (function() {
        function updateLegend(info) {

          if (info != undefined) {
            $("#top_legend").fadeOut("fast", function() {
              $("#top_legend").text(info.legendTop);
              $("#top_legend").fadeIn("slow", function() {
              });
            });

            $("#bottom_legend").fadeOut("fast", function() {
              $("#bottom_legend").text(info.legendBottom);
              $("#bottom_legend").fadeIn("slow", function() {
              });
            });
          }
        }

        return {
          update: updateLegend
        }
      }());

    	graphLegend = (function() {
    	  // Create the element - add it to DOM
    	  $('div#graph_container').append(
      	  '<div class="graph_legend">'+
          '  <h2>Tasa de Paro en Palencia<sup>(2010)</sup></h2>'+
          '  <p class="autonomy"><a href="#">Castilla y León</a></p>'+
          '  <div class="stats">'+
              '<div class="partido psoe"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>PSOE (61%)</p></div>'+
              '<div class="partido pp"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>PP (36%)</p></div>'+
              '<div class="partido iu"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>IU (12%)</p></div>'+
              '<div class="partido otros"><div class="bar"><span></span></div><p>OTROS (11%)</p></div>'+
          '  </div>'+
            '<form>'+
              '<input class="text" type="text" value="Busca tu municipio"/>'+
              '<input class="submit" type="submit" value=""/>'+
            '</form>'+
            '<div class="search_error">'+
              '<h5>Ops! No hemos podido encontrar lo que buscas</h5>'+
              '<p>Comprueba que has escrito bien el nombre o prueba con otro</p>'+
              '<a class="close" href="#cerrar">Cerrar</a>'+
            '</div>'+
          '</div>');

        $('div.graph_legend div.search_error a.close').click(function(ev){
          ev.preventDefault();
          ev.stopPropagation();
          $(this).parent().fadeOut();
        });

        $('div.graph_legend form').submit(function(ev){
          ev.preventDefault();
          ev.stopPropagation();
          $('div.graph_legend div.search_error a.close').trigger('click');
          var value = $(this).children('input.text').val();
          addNewBubble(value);
        });

        $('div.graph_legend form input.text').focusin(function(){
          var value = $(this).val();
          if (value=="Busca tu municipio") {
            $(this).val('');
          }
        });

        $('div.graph_legend form input.text').focusout(function(){
          var value = $(this).val();
          if (value=="") {
            $(this).val('Busca tu municipio');
          }
        });

        function showLegend() {
          $('div.graph_legend').fadeIn();
        }

        function hideLegend() {
          $('div.graph_legend').fadeOut();
        }

        function hideFast() {
          $('div.graph_legend').hide();
          $('div.graph_legend div.search_error').hide();
        }

        function changeData(results,names,parent_url) {
          if (names.length>0) {
            if (names.length==1) {
              $('div.graph_legend h2').html($('div.select.selected span.inner_select a').text() + ' ' + names[0].replace(/_/g,' ') + '<sup>('+year+')</sup>').show();
              $('div.graph_legend p.autonomy a').text('España')
              $('div.graph_legend p.autonomy a').attr('href','#ver_España');
            } else {
              $('div.graph_legend h2').html($('div.select.selected span.inner_select a').text() + ' ' + names[1].replace(/_/g,' ') + '<sup>('+year+')</sup>').show();
              $('div.graph_legend p.autonomy a').text(names[0].replace(/_/g,' '));
              $('div.graph_legend p.autonomy a').attr('href','#ver_'+names[0].replace(/_/g,' '));
            }

            $('div.graph_legend p.autonomy').show();
            $('div.graph_legend p.autonomy a').unbind('click');
            $('div.graph_legend p.autonomy a').click(function(ev){
              ev.stopPropagation();
              ev.preventDefault();
              goDeeper(parent_url[parent_url.length-1]);
              graphBubbleTooltip.hide();
              graphBubbleInfowindow.hide();
            });

            $('div.graph_legend div.stats').show();

            // Remove previous political style bars
            $('div.graph_legend div.stats div.partido').each(function(i,ele){
              $(ele).removeClass(parties.join(" ") + ' par1 par2 par3');
            });
            var bar_width;

            // First political party
            var partido_1 = normalizePartyName(results['partido_1'][0]);

            if (_.indexOf(parties, partido_1) !== -1) {
              $('div.graph_legend div.stats div.partido:eq(0)').addClass(partido_1);
            } else {
              $('div.graph_legend div.stats div.partido:eq(0)').addClass('par1');
            }
            bar_width = (results['partido_1'][1]*bar_width_multiplier)/100;
            $('div.graph_legend div.stats div.partido:eq(0) span.c').width((bar_width<2)?2:bar_width);
            $('div.graph_legend div.stats div.partido:eq(0) p').text(results['partido_1'][0]+' ('+results['partido_1'][1]+'%)');

            // Second political party
            var partido_2 = normalizePartyName(results['partido_2'][0]);
            if (_.indexOf(parties, partido_2) !== -1) {
              $('div.graph_legend div.stats div.partido:eq(1)').addClass(partido_2);
            } else {
              $('div.graph_legend div.stats div.partido:eq(1)').addClass('par2');
            }
            bar_width = (results['partido_2'][1]*bar_width_multiplier)/100;
            $('div.graph_legend div.stats div.partido:eq(1) span.c').width((bar_width<2)?2:bar_width);
            $('div.graph_legend div.stats div.partido:eq(1) p').text(results['partido_2'][0]+' ('+results['partido_2'][1]+'%)');

            // Third political party
            var partido_3 = normalizePartyName(results['partido_3'][0]);
            if (_.indexOf(parties, partido_3) !== -1) {
              $('div.graph_legend div.stats div.partido:eq(2)').addClass(partido_3);
            } else {
              $('div.graph_legend div.stats div.partido:eq(2)').addClass('par3');
            }

            bar_width = (results['partido_3'][1]*bar_width_multiplier)/100;
            $('div.graph_legend div.stats div.partido:eq(2) span.c').width((bar_width<2)?2:bar_width);
            $('div.graph_legend div.stats div.partido:eq(2) p').text(results['partido_3'][0]+' ('+results['partido_3'][1]+'%)');

            // Other
            bar_width = (results['otros'][0]*bar_width_multiplier)/100;
            $('div.graph_legend div.stats div.partido:eq(3) span.c').width((bar_width<2)?2:bar_width);
            $('div.graph_legend div.stats div.partido:eq(3) p').text('OTROS ('+results['otros'][1]*bar_width_multiplier+'%)');
            showLegend();
          } else {
            showSearch();
          }
        }

        function showSearch() {
          $('div.graph_legend h2').hide();
          $('div.graph_legend div.stats').hide();
          $('div.graph_legend p.autonomy').hide();
          $('div.graph_legend').show();
        }

  	    return {
          hide: hideLegend,
          hideFast: hideFast,
          show: showLegend,
          change: changeData
    	  }
    	}());

      //Control resize window
      $(window).resize(function(){
        graphBubbleInfowindow.hide();
      });
    }

    /*GRAPH FUNCTIONS!*/

    function restartGraph() {
      graphLegend.hide();
      graph_bubble_index = 100;
      $('div#graph_container .bubbleContainer').remove();
      valuesHash = {};
      possibleValues = {};
      var url = "/json/generated_data/"+deep+"/"+((name=="España")?'':name+'_')+normalization[compare]+"_"+graph_hack_year[year]+".json";
      createBubbles(url);
    }


    function createBubbles(url){
      $.getJSON(url, function(data) {
        var one = true;
        possibleValues = data;
        count = 0;
        _.each(data, function(val, key) {
          //Check data for show legend or not
          if (count>19) {
            return false;
          }

          if (one) {
            graphLegend.change(data[key].parent_results, data[key].parent, data[key].parent_url);
            one = false;
          }

          valuesHash[key] = val;

            console.log(val);
          nBubbles = nBubbles+1;
          $('#graph_container').append('<div class="bubbleContainer" id="'+key+'"><div class="outerBubble"></div><div class="innerBubble"></div></div>');
          $('#'+key).css("left",(offsetScreenX).toString()+"px");
          $('#'+key).css("top",(offsetScreenY).toString()+"px");
          $('#'+key).css("opacity","0");
          $('#'+key).find('.innerBubble').css("backgroundColor",val["color"]);

          updateBubble('#'+key,offsetScreenX+parseInt(val["x_coordinate"]),offsetScreenY-parseInt(val["y_coordinate"]),val["radius"],val["color"]);
          count ++;
        });
      });
    }


    function setValue(url){
      $.getJSON(url, function(data) {
        var one = true;
        _.each(data, function(v,key) {
          //Check data for show legend or not
          if (one) {
            graphLegend.change(data[key].parent_results, data[key].parent, data[key].parent_url);
            one = false;
          }
          valuesHash[key] = v;
          updateBubble('#'+key,offsetScreenX+parseInt(v["x_coordinate"]),offsetScreenY-parseInt(v["y_coordinate"]),v["radius"],v["color"]);
        });
      });
    }

    //Function for update the values of the bubbles that are being visualized
    function updateBubble (bubble,x,y,val,c){
      var offset = Math.abs(parseInt($(bubble).find('.outerBubble').css('top')) + (parseInt($(bubble).find('.outerBubble').css('height')) - val) / 2)*-1;
      var dominantColor = (c.length == 1) ? c[0].toString() : c[0].toString();
      var backgroundColor = ((c != null) ? dominantColor : "purple");

      $(bubble).animate({
          left: x.toString() + "px",
          top: y.toString() + "px",
          opacity: 1
        }, 1000, function(){
          //console.log("ukelele");
      });

      $(bubble).find('.outerBubble').animate({
        height: val.toString() + "px",
        width: val.toString() + "px",
        top: offset.toString() + "px",
        left: offset.toString() + "px"
      }, 1000);


      $(bubble).find('.innerBubble').animate({
        height: (val-10).toString() + "px",
        width: (val-10).toString() + "px",
        top: (offset + 5).toString() + "px",
        left: (offset + 5).toString() + "px",
        backgroundColor: backgroundColor
      }, 1000);
      //$(bubble).find('.innerBubble').addClass();
    }


    function goDeeper(url){
      graphLegend.hide();
      //Get new name and deep
      var url_split = url.split('/');
      deep = url_split[2];
      var length = url_split[url_split.length-1].split(compare)[0].length;
      name = url_split[url_split.length-1].split(compare)[0].substring(0, length-1);
      if (name == "") {
        name = 'España';
      }
      changeHash();

      for (key in valuesHash){
        //Destroy Bubbles
        destroyBubble(key, url);
      }
    }


    function destroyBubble(b, url){
      (parseInt($("#"+b).css("left")) < offsetScreenX) ? displacementX = "-=30px" : displacementX = "+=30px";
      (parseInt($("#"+b).css("top")) < offsetScreenY) ? displacementY = "-=30px" : displacementY = "+=30px";
      $("#"+key).animate({
        left: displacementX,
        top: displacementY,
        opacity: "0"
      }, 500, function(){
          //console.log("Removing "+b);
          $("#"+b).remove();
          nBubbles=nBubbles-1;
          if(nBubbles==0){
            createBubbles(url);
          }
        }
      );
    }


    function addNewBubble(region) {
      region = region.replace(/ /g,'_');

      //Check the ball is in the graph
      if ($('div.bubbleContainer[id="'+region+'"]').length) {
        $('div.bubbleContainer[id="'+region+'"]').css({'z-index':graph_bubble_index});
        $('div.bubbleContainer[id="'+region+'"] div.outerBubble').css("background", "#333333");
      } else {
        var count = 0;
        _.each(possibleValues,function(val,key){
          if (key.toLowerCase() == region.toLowerCase()) {
            valuesHash[key] = val;
            count++;
            $('#graph_container').append("<div class='bubbleContainer' id='"+key+"'><div class='outerBubble'></div><div class='innerBubble'></div></div>");
            $('#'+key).css("left",(offsetScreenX).toString()+"px");
            $('#'+key).css("top",(offsetScreenY).toString()+"px");
            $('#'+key).css("zIndex",graph_bubble_index);
            $('#'+key).css("opacity","0");
            $('#'+key).find('.innerBubble').css("backgroundColor",val["color"]);
            updateBubble('#'+key,offsetScreenX+parseInt(val["x_coordinate"]),offsetScreenY-parseInt(val["y_coordinate"]),val["radius"],val["color"]);
          }
        });
        if (count==0) {
          var position = $('div.graph_legend form').position();
          $('div.graph_legend div.search_error').css({'left':'-30px','top':position.top+40+'px'});
          $('div.graph_legend div.search_error').fadeIn();
        }
      }
    }
