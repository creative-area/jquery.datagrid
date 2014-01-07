/**
 * datagrid (jQuery plugin)
 *
 * Version: 0.0.1
 * 
 * Copyright (c) 2011 Creative Area
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Require jQuery
 * http://jquery.com/
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function($){
	var renderers = {
		source: {},
		sortable: {},
		pager: {},
		cell: {}
	};
	
	$.fn.extend({
		datagrid: function( options ) {
			// plugins hook
			if ( $.type( options ) === 'function' ) {
				this.addPlugin = function( type, name, callback ) {
					renderers[ type ][ name ] = callback;
				}
				options.call( this );
				return this;
			}
			
			// datagrid configuration
			var settings = {
					url: "",
					paramsDefault: {},
					paramsMapping: {},
					col: [],
					autoload: true,
					source: "post",
					onSourceData: false,
					onData: false,
					onRowData: false,
					noData: "no data",
					attr: false,
					sorter: false, // plugin : "bootstrap"
					pager: "default", // plugin : "bootstrap"
					pagerPosition: "bottom",
					resetContainer: true,
					onBefore: false,
					onComplete: false
				},
				datagrid = this,
				i;
			
			// extend default settings
			if ( options ) {
				$.extend( settings, options );
			}
			if ( $.type( settings.pagerPosition ) === "string" ) {
				settings.pagerPosition = [ settings.pagerPosition ];
			}
			
			// mapping for params send on getData
			settings.paramsMapping = $.extend( {
				page: "page",
				paging: "paging",
				orderby: "orderby",
				direction: "direction"
			}, settings.paramsMapping );
			
			var params = {};
				params[ settings.paramsMapping.page ] = 1;
				params[ settings.paramsMapping.paging ] = 15; // 0 for no paging
				params[ settings.paramsMapping.orderby ] = "";
				params[ settings.paramsMapping.direction ] = "";
				params = $.extend( params, settings.paramsDefault );
			
			var paramsUsed = {};
			
			// default column definition
			var settingsCol = {
				field: "",
				title: "",
				render: false,
				sortable: false,
				sortableDefaultAsc: true,
				attr: {},
				attrHeader: {}
			}
			
			// extend columns settings with default definition
			for ( i=0 ; i<settings.col.length ; i++ ) {
				settings.col[i] = $.extend( $.extend( {}, settingsCol ), settings.col[i] );
			}
			
			var table, total;

			// get / set option
			datagrid.getOption = function( option ) {
				return settings[ option ];
			}
			datagrid.setOption = function( option, value ) {
				settings[ option ] = value;
			}

			// get / set page
			datagrid.getPage = function() {
				return params[ settings.paramsMapping.page ];
			}
			datagrid.setPage = function( page ) {
				params[ settings.paramsMapping.page ] = page;
			}
			datagrid.getParams = function() {
				return params;
			}
			datagrid.getParamsUsed = function() {
				return paramsUsed;
			}
			
			// plugins
			var methods = {
				"getSource": function() {
					( methods.source[ $.type( settings.source ) ] || $.noop )();
				},
				"source": {
					"function": function() {
						$.when(
							settings.source.call( this, datagrid.getParams() )
						).done(
							function( result ) {
								datagrid.renderData( result );
							}
						);
					},
					"string": function() {
						switch ( settings.source ) {
							case "post":
								// post ajax source
								$.post( settings.url, datagrid.getParams(), function( result ) {
									datagrid.renderData( result );
								} );
							break;

							default:
								if ( renderers.source[ settings.source ] ) {
									renderers.source[ settings.source ].call( this, datagrid.getParams() );
								}
							break;
						}
					}
				},
				"getSorter": function( th, ascendant ) {
					( methods.sorter[ $.type( settings.sorter ) ] || $.noop )( th, ascendant );
				},
				"sorter": {
					"function": function( th, ascendant ) {
						settings.sorter.call( th, ascendant );
					},
					"string": function( th, ascendant ) {
						if ( renderers.sortable[ settings.sorter ] ) {
							// plugin
							renderers.sortable[ settings.sorter ].call( th, ascendant );
							return true;
						} else {
							// no plugin found
							datagrid._onError( "Unknown sorter", settings.sorter );
							return false;
						}
					},
					"object": function( th, ascendant ) {
						// plugin
						var isLoaded = false;
						for ( var p in settings.sorter ) {
							if ( renderers.sortable[ p ] ) {
								isLoaded = true;
								renderers.sortable[ p ].call( th, ascendant, settings.sorter[ p ] );
								return true;
							}
						}
						if ( !isLoaded ) {
							// no plugin found
							datagrid._onError( "Unknown sorter", JSON.stringify( settings.sorter ) );
							return false;
						}
					}
				},
				"getCell": function( result, i, row, td ) {
					if ( settings.col[ i ].render === false ) {
						return result.data[ row ][ settings.col[ i ].field ];
					} else {
						return ( methods.cell[ $.type( settings.col[ i ].render ) ] || function() { return "" } )( i, td, {
							value: result.data[ row ][ settings.col[ i ].field ], 
							field: settings.col[ i ].field,
							row: result.data[ row ], 
							colindex: i
						});
					}
				},
				"cell": {
					"function": function( i, td, renderParams ) {
						// "this" is the $(td) in the callback
						return settings.col[ i ].render.call( td, renderParams );
					},
					"string": function( i, td, renderParams ) {
						if ( renderers.cell[ settings.col[ i ].render ] ) {
							// plugin
							return renderers.cell[ settings.col[ i ].render ].call( td, renderParams );
						} else {
							// no plugin found
							datagrid._onError( "Unknown cell render", settings.col[ i ].render );
							return "";
						}
					},
					"object": function( i, td, renderParams ) {
						// plugin
						var isLoaded = false;
						for ( var p in settings.col[ i ].render ) {
							if ( renderers.cell[ p ] ) {
								isLoaded = true;
								return renderers.cell[ p ].call( td, renderParams, settings.col[ i ].render[ p ] );
							}
						}
						if ( !isLoaded ) {
							// no plugin found
							datagrid._onError( "Unknown cell render", JSON.stringify( settings.col[ i ].render ) );
							return "";
						}
					}
				},
				"getPager": function( page, lastpage ) {
					return ( methods.pager[ $.type( settings.pager ) ] || methods.pager[ "default" ] )( page, lastpage );
				},
				"pager": {
					"string": function( page, lastpage ) {
						if ( settings.pager == "default" ) {
							// default pager
							var pager = $( "<div>" );
							for ( var i = 1 ; i <= lastpage ; i++ ) {
								pager.append(
									$("<span>", {
										data: { "page": i },
										html: " &nbsp;"+i+"&nbsp; ",
										click: function() {
											datagrid.setPage( $(this).data( "page" ) );
											datagrid.getData();
										}
									})
								);
							}
							return pager;
						} else if ( renderers.pager[ settings.pager ] ) {
							// plugin
							return renderers.pager[ settings.pager ].call( datagrid, page, lastpage );
						} else {
							// no plugin found
							datagrid._onError( "Unknown sorter", settings.pager );
							return false;
						}
					},
					"function": function( page, lastpage ) {
						return settings.pager.call( datagrid, page, lastpage );
					},
					"object": function( page, lastpage ) {
						// plugin
						var isLoaded = false;
						for ( var p in settings.pager ) {
							if ( renderers.pager[ p ] ) {
								isLoaded = true;
								return renderers.pager[ p ].call( datagrid, page, lastpage, settings.pager[ p ] );
							}
						}
						if ( !isLoaded ) {
							// no plugin found
							datagrid._onError( "Unknown sorter", JSON.stringify( settings.pager ) );
							return false;
						}
					}
				},
				"getNoData": function() {
					return ( methods.noData[ $.type( settings.noData ) ] || function() { datagrid.html("") } )();
				},
				"noData": {
					"string": function() {
						datagrid.html( settings.noData );
					},
					"function": function() {
						datagrid.html( settings.noData() );
					}
				}
			}
			
			// get data from source
			datagrid.getData = function( filters ) {
				
				// onBefore
				if ( settings.onBefore !== false ) {
					settings.onBefore.call( this );
				}
				
				// extend default params with filters
				if ( filters ) {
					$.extend( params, filters );
				}
				
				paramsUsed = $.extend( {}, datagrid.getParams() );
				
				// loading
				datagrid.find( "table" ).css( "opacity", 0.5 );
				
				// get data by source
				methods.getSource();
			}
			
			datagrid.renderData = function( data ) {
				// event : onSourceData
				if ( $.type( settings.onSourceData ) === "function" ) data = settings.onSourceData( data );
				
				if ( $.type( data ) === 'string' ) {
					datagrid.renderTable( JSON.parse( data ) );
				} else {
					datagrid.renderTable( data );
				}
			}
			
			// render html table
			datagrid.renderTable = function( result ) {
				if ( result == undefined ) {
					return;
				}

				var i;
				
				total = ( result.total ) ? result.total : result.data.length;
				
				// event : onData
				if ( $.type( settings.onData ) === "function" ) result = settings.onData( result );
				
				// reset container
				if ( settings.resetContainer ) {
					datagrid.html("");
				}
				
				if ( result.data && result.data.length > 0 ) {
					
					table = $( "<table>" );
					if ( settings.attr !== false ) table.attr( settings.attr );
					
					var thead = $( "<thead>" ),
						tbody = $( "<tbody>" ),
						tr = $( "<tr>" ),
						td;
					
					// table header
					for ( i=0 ; i<settings.col.length ; i++ ) {
						tr.append( function() {
							var th = $( "<th>" , {
								"html": settings.col[i].title,
								"data": { "field": settings.col[i].field }
							}).attr(settings.col[ i ].attrHeader);
								
							// sortable column
							if ( settings.col[i].sortable ) {
								th
									.data({
										"direction": settings.col[i].sortableDefaultAsc,
										"colIndex": i 
									})
									.css( "cursor", "pointer" )
									.addClass( "text-info" )
									.on( "click", function() {
										
										datagrid.setPage( 1 );
										params[ settings.paramsMapping.orderby ] = $(this).data( "field" );
										params[ settings.paramsMapping.direction ] = ( $(this).data( "direction" ) ) ? "asc" : "desc";
										
										settings.col[ $(this).data( "colIndex" ) ].sortableDefaultAsc = !settings.col[ $(this).data( "colIndex" ) ].sortableDefaultAsc;
										
										datagrid.getData();
										
									});
								
								if ( params[ settings.paramsMapping.orderby ] == settings.col[i].field ) {
									
									var ascendant = !settings.col[i].sortableDefaultAsc;
									
									// event : sorter
									methods.getSorter( th, ascendant );
								}
							}
							
							return th;
						});
					}
					table.append( thead.append( tr ) );
					for ( var row = 0 ; row < result.data.length ; row++ ) {
						tr = $( "<tr>" );
						
						// event : onRowData
						if ( $.type( settings.onRowData ) === "function" ) result.data[ row ] = settings.onRowData( result.data[ row ], row, tr );
						
						for ( i = 0 ; i < settings.col.length ; i++ ) {
							var td = $( "<td>" ).attr( settings.col[ i ].attr );
							
							// cell render
							tr.append( 
								td.append( methods.getCell( result, i, row, td ) ) 
							);
						}
						
						tbody.append( tr );
					}
					table.append( tbody );
					
					// pager
					if ( $.inArray( "top", settings.pagerPosition ) >= 0 ) {
						datagrid.append( methods.getPager( params[ settings.paramsMapping.page ], Math.ceil( total / params[ settings.paramsMapping.paging ] ) ) );
					}
					
					datagrid.append( table );
					
					// pager
					if ( $.inArray( "bottom", settings.pagerPosition ) >= 0 ) {
						datagrid.append( methods.getPager( params[ settings.paramsMapping.page ], Math.ceil( total / params[ settings.paramsMapping.paging ] ) ) );
					}
					
				} else {
					
					// no data
					methods.getNoData();
					
				}
				
				// onComplete
				if ( settings.onComplete !== false ) {
					settings.onComplete.call( this );
				}
				
			}
			
			// pager helper
			datagrid.getPagerLimits = function( behavior, lastpage ) {
				if ( $.type( behavior ) === 'string' ) {
					var oldbehavior = behavior;
					behavior = {};
					behavior[ oldbehavior ] = {};
				}
				
				if ( behavior[ "sliding" ] ) {
					var page = datagrid.getPage(),
						pages = ( behavior[ "sliding" ][ "pages" ] ) ? behavior[ "sliding" ][ "pages" ] : 4;
					return {
						minpage: Math.max( 1, Math.min( page - pages, lastpage - ( 2 * pages ) ) ), 
						maxpage: Math.min( lastpage, Math.max( page + pages, ( 2 * pages ) + 1 ) ), 
						prevpage: ( page == 1 ) ? 1 : page - 1, 
						nextpage: ( page == lastpage ) ? lastpage : page + 1
					};
				}
			}
			
			// auto filters
			datagrid.addFilter = function( selector ) {
				selector.each( function() {
					$selector = $(this);
					switch ( this.tagName ) {
						case "SELECT":
						case "TEXTAREA":
						case "INPUT":
							datagrid.addElementFilter( $selector, "change" );
						break;
						
						default:
							// loop to find form elements
							$selector.find( "[name]" ).each( function() {
								if ( $.inArray( $(this)[0].tagName, [ "SELECT", "TEXTAREA", "INPUT" ] ) != -1 ) {
									datagrid.addElementFilter( $(this), "change", $selector );
								}
							});
						break;
					}
				});
			}
			
			// add filter on input, select, textarea
			datagrid.addElementFilter = function( $element, eventName, selector ) {
				// no auto add if data datagrid-filter = "disable"
				if ( $element.data("datagrid-filter") == "disable" ) return false;
				
				$element.on( eventName, function() {
					switch ( $element[0].type ) {
						case "checkbox":
							var isMultiple = ( $element[0].name.substr(-2) == "[]" );
							if ( isMultiple ) {
								params[ $element[0].name ] = [];
								selector.find( "[name='" + $element[0].name + "']" ).each( function() {
									if ( this.checked ) params[ $element[0].name ].push( $(this).val() );
								});
							} else {
								params[ $element[0].name ] = ( $element[0].checked ) ? $element.val() : '';
							}
						break;
						
						default:
							params[ $element[0].name ] = $element.val();
						break;
					}
					datagrid.setPage( 1 );
					datagrid.getData();
				});
			}
			
			// log errors
			datagrid._onError = function( err, value ) {
				console.error( "[jQuery.datagrid Error] " + err + ": " + value + "" );
			}
			
			// if autoload, get data
			if ( settings["autoload"] ) datagrid.getData();
			
			return this;
		}
	});
})(jQuery);