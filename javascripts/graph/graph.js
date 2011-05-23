// Graph global vars {#}
var name = "España";
var bar_width_multiplier = 140;

//Vars determining the center of the graph
var offsetScreenX = 510;
var offsetScreenY = 265;

var graph_bubble_index = 100;
var valuesHash = {};
var possibleValues = {};
var nBubbles = 0;
var selectedBubble;
var chooseMessage;
var axisLegend, graphLegend, graphBubbleInfowindow, graphBubbleTooltip;

jQuery.easing.def = "easeInOutCubic";

chooseMessage = (function() {

  $("div#graph div.message a").live("click", function(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    hideError();


    var text = $("div.select div.option_list ul li a.envejecimiento").text();
    $("div.select div.outer_select.people").parent().addClass("selected");
    $("div.select div.outer_select.people span.inner_select a").text(text);
    $("div.select div.option_list ul li a.envejecimiento").parent().addClass("selected");
    compare = "envejecimiento";

    if (year < 2005) { // because we don't have paro information prior 2005
      updateNewSliderValue(2005, year);
    } else {
      restartGraph();
    }
    drawNoDataBars();
  });

  function showError() {
    $('div#graph div.message').fadeIn("slow");
  }

  function hideError() {
    $('div#graph div.message').fadeOut("slow");
  }

  return {
    show: showError,
    hide: hideError
  }
})();

