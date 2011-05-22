
  function AboutWindow() {
    this.create();
  }

  AboutWindow.prototype = {};

  AboutWindow.prototype.create = function() {
    var me = this;
    this.div = document.createElement('div');
    this.div.setAttribute('id','aboutwindow');
    this.div.innerHTML =
      '<a class="close_info"></a>'+
      '<div class="content">'+
      	'<div class="upper_content">'+
        	'<span class="arrow"></span>'+
        	'<h3>Acerca del Microscopio del Voto</h3>'+
        	'<p>El Microscopio del Voto es la primera de una serie de iniciativas de RTVE apostando por la visualización de datos y las nuevas tecnologías de Internet.</p>'+
        	'<div class="blocks"><h4>UN PROYECTO DE</h4><a href="http://www.rtve.es" class="image_container" ><img src="images/logo_rtve.jpg" id="rtvelogo" alt="RTVE" title=""/></a></div>'+
        	'<div class="blocks"><h4>DESARROLLADO POR</h4><a href="http://www.vizzuality.com" class="image_container"><img src="images/logo_vizz.jpg" id="vizzlogo" alt="Vizzuality" title=""/></a></div>'+
        	'<div class="blocks last"><div><h4>AGRADECIMIENTOS</h4>'+
						'<ul>'+
						'<li><a href="http://twitter.com/algonpaje" target="_blank">Alberto González Paje</a></li>'+
						'<li><a href="http://twitter.com/oscarfonts" target="_blank">Oscar Fonts</a></li>'+
						'<li><a href="http://twitter.com/ruthdelcampo" target="_blank">Ruth del Campo</a></li>'+
						'<li><a href="http://twitter.com/Eskimo__Girl" target="_blank">Tania Durán</a></li>'+
						'<li><a class="disabled">Cristina Samarán</a></li>'+
						'</ul>'+
					'</div>'+
      	'</div>'+
				'<div class="lower_content">'+
				  '<div class="left">'+
				    '<h3>Datos abiertos y código libre</h3>'+
  					'<p>Puedes bajarte el proyecto en GitHub</p>'+
				  '</div>'+
				  '<div class="right">'+
					  '<a target="_blank" href="http://www.github.com" alt="GitHub"></a>'+
				  '</div>'+
				'</div>'+
			'</div>';

    $('div.tabs').append(this.div);
    $(this.div).children('a.close_info').click(function(ev){ev.stopPropagation();ev.preventDefault();me.hide();});
  	$(this.div).draggable({containment: 'parent'});
  }

  AboutWindow.prototype.show = function(general) {

		explanationwindow.hide();

    $(this.div).css({margin:'-177px 0 0 -267px',top:'50%',left:'50%'});
    $(this.div).fadeIn();
  }

  AboutWindow.prototype.hide = function() {
    $(this.div).fadeOut();
  }
