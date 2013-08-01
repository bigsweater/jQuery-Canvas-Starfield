/**
 * A jQuery plugin that generates an interactive starfield inside a canvas element.
 *
 * Based on Chiptune's starfield.js:
 * https://github.com/chiptune/js/blob/master/starfield.html
 */
;(function ( $, window, document, undefined ) {
	// Plugin constructor
	var Starfield = function(el, options) {
		this.el			= el;
		this.$el		= $(el);
		this.options	= options;

		obj				= this;
	};

	// Plugin prototype
	Starfield.prototype = {
		// Default settings
		defaults: {
			starColor:	"rgba(255,255,255,1)", 
			bgColor:	"rgba(0,0,0,1)",
			mouseMove:	true,
			mouseColor:	"rgba(0,0,0,0.2)",
			mouseSpeed:	20,
			fps:		15,
			speed:		5,
			quantity:	512,
			ratio:		256,
			class:		"starfield"
		},

		// Resize the canvas
		resizer: function() {
			this.w	= $(this.el).width();
			this.h	= $(this.el).height();
			this.x	= Math.round(this.w / 2);
			this.y	= Math.round(this.h / 2);
			this.z	= (this.w + this.h) / 2;
			this.star_color_ratio	= 1 / this.z;
			this.cursor_x	= this.x;
			this.cursor_y	= this.y;

			$(window).resize(function(){
				$('canvas', obj.el).remove();
				// Initialize
				obj.init();
			});

			// Initialize
			this.init();
		},

		// Initialize the plugin
		init: function() {
			this.canvas();

			// Context for the canvas element
			this.starz			= $('canvas', this.el);
			this.starz.width	= this.w;
			this.starz.height	= this.h;
			this.context		= this.starz[0].getContext('2d');

			// Create an array for every star
			for(var i = 0; i < this.n; i++) {
				this.star[i]	= new Array(5); 
				this.star[i][0]	= Math.random() * this.w * 2 - this.x * 2;
				this.star[i][1]	= Math.random() * this.h * 2 - this.y * 2;
				this.star[i][2]	= Math.round(Math.random() * this.z);
				this.star[i][3]	= 0;
				this.star[i][4]	= 0;
			}

			// Draw the starfield on the canvas
			this.context.fillStyle		= this.settings.bgColor;
			this.context.strokeStyle	= this.settings.starColor;
		},

		// Inject the canvas element
		canvas: function(){
			// Create canvas element
			this.w = $(this.el).width();
			this.h = $(this.el).height();

			this.wrapper = $('<canvas />')
			.attr({'width': this.w, 'height': this.h})
			.addClass(this.settings.class);

			this.wrapper.appendTo(this.el);
		},

		// Iterate over every star on the field and move it slightly, depending on things
		anim: function(){
			this.mouse_x	= this.cursor_x - this.x;
			this.mouse_y	= this.cursor_y - this.y;
			this.context.fillRect(0, 0, this.w, this.h);

			for(var i = 0; i < this.n; i++) {
				this.test			= true;
				this.star_x_save	= this.star[i][3];
				this.star_y_save	= this.star[i][4];
				this.star[i][0]	+= this.mouse_x >> 4;

				if(this.star[i][0] > this.x << 1) {
					this.star[i][0] -= this.w << 1;
					this.test = false;
				}
				if(this.star[i][0] <- this.x << 1) {
					this.star[i][0] += this.w << 1;
					this.test = false;
				}

				this.star[i][1] += this.mouse_y >> 4;
				if(this.star[i][1] > this.y << 1) {
					this.star[i][1] -= this.h << 1;
					this.test = false;
				}
				if(this.star[i][1] <- this.y << 1) {
					this.star[i][1] += this.h << 1;
					this.test = false;
				}

				this.star[i][2] -= this.star_speed;
				if(this.star[i][2] > this.z) {
					this.star[i][2] -= this.z;
					this.test = false;
				}
				if(this.star[i][2] < 0) {
					this.star[i][2] += this.z;
					this.test = false;
				}

				this.star[i][3] = this.x + (this.star[i][0] / this.star[i][2]) * this.star_ratio;
				this.star[i][4] = this.y + (this.star[i][1] / this.star[i][2]) * this.star_ratio;

				if(this.star_x_save > 0 && this.star_x_save < this.w && this.star_y_save > 0 && this.star_y_save < this.h && this.test ) {
					this.context.lineWidth = (1 - this.star_color_ratio * this.star[i][2]) * 2;
					this.context.beginPath();
					this.context.moveTo(this.star_x_save,this.star_y_save);
					this.context.lineTo(this.star[i][3], this.star[i][4]);
					this.context.stroke();
					this.context.closePath();
				}
			}
		},

		loop: function(){
			this.anim();
			window.requestAnimationFrame(this.loop.bind(this));

			$(window).resize(function(){
				cancelAnimationFrame;
			});

			/**
			 * requestAnimationFrame shim layer with setTimeout fallback
			 * @see http://paulirish.com/2011/requestanimationframe-for-smart-animating
			 */
			(function() {
			    var lastTime = 0;
			    var vendors = ['ms', 'moz', 'webkit', 'o'];
			    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			        window.cancelAnimationFrame = 
			          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
			    }
			 
			    if (!window.requestAnimationFrame)
			        window.requestAnimationFrame = function(callback, element) {
			            var currTime = new Date().getTime();
			            var timeToCall = Math.max(0, fps - (currTime - lastTime));
			            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
			              timeToCall);
			            lastTime = currTime + timeToCall;
			            return id;
			       };
			 
			    if (!window.cancelAnimationFrame)
			        window.cancelAnimationFrame = function(id) {
			            clearTimeout(id);
			        };
			}());
		},

		// Detect a mouse movement and do stuff
		move: window.onmousemove = function(evt){
			evt			= evt || event;
			var doc		= document.documentElement;
			obj.cursor_x	= evt.pageX || evt.clientX + doc.scrollLeft - doc.clientLeft;
			obj.cursor_y	= evt.pageY || evt.clientY + doc.scrollTop - doc.clientTop;
		},

		// this.start this whole thing
		start: function() {
			// Get default settings 
			this.settings = $.extend({}, this.defaults, this.options, this.metadata);

			// Variables
			var url	= document.location.href;
			this.n	= parseInt(
				(url.indexOf('n=') != -1) ? url.substring(url.indexOf('n=') + 2, (
					(url.substring(
						url.indexOf('n=') + 2,
						url.length)
					).indexOf('&') != -1) ? url.indexOf('n=') + 2 + (url.substring(
						url.indexOf('n=') + 2,
						url.length)
					).indexOf('&') :
						url.length) :
							this.settings.quantity
				);

			this.flag	= true;
			this.test 	= true;
			this.w		= 0;
			this.h		= 0;
			this.x		= 0;
			this.y		= 0;
			this.z		= 0;
			this.star_color_ratio	= 0;
			this.star_x_save = 0;
			this.star_y_save;
			this.star_ratio		= this.settings.ratio;
			this.star_speed		= this.settings.speed;
			this.star_speed_save	= 0;
			this.star			= new Array(this.n);
			this.color;
			this.opacity		= 0.1;

			this.cursor_x	= 0;
			this.cursor_y	= 0;
			this.mouse_x	= 0;
			this.mouse_y	= 0;

			this.canvas_x	= 0;
			this.canvas_y	= 0;
			this.canvas_w	= 0;
			this.canvas_h	= 0;
			
			this.fps		= this.settings.fps;

			// Resize the canvas
			this.resizer();
			this.loop();

			return this;
		}
	}

	Starfield.defaults	= Starfield.prototype.defaults;

	// Finally, the actual plugin code
	$.fn.starfield = function(options){
		return this.each(function() {
			new Starfield(this, options).start();
		});
	}
})( jQuery, window, document );