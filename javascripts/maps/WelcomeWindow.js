
  function WelcomeWindow() {
    this.create();
  }

  WelcomeWindow.prototype = {};

  WelcomeWindow.prototype.create = function() {
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
          '<li class="selected"><a href="#Inmigración">Inmigración</a></li>'+
          '<li><a href="#Sexo">Sexo</a></li>'+
          '<li><a href="#Paro">Paro</a></li>'+
          '<li><a href="#Saldo Vegetativo">Saldo Vegetativo</a></li>'+
        '</ul>'+
      '</div>'+
      '<div class="explain">'+
        '<h1>Edad Media de la Población</h1>'+
        '<p>La edad  media de la población española se ha calculado en base a los datos de población inlcuidos en el censo nacional y publicados en la página web del INE.</p>'+
        '<p>Para calcular la edad media hemos multiplicado el valor medio de cada quinquenio por el número de personas situadas en ese rango, para después, volver a dividir entre el total.</p>'+
      '</div>';

    $('div#map').prepend(this.div);
    $(this.div).children('a.close_info').click(function(ev){ev.stopPropagation();ev.preventDefault();me.hide();});
    
    $(this.div).find('li').children('a').click(function(ev){
      ev.stopPropagation(); ev.preventDefault();
      if (!$(this).parent().hasClass('selected')) {
        $('div#appInfo ul li').each(function(i,ele){$(ele).removeClass('selected')});
        $(this).parent().addClass('selected');
        var offset = $(this).position().top;
        $('div#appInfo span.arrow').animate({top:offset+'px'},300);
        //TODO - change div to show in the right main window
        
      }
    });
    $(this.div).draggable({containment: 'parent'});
  }

  WelcomeWindow.prototype.show = function() {
    $(this.div).css('margin','-200px 0 0 -178px').css('top','50%').css('left','50%');
    $(this.div).fadeIn();
  }

  WelcomeWindow.prototype.hide = function() {
    $(this.div).fadeOut();
  }
