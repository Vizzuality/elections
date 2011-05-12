
    //Vars determining the center of the graph
    var offsetScreenX = 510;
    var offsetScreenY = 265;

    var graph_bubble_index = 100;
    var valuesHash = {};
    var nBubbles = 0;

    var selectedBubble;

    var graphLegend,graphBubbleInfowindow, graphBubbleTooltip;

    jQuery.easing.def = "easeInOutCubic";

    function initializeGraph() {

      $(".innerBubble").live({
        mouseenter: function () {
          console.log(graphBubbleInfowindow.isOpen());
          var radius = $(this).height()/2;
          var top = $(this).parent().css('top').replace('px','') - radius - 21;
          var left = $(this).parent().css('left').replace('px','');
          var text = $(this).parent().attr('id');
          graphBubbleTooltip.show(left,top,text);
          $(this).parent().css('zIndex',graph_bubble_index++);
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
        dblclick: function(){
          graphBubbleTooltip.hide();
          graphBubbleInfowindow.hide();

          var url = valuesHash[$(this).parent().attr('id')]["children_json_url"];
          if (url == null) {
            return false;
          } else {
            goDeeper(url);
          }
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
        },
      });

      // Bubble graph infowindow
      graphBubbleInfowindow = (function() {
        var open = false;

        //Create infowindow and add it to DOM
        $('body').append(
          '<div class="infowindow" id="graph_infowindow" style="z-index:1000">'+
          '  <a class="close_infowindow"></a>'+
          '  <div class="top">'+
          '    <h2>Alaejos</h2>'+
          '    <p class="province">11.982 habitantes.</p>'+
          '    <div class="stats">'+
          '      <h4>65% de participación</h4>'+
          '      <div class="partido"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>PSOE (61%)</p></div>'+
          '      <div class="partido"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>PP (36%)</p></div>'+
          '      <div class="partido"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>IU (12%)</p></div>'+
          '      <div class="partido"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>OTROS (11%)</p></div>'+
          '    </div>'+
          '  </div>'+
          '  <div class="bottom">'+
          '    <p class="info">Su población es <strong>8 años mas jóven</strong> que la media de edad nacional</p>'+
          '    <img src="http://chart.apis.google.com/chart?chf=bg,s,FFFFFF00&chs=205x22&cht=ls&chco=8B1F72&chds=-80,97.828&chd=t:97.277,-48.793,58.405,97.828,94.565&chdlp=b&chls=1&chm=o,8B1F72,0,5,6&chma=3,3,3,3" class="sparklines" />'+
          '    <a class="compare">Comparar</a>'+
          '  </div>'+
          '</div>');

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

        function isOpen() {
          return open;
        }

        function refreshInfowindow() {
          $('div#graph_infowindow').css({opacity:1,visibility:'visible'});
        }

        function showInfowindow(left, top) {
          $('div#graph_infowindow').css({opacity:0,visibility:'visible',left:left+'px',top:top+'px'});
          $('div#graph_infowindow').stop().animate({ top: '-=' + 10 + 'px', opacity: 1 }, 250, 'swing', function(ev) {open = true;});
        }

        function hideInfowindow() {
          $('div#graph_infowindow').stop().animate({
            top: '+=' + 10 + 'px',
            opacity: 0
          }, 100, 'swing', function(ev){
      			$('div#graph_infowindow').css({visibility:"hidden"});
      			open = false;
      		});
        }

        function changeData(left,top,data_id) {
          if ($("#graph_infowindow").attr('alt')==data_id && $("#graph_infowindow").is(':visible')) {
            return false;
          }

          $("#graph_infowindow").attr('alt',data_id);
          $("#graph_infowindow").find(".top").find("h2").empty();
          $("#graph_infowindow").find(".top").find("h2").append(data_id.replace(/_/g,' '));
          $("#graph_infowindow").find(".top").find(".province").empty();
          $("#graph_infowindow").find(".top").find(".province").append(valuesHash[data_id]["censo_total"] + " habitantes");
          $("#graph_infowindow").find(".top").find(".stats").find("h4").empty();
          $("#graph_infowindow").find(".top").find(".stats").find("h4").append(Math.floor(parseInt(valuesHash[data_id]["porcentaje_participacion"])) + "% de participación");

          // First political party
          var partido_1 = valuesHash[data_id]["partido_1"][0].toLowerCase();
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
          bar_width = (valuesHash[data_id]["partido_1"][2]*175)/100;
          $('div#graph_infowindow div.top div.stats div.partido:eq(0) span').width((bar_width<2)?2:bar_width);
          $('div#graph_infowindow div.top div.stats div.partido:eq(0) p').text(valuesHash[data_id]["partido_1"][0]+' ('+(valuesHash[data_id]["partido_1"][1]*175)/100+'%)');

          // Second political party
          var partido_2 = valuesHash[data_id]["partido_2"][0].toLowerCase();
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
          bar_width = (valuesHash[data_id]["partido_2"][2]*175)/100;
          $('div#graph_infowindow div.top div.stats div.partido:eq(1) span').width((bar_width<2)?2:bar_width);
          $('div#graph_infowindow div.top div.stats div.partido:eq(1) p').text(valuesHash[data_id]["partido_2"][0]+' ('+(valuesHash[data_id]["partido_2"][1]*175)/100+'%)');

          // Third political party
          var partido_3 = valuesHash[data_id]["partido_3"][0].toLowerCase();
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
          bar_width = (valuesHash[data_id]["partido_3"][2]*175)/100;
          $('div#graph_infowindow div.top div.stats div.partido:eq(2) span').width((bar_width<2)?2:bar_width);
          $('div#graph_infowindow div.top div.stats div.partido:eq(2) p').text(valuesHash[data_id]["partido_3"][0]+' ('+(valuesHash[data_id]["partido_3"][1]*175)/100+'%)');

          // Other political party
          bar_width = (valuesHash[data_id]["resto_partidos_percent"]*175)/100;
          $('div#graph_infowindow div.stats div.partido:eq(3) span').width((bar_width<2)?2:bar_width);
          $('div#graph_infowindow div.stats div.partido:eq(3) p').text('OTROS ('+valuesHash[data_id]["resto_partidos_percent"]+'%)');

          showInfowindow(left,top);
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



    	graphLegend = (function() {
    	  // Create the element - add it to DOM
    	  $('div#graph').append(
      	  '<div class="graph_legend">'+
          '  <h2>Tasa de Paro en Palencia<sup>(2010)</sup></h2>'+
          '  <p class="autonomy"><a href="#">Castilla y León</a></p>'+
          '  <div class="stats">'+
          '    <div class="partido psoe"><div class="bar"><span style="width:20px"></span></div><p>PSOE (61%)</p></div>'+
          '    <div class="partido pp"><div class="bar"><span style="width:20px"></span></div><p>PP (36%)</p></div>'+
          '    <div class="partido iu"><div class="bar"><span style="width:20px"></span></div><p>IU (12%)</p></div>'+
          '    <div class="partido otros"><div class="bar"><span style="width:20px"></span></div><p>OTROS (11%)</p></div>'+
          '  </div>'+
          '</div>');

        function showLegend() {
          $('div.graph_legend').fadeIn();
        }

        function hideLegend() {
          $('div.graph_legend').fadeOut();
        }

        function changeData(results,names) {
          if (names && names.length!=0) {
            showLegend();
          } else {
            hideLegend();
          }
        }

  	    return {
          hide: hideLegend,
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
      createBubbles("/json/generated_data/autonomies/"+normalization[compare]+"_"+year+".json");
    }


    function createBubbles(url){
      $.getJSON(url, function(data) {

        var one = true;
        _.each(data, function(val, key) {

          //Check data for show legend or not
          if (one) {
            graphLegend.change(data[key].parent_results, data[key].parents);
            one = false;
          }

          valuesHash[key] = val;
          nBubbles = nBubbles+1;
          $('#graph_container').append("<div class='bubbleContainer' id='"+key+"'><div class='outerBubble'></div><div class='innerBubble'></div></div>");
          $('#'+key).css("left",(offsetScreenX).toString()+"px");
          $('#'+key).css("top",(offsetScreenY).toString()+"px");
          $('#'+key).css("opacity","0");
          $('#'+key).find('.innerBubble').css("backgroundColor",val["color"]);

          updateBubble('#'+key,offsetScreenX+parseInt(val["x_coordinate"]),offsetScreenY+parseInt(val["y_coordinate"]),val["radius"],val["color"]);
        });
      });
    }


    function setValue(url){
      $.getJSON(url, function(data) {
        _.each(data, function(v,key) {
          valuesHash[key] = v;
          updateBubble('#'+key,offsetScreenX+parseInt(v["x_coordinate"]),offsetScreenY+parseInt(v["y_coordinate"]),v["radius"],v["color"]);
        });
      });
    }



    //Function for update the values of the bubbles that are being visualized
    function updateBubble (bubble,x,y,val,c){
      var offset = Math.abs(parseInt($(bubble).find('.outerBubble').css('top')) + (parseInt($(bubble).find('.outerBubble').css('height')) - val) / 2)*-1;

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
        backgroundColor: c.toString() + "px"
      }, 1000);
    }


    function goDeeper(url){
      graphLegend.hide();
      //console.log("Going deep to " + url);
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







