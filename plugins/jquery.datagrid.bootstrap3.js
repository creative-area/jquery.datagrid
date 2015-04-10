/**
 * Bootstrap plugin for jquery.datagrid
 * Version: 0.1.1
 *
 * Copyright (c) 2011 Creative Area
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Require jquery.datagrid
 * Copyright (c) 2011 Creative Area
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Require Bootstrap
 * Copyright (c) 2012 Twitter, Inc.
 * Licensed under the Apache license, version 2.0.
 *
 * Require jQuery
 * http://jquery.com/
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
;(function($){
	if ( $.type( $.fn.datagrid ) !== 'function' ) {
		console.error( 'jquery.datagrid not loaded !' );
	} else {

		// sorter plugins
		var sorter = function( ascendant, sorterOptions ) {
			var options = {
				up: "chevron-up",
				down: "chevron-down",
				icons: false // false ("chevron"), "arrow", "load"
			};
			if ( sorterOptions ) {
				$.extend( options, sorterOptions );
			}
			switch ( options.icons ) {
				case "arrow":
					options.up = "arrow-up";
					options.down = "arrow-down";
				break;

				case "load":
					options.up = "upload";
					options.down = "download";
				break;
			}
			if ( ascendant ) {
				this.append( $('<i>', { "class": "glyphicon glyphicon-" + options.up, "style": "margin-left:5px;" } ) );
			} else {
				this.append( $('<i>', { "class": "glyphicon glyphicon-" + options.down, "style": "margin-left:5px;" } ) );
			}
		};

		$.fn.datagrid( "plugin", "sorter", "bootstrap", sorter );

		$.fn.datagrid( "plugin", "sorter", "bootstrap-chevron", "bootstrap", {} );
		$.fn.datagrid( "plugin", "sorter", "bootstrap-arrow", "bootstrap", { "icons": "arrow" } );
		$.fn.datagrid( "plugin", "sorter", "bootstrap-load", "bootstrap", { "icons": "load" } );


		// pager plugins
		$.fn.datagrid( "plugin", "pager", "bootstrap", "default", {
			item: "li",
			attrUl: { "class": "pagination" },
			attrItemActive: { "class": "active" },
			attrItemDisabled: { "class": "disabled" },
			link: true,
			behavior: { "sliding": { "pages": 3 } },
			firstPage: "&lt;&lt;",
			prevPage: "&lt;",
			nextPage: "&gt;",
			lastPage: "&gt;&gt;"
		});
		$.fn.datagrid( "plugin", "pager", "bootstrap-sm", "bootstrap", {
			attrUl: { "class": "pagination pagination-sm" }
		});
		$.fn.datagrid( "plugin", "pager", "bootstrap-lg", "bootstrap", {
			attrUl: { "class": "pagination pagination-lg" }
		});


		// cell plugins

		// render button helper
		var renderButton = function( renderOptions ) {
			var options = {
				classes: false,
				css: false,
				value: ""
			};
			if ( renderOptions ) {
				$.extend( options, renderOptions );
			}
			var html = "";
			html += "<button";
			if ( options.classes ) {
				html += " class=\"" + options.classes + "\"";
			}
			if ( options.css ) {
				html += " css=\"" + options.css + "\"";
			}
			html += ">";
			html += options.value;
			html += "</button>";
			return html;
		};

		// buttons
		var cellButton = function( data, buttonOptions ) {
			var options = {
				icons: "glyphicon", // "glyphicon", "fa" (font-awesome)
				style: false, // "default", "primary", "info", "success", "warning", "danger", "inverse"
				size: false, // "lg", "sm", "xs"
				classes: false, // add css class
				css: false, // add css style
				icon: false,
				value: data.value
			};
			if ( buttonOptions ) {
				$.extend( options, buttonOptions );
			}
			for ( var p in options ) {
				if ( $.type( options[ p ] ) === 'function' ) {
					options[ p ] = options[ p ]( data );
				}
			}
			var renderOptions = {
				classes: "btn",
				css: options.css,
				value: ""
			};
			if ( options.style ) {
				renderOptions.classes += " btn-" + options.style;
			}
			if ( options.size ) {
				renderOptions.classes += " btn-" + options.size;
			}
			if ( options.classes ) {
				renderOptions.classes += " " + options.classes;
			}
			if ( options.icon ) {
				renderOptions.value += "<i class=\"" + options.icons + " " + options.icons + "-" + options.icon + "\"></i> ";
			}
			renderOptions.value += options.value;
			return renderButton( renderOptions );
		}

		$.fn.datagrid( "plugin", "cell", "bootstrap-button", cellButton );
		$.fn.datagrid( "plugin", "cell", "fa-button", "bootstrap-button", { "icons": "fa" } );


		// boolean buttons
		var booleanCellButton = function( data, paramOptions ) {
			var options = {
				icons: "glyphicon", // "glyphicon", "fa" (font-awesome)
				styleOn: "success", // "default", "primary", "info", "success", "warning", "danger", "inverse"
				styleOff: "warning",
				style: false, // shortcut for "styleOn" = "styleOff" = "style"
				classes: false,
				css: false, // add css style
				valueOn: "1",
				displayOn: "yes",
				displayOff: "no",
				display: false, // shortcut for "displayOn" = "displayOff" = "display"
				iconOn: false,
				iconOff: false,
				icon: false, // shortcut for "iconOn" = "iconOff" = "icon"
				size: false // "lg", "sm", "xs"
			};
			if ( paramOptions ) {
				$.extend( options, paramOptions );
			}
			if ( options.style !== false ) {
				options.styleOn = options.style;
				options.styleOff = options.style;
			}
			if ( options.display !== false ) {
				options.displayOn = options.display;
				options.displayOff = options.display;
			}
			if ( options.icon !== false ) {
				options.iconOn = options.icon;
				options.iconOff = options.icon;
			}
			for ( var p in options ) {
				if ( $.type( options[ p ] ) === 'function' ) {
					options[ p ] = options[ p ]( data );
				}
			}
			var isOnOff = ( data.value == options.valueOn ) ? "On" : "Off";
			var renderOptions = {
				classes: "btn",
				css: options.css,
				value: ""
			};
			if ( options[ "style" + isOnOff ] ) {
				renderOptions.classes += " btn-" + options[ "style" + isOnOff ];
			}
			if ( options.size ) {
				renderOptions.classes += " btn-" + options.size;
			}
			if ( options.classes ) {
				renderOptions.classes += " " + options.classes;
			}
			if ( options[ "icon" + isOnOff ] ) {
				renderOptions.value += "<i class=\"" + options.icons + " " + options.icons + "-" + options[ "icon" + isOnOff ] + "\"></i> ";
			}
			renderOptions.value += options[ "display" + isOnOff ];
			return renderButton( renderOptions );
		}

		$.fn.datagrid( "plugin", "cell", "bootstrap-button-boolean", booleanCellButton );
		$.fn.datagrid( "plugin", "cell", "bootstrap-button-yn", "bootstrap-button-boolean", {
			valueOn: "Y",
		} );
		$.fn.datagrid( "plugin", "cell", "fa-button-boolean", "bootstrap-button-boolean", {
			icons: "fa"
		} );
		$.fn.datagrid( "plugin", "cell", "fa-button-yn", "bootstrap-button-yn", {
			icons: "fa"
		} );

	}
})(jQuery);
