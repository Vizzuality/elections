
  var deep = "autonomias";
  var createdBubbles = false;
  var procesos_electorales;
  var animate_interval;
  var animation = false;
  var previous_year;
  var failCircle;
  var deep_interval;

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
    var deep_level = getDeepLevelFromZoomLevel(start_zoom);

    /* Receive all the vars without data */
    getUnavailableData(deep_level);

    updateWadusText();

    // Graph - Map
    if (state == "grafico") {
      $('div#tab_menu a.map').removeClass('selected');
      $('div#tab_menu a.stats').addClass('selected');
      restartGraph();
      $('div#map').css('zIndex',0);
      $('div#graph').css('zIndex',10);
    }

    //Control tab menu - map or graph
    $('div#tab_menu a').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      var className = ($(this).hasClass('map'))?'map':'graph';
      if (!$(this).hasClass('selected')) {
        infoTooltip.hide_();
        $('div#tab_menu a').removeClass('selected');
        if (className == 'map') {
          $("#graph").hide();
          comparewindow.hide();
          graphBubbleTooltip.hide();
          $("#welcomewindow").fadeOut();
          state = "mapa";
          drawNoDataBars();

          // This element belongs to body, not to graph container
          graphBubbleInfowindow.hide();
          $('div#map').css('zIndex',10);
          $('div#graph').css('zIndex',0);

          setTimeout(function(){
            refreshBubbles();
            refreshTiles();
          },500);

        } else {
          state = "grafico";
          $("#welcomewindow").fadeOut();
          comparewindow.hide();
          graphBubbleTooltip.hide();
          $("#graph").show();
          drawNoDataBars();

          // reset to the higher level
          name = "España";
          deep = "autonomias";
          changeHash();

          // Hide the legend if this is visible...
          graphLegend.hideFast();
          restartGraph();
          $('div#map').css('zIndex',0);
          $('div#graph').css('zIndex',10);
        }
        // Stop the slider animation if it is playing
        clearInterval(animate_interval);
        $('body').unbind('click');
        
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
      animation = true;
      checkStartYear();
      $('body').click(function(ev){
        $('a.stop').removeClass('stop').addClass('play');
        $('a.play').attr('href','#play');
        $('body').unbind('click');
        clearInterval(animate_interval);
      })
    });

    // Stop animation process
    $('a.stop').live('click',function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      animation = false;
      clearInterval(animate_interval);
      $('body').unbind('click');
      $(this).removeClass('stop').addClass('play');
      $(this).attr('href','#play');
    });


    // Next - before
    $('div.years_content a.left').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      graphBubbleInfowindow.hide();
      if (year>1987)
        updateNewSliderValue(year-1,year);
    });
    $('div.years_content a.right').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      if (year<2011)
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
            $("div.info_tooltip ul li.left").html("<span>-25</span>" + info.left);
            $("div.info_tooltip ul li.right").html("<span>+25</span>" + info.right);

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
        hide_: hideTooltip,
        show_: showInfoTooltip
      };
    }());


    /*SELECTS*/
    /*Select event*/
    $('div.select div.outer_select').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();

          $("#welcomewindow").fadeOut();

      $('div.select').each(function(i,ele){$(ele).removeClass('opened');});

      if (!$(this).closest('div.select').hasClass('opened')) {
        infoTooltip.hide_();
        failCircle.reset();
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

          $("#welcomewindow").fadeOut();

      var value = $(this).text();

      if (!$(this).parent().hasClass('selected') ) {
        compare = $(this).attr('class').replace(/_/g,' ');
        axisLegend.update(tooltipInfo[value]);
        graphBubbleInfowindow.hide();

        if (state == 'mapa') {
          refreshBubbles();
          if (comparewindow.isVisible()) {
            comparewindow.setUpChartView();
          }
          if (infowindow.isOpen()) {
            infowindow.updateValues();
          }
        } else {

          if (comparewindow.isVisible()) {
            comparewindow.setUpChartView();
          }
          createOrUpdateBubbles(global_url + "/graphs/"+deep+"/"+graph_version+"/"+((name=="España")?'':name+'_')+normalization[compare]+"_"+year+".json");
        }

        drawNoDataBars();
        changeHash();

        $('div.select span.inner_select a').each(function(i,ele){$(this).text($(this).attr('title'));});
        $('div.option_list ul li').each(function(i,ele){$(ele).removeClass('selected');});
        $('div.select').each(function(i,ele){$(ele).removeClass('selected');});

        infoTooltip.show_(value, $(this).closest('div.select').position().left);

        $(this).parent().addClass('selected');
        $(this).closest('div.select').addClass('selected').removeClass('opened');
        $(this).closest('div.select').find('span.inner_select a').text(value);
        $('body').unbind('click');
      } else {
        $(this).closest('div.select').addClass('selected').removeClass('opened');
      }
    });

    /*failCircle*/
    failCircle = (function() {
      var showed = false;

      var data_not_found = false;

      $("div.fail").live("click", function(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        hideError();
      });

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

      $("div.fail a.continue").live("click", function(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        hideError();
      });

      function updateContent() {
        if (state == "mapa") {
          var $state = $("#map");
          var deep_level = getDeepLevelFromZoomLevel(peninsula.getZoom());
          var isDataAvailableInDeep = true;
        } else {
          var $state = $("#graph");
          var deep_level = deep;
        }

        if (availableData[deep_level][normalization[compare]] == undefined) {
          var isDataAvailableInDeep = false;
        } else {
          var isDataAvailableInDeep = true;
        }

        if (isDataAvailableInDeep == true) {
          text = "No hay datos para este año";
          next_link_text = "ver siguiente año con datos";
        } else {
          text = "No hay datos a este nivel de zoom";
          next_link_text = "ver siguiente nivel con datos";
        }

        $state.find('div.content span.message').html(text);
        $state.find('div.content a.next').html(next_link_text);
      }

      function showError() {
        if (!showed) {
          showed = true;
          if (state == "mapa") {
            updateContent();
            var $state = $("#map");
            $("div.fail").css('height','auto');
          } else {
            var $state = $("#graph");
            var graph_height = $('div#graph_container').height();
            var tabs_height = $('div.tabs').height();
            if (graph_height>tabs_height) {
              $("div.fail").height(graph_height);
            }
          }

          if (data_not_found != true) {
            $state.find('div.fail').fadeIn("slow", function() { data_not_found = true; });
          }
        }
      }

      function resetDataNotFound() {
        data_not_found = false;
      }

      function resetShowed() {
        showed = false;
      }

      function hideError() {

        var $state = (state == "mapa") ? $("#map") : $("#graph");
        $state.find('div.fail').fadeOut("slow", function() { data_not_found = undefined; })
      }

      function getNextAvailableYear(deep_level) {
        var data = availableData[deep_level][normalization[compare]];

        if (data!=undefined) {
          if (year > data[data.length - 1]) {
            return data[data.length - 1];
          } else {
            return _.detect(data, function(num){ return year < num; }); // next election year to the current year
          }
        } else {
          return year;
        }
      }

      function goToNextYear() {

        if (state == "mapa") {
          var deep_level = getDeepLevelFromZoomLevel(peninsula.getZoom());

          var next_year = getNextAvailableYear(deep_level);
          if (next_year!=year && next_year<2012) {
            updateNewSliderValue(next_year);
            failCircle.hide();
          } else {
            peninsula.setZoom(6);

            var deep_level = getDeepLevelFromZoomLevel(6);
            
            if (years_nodata[deep_level]==undefined) {
              var count = 0;
              clearInterval(deep_interval);
              deep_interval = setInterval(function(){
            
                if (years_nodata[deep_level]==undefined) {
                  count++;
                  if (count>5) {
                    clearInterval(deep_interval);
                  }
                } else {
                  var next_year = getNextAvailableYear(deep_level);
                  if (next_year!=year && next_year<2012) {
                    updateNewSliderValue(next_year,year);
                  }
                  clearInterval(deep_interval);
                }
              },500);
            } else {
              var next_year = getNextAvailableYear(deep_level);
              if (next_year!=year && next_year<2012) {
                updateNewSliderValue(next_year,year);
              }
            }
          }


        } else {
          updateNewSliderValue(getNextAvailableYear(deep));
          createOrUpdateBubbles(global_url + "/graphs/"+deep+"/"+graph_version+"/"+((name=="España")?'':name+'_')+normalization[compare]+"_"+year+".json");
        }
      }

      function hasFailed() {
        return data_not_found;
      }

      return {
        show: showError,
        hide: hideError,
        failed: hasFailed,
        reset: resetShowed,
        resetDataNotFound: resetDataNotFound
      }
    })();

		//
    $("span.aux_info a.more_info").click(function(ev) {
			ev.stopPropagation();
      ev.preventDefault();
      $("#welcomewindow").fadeOut("slow");
      explanationwindow.show(true);
		});

    $("span.aux_info a.know_more").click(function(ev) {
			ev.stopPropagation();
      ev.preventDefault();
      $("#welcomewindow").fadeOut("slow");
      aboutwindow.show();
		});


    // Twitter link
    $('a.twitter').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      var new_url = 'http://twitter.com/?status=' + encodeURIComponent('El microscopio del voto, cómo vota España ' + window.location.href);
      window.open(new_url,'_newtab');
    });


    //Unselect all variables
    $('a.deselection').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      unSelectAllVariables();
      removeDataBars();
    });
  }

  function checkStartYear() {
    if (year!=2011) {
      if (checkFailYear(year)) {
        animate_interval = setInterval(function(){animateSlider();},2500);
      } else {
        updateNewSliderValue(getFirstAvailableYear(getDeepLevelFromZoomLevel(peninsula.getZoom())),year);
        animate_interval = setInterval(function(){animateSlider();},2500);
      }
    } else {
      updateNewSliderValue(1987,2011);
      animate_interval = setInterval(function(){animateSlider();},2500);
    }
  }

  function getFirstAvailableYear(deep_level) {
    var data = availableData[deep_level][normalization[compare]];
    if (data!=undefined && data.length>0) {
      return data[0];
    } else {
      return year;
    }
  }

  function animateSlider() {
    var new_value = year + 1;
    if (new_value>2011) {
      $('a.action').removeClass('stop').addClass('play');
      $('a.action.play').attr('href','#play');
      animation = false;
      $('body').unbind('click');
      clearInterval(animate_interval);
      return false;
    } else {
      animation = true;
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
  
  function removeDataBars() {
    $('span.slider_no_data_left').css({width:"0%"});
    $('span.slider_no_data_right').css({width:"0%"});
  }

  function drawNoDataBars() {
    // First, let's reset the bars
    $('span.slider_no_data_left').hide();
    $('span.slider_no_data_right').hide();
    $('span.slider_no_data_left').css({width:"0%"});
    $('span.slider_no_data_right').css({width:"0%"});

    var deep_level;

    if (state == "mapa") {
      var zoom = peninsula.getZoom();
      deep_level = getDeepLevelFromZoomLevel(zoom);
    } else {
      deep_level = deep;
    }

    if (years_nodata[deep_level]==undefined) {
      getUnavailableData(deep_level);
      return false;
    }

    var comparison_var = normalization[compare];

    if (years_nodata[deep_level][comparison_var]!=undefined) {

      var left_no      = years_nodata[deep_level][comparison_var][0] - 1987;
      var length_array = years_nodata[deep_level][comparison_var].length;
      var right_no     = 2011 - years_nodata[deep_level][comparison_var][length_array-1];

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

      if (!checkFailYear(year)) {
        failCircle.show();
      } else {
        failCircle.hide();
      }
    } else {
      if (compare!="ninguna") {
        $('span.slider_no_data_left').css({width:"100%"});
        $('span.slider_no_data_right').css({width:"0%"});

        $('span.slider_no_data_left').show();
        $('span.slider_no_data_right').show();
        failCircle.show();
        return;
      }
    }
  }

  function checkFailYear(year) {
    if (state == "mapa") {
      return checkFailYearForMap(year);
    } else {
      return checkFailYearForGraph(year);
    }
  }

  function checkFailYearForMap(year) {
    var region_type = getDeepLevelFromZoomLevel(peninsula.getZoom());
    if (years_nodata[region_type]!=undefined && years_nodata[region_type][normalization[compare]]!=undefined) {
      var length_array = years_nodata[region_type][normalization[compare]].length;
      return (year>=years_nodata[region_type][normalization[compare]][0]) && (year<=years_nodata[region_type][normalization[compare]][length_array-1]);
    } else {
      return true;
    }
  }
  function checkFailYearForGraph(year) {
    var region_type = deep;
    if (years_nodata[region_type][normalization[compare]]!=undefined) {
      var length_array = years_nodata[region_type][normalization[compare]].length;
      return (year>=years_nodata[region_type][normalization[compare]][0]) && (year<=years_nodata[region_type][normalization[compare]][length_array-1]);
    } else {
      return true;
    }
  }

  function updateNewSliderValue(new_year,previous_year) {
    $("div.year_slider").slider('value', new_year);
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

      if(infowindow.isOpen()){
        infowindow.updateValues();
      }
      if(comparewindow.isVisible()){
        comparewindow.updateValues();
        comparewindow.createChart(infowindow.information,true,true);
      }
    } else {
      graphBubbleTooltip.hide();

      if(comparewindow.isVisible()){
        comparewindow.updateValues();
        comparewindow.refreshChart();
      }
      createOrUpdateBubbles(global_url + "/graphs/"+deep+"/"+graph_version+"/"+((name=="España")?'':name+'_')+normalization[compare]+"_"+new_year+".json");
    }

    changeHash();
  }


  function unSelectAllVariables() {
    compare = 'ninguna';
    // Remove selected variable
    $('div.option_list ul li.selected').each(function(i,ele){$(ele).removeClass('selected');});
    $('div.select').each(function(i,ele){$(ele).removeClass('selected');});
    $('div.select span.inner_select a').each(function(i,ele){var text = $(ele).attr('title'); $(ele).text(text);});

    changeHash();
    refreshBubbles();
  }


  function updateWadusText() {
    if (compare=="ninguna") {
      $('div.wadusText').hide();
    } else {
      var first_text = $('div.select div.option_list li a.'+compare.replace(/ /g,'_')).text();
      var wadus_text = (first_text=="Parados larga dur...")?'Parados larga duración':first_text;
      $('div.wadusText p').html(wadus_text+' <sup>['+year+']</sup>');
      $('div.wadusText').show();
    }
  }
