/**
 * Bootstrap plugin for jQuery Datagrid
 * Version: draft
 * Released: 2012-02-13
 * 
 * Copyright (c) 2011 Creative Area
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Require jQuery Datagrid
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
(function($){
	if ( $.type( $.fn.datagrid ) !== 'function' ) {
		console.error( 'jQuery Datagrid not loaded !' );
	} else {
		$.fn.datagrid( function() {
			// sortable plugin
			var sortable = function( ascendant, sortableOptions ) {
				var options = {
					up: "chevron-up",
					down: "chevron-down",
					icons: false // false ("chevron"), "arrow", "load"
				};
				if ( sortableOptions ) {
					$.extend( options, sortableOptions );
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
					this.append( $('<i>', { "class": "icon-" + options.up, "style": "margin-left:5px;" } ) );
				} else {
					this.append( $('<i>', { "class": "icon-" + options.down, "style": "margin-left:5px;" } ) );
				}
			};
			
			this.addPlugin( "sortable", "bootstrap", sortable);
			
			this.addPlugin( "sortable", "bootstrap-chevron", sortable);
			
			this.addPlugin( "sortable", "bootstrap-arrow", function( ascendant ) {
				sortable.call( this, ascendant, { "icons": "arrow" } );
			});
			
			this.addPlugin( "sortable", "bootstrap-load", function( ascendant ) {
				sortable.call( this, ascendant, { "icons": "load" } );
			});
			
			// pager plugin
			var pager = function( page, lastpage, pagerOptions ) {
				var datagrid = this,
					options = {
					firstPage: false,
					prevPage: false,
					nextPage: false,
					lastPage: false,
					hideDisabled: false,
					align: false, // false (left), "centered", "right"
					behavior: false // "sliding", "paging"
				};
				if ( pagerOptions ) {
					$.extend( options, pagerOptions );
				}
				
				// page == datagrid.getPage();
				
				var div = $( "<div>", { "class": "pagination" + ( ( options.align ) ? ' pagination-'+options.align : '' ) } ),
					ul = $( "<ul>" ),
					li;
				
				// default limits (all pages)
				var pagerLimits = {
					minpage: 1, 
					maxpage: lastpage, 
					prevpage: ( page == 1 ) ? 1 : page - 1, 
					nextpage: ( page == lastpage ) ? lastpage : page + 1
				};
				
				// behavior helper
				if ( options.behavior ) {
					pagerLimits = datagrid.getPagerLimits( options.behavior, lastpage );
				}
				
				var pagerExtremes = function ( disabled, gopage, label ) {
					if ( disabled ) {
						li = ( options.hideDisabled ) ? false : $("<li>").addClass( "disabled" );
					} else {
						li = $("<li>", {
							data: { "page": gopage },
							click: function() {
								datagrid.setPage( $(this).data( "page" ) );
								datagrid.getData();
							}
						});
					}
					if ( li ) {
						li.append(
							$("<a>").html( label )
						)
						ul.append( li );
					}
				}
				if ( options.firstPage ) {
					pagerExtremes( ( page == 1 ), 1, options.firstPage );
				}
				if ( options.prevPage ) {
					pagerExtremes( ( page == 1 ), page - 1, options.prevPage );
				}
				for ( var i = pagerLimits.minpage ; i <= pagerLimits.maxpage ; i++ ) {
					ul.append(
						$("<li>", {
							data: { "page": i },
							click: function() {
								datagrid.setPage( $(this).data( "page" ) );
								datagrid.getData();
							}
						})
						.addClass(function() {
							return ( page == i ) ? "active" : false;
						})
						.append(
							$("<a>").html(i)
						)
					);
				}
				if ( options.nextPage ) {
					pagerExtremes( ( page == lastpage ), page + 1, options.nextPage );
				}
				if ( options.lastPage ) {
					pagerExtremes( ( page == lastpage ), lastpage, options.lastPage );
				}
				div.append( ul );
				return div;
			}
			
			this.addPlugin( "pager", "bootstrap", pager);
			
			this.addPlugin( "cell", "bootstrap-button", function( data, buttonOptions ) {
				var datagrid = this,
					options = {
					style: false, // "primary", "info", "success", "warning", "danger", "inverse"
					size: false, // "large", "small", "mini"
					icon: false
				};
				if ( buttonOptions ) {
					$.extend( options, buttonOptions );
				}
				return "<button class='btn" 
					+ ( (options.style) ? " btn-"+options.style : "" ) 
					+ ( (options.size) ? " btn-"+options.size : "" ) 
					+ "'>" 
					+ ( (options.icon) ? "<i class='icon-" + options.icon + ( (options.style) ? " icon-white" : "" ) + "'></i> " : "" ) 
					+ data.value + "</button>";
			});
			
		})
	}
})(jQuery);