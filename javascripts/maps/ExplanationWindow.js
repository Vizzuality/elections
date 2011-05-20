
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
        '<h4>Datos demográficos</h4>'+
        '<ul>'+
          '<li class="selected"><a href="#Edad Media">Edad Media</a></li>'+
          '<li><a href="#Envejecimiento">Envejecimiento</a></li>'+
          '<li><a href="#Inmigración">Porcentaje de inmigración</a></li>'+
          '<li><a href="#Inmigración">Saldo vegetativo</a></li>'+
        '</ul>'+
        '<h4>Datos económicos</h4>'+
        '<ul>'+
          '<li><a href="#Inmigración">Tasa de paro</a></li>'+
          '<li><a href="#Inmigración">Parados larga duración</a></li>'+
          '<li><a href="#Inmigración">Jóvenes parados larga duración</a></li>'+
          '<li><a href="#Inmigración">PIB per cápita</a></li>'+
          '<li><a href="#Inmigración">Salario medio</a></li>'+
          '<li><a href="#Inmigración">Matriculaciones</a></li>'+
        '</ul>'+
        '<h4>Datos sociológicos</h4>'+
        '<ul>'+
          '<li><a href="#Inmigración">Estudios superiores</a></li>'+
          '<li><a href="#Inmigración">Consumo de TV</a></li>'+
          '<li><a href="#Inmigración">Consumo de prensa</a></li>'+
          '<li><a href="#Inmigración">Penetración de internet</a></li>'+
          '<li><a href="#Inmigración">Detenidos</a></li>'+
        '</ul>'+

      '</div>'+
      '<div class="explain"></div>';

    $('div.tabs').append(this.div);
    $(this.div).children('a.close_info').click(function(ev){ev.stopPropagation();ev.preventDefault();me.hide();});

    $(this.div).find('li').children('a').click(function(ev){
      ev.stopPropagation(); ev.preventDefault();
      if (!$(this).parent().hasClass('selected')) {
        $('div#appInfo ul li').each(function(i,ele){$(ele).removeClass('selected')});
        $(this).parent().addClass('selected');
        $('div#appInfo div.explain').children().remove();
        $('div#appInfo div.explain').append(explanationContent[$(this).parent().text()].htmlContent)
        var offset = $(this).position().top;
        $('div#appInfo span.arrow').animate({top:offset+'px'},300);
        //TODO - change div to show in the right main window

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