function initializeGraph() {
  if (state == "grafico") {
    $("#graph").show();
  }

  $('.text').live("change", function(ev) {
    value = $(".text option:selected").val();
    if (value) {
      addNewBubble(value);
    }
  });

  $(".innerBubble").live({
    mouseenter: function () {
      if (failCircle.failed() === true) {
        return;
      }

      var radius = $(this).height()/2;
      var top = $(this).parent().css('top').replace('px','') - radius - 21;
      var left = $(this).parent().css('left').replace('px','');
      var text = valuesHash[$(this).parent().attr("id")].name;
      graphBubbleTooltip.show(left,top,text);

      if (!$.browser.msie ) {
        $(this).parent().css('zIndex',graph_bubble_index++);
      }

      $(this).parent().children('.outerBubble').css("background","#333333");
      $(this).parent().children('p.region_name').css("color","#333333");
      $(this).parent().children('p.region_name').addClass("white_shadow");

      if (!graphBubbleInfowindow.isOpen() && selectedBubble !== $(this).parent().attr("id")) {
        $("div#" + selectedBubble + " div.outerBubble").css("background", "rgba(255,255,255,0.5)");
      }
    },
    mouseleave: function () {
      if (selectedBubble !== $(this).parent().attr("id")) {
        $(this).parent().children('.outerBubble').css("background","rgba(255,255,255,0.5)");
        if (ie_) {
          $(this).parent().children('p.region_name').css("color","black");
        } else {
          $(this).parent().children('p.region_name').css("color","#fff");
        }
        $(this).parent().children('p.region_name').addClass("dark_shadow");
        $(this).parent().children('p.region_name').removeClass("white_shadow");
      }
      graphBubbleTooltip.hide();
    },
    click: function() {
      if (failCircle.failed() === true) {
        return;
      }

      var radius = $(this).height()/2;
      var top  = $(this).parent().offset().top - 274;
      var left = $(this).parent().offset().left - 117;

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
    var selected_value;

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
      '      <div class="partido otros"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p><a href="http://resultados-elecciones.rtve.es/municipales/" target="_blank">OTROS (11%)</a></p></div>'+
      '    </div>'+
            '<div class="summary">'+
            '<h4>Municipios en los que es el más votado...</h4>'+
            '<ul>'+
              '<li class="partido psoe bar"><strong>00</strong><span>PSOE</span></li>'+
              '<li class="partido pp bar"><strong>00</strong><span>PP</span></li>'+
              '<li class="partido iu bar"><strong>00</strong><span>IU</span></li>'+
              '<li class="partido otros"><strong>00</strong><span>OTROS</span></li>'+
            '</ul>'+
            '</div>'+
      '  </div>'+
      '  <div class="bottom">'+
      '  <div class="tooltip"><span>Test</span><div class="tip"></div></div>'+
      '    <p class="info">Su población es <strong>8 años mas jóven</strong> que la media de edad nacional</p>'+
      '    <div class="chart">'+
      '      <img src="http://chart.apis.google.com/chart?chf=bg,s,FFFFFF00&chs=205x22&cht=ls&chco=8B1F72&chds=-80,97.828&chd=t:97.277,-48.793,58.405,97.828,94.565&chdlp=b&chls=1&chm=o,8B1F72,0,5,6&chma=3,3,3,3" class="sparklines" />'+
      '    </div>'+
      '    <div class="warning"><span>No hay datos de paro a nivel de provincia</span><div class="tip"></div></div>' +
      '    <a class="more">Ver más</a>'+
      '    <a class="compare">Comparar</a>'+
      '  </div>'+
      '  <div class="footer"></div>'+
      '</div>');

      bindEvents();

      function isOpen() {
        return open;
      }

      function refreshInfowindow() {
        $('div#graph_infowindow').css({opacity:1,visibility:'visible'});
      }

      function updateInfoText() {
        var comparison_variable = normalization[compare];
        var info_text = textInfoWindow[comparison_variable];

        var sign     = (selected_value < 0) ? "negative" : "positive";

        var text = info_text["before_"+sign] + " <strong>"+Math.abs(selected_value)+"</strong>" + info_text["after_" + sign];
        if (compare=="lineas adsl" || compare=="consumo prensa" || compare=="consumo tv") {
          var media = parseFloat(max_min_avg[(normalization[compare])+'_'+year+'_avg']).toFixed(2);
        } else {
          var media = parseFloat(max_min_avg[(normalization[compare]).replace('_normalizado','')+'_'+year+'_avg']).toFixed(2);
        }

        var last_year = lastAvailableYear();
        text = _.template(text)({media:media, yearSim: (last_year<year)?last_year:year});

        text = text + "<sup class='help'>1</sup>";


        $('div#graph_infowindow p.info').html(text);

        $('div#graph_infowindow p.info sup.help').unbind('mouseenter').unbind('mouseleave');
        $('div#graph_infowindow p.info sup.help').mouseenter(function(ev){

          var top = $('div#graph_infowindow p.info sup.help').position().top;
          var left = $('div#graph_infowindow p.info sup.help').position().left;
          var deep_text = {autonomias:"las autonomías", provincias:"las provincias", municipios:"los municipios"}

          $('div#graph_infowindow div.tooltip').css("top", top - 60);
          $('div#graph_infowindow div.tooltip').css("left", left - 70);
          $('div#graph_infowindow div.tooltip span').text("Desviación respecto a la media de " + deep_text[deep]);
          $('div#graph_infowindow div.tooltip').show();
        });
        $('div#graph_infowindow p.info sup.help').mouseleave(function(ev){
          $('div#graph_infowindow div.tooltip').hide();
        });
      }

      function showInfowindow(left, top) {

        if (deep == "provincias" || deep == "autonomias") {
          $('div#graph_infowindow a.compare').hide();
        } else {
          $('div#graph_infowindow a.compare').show();
        }

        $('div#graph_infowindow a.more').unbind('click');
        $('div#graph_infowindow a.more').unbind('mouseenter').unbind('mouseleave');

        var first_text = $('div.select div.option_list li a.'+compare.replace(/ /g,'_')).text();
        var selected_dataset = (first_text == "Parados larga dur...")?'parados larga duración':first_text.toLowerCase();

        if (deep == "provincias"){
          deep_level = "municipios";
        } else if (deep == "autonomias"){
          deep_level = "provincias";
        }

        var data = var_resolutions[deep_level];
        //console.log(data, deep_level);

        if (data == undefined || data[normalization[compare]] == null || _.indexOf(data[normalization[compare]], year) == -1) {
         // console.log("no hay datos");
          $("div#graph_infowindow a.more").css("color", "#ccc");
          $("div#graph_infowindow div.bottom div.warning span").text("No hay datos de " + selected_dataset + " a nivel de " + deep_level);

          $('div#graph_infowindow a.more').mouseenter(function(ev){
            $("div#graph_infowindow div.bottom div.warning").show();
          });

          $('div#graph_infowindow a.more').mouseleave(function(ev){
            $("div#graph_infowindow div.bottom div.warning").hide();
          });
        } else {

          $("div#graph_infowindow a.more").css("color", "#333");
          $('div#graph_infowindow a.more').click(function(ev){
            ev.stopPropagation();
            ev.preventDefault();

            graphBubbleTooltip.hide();
            graphBubbleInfowindow.hide();

            var $selectedBubble = $("div#" + selectedBubble);
            var url = valuesHash[$selectedBubble.attr('id')].children_json_url;
            if (url === null) {
              return false;
            } else {
              goDeeper(global_url + "/" + url);
            }
          });

        }


        if ( $.browser.msie ) {
          $('div#graph_infowindow').css({visibility:'visible',left:left+'px',top:top+'px'});
          $('div#graph_infowindow').show();
          open = true;
        } else {

          $('div#graph_infowindow').css({opacity:0,visibility:'visible',left:left+'px',top:top+'px'});
          $('div#graph_infowindow').stop().animate({ top: '-=' + 10 + 'px', opacity: 1 }, 250, 'swing', function(ev) {open = true;});
        }
        updateInfoText();
      }

      function hideInfowindow() {
        if (isOpen()) {
          if ( $.browser.msie ) {

            $('div#graph_infowindow').hide();
            open = false;
            return;
          }

          $('div#graph_infowindow').stop().animate({ top: '+=' + 10 + 'px', opacity: 0 }, 100, 'swing', function(ev){
            $('div#graph_infowindow').css({visibility:"hidden"});
            open = false;
          });
        }
      }

      function drawPartyBar(data_id, party_id){
        var id         = party_id - 1;
        var party_name = valuesHash[data_id]["partido_"+party_id][0];
        var $p = $('div#graph_infowindow div.top div.stats div.partido:eq('+id+')');

        if (party_name == null) {
           $p.hide();
          return;
        } else {
           $p.show();
        }

        var clase      = normalizePartyName(party_name);
        var value      = valuesHash[data_id]["partido_"+party_id][1];

        var clases = $p.attr('class').split(" ");

        $.each(clases, function(c){
          if (clases[c] != "partido"){
            $p.removeClass(clases[c]);
          }
        });

        if (_.indexOf(parties, clase) == -1) { clase = 'par'+party_id; }
        $p.addClass(clase);

        bar_width = normalizeBarWidth((value*bar_width_multiplier)/100);

        $p.find('span').width(bar_width);
        $p.find('p').text(party_name +' ('+(value)+'%)');

      }

    function renderTotalNumber($div, id, value, name) {
      if (name != null) {
        $div.show();
        $div.find('strong').text(value);
        $div.find('span').text(name.toUpperCase());
      } else {
        $div.hide();
      }
    }

    function drawTotalNumber(party_id, info, animated) {
      var me        = this;
      var id        = party_id - 1;
      var clase     = "otros";
      var $p = $('div#graph_infowindow div.summary li.partido:eq('+id+')');
      var partido;
      var percent;

      if (party_id < 4) {
        partido   = info['partido_'+party_id][0];
        percent   = info['partido_'+party_id][1];

        var partido_class = normalizePartyName(partido);

        if (_.indexOf(parties, partido_class) !== -1) { clase = partido_class; } else { clase = 'par'+party_id; }
        $p.addClass(clase);
      } else {
        partido   = "otros";
        percent   = info['resto_partidos_percent'];
      }
      renderTotalNumber($p, id, percent, partido);
    }

      function changeData(left,top,data_id) {
        if ($("#graph_infowindow").attr('alt') == data_id && isOpen()) {
          return false;
        }

        $("#graph_infowindow").attr('alt',data_id);
        $("#graph_infowindow").find(".top").find("h2").empty();
        var title = valuesHash[data_id].name;

        if (title.length > 24) {
          title = title.substr(0,21) + "...";
        }

        $("#graph_infowindow").find(".top").find("h2").append(title);

        $("#graph_infowindow a.more").show();

        if (deep == "autonomias") {
          $("#graph_infowindow a.more").text("Ver provincias");
        } else if (deep == "provincias") {
          $("#graph_infowindow a.more").text("Ver municipios");
        } else {
          $("#graph_infowindow a.more").hide();
        }

        var porcentaje_participacion = Math.floor(parseInt(valuesHash[data_id].porcentaje_participacion));

        $("#graph_infowindow").find(".top").find(".province").empty();
        $("#graph_infowindow").find(".top").find(".province").append(valuesHash[data_id].censo_total + " habitantes, " + year);
        $("#graph_infowindow").find(".top").find(".stats").find("h4").empty();
        $("#graph_infowindow").find(".top").find(".stats").find("h4").append(porcentaje_participacion + "% de participación");

        if (deep == "municipios") {

          $('div#graph_infowindow div.stats').show();
          $('div#graph_infowindow div.summary').hide();

          for (var i = 1; i <= 3; i++) {
            drawPartyBar(data_id, i);
          }

          // Other political party
          bar_width = normalizeBarWidth((valuesHash[data_id].resto_partidos_percent * bar_width_multiplier/100));
          $('div#graph_infowindow div.stats div.partido:eq(3) span').width(bar_width);
          $('div#graph_infowindow div.stats div.partido:eq(3) p a').text('OTROS ('+valuesHash[data_id].resto_partidos_percent+'%)');
          var lavinia = (valuesHash[data_id].lavinia_url).split('|');
          $('div#graph_infowindow div.stats div.partido:eq(3) p a').attr('href','http://resultados-elecciones.rtve.es/municipales/'+lavinia[0]+'/provincias/'+lavinia[1]+'/municipios/'+lavinia[2]+'/');
        } else {
          $('div#graph_infowindow div.stats').hide();
          $('div#graph_infowindow div.summary').show();

          $('div#graph_infowindow div.summary li.partido').each(function(i,ele){
            $(ele).removeClass(parties.join(" ") + ' par1 par2 par3');
          });

          for (var i = 1; i <= 4; i++) {
            drawTotalNumber(i, valuesHash[data_id], false);
          }
        }

        var data = valuesHash[data_id].evolution.split(",");
        var max = 0; var count = 0; var find = false; var find_year; var chartDataString = "";
        var minYear = 1975; var maxYear = 2011;

        var electionYears = [1987,1991,1995,1999,2003,2007,2011];

        selected_value = parseFloat(data[36 - (maxYear - year)]);

        var availableYears = var_resolutions[deep][normalization[compare]];

        var firstYear = availableYears[0];

        if (firstYear < 1987) {
          firstYear = 1987;
        }
        var lastYear  = availableYears[availableYears.length - 1];

        var firstYearIndex = 36 - (maxYear- firstYear);
        var lastYearIndex  = 36 - (maxYear- lastYear);
        var currentYearIndex = 36 - (maxYear- year);
        var marginRight = 36 - lastYearIndex;

        //console.log(firstYearIndex, lastYearIndex, data[firstYearIndex], data[lastYearIndex]);
        //console.log(data, data[firstYearIndex]);

        for (var i = firstYearIndex; i < lastYearIndex + 1; i++) {
          if (!find) {
            if (i == currentYearIndex) {
              find = true;
              find_year = count;
            }
          }

          if (Math.abs(parseFloat(data[i]))>max) {
            max = Math.ceil(Math.abs(parseFloat(data[i])));
          }

          chartDataString += data[i]+ ',';
          count++;
        }

        if (find_year == null) {
          find_year = lastYearIndex;
        }
        chartDataString = chartDataString.substring(0, chartDataString.length-1);
        var width = (lastYearIndex - firstYearIndex)*8+10;

        $('div#graph_infowindow div.chart img').attr('src','http://chart.apis.google.com/chart?chf=bg,s,FFFFFF00&chs='+width+'x22&cht=ls&chco=8B1F72&chds=-'+max+','+max+'&chd=t:' + chartDataString + '&chdlp=b&chls=1&chm=o,8B1F72,0,'+find_year+',6&chma=3,3,3,3');
          $('div#graph_infowindow div.chart img').css({margin:'0 '+marginRight*7+'px 0 0'});
        $('div#graph_infowindow div.chart img').show();

        showInfowindow(left,top);
      }

      function bindEvents() {
        $('div#graph_infowindow a.compare').click(function(ev){
          try { ev.stopPropagation(); } catch(e){ event.cancelBubble=true; };

          hideInfowindow();
          var $selectedBubble = $("div#" + selectedBubble);
          var place = replaceWeirdCharacters(valuesHash[selectedBubble].google_maps_name);
          var url   = global_url+'/google_names_cache/'+gmaps_version+'/'+place+'.json';

          if (comparewindow.isVisible()) {
            comparewindow.compareSecondRegion(null, place, deep);
          } else {
            $.ajax({
              method: "GET",
              dataType: 'json',
              url: url,
              success: function(info) {
                comparewindow.compareFirstRegion(info);
                comparewindow.show();
              },
              error: function(error) {
                $('div#comparewindow div.bottom').addClass('search').removeClass('region')
                $('div#comparewindow p.refer').text('No hemos encontrado la localidad, prueba con otra');
              }
            });

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
            var text   = valuesHash[selectedBubble].name;
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
      };
  }());

  // Tooltip when mouseover some bubble
  graphBubbleTooltip = (function() {
    // Create the element - add it to DOM
    $('div#graph_container').append('<p class="graph_bubble_tooltip">Comunidad de Madrid</p>');

    function hideTooltip() {
    return;
      $('p.graph_bubble_tooltip').hide();
    }

    function showTooltip(left,top,text) {
    return;
      $('p.graph_bubble_tooltip').text(text);
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

      if (info !== undefined) {
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
    $('div#graph_container').append('<div class="graph_legend">\
       <h2>Tasa de Paro en España<sup>(2010)</sup></h2>\
       <p class="autonomy"><a href="#">Castilla y León</a></p>\
       <div class="stats">\
       <div class="partido psoe"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>PSOE (61%)</p></div>\
       <div class="partido pp"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>PP (36%)</p></div>\
       <div class="partido iu"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>IU (12%)</p></div>\
       <div class="partido otros"><div class="bar"><span class="l"></span><span class="c"></span><span class="r"></span></div><p>OTROS (11%)</p></div>\
       </div>\
       <div class="summary">\
       <h4>Municipios en los que es el más votado...</h4>\
       <ul>\
         <li class="partido psoe bar"><strong>00</strong><span>PSOE</span></li>\
         <li class="partido pp bar"><strong>00</strong><span>PP</span></li>\
         <li class="partido iu bar"><strong>00</strong><span>IU</span></li>\
         <li class="partido otros"><strong>00</strong><span>OTROS</span></li>\
       </ul>\
       </div>\
       <form>\
       <select class="text"></select>\
       </form>\
       <div class="search_error">\
       <h5>Ops! No hemos podido encontrar lo que buscas</h5>\
       <p>Comprueba que has escrito bien el nombre que buscabas</p>\
       <a class="close" href="#cerrar">Cerrar</a>\
       </div>\
       </div>');

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
      if (value == "Busca tu CCAA" || value == "Busca tu provincia" || value == "Busca tu municipio") {
        $(this).val('');
      }
    });

    function updateSearchInput() {
      $input = $('div.graph_legend form input.text');
      if (deep == "autonomias") {
        $input.val('Busca tu CCAA');
      } else if (deep == "provincias") {
        $input.val('Busca tu provincia');
      } else {
        $input.val('Busca tu municipio');
      }
    }

    $('div.graph_legend form input.text').focusout(function(){
      var value = $(this).val();
      if (value == "") {
        updateSearchInput();
      }
    });

    function showLegend() {
      $('div.graph_legend').fadeIn();
    }

    function hideSearchError() {
      $('div.graph_legend div.search_error').hide();
    }

    function showSearchError() {
      var formTopPosition = $('div.graph_legend form ').position().top;
      $('div.graph_legend div.search_error').css("top", formTopPosition + 40);
      $('div.graph_legend div.search_error').fadeIn();
    }

    function hideLegend() {
      $('div.graph_legend').fadeOut("slow", function() { updateSearchInput(); });
    }

    function hideFast() {
      $('div.graph_legend').hide();
      $('div.graph_legend div.search_error').hide();
    }

    function drawPartyBar(party_data, party_id) {

      var id    = party_id - 1;
      var clase = normalizePartyName(party_data["partido_"+party_id][0]);
      var $p    = $('div.graph_legend div.stats div.partido:eq('+id+')');
      var name  = party_data["partido_" + party_id][0];
      var value = party_data["partido_" + party_id][1];

      if (name == null) {
        $p.hide();
        return;
      } else {
        $p.show();
      }

      if (_.indexOf(parties, clase) == -1) {
        clase = 'par'+party_id;
      }

      $p.addClass(clase);
      bar_width = normalizeBarWidth((value*bar_width_multiplier)/100);

      $p.find('span.c').width(bar_width);
      $p.find('p').text(name+' ('+value+'%)');
    }

    function changeData(results,names,parent_url) {

      if (names.length > 0) {
        if (names.length == 1) {
          $('div.graph_legend h2').html($('div.select.selected span.inner_select a').text() + ' ' + normalizeRegionName(names[0])).show();
          $('div.graph_legend p.autonomy a').text('Volver a España')
          $('div.graph_legend p.autonomy a').attr('href','#ver_España');
        } else {
          $('div.graph_legend h2').html($('div.select.selected span.inner_select a').text() + ' ' + normalizeRegionName(names[1])).show();
          $('div.graph_legend p.autonomy a').text('Volver a ' + normalizeRegionName(names[0]));
          $('div.graph_legend p.autonomy a').attr('href','#ver_'+names[0].replace(/_/g,' '));
        }

        $('div.graph_legend p.autonomy').show();
        $('div.graph_legend p.autonomy a').unbind('click');
        $('div.graph_legend p.autonomy a').click(function(ev){
          ev.stopPropagation();
          ev.preventDefault();
          var url = global_url + "/" + parent_url[parent_url.length-1];
          goDeeper(url);
          graphBubbleTooltip.hide();
          graphBubbleInfowindow.hide();
        });

        if (deep=="municipios") {
          $('div.graph_legend div.stats').show();
          $('div.graph_legend div.summary').hide();
        } else {
          $('div.graph_legend div.stats').hide();
          $('div.graph_legend div.summary').show();
        }

        // Remove previous political style bars
        $('div.graph_legend div.stats div.partido').each(function(i,ele){
          $(ele).removeClass(parties.join(" ") + ' par1 par2 par3');
        });

        var bar_width;

        drawPartyBar(results,1);
        drawPartyBar(results,2);
        drawPartyBar(results,3);

        // Other
        bar_width = normalizeBarWidth((results.otros[1]*bar_width_multiplier)/100);
        $('div.graph_legend div.stats div.partido:eq(3) span.c').width(bar_width);
        $('div.graph_legend div.stats div.partido:eq(3) p').text('OTROS ('+results.otros[1]+'%)');
        showLegend();
      } else {

        $('div.graph_legend div.summary').show();
        $('div.graph_legend h2').html($('div.select.selected span.inner_select a').text() + ' España'  + '<sup>('+year+')</sup>').show();
        $('div.graph_legend p.autonomy').show();
        $('div.graph_legend p.autonomy a').unbind('click');

        showSearch();
      }
    }

    function showSearch() {
      $('div.graph_legend div.stats').hide();
      $('div.graph_legend p.autonomy').hide();
      showLegend();
    }

    return {
      hide: hideLegend,
      hideFast: hideFast,
      show: showLegend,
      showError: showSearchError,
      hideError: hideSearchError,
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
  createdBubbles = false;
  nBubbles = 0;
  graphLegend.hide();
  graph_bubble_index = 100;
  $('div#graph_container .bubbleContainer').remove();
  valuesHash = {};
  possibleValues = {};
  createOrUpdateBubbles(global_url + "/graphs/" + deep + "/" + graph_version + "/" + ((name=="España")?'':name+'_')+normalization[compare]+"_"+year+".json");
}


    function renderTotalNumber($div, id, value, name) {
      if (name != null) {
        $div.show();
        $div.find('strong').text(value);
        $div.find('span').text(name.toUpperCase());
      } else {
        $div.hide();
      }
    }

    function drawTotalNumber(party_data, party_id, animated) {
      var me = this;
      var id = party_id - 1;
      var name;
      var value;
      var clase = "otros";

      if (party_id < 4) {
        name  = party_data["partido_" + party_id][0];
        value = party_data["partido_" + party_id][1];
      } else {
        value = party_data["otros"][1];
        name  = party_data["otros"][0];
      }

      var $p = $('div.graph_legend div.summary li.partido:eq('+id+')');

      var partido_class = normalizePartyName(name);

      if (_.indexOf(parties, partido_class) !== -1) { clase = partido_class; } else { clase = 'par'+party_id; }
      $p.addClass(clase);

      if (animated == true) {
        var old_percent = $p.find('strong').text();
        var old_party   = $p.find('span').text();

        if (old_percent != value || (name!= null && old_party != name)) {
          $p.find('> *').fadeOut("slow", function() { renderTotalNumber($p, id, value, name); $p.find('> *').fadeIn("slow"); });
        }
      } else {
        renderTotalNumber($p, id, value, name);
      }
    }

function createOrUpdateBubbles(url){
  showGraphLoader();
  graphBubbleTooltip.hide();

  if (createdBubbles == true) {
    updateBubbles(url);
  } else {
    createBubbles(url);
  }
}

function createBubbles(url){
  //console.log("Create bubbles", url);

  if (compare === "ninguna") {
    hideGraphLoader();
    chooseMessage.show();
    return;
  } else {
    chooseMessage.hide();
  }

  $.getJSON(url, function(data) {
    if (data == null) {
      createdBubbles = false;
      failCircle.reset();
      failCircle.resetDataNotFound();
      failCircle.show();
      //console.log("Create 404", url);
      hideGraphLoader();
      return;
    }

    failCircle.hide();

    var one = true;
    possibleValues = data;
    updateSelect(data);
    count = 0;
    _.each(data, function(val, key) {
      //Check data for show legend or not

      if (createdBubbles) {
        return;
      }

      if (count>19) {
        createdBubbles = true;
        hideGraphLoader();
        return false;
      } else if (count >= _.size(possibleValues) - 1) {
        createdBubbles = true;
        hideGraphLoader();
      }

      if (one) {
        graphLegend.change(data[key].parent_results, data[key].parent, data[key].parent_url);

        if (deep != "municipios") {

          $('div.graph_legend div.summary h4').text(toTitleCase(deep) + " en los que es el más votado");

          $('div.graph_legend div.summary li.partido').each(function(i,ele){
            $(ele).removeClass(parties.join(" ") + ' par1 par2 par3');
          });

          for (var i = 1; i <= 4; i++) {
            drawTotalNumber(data[key].parent_results, i, true);
          }
        }

        one = false;
      }

      valuesHash[key] = val;

      nBubbles = nBubbles+1;
      //console.log(count, nBubbles, " created bubble " + key, createdBubbles);
      $('#graph_container').append('<div class="bubbleContainer" id="'+key+'"><p class="region_name">'+val.name+'</p><div class="outerBubble"></div><div class="innerBubble"></div></div>');

      var height_stat = $('#'+key+' p.region_name').height();
      $('#'+key+' p.region_name').css({top:'-'+(height_stat+25)+'px'});
      $('#'+key+' p.region_name').addClass("dark_shadow");
      $('#'+key).css("left",(offsetScreenX).toString()+"px");
      $('#'+key).css("top",(offsetScreenY).toString()+"px");
      $('#'+key).css("opacity","0");
      $('#'+key).find('.innerBubble').css("backgroundColor",val["color"]);

      updateBubble('#'+key,offsetScreenX+parseInt(val["x_coordinate"]),offsetScreenY-parseInt(val["y_coordinate"]),val["radius"],val["color"], val.partido_1[0]);
      count ++;
    });
  })
}

function updateBubbles(url){
  //console.log("Update bubbles", url);

  $.getJSON(url, function(data) {

    if (data == null) {
      failCircle.reset();
      failCircle.resetDataNotFound();
      failCircle.show();
      hideGraphLoader();
      //console.log("Update 404", url);
      return;
    }

    failCircle.hide();
    var one = true;
    var count = 0;
    _.each(data, function(v,key) {
      if (one) { //Check data for show legend or not
        graphLegend.change(data[key].parent_results, data[key].parent, data[key].parent_url);

        if (deep != "municipios") {
          $('div.graph_legend div.summary h4').text(toTitleCase(deep) + " en los que es el más votado");

          $('div.graph_legend div.summary li.partido').each(function(i,ele){
            $(ele).removeClass(parties.join(" ") + ' par1 par2 par3');
          });

          for (var i = 1; i <= 4; i++) {
            drawTotalNumber(data[key].parent_results, i, true);
          }
        }

        one = false;
      }

      if (count >= _.size(possibleValues) - 1) {
        hideGraphLoader();
      }

      valuesHash[key] = v;
      updateBubble('#'+key,offsetScreenX+parseInt(v["x_coordinate"]),offsetScreenY-parseInt(v["y_coordinate"]),v["radius"],v["color"], v.partido_1[0]);
      count ++;
    });
  })
}

//Function for update the values of the bubbles that are being visualized
function updateBubble (id, x, y, val, colors, party) {
  var offset = Math.abs(parseInt($(id).find('.outerBubble').css('top')) + (parseInt($(id).find('.outerBubble').css('height')) - val) / 2)*-1;
  var dominantColor = (colors.length == 1) ? colors[0].toString() : colors[0].toString();
  var backgroundColor = ((colors != null) ? dominantColor : "#c9cbae");

  // if the party we're paiting is not on the main parties list, let's paint it #FF9820
  if (party != undefined && _.indexOf(parties, normalizePartyName(party)) == -1)  {
    backgroundColor = "#c9cbae";
  }

  // Bubbles animations
  $(id).animate({ left: x.toString() + "px", top: y.toString() + "px", opacity: 1 }, 1000);
  $(id).find('.outerBubble').animate({ height: val.toString() + "px", width: val.toString() + "px", top: offset.toString() + "px", left: offset.toString() + "px" }, 1000);
  $(id).find('.innerBubble').animate({ height: (val-10).toString() + "px", width: (val-10).toString() + "px", top: (offset + 5).toString() + "px", left: (offset + 5).toString() + "px", backgroundColor: backgroundColor }, 1000);
  $(id).find('.innerBubble').addClass(normalizePartyName(party));
}

function updateSelect(values) {
  var options = $("select.text");

  if (options) {
    $("select.text").empty();

    var region = { municipios : "un muncipio", provincias : "una provincia", autonomias: "una autonomía"}
    options.append($("<option />").val("").text("Busca " + region[deep]));

    $.each(values, function() {

      // Let's get rid of parenthesis
      var option_name = this.name.replace("(", "");
      option_name = option_name.replace(")", "");
      option_name = replaceWeirdCharacters(option_name);

      options.append($("<option />").val(option_name).text(this.name));
    });
  }
}

function goDeeper(url){
  graphLegend.hide();
  showGraphLoader();

  var url_split = url.split('/');

  deep = url_split[5];

  var url_split_length = url_split.length-1;
  var compare_var      = compare.replace(/ /g,'_');
  var length           = url_split[url_split_length].split(normalization[compare])[0].length;

  name = url_split[url_split_length].split(normalization[compare])[0].substring(0, length-1);

  //console.log("url_split", url_split);
  //console.log("deep", deep);
  //console.log("name", name);
  //console.log("compare", normalization[compare], compare);

  graphLegend.hideError();
  graphBubbleTooltip.hide();

  drawNoDataBars();

  if (name == "") {
    name = 'España';
  }

  changeHash();
  destroyBubbles(url);
}

function destroyBubbles(url){
  for (key in valuesHash){
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
    //console.log(nBubbles, " removing "+b);
    $("#"+b).remove();
    nBubbles = nBubbles-1;

    if(nBubbles == 0){
      //console.log("All bubbles were removed", valuesHash, valuesHash.length);
      createdBubbles = false;
      createOrUpdateBubbles(url);
    }
  });
}

function addNewBubble(region) {
  region = region.toLowerCase().replace(/ñ/,'n').replace(/ /g,'_');

  //Check the ball is in the graph
  if ($('div.bubbleContainer[id="'+region+'"]').length) {

    if (selectedBubble !== undefined) {
      $("div#" + selectedBubble + " div.outerBubble").css("background", "rgba(255,255,255,0.5)");
    }

    selectedBubble = region;

    $('div.bubbleContainer[id="'+region+'"]').css({'z-index':graph_bubble_index});
    $('div.bubbleContainer[id="'+region+'"] div.outerBubble').css("background", "#333333");
    $("div#" + selectedBubble + " p.region_name").css("color","#333333");
    $("div#" + selectedBubble + " p.region_name").addClass("white_shadow");

  } else {
    var count = 0;
    _.each(possibleValues,function(val,key){
      if (key.toLowerCase() == region.toLowerCase()) {

        if (selectedBubble !== undefined) {
          $("div#" + selectedBubble + " div.outerBubble").css("background", "rgba(255,255,255,0.5)");
        }
        selectedBubble = key;

        valuesHash[key] = val;
        count++;
        $('#graph_container').append("<div class='bubbleContainer' id='"+key+"'><p class='region_name'>"+val.name+"</p><div class='outerBubble'></div><div class='innerBubble'></div></div>");

        var height_stat = $('#'+key+' p.region_name').height();
        $('#'+key+' p.region_name').css({top:'-'+(height_stat+25)+'px'});
        $('#'+key+' p.region_name').addClass("dark_shadow");

        $('#'+key).css("left",(offsetScreenX).toString()+"px");
        $('#'+key).css("top",(offsetScreenY).toString()+"px");
        $('#'+key).css("zIndex",graph_bubble_index);
        $('#'+key).css("opacity","0");
        $('#'+key).find('.innerBubble').css("backgroundColor",val["color"]);
        updateBubble('#'+key,offsetScreenX+parseInt(val["x_coordinate"]),offsetScreenY-parseInt(val["y_coordinate"]),val["radius"],val["color"], val.partido_1[0]);
      }
    });
    if (count == 0) {
      graphLegend.showError();
    }
  }
}

function showGraphLoader() {
  $('div#graph span.loader').fadeIn();
}

function hideGraphLoader() {
  $('div#graph span.loader').fadeOut();
}
