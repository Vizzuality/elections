    
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
        click: function() {
          var url = valuesHash[$(this).parent().attr('id')]["children_json_url"];
          if (url == null) {
            return false;
          } else {
            goDeeper(url);
          }
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
        left: x.toString(),
        top: y.toString(),
        opacity: "1"
      }, 1000);
  
      $(bubble).find('.outerBubble').animate({
          height: val.toString(),
          width: val.toString(),
          top: offset.toString(),
          left: offset.toString(),
        }, 1000);
  
      $(bubble).find('.innerBubble').animate({
          height: (val-10).toString(),
          width: (val-10).toString(),
          top: (offset + 5).toString(),
          left: (offset + 5).toString(),
          backgroundColor: c.toString()        
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