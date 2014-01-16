/**
 * Bootstrap plugin for jquery.datagrid
 * Version: 0.1
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
		var cellButton = function( data, buttonOptions ) {
			var options = {
				icons: "glyphicon", // "glyphicon", "fa" (font-awesome)
				style: false, // "primary", "info", "success", "warning", "danger", "inverse"
				size: false, // "lg", "sm", "xs"
				icon: false,
				value: data.value
			};
			if ( buttonOptions ) {
				$.extend( options, buttonOptions );
			}
			return "<button class='btn" 
				+ ( (options.style) ? " btn-"+options.style : "" ) 
				+ ( (options.size) ? " btn-"+options.size : "" ) 
				+ "'>" 
				+ ( (options.icon) ? "<i class='" + options.icons + " " + options.icons + "-" + options.icon + "'></i> " : "" ) 
				+ options.value + "</button>";
		}
		
		$.fn.datagrid( "plugin", "cell", "bootstrap-button", cellButton );
		$.fn.datagrid( "plugin", "cell", "fa-button", "bootstrap-button", { "icons": "fa" } );

	}
})(jQuery);