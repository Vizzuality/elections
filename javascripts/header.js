
  var deep = "autonomias";
  var createdBubbles = false;
  var procesos_electorales;
  var animate_interval;
  var previous_year;
  var failCircle;

  var years_nodata = {};

  function getDeepLevelFromZoomLevel(zoom_level) {
    if (zoom_level == 6) {
      return "autonomias";
    } else if (zoom_level > 6 && zoom_level < 11) {
      return "provincias";
    } else {
      return "municipios";
    }
  }

  function initializeHeader() {
    deep = getDeepLevelFromZoomLevel(start_zoom);

    /* Receive all the vars without data */
    getUnavailableData(deep);

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
    var value = $('div.option_list ul li a.'+compare).text();
    $('div.option_list ul li a.'+compare).closest('div.select').find('span.inner_select a').text(value);


    //Control tab menu - map or graph
    $('div#tab_menu a').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      var className = ($(this).hasClass('map'))?'map':'graph';
      if (!$(this).hasClass('selected')) {
        infoTooltip.hide();
        $('div#tab_menu a').removeClass('selected');
        if (className == 'map') {
          $("#graph").hide();
          state = "mapa";
          // This element belongs to body, not to graph container
          graphBubbleInfowindow.hide();
          $('div#map').css('zIndex',10);
          $('div#graph').css('zIndex',0);

          setTimeout(function(){
            refreshBubbles();
            refreshTiles();
          },500);

        } else {
          $("#graph").show();
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
      animate_interval = setInterval(function(){animateSlider();},2000);
    });

    // Stop animation process
    $('a.stop').live('click',function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      clearInterval(animate_interval);
      $(this).removeClass('stop').addClass('play');
      $(this).attr('href','#play');
    });


    // Next - before
    $('div.years_content a.left').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      graphBubbleInfowindow.hide();
      updateNewSliderValue(year-1,year);
    });
    $('div.years_content a.right').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      updateNewSliderValue(year+1,year);
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
        }
        previous_year = ui.value;
      },
      stop: function( event, ui ) {
        if (ui.value!=previous_year) {
          updateNewSliderValue(ui.value,previous_year);
        }
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
      };
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
        }
      });
    });

    /*Select list events*/
    $('div.option_list ul li a').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();

      var value = $(this).text();

      if (!$(this).parent().hasClass('selected') && !$(this).parent().hasClass('disabled')) {
        compare = $(this).attr('class').replace(/_/g,' ');
        axisLegend.update(tooltipInfo[value]);
        graphBubbleInfowindow.hide();

        if (state == 'mapa') {
          refreshBubbles();
        } else {
          console.log(deep);
          setValue(global_url + "/graphs/"+deep+"/"+graph_version+"/"+((name=="España")?'':name+'_')+normalization[compare]+"_"+year+".json");
        }

        drawNoDataBars();
        changeHash();

        $('div.select span.inner_select a').each(function(i,ele){$(this).text($(this).attr('title'));});
        $('div.option_list ul li').each(function(i,ele){$(ele).removeClass('selected');});
        $('div.select').each(function(i,ele){$(ele).removeClass('selected');});

        infoTooltip.show(value, $(this).closest('div.select').position().left);

        $(this).parent().addClass('selected');
        $(this).closest('div.select').addClass('selected').removeClass('opened');
        $(this).closest('div.select').find('span.inner_select a').text(value);
        $('body').unbind('click');
      }
    });



    /*failCircle*/
    failCircle = (function() {
      var data_not_found = false;

      $("div.fail a.why").live("click", function(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        explanationwindow.show();
      });

      $("div.fail a.next").live("click", function(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        goToNextYear();
      });

      function showError() {
        if (state == "mapa") {
          var $state = $("#map");
          var deep_level = getDeepLevelFromZoomLevel(peninsula.getZoom());
        } else {
          var $state = $("#graph");
          var deep_level = deep;
        }

        if (data_not_found != true) {
          $state.find('div.fail').fadeIn("slow", function() { data_not_found = true; });
        }
      }

      function hideError() {
        var $state = (state == "mapa") ? $("#map") : $("#graph");
        $state.find('div.fail').fadeOut("slow", function() { data_not_found = undefined; })
      }

      function getNextAvailableYear(deep_level) {
        var data = availableData[deep_level][normalization[compare]];
        if (year > data[data.length - 1]) {
          return data[data.length - 1];
        } else {
          return _.detect(data, function(num){ return year < num; }); // next election year to the current year
        }
      }

      function goToNextYear() {

        if (state == "mapa") {
          var deep_level = getDeepLevelFromZoomLevel(peninsula.getZoom());
          updateNewSliderValue(getNextAvailableYear(deep_level));
          failCircle.hide();
        } else {
          updateNewSliderValue(getNextAvailableYear(deep));
          setValue(global_url + "/graphs/"+deep+"/"+graph_version+"/"+((name=="España")?'':name+'_')+normalization[compare]+"_"+year+".json");
        }
      }

      function hasFailed() {
        return data_not_found;
      }

      return {
        show: showError,
        hide: hideError,
        failed: hasFailed
      }
    })();

  }

  function animateSlider() {
    var new_value = $("div.year_slider").slider('value') + 1;
    if (new_value>2011) {
      $('a.action').removeClass('stop').addClass('play');
      $('a.action.play').attr('href','#play');
      clearInterval(animate_interval);
      return false;
    } else {
      updateNewSliderValue(new_value);
    }
  }


  function getUnavailableData(deep) {
    $.getJSON(global_url + "/graphs/meta/" + deep + ".json", function(data) {
      years_nodata[deep] = new Object();
      _.each(data,function(ele,i){
        years_nodata[deep][i] = new Array();
        years_nodata[deep][i] = ele;
      });
      drawNoDataBars();
    });
  }


  function drawNoDataBars() {
    $('span.slider_no_data_left').hide();
    $('span.slider_no_data_right').hide();

    var deep;
    var zoom = peninsula.getZoom();
    if (zoom==6) {
      deep = "autonomias";
      if (years_nodata["autonomias"]==undefined) {
        getUnavailableData('autonomias');
        return false;
      }
    } else if (zoom>6 && zoom<11) {
      deep = "provincias";
      if (years_nodata["provincias"]==undefined) {
        getUnavailableData('provincias');
        return false;
      }
    } else {
      deep = "municipios";
      if (years_nodata["municipios"]==undefined) {
        getUnavailableData('municipios');
        return false;
      }
    }

    if (years_nodata[deep][normalization[compare]]!=undefined) {
      var left_no = years_nodata[deep][normalization[compare]][0] - 1987;
      var lenght_array = years_nodata[deep][normalization[compare]].length;
      var right_no = 2011 - years_nodata[deep][normalization[compare]][lenght_array-1];

      if (left_no!=0) {
        $('span.slider_no_data_left').css({width:(left_no*4.16)+"%"});
        $('span.slider_no_data_left').show();
      } else {
        $('span.slider_no_data_left').hide();
      }

      if (right_no!=0) {
        $('span.slider_no_data_right').css({width:(right_no*4.16)+"%"});
        $('span.slider_no_data_right').show();
      } else {
        $('span.slider_no_data_right').hide();
      }
    }

    if (!checkFailYear(year)) {
      failCircle.show();
    } else {
      failCircle.hide();
    }
  }

  function checkFailYear(year) {
    if (years_nodata[deep]!=undefined && years_nodata[deep][normalization[compare]]!=undefined) {
    var deep = getDeepLevelFromZoomLevel(peninsula.getZoom());
      var length_array = years_nodata[deep][normalization[compare]].length;
      return (year>=years_nodata[deep][normalization[compare]][0]) && (year<=years_nodata[deep][normalization[compare]][length_array-1]);
    } else {
      return false;
    }
  }



  function updateNewSliderValue(new_year,previous_year) {
    if (state == 'mapa') {
      if (previous_year!=undefined) {
        if (graph_hack_year[previous_year] != graph_hack_year[new_year]) {
          refreshTiles();
        }
      } else {
        refreshTiles();
      }
      if (!checkFailYear(new_year)) {
        failCircle.show();
      } else {
        failCircle.hide();
      }
      refreshBubbles();
    } else {

      var url = global_url + "/graphs/"+deep+"/"+graph_version+"/"+((name=="España")?'':name+'_')+normalization[compare]+"_"+year+".json";

      // Let's decide if we must update (setValue) or create the bubbles
      if (createdBubbles == true) {
        setValue(url);
      } else {
        createBubbles(url);
      }
    }

    $("div.year_slider").slider('value', new_year);
    changeHash();
  }








