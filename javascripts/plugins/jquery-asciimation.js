/*!
 * jQuery plugin ASCIIMATION version v0.1
 * http://code.google.com/p/jquery-asciimation
 *
 * Copyright 2010, Pimin Konstantin Kefaloukos
 * Licensed under GPL Version 2.
 *
 * Date: Tue Dec 21 21:31:12 RST 2010
 */


(function( $ ){

  var methods = {
  
    init : function( options ) {

      return this.each(function(){

        var $this = $(this);
        var data = $this.data('asciimation');

        // If the plugin hasn't been initialized yet
        if ( ! data ) {

          var settings = {
            'frameClass' : 'frame',
            'fps' : 25
          };

          if ( options ) { 
            $.extend( settings, options );
          }
          
          var frames = [];
          $("." + settings.frameClass).each( function() {frames.push($(this).text());} );

          // insert the pre tag
          $this.html("<pre/>");

          $this.data('asciimation', {
            target : $this,
            frames : frames,
            fps : settings.fps,
            currentFrame : 0,
            timer : null,
            pre : $this.find("pre")
          });
          
        }
      })
    },
    
    start : function( ) {

      return this.each(function(){

        var $this = $(this);
        var data = $this.data('asciimation');

        if ( ! data ) return;
        
        clearInterval(data.timer);
        data.timer = setInterval(function() {

          data.pre.text(data.frames[data.currentFrame]);
          data.currentFrame = (data.currentFrame + 1) % data.frames.length;          

        }, Math.floor(1000.0/data.fps));
        
      })

    },
    
    stop : function( ) { 

      return this.each(function(){

        var $this = $(this);
        var data = $this.data('asciimation');

        if ( ! data ) return;
        clearInterval(data.timer);
        data.timer = null;
      })    
    },
    
    fps : function( framesPerSecond ) { 

      return this.each(function() {
      
        var $this = $(this);
        var data = $this.data('asciimation');

        if ( ! data ) return;
        
        data.fps = framesPerSecond;
        clearInterval(data.timer);
        data.timer = setInterval(function() {

          data.pre.text(data.frames[data.currentFrame]);
          data.currentFrame = (data.currentFrame + 1) % data.frames.length;          

        }, Math.floor(1000.0/data.fps));
      })
      
    }
  };

  $.fn.asciimation = function( method ) {

    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }    

  };

})( jQuery );