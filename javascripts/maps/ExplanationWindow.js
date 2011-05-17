
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
          '<li class="selected"><a href="#Inmigración">Edad Media</a></li>'+
          '<li><a href="#Inmigración">Other</a></li>'+          
        '</ul>'+
      '</div>'+
      '<div class="explain"></div>';

    $('body').append(this.div);
    $(this.div).children('a.close_info').click(function(ev){ev.stopPropagation();ev.preventDefault();me.hide();});

    $(this.div).find('li').children('a').click(function(ev){
      ev.stopPropagation(); ev.preventDefault();
      if (!$(this).parent().hasClass('selected')) {
        $('div#appInfo ul li').each(function(i,ele){$(ele).removeClass('selected')});
        $(this).parent().addClass('selected');
        console.log($(this).parent().text());
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
