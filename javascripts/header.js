
  var procesos_electorales;
  
  function initializeOptions() {
    //Control tab menu - map or graph
    $('div#tab_menu a').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      var className = ($(this).hasClass('map'))?'map':'graph';
      if (!$(this).hasClass('selected')) {
        $('div#tab_menu a').removeClass('selected');
        if (className=='map') {
          $('div#map').css('zIndex',10);
          $('div#graph').css('zIndex',0);
        } else {
          restartGraph();
          $('div#map').css('zIndex',0);
          $('div#graph').css('zIndex',10);
        }
        $(this).addClass('selected')
      }
    });



    // Procesos_electorales var
    $.ajax({
      method: "GET",
      dataType: 'jsonp',
      url: 'https://api.cartodb.com/v1',
      data: {sql:'SELECT * FROM procesos_electorales',api_key:'8c587c9f93c36d146c9e66a29cc8a3499e869609'},
      success: function(data) {
        procesos_electorales = data.rows;
      },
      error: function(e) {
        
      }
    });


    // Year Slider
    $("div.year_slider").slider({
      range: "min",
      min: 1987,
      max: 2011,
      value: 2009,
      step: 1,
      create: function(event,ui) {
        $(this).find('a.ui-slider-handle').text('2009');
      },
      slide: function( event, ui ) {
        $(this).find('a.ui-slider-handle').text(ui.value);
        year = ui.value;
      },
      change: function( event, ui ) {
        $(this).find('a.ui-slider-handle').text(ui.value);
        year = ui.value;
        setValue("/json/generated_data/autonomies_"+normalization[compare]+"_"+year+".json");
      },
      stop: function( event, ui ) {
        changeHash();
        refreshTiles();
      }
    });

    /*SELECTS*/
    /*Select event*/
    $('div.select div.outer_select').click(function(ev){
      ev.stopPropagation();
      ev.preventDefault();

      $('div.select').each(function(i,ele){$(ele).removeClass('opened');});
      if (!$(this).closest('div.select').hasClass('opened')) {
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

        $(this).parent().addClass('selected');
        $(this).closest('div.select').addClass('selected').removeClass('opened');
        $(this).closest('div.select').find('span.inner_select a').text(value);
        $('body').unbind('click');
      } 
    });
  }
