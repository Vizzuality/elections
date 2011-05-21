
  function ExplanationWindow() {
    this.create();
  }

  ExplanationWindow.prototype = {};

  ExplanationWindow.prototype.create = function() {
    var me = this;
    this.div = document.createElement('div');
    this.div.setAttribute('id','appInfo');
    this.div.innerHTML =
      '<a class="close_info"></a>'+
      '<div class="options">'+
        '<span class="arrow"></span>'+
        '<h3>¿DE DÓNDE SALEN LOS DATOS?</h3>'+
        '<h4><a href="#" id="electorales">Datos electorales</a></h4>'+
        '<ul>'+
          '<li><a href="#" alt="electorales">Resultados electorales</a></li>'+
        '</ul>'+				
        '<h4><a href="#">Datos demográficos</a></h4>'+
        '<ul>'+
          '<li><a href="#Edad media" alt="edad media">Edad media</a></li>'+
          '<li><a href="#Envejecimiento" alt="envejecimiento">Envejecimiento</a></li>'+
          '<li><a href="#Inmigración" alt="inmigracion">Porcentaje de inmigración</a></li>'+
          '<li><a href="#Inmigración" alt="saldo vegetativo">Saldo vegetativo</a></li>'+
        '</ul>'+
        '<h4><a href="#">Datos económicos</a></h4>'+
        '<ul>'+
          '<li><a href="#Inmigración" alt="paro">Tasa de paro</a></li>'+
          '<li><a href="#Inmigración" alt="parados larga duracion">Parados larga duración</a></li>'+
          '<li><a href="#Inmigración" alt="jovenes parados">Jóvenes parados larga duración</a></li>'+
          '<li><a href="#Inmigración" alt="pib">PIB per cápita</a></li>'+
          '<li><a href="#Inmigración" alt="salario">Salario medio</a></li>'+
          '<li><a href="#Inmigración" alt="matriculaciones">Matriculaciones</a></li>'+
        '</ul>'+
        '<h4><a href="#">Datos sociológicos</a></h4>'+
        '<ul>'+
          '<li><a href="#Inmigración" alt="secundaria acabada">Estudios superiores</a></li>'+
          '<li><a href="#Inmigración" alt="consumo tv">Consumo de TV</a></li>'+
          '<li><a href="#Inmigración" alt="consumo prensa">Consumo de prensa</a></li>'+
          '<li><a href="#Inmigración" alt="lineas adsl">Penetración de internet</a></li>'+
          '<li><a href="#Inmigración" alt="detenidos">Detenidos</a></li>'+
        '</ul>'+
      '</div>'+
      '<div class="explain"></div>';

    $('div.tabs').append(this.div);
    $(this.div).children('a.close_info').click(function(ev){ev.stopPropagation();ev.preventDefault();me.hide();});

    $(this.div).find('h4').click(function(ev){
      ev.stopPropagation(); ev.preventDefault();
			$(this).parent().find('ul').hide("slow");
			var theList = $(this).next("ul");
			theList.toggle("slow");
		});

    $(this.div).find('li').children('a').click(function(ev){

      ev.stopPropagation(); ev.preventDefault();

      if (!$(this).parent().hasClass('selected')) {
	
	      $('div#appInfo ul li').each(function(i,ele){$(ele).removeClass('selected')});
        $(this).parent().addClass('selected');
        $('div#appInfo div.explain').children().remove();
        $('div#appInfo div.explain').append(explanationContent[$(this).parent().text()].htmlContent);
	
				if (explanationContent[$(this).parent().text()].graph) {					
					var varName = normalization[$(this).attr('alt')].replace("_normalizado","");					
					var chartData = "";
					var maxValue = -99999999999;
					var minValue = 99999999999;
					var lastYear = 1981;
					
					for (year=1987; year<=2011; year++) {
						var value = max_min_avg[varName+"_"+year+"_avg"];									
						if (value == undefined) continue;
						if (value < 0) value = 0;
						if (value > maxValue) {
							maxValue = value;
						}
						chartData += value+",";
						lastYear = year;
					}
					if (chartData.charAt(chartData.length-1) == ',') {
						chartData = chartData.substring(0,chartData.length-1);
					}
					minValue = 0;
					//maxValue += 0.1*maxValue;					
					maxValue = explanationContent[$(this).parent().text()].graphRange;
					var urlChart = "http://chart.apis.google.com/chart?chs=480x166&cht=ls&chco=862071&chd=t:"+chartData+"&chg=5,-1,0,1&chls=3&chma=|0,3&chm=B,E6DBE4,0,0,0&chds="+minValue+","+maxValue;
        	$('div#appInfo div.explain').append("<div class='chart'><img src='"+urlChart+"' class='chart'/></div>");
        	$('div#appInfo div.explain div.chart').append("<div class='chartCurrentLabel'><span class='value'>"+max_min_avg[varName+"_"+lastYear+"_avg"]+"</span><br/><span class='year'>"+explanationContent[$(this).parent().text()].units+" en "+lastYear+"</span>")
				}
        $('div#appInfo div.explain').append(explanationContent[$(this).parent().text()].sourceText); 				
				var offset = $(this).position().top;
        $('div#appInfo span.arrow').animate({top:offset+'px'},300);				
      }

    });

    $(this.div).draggable({containment: 'parent'});
  }

  ExplanationWindow.prototype.show = function(general) {
	
		aboutwindow.hide();
		
    $(this.div).css({margin:'-237px 0 0 -385px',top:'50%',left:'50%'});
    $(this.div).fadeIn();
		$(this.div).find('ul').hide();
		var variableToShow;
		if ((general) || (compare == undefined)) {
			 variableToShow = "electorales";
		} else {
			variableToShow = compare;
		}
		$('[alt="'+variableToShow+'"]').parent().parent().show();
		$('[alt="'+variableToShow+'"]').click();
  }

  ExplanationWindow.prototype.hide = function() {
    $(this.div).fadeOut();
  }
