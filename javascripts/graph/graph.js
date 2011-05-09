    
    //Vars determining the center of the graph
    var offsetScreenX = 510;
    var offsetScreenY = 265;  

    var valuesHash = {};
    var nBubbles = 0;

    jQuery.easing.def = "easeInOutCubic";
    
    function initializeGraph() {
      $(".innerBubble").live({
        mouseenter: function () {
          $(this).css("backgroundColor","#000000");
        },
        mouseleave: function () {
          $(this).css("backgroundColor",valuesHash[$(this).parent().attr('id')]["color"]);
        },
        dblclick: function(){
          var url = valuesHash[$(this).parent().attr('id')]["children_json_url"];
          if (url == null) {
            return false;
          } else {
            goDeeper(url);
          }
        },
        click: function() {
          $("#graph_infowindow").find(".top").find("h2").empty();
          $("#graph_infowindow").find(".top").find("h2").append($(this).parent().attr('id'));
          $("#graph_infowindow").find(".top").find(".province").empty();
          $("#graph_infowindow").find(".top").find(".province").append(valuesHash[$(this).parent().attr('id')]["censo_total"] + " habitantes");
          $("#graph_infowindow").find(".top").find(".stats").find("h4").empty();
          $("#graph_infowindow").find(".top").find(".stats").find("h4").append(Math.floor(parseInt(valuesHash[$(this).parent().attr('id')]["porcentaje_participacion"])) + "% de participación");
          
          // First political party
          var partido_1 = valuesHash[$(this).parent().attr('id')]["partido_1"][0].toLowerCase();
          c1 = $('div#graph_infowindow div.top div.stats div.partido:eq(0)').attr('class').split(" ");
          $.each(c1, function(c){
            if(c1[c] != "partido"){
              $('div#graph_infowindow div.top div.stats div.partido:eq(0)').removeClass(c1[c]);
            }
          })
          if (partido_1=='psoe' || partido_1=="pp" || partido_1 == "iu") {
            $('div#graph_infowindow div.top div.stats div.partido:eq(0)').addClass(partido_1);
          } else {
            $('div#graph_infowindow div.top div.stats div.partido:eq(0)').addClass('par1');
          }
          bar_width = (valuesHash[$(this).parent().attr('id')]["partido_1"][2]*175)/100;
          $('div#graph_infowindow div.top div.stats div.partido:eq(0) span').width((bar_width<2)?2:bar_width);
          $('div#graph_infowindow div.top div.stats div.partido:eq(0) p').text(valuesHash[$(this).parent().attr('id')]["partido_1"][0]+' ('+(valuesHash[$(this).parent().attr('id')]["partido_1"][1]*175)/100+'%)');

          // Second political party
          var partido_2 = valuesHash[$(this).parent().attr('id')]["partido_2"][0].toLowerCase();
          c2 = $('div#graph_infowindow div.top div.stats div.partido:eq(1)').attr('class').split(" ");
          $.each(c2, function(c){
            if(c2[c] != "partido"){
              $('div#graph_infowindow div.top div.stats div.partido:eq(1)').removeClass(c2[c]);
            }
          })
          if (partido_2=='psoe' || partido_2=="pp" || partido_2 == "iu") {
            $('div#graph_infowindow div.top div.stats div.partido:eq(1)').addClass(partido_2);
          } else {
            $('div#graph_infowindow div.top div.stats div.partido:eq(1)').addClass('par2');
          }
          bar_width = (valuesHash[$(this).parent().attr('id')]["partido_2"][2]*175)/100;
          $('div#graph_infowindow div.top div.stats div.partido:eq(1) span').width((bar_width<2)?2:bar_width);
          $('div#graph_infowindow div.top div.stats div.partido:eq(1) p').text(valuesHash[$(this).parent().attr('id')]["partido_2"][0]+' ('+(valuesHash[$(this).parent().attr('id')]["partido_2"][1]*175)/100+'%)');
          
          // Third political party
          var partido_3 = valuesHash[$(this).parent().attr('id')]["partido_3"][0].toLowerCase();
          c3 = $('div#graph_infowindow div.top div.stats div.partido:eq(2)').attr('class').split(" ");
          $.each(c3, function(c){
            if(c3[c] != "partido"){
              $('div#graph_infowindow div.top div.stats div.partido:eq(2)').removeClass(c3[c]);
            }
          })
          if (partido_3=='psoe' || partido_3=="pp" || partido_3 == "iu") {
            $('div#graph_infowindow div.top div.stats div.partido:eq(2)').addClass(partido_3);
          } else {
            $('div#graph_infowindow div.top div.stats div.partido:eq(2)').addClass('par3');
          }
          bar_width = (valuesHash[$(this).parent().attr('id')]["partido_3"][2]*175)/100;
          $('div#graph_infowindow div.top div.stats div.partido:eq(2) span').width((bar_width<2)?2:bar_width);
          $('div#graph_infowindow div.top div.stats div.partido:eq(2) p').text(valuesHash[$(this).parent().attr('id')]["partido_3"][0]+' ('+(valuesHash[$(this).parent().attr('id')]["partido_3"][1]*175)/100+'%)');

          // Other political party
          bar_width = (valuesHash[$(this).parent().attr('id')]["resto_partidos_percent"]*175)/100;
          $('div#graph_infowindow div.stats div.partido:eq(3) span').width((bar_width<2)?2:bar_width);
          $('div#graph_infowindow div.stats div.partido:eq(3) p').text('OTROS ('+valuesHash[$(this).parent().attr('id')]["resto_partidos_percent"]+'%)');
        },
        hover: function() {
          console.log($(this).parent().attr('id') + ' ('+valuesHash[$(this).parent().attr('id')]["cartodb_id"]+'): ' + valuesHash[$(this).parent().attr('id')]["x_coordinate"] + ', ' + valuesHash[$(this).parent().attr('id')]["y_coordinate"]);
        }
      });
    }
    
    function restartGraph() {
      $('div#graph_container').empty();
      valuesHash = {};
      createBubbles("/json/generated_data/autonomies_"+normalization[compare]+"_"+year+".json");
    }

    function createBubbles(url){
      $.getJSON(url, function(data) {
        $.each(data, function(key, val) {
          valuesHash[key] = val;
          nBubbles = nBubbles+1;
          $('#graph_container').append("<div class='bubbleContainer' id='"+key+"'><div class='outerBubble'></div><div class='innerBubble'></div></div>");
          $('#'+key).css("left",(offsetScreenX).toString()+"px");
          $('#'+key).css("top",(offsetScreenY).toString()+"px");
          $('#'+key).css("opacity","0");
          $('#'+key).find('.innerBubble').css("backgroundColor",val["color"]);
        });
      }); 
      setValue(url);
    }

    //changes the values on the graph
    function setValue(url){
      //TODO: VER SI PUEDO EVITAR LEER EL JSON (AL MENOS AL PRINCIPIO)
      console.log("le llega el JSON "+ url);
      $.getJSON(url, function(data) {
        $.each(data, function(key, v) {          
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
        console.log("ukelele");
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
      console.log("Going deep to " + url);
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