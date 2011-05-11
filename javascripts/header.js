
  var procesos_electorales;
  var animate_interval;

  function initializeOptions() {
    //Control tab menu - map or graph
    $('div#tab_menu a').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      var className = ($(this).hasClass('map'))?'map':'graph';
      if (!$(this).hasClass('selected')) {
        $('div#tab_menu a').removeClass('selected');
        if (className=='map') {
          state = "map";
          $('div#map').css('zIndex',10);
          $('div#graph').css('zIndex',0);
        } else {
          state = "graph";
          restartGraph();
          $('div#map').css('zIndex',0);
          $('div#graph').css('zIndex',10);
        }
        $(this).addClass('selected')
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
      stop: function( event, ui ) {
        changeHash();
        refreshTiles();
        refreshBubbles();
        setValue("/json/generated_data/autonomies_"+normalization[compare]+"_"+year+".json");
      }
    });

    var infoTooltip = (function() {

        $('div.info_tooltip a.close').live('click',function(ev){
          ev.stopPropagation();
          ev.preventDefault();
          hideTooltip();
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

            $("div.info_tooltip").css("left", position );
            $("div.info_tooltip").fadeIn("slow", function() { $('body').click(function(event) { hideTooltip();}); });
            refreshHeight();
          }
        });
      }

      function refreshHeight() {
        var height = $("div.info_tooltip div.content").height() + 65;
        height = (height > 231) ? 231 : height;
        $("div.info_tooltip").css("height", height + "px");
      }

      return{
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
        $('div.select span.inner_select a').each(function(i,ele){$(this).text($(this).closest('div.select').find('img').attr('alt'));});
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
      $(this).removeClass('stop').addClass('play');
      $(this).attr('href','#play');
      clearInterval(animate_interval);
      return false;
    } else {
      $("div.year_slider").slider('value',new_value);
      refreshBubbles();
      changeHash();
      refreshTiles();
    }
  }
