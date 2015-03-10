/*
 *  Project: jquery.datagrid
 *  Description: datagrid
 *  Version: 0.2
 *  Author: Creative Area www.creative-area.net
 *  License: Dual licensed under the MIT or GPL Version 2 licenses.
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window is passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "datagrid";

    // Default plugin options
    var defaults = {
            source: "default", // plugin
            url: "",
            data: false,
            autoload: true,
            paramsDefault: {},
            paramsMapping: {
                page: "page",
                paging: "paging",
                orderby: "orderby",
                direction: "direction"
            },
            parse: function( data ) {
                if ( $.type( data ) === 'string' ) {
                    return JSON.parse( data );
                } else {
                    return data;
                }
            },
            col: [],
            attr: {},
            attrSortable: {},
            noData: "no data",
            onBefore: false,
            onData: false,
            onRowData: false,
            onComplete: false,
            sorter: "default", // plugin
            pager: "default", // plugin
            pagerPosition: "bottom",
            resetContainer: true
        };

    // Default column options
    var defaultsColumn = {
            field: "",
            title: "",
            render: "default", // plugin
            sortable: false,
            sortableDefaultAsc: true,
            attr: {},
            attrHeader: {}
        };

    // tools
    var tools = {
        // pager helper
        getPagerLimits: function( behavior, page, lastpage ) {
            if ( $.type( behavior ) === 'string' ) {
                var oldbehavior = behavior;
                behavior = {};
                behavior[ oldbehavior ] = {};
            }

            if ( behavior[ "sliding" ] ) {
                var pages = ( behavior[ "sliding" ][ "pages" ] ) ? behavior[ "sliding" ][ "pages" ] : 3;
                return {
                    minpage: Math.max( 1, Math.min( page - pages, lastpage - ( 2 * pages ) ) ),
                    maxpage: Math.min( lastpage, Math.max( page + pages, ( 2 * pages ) + 1 ) )
                };
            }
        },
        data: {
            // sort array of objects by key
            sorter: function( data, key, comparator ) {
                return data.sort(function(a, b) {
                    var x = a[key];
                    var y = b[key];
                    if ( 1*x - x === 0 ) {
                        x = 1*x;
                    }
                    if ( 1*y - y === 0 ) {
                        y = 1*y;
                    }
                    return ((x < y) ? -comparator : ((x > y) ? comparator : 0));
                });
            },
            // filter data
            filter: function( data, filters ) {
                var filteredData = [];
                for ( var i=0 ; i<data.length ; i++ ) {
                    var good = true;
                    for ( var filter in filters ) {
                        if ( "" + filters[ filter ] !== "" ) {
                            good = good && ( "" + data[ i ][ filter ] === "" + filters[ filter ] );
                        }
                    }
                    if ( good ) {
                        filteredData.push( data[ i ] );
                    }
                }
                return filteredData;
            }
        }
    };

    // Plugins
    var plugins = {
            sourceArgs: 0,
            source: {
                "default": function( sourceOptions ) {
                    var datagrid = this;
                    var options = {
                        url: datagrid.settings.url
                    };
                    $.extend( options, sourceOptions );
                    $.post( options.url, datagrid.params(), function( result ) {
                        datagrid.render( result );
                    } );
                },
                "data": function( sourceOptions ) {
                    var datagrid = this;
                    var params = datagrid.params();
                    var page = params[ datagrid.settings.paramsMapping.page ];
                    var paging = params[ datagrid.settings.paramsMapping.paging ];
                    var orderby = params[ datagrid.settings.paramsMapping.orderby ];
                    var direction = params[ datagrid.settings.paramsMapping.direction ];
                    var options = {
                        sorter: tools.data.sorter,
                        filter: tools.data.filter,
                        data: datagrid.settings.data
                    };
                    $.extend( options, sourceOptions );
                    var filters = $.extend( {}, params );
                    delete filters[ datagrid.settings.paramsMapping.page ];
                    delete filters[ datagrid.settings.paramsMapping.paging ];
                    delete filters[ datagrid.settings.paramsMapping.orderby ];
                    delete filters[ datagrid.settings.paramsMapping.direction ];
                    if ( options.data ) {
                        if ( orderby !== "" ) {
                            options.data = options.sorter( options.data, orderby, ( direction === "desc" ) ? -1 : 1 );
                        }
                        if ( options.filter !== false ) {
                            options.data = options.filter( options.data, filters );
                        }
                        pagedata = options.data.slice( (page-1)*paging, page*paging );
                        datagrid.render( { total: options.data.length, data: pagedata } );
                    }
                }
            },
            sorterArgs: 1,
            sorter: {
                "default": function( ascendant, sorterOptions ) {
                    var options = {
                        up: " ↑",
                        down: " ↓"
                    };
                    if ( sorterOptions ) {
                        $.extend( options, sorterOptions );
                    }
                    if ( ascendant ) {
                        this.append( options.up );
                    } else {
                        this.append( options.down );
                    }
                }
            },
            cellArgs: 1,
            cell: {
                "default": function( data, cellOptions ) {
                    return data.value;
                }
            },
            pagerArgs: 2,
            pager: {
                "default": function( page, lastpage, pagerOptions ) {
                    var datagrid = this;
                    var options = {
                        container: "div",
                        attrContainer: {},
                        attrUl: {},
                        item: "span", // "span", "div", "li" (auto insert ul)
                        attrItemActive: {},
                        attrItemDisabled: {},
                        before: " ",
                        after: " ",
                        link: false,
                        firstPage: false,
                        prevPage: false,
                        nextPage: false,
                        lastPage: false,
                        hideDisabled: false,
                        behavior: false // "sliding", "paging"
                    };
                    if ( pagerOptions ) {
                        $.extend( options, pagerOptions );
                    }

                    var container = $( "<" + options.container + ">" ).attr( options.attrContainer );
                    if ( options.item === "li" ) {
                        var ul = $( "<ul>" ).attr( options.attrUl );
                        container.append( ul );
                        container = ul;
                    }

                    // default limits (all pages)
                    var pagerLimits = {
                        minpage: 1,
                        maxpage: lastpage
                    };

                    // behavior helper
                    if ( options.behavior ) {
                        pagerLimits = datagrid.tools.getPagerLimits( options.behavior, datagrid.page(), lastpage );
                    }

                    var pagerExtremes = function ( disabled, gopage, label ) {
                        var element;
                        if ( disabled ) {
                            element = ( options.hideDisabled ) ? false : $("<" + options.item + ">").attr( options.attrItemDisabled );
                        } else {
                            element = $("<" + options.item + ">", {
                                data: { "page": gopage },
                                "class": pluginName + "-page"
                            });
                        }
                        if ( element ) {
                            element.append(
                                $("<a>").html( label )
                            );
                            container.append( element );
                        }
                    };
                    if ( options.firstPage ) {
                        pagerExtremes( ( page == 1 ), 1, options.firstPage );
                    }
                    if ( options.prevPage ) {
                        pagerExtremes( ( page == 1 ), page - 1, options.prevPage );
                    }
                    for ( var i = pagerLimits.minpage ; i <= pagerLimits.maxpage ; i++ ) {
                        container.append(
                            $("<" + options.item + ">", {
                                data: { "page": i },
                                attr: ( page == i ) ? options.attrItemActive : {},
                                "class": pluginName + "-page"
                            })
                            .append(
                                ( options.link ) ? $("<a>").html( options.before + i + options.after ) : options.before + i + options.after
                            )
                        );
                    }
                    if ( options.nextPage ) {
                        pagerExtremes( ( page == lastpage ), page + 1, options.nextPage );
                    }
                    if ( options.lastPage ) {
                        pagerExtremes( ( page == lastpage ), lastpage, options.lastPage );
                    }
                    return container;
                }
            }
        };

    // post alias
    plugins.source.post = plugins.source.default;

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.$el = $(element);

        this.settings = $.extend( true, {}, defaults, options ) ;

        if ( $.type( this.settings.pagerPosition ) === "string" ) {
            this.settings.pagerPosition = [ this.settings.pagerPosition ];
        }

        // extend columns settings with default definition
        for ( i=0 ; i<this.settings.col.length ; i++ ) {
            this.settings.col[i] = $.extend( {}, defaultsColumn, this.settings.col[i] );
        }

        // init default _params
        this._params = {};
        this._params[ this.settings.paramsMapping.page ] = 1;
        this._params[ this.settings.paramsMapping.paging ] = 15; // 0 for no paging
        this._params[ this.settings.paramsMapping.orderby ] = "";
        this._params[ this.settings.paramsMapping.direction ] = "";
        
        $.extend( this._params, this.settings.paramsDefault );

        // backup default params for reset
        this._paramsDefault = $.extend( {}, this._params, this.settings.paramsDefault );

        this.tools = tools;

        this._defaults = defaults;
        this._name = pluginName;

        // cache auto filtered elements (needed to remove filters events)
        this._filters = [];

        // static data
        if ( this.settings.data !== false && !this.settings.source.data ) {
            this.settings.source = "data";
        }

        this.init();
    }

    Plugin.prototype = {
        init: function () {
            var datagrid = this;

            // sorter events
            this.$el.on( "click", "." + pluginName + "-sortable", function(e) {
                e.preventDefault();
                var $this = $(this);
                datagrid.page( 1 );
                datagrid.orderby( $this.data( "field" ) );
                datagrid.direction( ( $this.data( "direction" ) ) ? "asc" : "desc" );
                datagrid.settings.col[ $this.data( "colIndex" ) ].sortableDefaultAsc = !datagrid.settings.col[ $this.data( "colIndex" ) ].sortableDefaultAsc;
                datagrid.fetch();
            });

            // pager events
            this.$el.on( "click", "." + pluginName + "-page", function(e) {
                e.preventDefault();
                datagrid.page( $(this).data( "page" ) );
                datagrid.fetch();
            });

            // if autoload, get data
            if ( this.settings.autoload ) {
                this.fetch();
            }
        },

        // get params
        params: function() {
            return this._params;
        },

        // reset params
        reset: function() {
            this._params = $.extend( {}, this._paramsDefault );
        },

        // get / set page
        page: function( page ) {
            if ( page === undefined ) {
                return this._params[ this.settings.paramsMapping.page ];
            } else {
                this._params[ this.settings.paramsMapping.page ] = page;
            }
        },

        // get / set paging
        paging: function( paging ) {
            if ( paging === undefined ) {
                return this._params[ this.settings.paramsMapping.paging ];
            } else {
                this._params[ this.settings.paramsMapping.paging ] = paging;
            }
        },

        // get / set orderby
        orderby: function( orderby ) {
            if ( orderby === undefined ) {
                return this._params[ this.settings.paramsMapping.orderby ];
            } else {
                this._params[ this.settings.paramsMapping.orderby ] = orderby;
            }
        },

        // get / set direction
        direction: function( direction ) {
            if ( direction === undefined ) {
                return this._params[ this.settings.paramsMapping.direction ];
            } else {
                this._params[ this.settings.paramsMapping.direction ] = direction;
            }
        },

        fetch: function( filters ) {
            // onBefore
            if ( this.settings.onBefore !== false ) {
                this.settings.onBefore.call( this );
            }

            // extend default params with filters
            if ( filters ) {
                $.extend( this._params, filters );
            }

            // loading
            this.$el.find( "table" ).css( "opacity", 0.5 );

            // get data by source
            this.getSource();
        },

        // plugins
        getSource: function() {
            ( this.source[ $.type( this.settings.source ) ] || $.noop )( this );
        },
        source: {
            "function": function( self ) {
                $.when(
                    self.settings.source.call( self )
                ).done(
                    function( result ) {
                        self.render( result );
                    }
                );
            },
            "string": function( self ) {
                if ( plugins.source[ self.settings.source ] ) {
                    plugins.source[ self.settings.source ].call( self );
                } else {
                    // no plugin found
                    self._onError( "Unknown source", self.settings.source );
                    return false;
                }
            },
            "object": function( self ) {
                // plugin
                var isLoaded = false;
                for ( var p in self.settings.source ) {
                    if ( plugins.source[ p ] ) {
                        isLoaded = true;
                        plugins.source[ p ].call( self, self.settings.source[ p ] );
                        return true;
                    }
                }
                if ( !isLoaded ) {
                    // no plugin found
                    self._onError( "Unknown sorter", JSON.stringify( self.settings.source ) );
                    return false;
                }
            }
        },

        render: function( data ) {
            if ( $.type( this.settings.parse ) === "function" ) data = this.settings.parse( data );
            this.renderTable( data );
        },

        // render html table
        renderTable: function( result ) {

            if ( result === undefined ) {
                return;
            }

            var i;
            var table, total;
            var self = this;

            total = ( result.total ) ? result.total : result.data.length;

            // event : onData
            if ( $.type( this.settings.onData ) === "function" ) result = ( this.settings.onData( result ) || result );

            // reset container
            if ( this.settings.resetContainer ) {
                this.$el.html("");
            }

            if ( result.data && result.data.length > 0 ) {

                table = $( "<table>" ).attr( this.settings.attr );

                var thead = $( "<thead>" ),
                    tbody = $( "<tbody>" ),
                    tr = $( "<tr>" ),
                    td;

                // table header
                for ( i=0 ; i<this.settings.col.length ; i++ ) {
                    tr.append( function() {
                        var th = $( "<th>" , {
                            "html": self.settings.col[i].title,
                            "data": { "field": self.settings.col[i].field }
                        }).attr(self.settings.col[ i ].attrHeader);

                        // sortable column
                        if ( self.settings.col[i].sortable ) {
                            th
                                .data({
                                    "direction": self.settings.col[i].sortableDefaultAsc,
                                    "colIndex": i
                                })
                                .css( "cursor", "pointer" )
                                .attr( self.settings.attrSortable )
                                .addClass( pluginName + "-sortable" );

                            if ( self.orderby() == self.settings.col[i].field ) {

                                var ascendant = !self.settings.col[i].sortableDefaultAsc;

                                th.addClass(  pluginName + "-sortable-" + (ascendant ? 'asc' : 'desc') );

                                // event : sorter
                                self.getSorter( th, ascendant );
                            }
                        }

                        return th;
                    });
                }

                table.append( thead.append( tr ) );
                for ( var row = 0 ; row < result.data.length ; row++ ) {
                    tr = $( "<tr>" );

                    // event : onRowData
                    if ( $.type( this.settings.onRowData ) === "function" ) result.data[ row ] = ( this.settings.onRowData( result.data[ row ], row, tr ) || result.data[ row ] );

                    for ( i = 0 ; i < this.settings.col.length ; i++ ) {
                        td = $( "<td>" ).attr( this.settings.col[ i ].attr );

                        // cell render
                        tr.append(
                            td.append( this.getCell( result, i, row, td ) )
                        );
                    }

                    tbody.append( tr );
                }
                table.append( tbody );

                // pager
                if ( $.inArray( "top", this.settings.pagerPosition ) >= 0 ) {
                    this.renderPager( total );
                }

                this.$el.append( table );

                // pager
                if ( $.inArray( "bottom", this.settings.pagerPosition ) >= 0 ) {
                    this.renderPager( total );
                }

            } else {

                // no data
                this.getNoData();

            }

            // onComplete
            if ( this.settings.onComplete !== false ) {
                this.settings.onComplete.call( this );
            }

        },

        renderPager: function( total ) {
            this.$el.append( this.getPager( this._params[ this.settings.paramsMapping.page ], Math.ceil( total / this._params[ this.settings.paramsMapping.paging ] ) ) );
        },

        getSorter: function( th, ascendant ) {
            ( this.sorter[ $.type( this.settings.sorter ) ] || $.noop )( this, th, ascendant );
        },
        sorter: {
            "function": function( self, th, ascendant ) {
                this.settings.sorter.call( th, ascendant );
            },
            "string": function( self, th, ascendant ) {
                if ( plugins.sorter[ self.settings.sorter ] ) {
                    // plugin
                    plugins.sorter[ self.settings.sorter ].call( th, ascendant );
                    return true;
                } else {
                    // no plugin found
                    self._onError( "Unknown sorter", self.settings.sorter );
                    return false;
                }
            },
            "object": function( self, th, ascendant ) {
                // plugin
                var isLoaded = false;
                for ( var p in self.settings.sorter ) {
                    if ( plugins.sorter[ p ] ) {
                        isLoaded = true;
                        plugins.sorter[ p ].call( th, ascendant, self.settings.sorter[ p ] );
                        return true;
                    }
                }
                if ( !isLoaded ) {
                    // no plugin found
                    self._onError( "Unknown sorter", JSON.stringify( self.settings.sorter ) );
                    return false;
                }
            }
        },

        getCell: function( result, i, row, td ) {
            return ( this.cell[ $.type( this.settings.col[ i ].render ) ] || function() { return ""; } )( this, i, td, {
                value: result.data[ row ][ this.settings.col[ i ].field ],
                field: this.settings.col[ i ].field,
                row: result.data[ row ],
                colindex: i
            });
        },
        cell: {
            "function": function( self, i, td, renderParams ) {
                // "this" is the $(td) in the callback
                return self.settings.col[ i ].render.call( td, renderParams );
            },
            "string": function( self, i, td, renderParams ) {
                if ( plugins.cell[ self.settings.col[ i ].render ] ) {
                    // plugin
                    return plugins.cell[ self.settings.col[ i ].render ].call( td, renderParams );
                } else {
                    // no plugin found
                    self._onError( "Unknown cell render", self.settings.col[ i ].render );
                    return "";
                }
            },
            "object": function( self, i, td, renderParams ) {
                // plugin
                var isLoaded = false;
                for ( var p in self.settings.col[ i ].render ) {
                    if ( plugins.cell[ p ] ) {
                        isLoaded = true;
                        return plugins.cell[ p ].call( td, renderParams, self.settings.col[ i ].render[ p ] );
                    }
                }
                if ( !isLoaded ) {
                    // no plugin found
                    self._onError( "Unknown cell render", JSON.stringify( self.settings.col[ i ].render ) );
                    return "";
                }
            }
        },

        getPager: function( page, lastpage ) {
            return ( this.pager[ $.type( this.settings.pager ) ] || this.pager[ "default" ] )( this, page, lastpage );
        },
        pager: {
            "string": function( self, page, lastpage ) {
                if ( plugins.pager[ self.settings.pager ] ) {
                    // plugin
                    return plugins.pager[ self.settings.pager ].call( self, page, lastpage );
                } else {
                    // no plugin found
                    self._onError( "Unknown pager", self.settings.pager );
                    return false;
                }
            },
            "function": function( self, page, lastpage ) {
                return self.settings.pager.call( self, page, lastpage );
            },
            "object": function( self, page, lastpage ) {
                // plugin
                var isLoaded = false;
                for ( var p in self.settings.pager ) {
                    if ( plugins.pager[ p ] ) {
                        isLoaded = true;
                        return plugins.pager[ p ].call( self, page, lastpage, self.settings.pager[ p ] );
                    }
                }
                if ( !isLoaded ) {
                    // no plugin found
                    self._onError( "Unknown sorter", JSON.stringify( self.settings.pager ) );
                    return false;
                }
            }
        },

        getNoData: function() {
            return ( this.noData[ $.type( this.settings.noData ) ] || function() { this.element.html(""); } )( this );
        },
        noData: {
            "string": function( self ) {
                self.$el.html( self.settings.noData );
            },
            "function": function( self ) {
                self.$el.html( self.settings.noData() );
            }
        },

        // auto filters
        filters: function( selector ) {
            var self = this;
            if ( $.type( selector ) === "string" ) selector = $( selector );
            selector.each( function() {
                $selector = $(this);
                switch ( this.tagName ) {
                    case "SELECT":
                    case "TEXTAREA":
                    case "INPUT":
                        self.addElementFilter( $selector, "change" );
                    break;

                    default:
                        // loop to find form elements
                        $selector.find( "[name]" ).each( function() {
                            if ( $.inArray( $(this)[0].tagName, [ "SELECT", "TEXTAREA", "INPUT" ] ) != -1 ) {
                                self.addElementFilter( $(this), "change", $selector );
                            }
                        });
                    break;
                }
            });
        },

        // add filter on input, select, textarea
        addElementFilter: function( $element, eventName, selector ) {
            var self = this;

            // no auto add if data datagrid-filter = "disable"
            if ( $element.data("datagrid-filter") == "disable" ) return false;

            $element.on( eventName, function() {
                switch ( $element[0].type ) {
                    case "checkbox":
                        var isMultiple = ( $element[0].name.substr(-2) == "[]" );
                        if ( isMultiple ) {
                            self._params[ $element[0].name ] = [];
                            selector.find( "[name='" + $element[0].name + "']" ).each( function() {
                                if ( this.checked ) self._params[ $element[0].name ].push( $(this).val() );
                            });
                        } else {
                            self._params[ $element[0].name ] = ( $element[0].checked ) ? $element.val() : '';
                        }
                    break;

                    default:
                        self._params[ $element[0].name ] = $element.val();
                    break;
                }
                self.page( 1 );
                self.fetch();
            });

            this._filters.push([$element, eventName]);
        },

        // error
        _onError: function( err, value ) {
            console.error( "[jquery.datagrid error] " + err + ": " + value + "" );
        }
    };

    // You don't need to change something below:
    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations and allowing any
    // public function (ie. a function whose name doesn't start
    // with an underscore) to be called via the jQuery plugin,
    // e.g. $(element).datagrid('functionName', arg1, arg2)
    $.fn[pluginName] = function ( options ) {
        var args = arguments;

        // Is the first parameter an object (options), or was omitted,
        // instantiate a new instance of the plugin.
        if (options === undefined || typeof options === "object") {
            return this.each(function () {

                // Only allow the plugin to be instantiated once,
                // so we check that the element has no plugin instantiation yet
                if (!$.data(this, "plugin_" + pluginName)) {

                    // if it has no instance, create a new one,
                    // pass options to our plugin constructor,
                    // and store the plugin instance
                    // in the elements jQuery data object.
                    $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
                }
            });

        // If the first parameter is a string and it doesn't start
        // with an underscore or "contains" the `init`-function,
        // treat this as a call to a public method.
        } else if (typeof options === "string" && options[0] !== "_" && options !== "init") {

            // Cache the method call
            // to make it possible
            // to return a value
            var returns;

            // Plugins
            if (options === "plugin") {
                // Add Plugins
                // $.fn.datagrid( "plugin", "source|sorter|pager|cell", "pluginName", function );
                if ( args.length === 4 && typeof args[1] === "string" && typeof args[2] === "string" && typeof args[3] === "function" ) {
                    // plugins[ type ][ name ] = callback;
                    plugins[ args[1] ][ args[2] ] = args[3];
                    return this;
                }
                // Extend Plugins
                // $.fn.datagrid( "plugin", "source|sorter|pager|cell", "pluginName", "extendedPluginName", extendedOptions );
                if ( args.length === 5 && typeof args[1] === "string" && typeof args[2] === "string" && typeof args[3] === "string" ) {
                    // plugins[ type ][ name ] = callback;
                    var pluginType = args[1];
                    plugins[ pluginType ][ args[2] ] = function() {
                        var _args = [];
                        for ( var i=0 ; i < arguments.length ; i++ ) {
                            _args.push(arguments[i]);
                        }
                        if ( _args.length > plugins[ pluginType + "Args" ] ) {
                            _args[ _args.length - 1 ] = $.extend( args[4], _args[ _args.length - 1 ] );
                        } else {
                            _args.push( args[4] );
                        }
                        return plugins[ pluginType ][ args[3] ].apply( this, _args );
                    };
                    return this;
                }
            }

            // Get datagrid instance
            if (options === pluginName) {
                return this.data("plugin_" + pluginName);
            }

            this.each(function () {
                var instance = $.data(this, "plugin_" + pluginName);

                // Tests that there's already a plugin-instance
                // and checks that the requested public method exists
                if (instance instanceof Plugin && typeof instance[options] === "function") {

                    // Call the method of our plugin instance,
                    // and pass it the supplied arguments.
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }

                // Allow instances to be destroyed via the 'destroy' method
                if (options === "destroy") {
                    // remove events
                    instance.$el.off( "click", "." + pluginName + "-sortable");
                    instance.$el.off( "click", "." + pluginName + "-page");
                    for ( var i=0 ; i<instance._filters.length ; i++ ) {
                        instance._filters[i][0].off(instance._filters[i][1]);
                    }
                    // remove plugin
                    instance.$el.children().remove();
                    // delete plugin instance saved on element data
                    $.data(this, "plugin_" + pluginName, null);
                    instance = null;
                }
            });

            // If the earlier cached method
            // gives a value back return the value,
            // otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    };

}(jQuery, window, document));