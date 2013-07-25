/**
 * A jQuery plugin that generates an interactive starfield inside a canvas element.
 *
 * Based on Chiptune's starfield.js:
 * https://github.com/chiptune/js/blob/master/starfield.html
 */
;(function ( $ ) {

	var plugin = {};

	var defaults = {
		starColor:	"rgba(255,255,255,1)", 
		bgColor:	"rgba(0,0,0,1)",
		mouseColor:	"rgba(0,0,0,0.2)",
		mouseSpeed:	20,
		fps:		15,
		speed:		5,
		quantity:	512,
		ratio:		256,
		class:		"starfield", 
	}

	$.fn.starfield = function(options){
	if( this.length == 0 ) return this;

	// Multiple starfields
	if( this.length > 1 ) {
		this.each( function() {
			$this.starfield(options);
		})

		return this;
	}

	// Namespace
	var starfield = {};

	// The element
	var el		= this;
	plugin.el	= this;

	// Merge in our user-supplied settings
	starfield.settings = $.extend({}, defaults, options);

	function get_screen_size() {
		var w = el.width();
		var h = el.height();
		return Array(w,h);
	}

	var url=document.location.href;
	var n=parseInt((url.indexOf('n=')!=-1)?url.substring(url.indexOf('n=')+2,((url.substring(url.indexOf('n=')+2,url.length)).indexOf('&')!=-1)?url.indexOf('n=')+2+(url.substring(url.indexOf('n=')+2,url.length)).indexOf('&'):url.length):starfield.settings.quantity);

	var flag=true;
	var test=true;
	var w=0;
	var h=0;
	var x=0;
	var y=0;
	var z=0;
	var star_color_ratio=0;
	var star_x_save,star_y_save;
	var star_ratio=starfield.settings.ratio;
	var star_speed=starfield.settings.speed;
	var star_speed_save=0;
	var star=new Array(n);
	var color;
	var opacity=0.1;

	var cursor_x=0;
	var cursor_y=0;
	var mouse_x=0;
	var mouse_y=0;

	var canvas_x=0;
	var canvas_y=0;
	var canvas_w=0;
	var canvas_h=0;
	var context;

	var key;
	var ctrl;

	var timeout;
	var fps=starfield.settings.fps;

	function init() {
		// Create canvas element
		w = $(el).width();
		h = $(el).height();
		$('<canvas class="' + starfield.settings.class + '" width="' + w + '" height="' + h + '"></canvas>').appendTo(el);

		var a=0;
		for(var i=0;i<n;i++)
			{
			star[i]=new Array(5); // Each star has five attributes: 
			star[i][0]=Math.random()*w*2-x*2; //X-position
			star[i][1]=Math.random()*h*2-y*2; // Y-Position
			star[i][2]=Math.round(Math.random()*z); // Z-position
			star[i][3]=0; // X-position relative to the mouse
			star[i][4]=0; // Y-position relative to the mouse
			}
		var starz = $('canvas', el);
		starz.width=w;
		starz.height=h;
		context=starz[0].getContext('2d');
		//context.lineCap='round';
		context.fillStyle=starfield.settings.bgColor;
		context.strokeStyle=starfield.settings.starColor;
	}

	function anim() {
		mouse_x=cursor_x-x;
		mouse_y=cursor_y-y;
		context.fillRect(0,0,w,h);
		for(var i=0;i<n;i++)
			{
			test=true;
			star_x_save=star[i][3];
			star_y_save=star[i][4];
			star[i][0]+=mouse_x>>4; if(star[i][0]>x<<1) { star[i][0]-=w<<1; test=false; } if(star[i][0]<-x<<1) { star[i][0]+=w<<1; test=false; }
			star[i][1]+=mouse_y>>4; if(star[i][1]>y<<1) { star[i][1]-=h<<1; test=false; } if(star[i][1]<-y<<1) { star[i][1]+=h<<1; test=false; }
			star[i][2]-=star_speed; if(star[i][2]>z) { star[i][2]-=z; test=false; } if(star[i][2]<0) { star[i][2]+=z; test=false; }
			star[i][3]=x+(star[i][0]/star[i][2])*star_ratio;
			star[i][4]=y+(star[i][1]/star[i][2])*star_ratio;
			if(star_x_save>0&&star_x_save<w&&star_y_save>0&&star_y_save<h&&test)
				{
				context.lineWidth=(1-star_color_ratio*star[i][2])*2;
				context.beginPath();
				context.moveTo(star_x_save,star_y_save);
				context.lineTo(star[i][3],star[i][4]);
				context.stroke();
				context.closePath();
				}
			}
		timeout=setTimeout('anim()',fps);
	}
	window.anim = anim;

	function move(evt) {
		evt=evt||event;
		var doc=document.documentElement;
		cursor_x=evt.pageX||evt.clientX+doc.scrollLeft-doc.clientLeft;
		cursor_y=evt.pageY||evt.clientY+doc.scrollTop -doc.clientTop;
	}

	function start() {
		resize();
		anim();
	}

	function resize() {
		w=parseInt((url.indexOf('w=')!=-1)?url.substring(url.indexOf('w=')+2,((url.substring(url.indexOf('w=')+2,url.length)).indexOf('&')!=-1)?url.indexOf('w=')+2+(url.substring(url.indexOf('w=')+2,url.length)).indexOf('&'):url.length):get_screen_size()[0]);
		h=parseInt((url.indexOf('h=')!=-1)?url.substring(url.indexOf('h=')+2,((url.substring(url.indexOf('h=')+2,url.length)).indexOf('&')!=-1)?url.indexOf('h=')+2+(url.substring(url.indexOf('h=')+2,url.length)).indexOf('&'):url.length):get_screen_size()[1]);
		x=Math.round(w/2);
		y=Math.round(h/2);
		z=(w+h)/2;
		star_color_ratio=1/z;
		cursor_x=x;
		cursor_y=y;
		init();
	}

	document.onmousemove=move;
		start();

		$(window).resize(function(){
			resize();
		})

		$(window).mousedown(function(){
			context.fillStyle=starfield.settings.mouseColor;
			speed = starfield.settings.mouseSpeed;
		})

		$(window).mouseup(function(){
			context.fillStyle=starfield.settings.bgColor;
			speed = starfield.settings.speed;
		})
	}
})( jQuery );