
  var procesos_electorales;
  var animate_interval;
  var previous_year;

  function initializeHeader() {
    // Graph - Map
    if (state == "grafico") {
      $('div#tab_menu a.map').removeClass('selected');
      $('div#tab_menu a.stats').addClass('selected');
      restartGraph();
      $('div#map').css('zIndex',0);
      $('div#graph').css('zIndex',10);
    }

    // Initialize select
    $('div.option_list ul li a.'+compare).closest('li').addClass('selected');
    $('div.option_list ul li a.'+compare).closest('div.select').addClass('selected');

    //Control tab menu - map or graph
    $('div#tab_menu a').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      var className = ($(this).hasClass('map'))?'map':'graph';
      if (!$(this).hasClass('selected')) {
        $('div#tab_menu a').removeClass('selected');
        if (className=='map') {
          state = "mapa";
          // This element belongs to body, not to graph container
          graphBubbleInfowindow.hide();
          $('div#map').css('zIndex',10);
          $('div#graph').css('zIndex',0);
          // Refresh map to show last changes done in application
          //refreshMap();
        } else {
          // Hide the legend if this is visible...
          graphLegend.hideFast();
          state = "grafico";
          restartGraph();
          $('div#map').css('zIndex',0);
          $('div#graph').css('zIndex',10);
        }
        // Stop the slider animation if it is playing
        clearInterval(animate_interval);

        $(this).addClass('selected');
        changeHash();
      }
    });

    /* Animate electoral slider process */
    // Play animation process
    $('a.play').live('click',function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      //Remove play class and add pause class
      $(this).removeClass('play').addClass('stop');
      $(this).attr('href','#stop');
      animate_interval = setInterval(function(){animateSlider()},4000);
    });

    // Stop animation process
    $('a.stop').live('click',function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      clearInterval(animate_interval);
      $(this).removeClass('stop').addClass('play');
      $(this).attr('href','#play');
    });



    // Year Slider
    $("div.year_slider").slider({
      range: "min",
      min: 1987,
      max: 2011,
      value: year,
      step: 1,
      create: function(event,ui) {
        $(this).find('a.ui-slider-handle').text(year);
      },
      slide: function( event, ui ) {
        $(this).find('a.ui-slider-handle').text(ui.value);
        year = ui.value;
      },
      change: function( event, ui ) {
        $(this).find('a.ui-slider-handle').text(ui.value);
        year = ui.value;
      },
      start: function(event, ui) {
        if (state === "grafico" && graphBubbleInfowindow.isOpen()) {
          graphBubbleInfowindow.hide();
          graphBubbleTooltip.hide();
        }
        previous_year = ui.value;
      },
      stop: function( event, ui ) {
        if (state=="mapa") {
          refreshMap();
        } else {
          if (graph_hack_year[previous_year]!=graph_hack_year[year]) {
            setValue("/json/generated_data/"+deep+"/"+((name=="España")?'':name+'_')+normalization[compare]+"_"+graph_hack_year[year]+".json");
          }
        }
        changeHash();
      }
    });


    /*Info tooltip when you select a variable*/
    var infoTooltip = (function() {

      $('div.info_tooltip a.close').click(function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        hideTooltip();
      });
      
      $('div.info_tooltip a.more').click(function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        hideTooltip();
        explanationwindow.show();
      });

      function hideTooltip() {
        $("div.info_tooltip").fadeOut("slow");
        $('body').unbind("click");
      }

      function showInfoTooltip(title, position) {
        $("div.info_tooltip").fadeOut("slow", function() {

          var info = tooltipInfo[title];

          if (info !== undefined) {
            $("div.info_tooltip h5").text(title);
            $("div.info_tooltip p").text(info.content);
            $("div.info_tooltip ul li.left").html("<span>+25</span>" + info.left);
            $("div.info_tooltip ul li.right").html("<span>-25</span>" + info.right);

            $("div.info_tooltip").css("left", position-7);
            $("div.info_tooltip").fadeIn("slow", function() {
              $('body').click(function(event) {
                if (!$(event.target).closest('div.info_tooltip').length) { hideTooltip(); }
              });
            });
            refreshHeight();
          }
        });
      }

      function refreshHeight() {
        var height = $("div.info_tooltip div.content").height() + 50;
        height = (height > 231) ? 231 : height;
        $("div.info_tooltip").css("height", height + "px");
      }

      return {
        hide: hideTooltip,
        show: showInfoTooltip
      }
    }());


    /*SELECTS*/
    /*Select event*/
    $('div.select div.outer_select').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();

      $('div.select').each(function(i,ele){$(ele).removeClass('opened');});

      if (!$(this).closest('div.select').hasClass('opened')) {
        infoTooltip.hide();
        if ($(this).parent().find('li.selected').length) {
          var index = $(this).parent().find('li.selected').index();
          $(this).parent().find('div.option_list').css('top',-(index*24)+'px');
        } else {
          $(this).parent().find('div.option_list').css('top','0px');
        }
        $(this).closest('div.select').addClass('opened');
      } else {
        $(this).closest('div.select').removeClass('opened');
      }

      $('body').click(function(event) {
        if (!$(event.target).closest('div.option_list').length) {
          $('div.select').each(function(i,ele){$(ele).removeClass('opened');});
          $('body').unbind('click');
        };
      });
    });

    /*Select list events*/
    $('div.option_list ul li a').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();

      var value = $(this).text();


      if (!$(this).parent().hasClass('selected')) {
        compare = $(this).attr('class');
        axisLegend.update(tooltipInfo[value]);
        graphBubbleInfowindow.hide();
        
        if (state == 'mapa') {
          refreshMap();
        } else {
          setValue("/json/generated_data/"+deep+"/"+((name=="España")?'':name+'_')+normalization[compare]+"_"+graph_hack_year[year]+".json");
        }
        
        changeHash();

        $('div.select span.inner_select a').each(function(i,ele){$(this).text($(this).attr('title'))});
        $('div.option_list ul li').each(function(i,ele){$(ele).removeClass('selected');});
        $('div.select').each(function(i,ele){$(ele).removeClass('selected');});

        infoTooltip.show(value, $(this).closest('div.select').position().left);

        $(this).parent().addClass('selected');
        $(this).closest('div.select').addClass('selected').removeClass('opened');
        $(this).closest('div.select').find('span.inner_select a').text(value);
        $('body').unbind('click');
      }
    });
  }



  function animateSlider() {
    var new_value = $("div.year_slider").slider('value') + 1;
    if (new_value>2011) {
      $('a.action').removeClass('stop').addClass('play');
      $('a.action.play').attr('href','#play');
      clearInterval(animate_interval);
      return false;
    } else {
      $("div.year_slider").slider('value',new_value);

      if (state == 'mapa') {
        refreshMap();
      } else {
        setValue("/json/generated_data/"+deep+"/"+((name=="España")?'':name+'_')+normalization[compare]+"_"+graph_hack_year[year]+".json");
      }

      changeHash();
    }
  }
