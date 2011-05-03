

    function CompareWindow() {
      this.create();
    }
    
    CompareWindow.prototype = {};
    
    
    CompareWindow.prototype.create = function() {
      var me = this;
      this.div = document.createElement('div');
      this.div.setAttribute('id','comparewindow');
      this.div.innerHTML =
        '<a class="close_infowindow"></a>'+
        '<div class="top">'+
          '<h2>Alaejos</h2>'+
          '<p class="province">Valladolid, 11.982 habitantes.</p>'+
          '<div class="stats">'+
            '<h4>65% de participación</h4>'+
            '<div class="partido psoe"><div class="bar"><span></span></div><p>PSOE (61%)</p></div>'+
            '<div class="partido pp"><div class="bar"><span></span></div><p>PP (36%)</p></div>'+
            '<div class="partido iu"><div class="bar"><span></span></div><p>IU (12%)</p></div>'+
            '<div class="partido otros"><div class="bar"><span></span></div><p>OTROS (11%)</p></div>'+
          '</div>'+
          '<div class="compare_graph">'+
            '<a href="#" class="left">left</a>'+
            '<a href="#" class="right">right</a>'+
          '</div>'+
        '</div>'+
        '<div class="bottom search">'+
          '<div class="search">'+
            '<h4>Selecciona otro lugar para comparar...</h4>'+
            '<form class="search_compare">'+
              '<input class="text" type="text" value="Busca una localidad..." />'+
              '<input class="submit" type="submit" value=""/>'+
            '</form>'+
            '<div class="autocomplete">'+
              '<ul>'+
                '<li>Cuidad uno</li>'+
                '<li>Cuidad dos</li>'+
                '<li>No hay ciudades hermano</li>'+
              '</ul>'+
            '</div>'+
          '</div>'+
          '<div class="region">'+
            '<h2>Alaejos</h2>'+
            '<p class="province">Valladolid, 11.982 habitantes.</p>'+
            '<div class="stats">'+
              '<h4>65% de participación</h4>'+
              '<div class="partido psoe"><div class="bar"><span></span></div><p>PSOE (61%)</p></div>'+
              '<div class="partido pp"><div class="bar"><span></span></div><p>PP (36%)</p></div>'+
              '<div class="partido iu"><div class="bar"><span></span></div><p>IU (12%)</p></div>'+
              '<div class="partido otros"><div class="bar"><span></span></div><p>OTROS (11%)</p></div>'+
            '</div>'+
          '</div>'+
        '</div>';
      
      $('div#map').prepend(this.div);
      $(this.div).children('a.close_infowindow').click(function(ev){ev.stopPropagation();ev.preventDefault();me.hide();});
      $(this.div).draggable({containment: 'parent'});
    }
    
    CompareWindow.prototype.changeRegions = function() {
      
    }

    CompareWindow.prototype.show = function() {
      
      $(this.div).css('margin','-200px 0 0 -178px').css('top','50%').css('left','50%');
      $(this.div).fadeIn();
    }
    
    CompareWindow.prototype.hide = function() {
      $(this.div).fadeOut();
    }
 