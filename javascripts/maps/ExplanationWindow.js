
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
          '<li><a href="#" id="electorales">Resultados electorales</a></li>'+
        '</ul>'+				
        '<h4><a href="#">Datos demográficos</a></h4>'+
        '<ul>'+
          '<li><a href="#Edad media" id="edad_media">Edad media</a></li>'+
          '<li><a href="#Envejecimiento" id="envejecimiento">Envejecimiento</a></li>'+
          '<li><a href="#Inmigración" id="inmigracion">Porcentaje de inmigración</a></li>'+
          '<li><a href="#Inmigración" id="saldo_vegetativo">Saldo vegetativo</a></li>'+
        '</ul>'+
        '<h4><a href="#">Datos económicos</a></h4>'+
        '<ul>'+
          '<li><a href="#Inmigración"id="paro_epa">Tasa de paro</a></li>'+
          '<li><a href="#Inmigración" id="parados_larga_duracion">Parados larga duración</a></li>'+
          '<li><a href="#Inmigración" id="jovenes_parados">Jóvenes parados larga duración</a></li>'+
          '<li><a href="#Inmigración" id="pib">PIB per cápita</a></li>'+
          '<li><a href="#Inmigración" id="salario_medio">Salario medio</a></li>'+
          '<li><a href="#Inmigración" id="matriculaciones">Matriculaciones</a></li>'+
        '</ul>'+
        '<h4><a href="#">Datos sociológicos</a></h4>'+
        '<ul>'+
          '<li><a href="#Inmigración" id="secundaria_acabada">Estudios superiores</a></li>'+
          '<li><a href="#Inmigración" id="audiencia_diaria_tv">Consumo de TV</a></li>'+
          '<li><a href="#Inmigración" id="prensa_diaria">Consumo de prensa</a></li>'+
          '<li><a href="#Inmigración" id="penetracion_internet">Penetración de internet</a></li>'+
          '<li><a href="#Inmigración" id="detenidos">Detenidos</a></li>'+
        '</ul>'+

      '</div>'+
      '<div class="explain"></div>';

    $('body').append(this.div);
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
					var varName = $(this).attr('id');
					var chartData = "";
					var maxValue = -99999999999;
					var minValue = 99999999999;
					var lastYear = 1981;
					for (year=1987; year<=2011; year++) {
					
						var value = max_min_avg[varName+"_"+year+"_avg"];									
						if (value == undefined) continue;
						if (value > maxValue) {
							maxValue = value;
						}
						if (value < minValue) {
							minValue = value;
						}
						chartData += value+",";
						lastYear = year;
					}
					if (chartData.charAt(chartData.length-1) == ',') {
						chartData = chartData.substring(0,chartData.length-1);
					}
					minValue -= 0.1*maxValue;
					maxValue += 0.1*maxValue;					
					var urlChart = "http://chart.apis.google.com/chart?chs=480x166&cht=ls&chco=862071&chd=t:"+chartData+"&chg=5,-1,0,1&chls=3&chma=|0,3&chm=B,E6DBE4,0,0,0&chds="+minValue+","+maxValue;
        	$('div#appInfo div.explain').append("<img src='"+urlChart+"' class='chart'/>");
        	$('div#appInfo div.explain').append("<div class='chartCurrentLabel'><span class='value'>"+max_min_avg[varName+"_"+lastYear+"_avg"]+"</span><br/><span class='year'>"+explanationContent[$(this).parent().text()].units+" en "+lastYear+"</span>")
				}
        $('div#appInfo div.explain').append(explanationContent[$(this).parent().text()].sourceText); 				
				var offset = $(this).position().top;
        $('div#appInfo span.arrow').animate({top:offset+'px'},300);				
      }

    });

    $(this.div).draggable({containment: 'parent'});
  }

  ExplanationWindow.prototype.show = function() {
    $(this.div).css({margin:'-237px 0 0 -385px',top:'50%',left:'50%'});
    $(this.div).fadeIn();
  }

  ExplanationWindow.prototype.hide = function() {
    $(this.div).fadeOut();
  }
