jquery.datagrid
===============

- Fetch data from any source: local data or remote data (using ajax, deferred function or plugin)
- Render a simple HTML Table easy to style (no imposed css)
- Simple columns definition
- Semi-automatic sorter and pager (for remote data, you need to code server side)
- Plugins for cell, pager and sorter renderers (easy to create, very easy to extend)
- Events on each step (you do what you want with your data)
- Convert form elements (input, select) into automatic filters (magic!)


# Demo

<a href="http://labs.creative-area.net/jquery.datagrid/demo/">jquery.datagrid demo</a>


# Install

`bower install jquery.datagrid`

or

`npm install jquery.datagrid`


# Configuration

Just load `jquery.datagrid.js` (and optional plugin scripts if you want to use them)

A simple example with **remote data** (fetch by ajax post)

```html
<script type="text/javascript" src="jquery.datagrid.js"></script>
<script type="text/javascript">
$( document ).ready( function() {
	var datagrid = $(container).datagrid({
		url: "get-data-url",
		col: [{
			field: "name",
			title: "Name",
			sortable: true
		},{
			field: "age",
			title: "Age",
			render: function( data ) {
				return "<strong>" + data.value + "<strong>";
			}
		}]
	})
});	
</script>
```

Another simple example with **local data**

```html
<script type="text/javascript" src="jquery.datagrid.js"></script>
<script type="text/javascript">
$( document ).ready( function() {
    var datagrid = $(container).datagrid({
        data: [{
            firstname: "Bob",
            lastname: "Dylan"
        },{
            firstname: "Jimi",
            lastname: "Hendrix"
        }],
        col: [{
            field: "firstname",
            title: "Firstname"
        },{
            field: "lastname",
            title: "Lastname",
            sortable: true,
            render: function( data ) {
                return "<strong>" + data.value + "<strong>";
            }
        }]
    })
}); 
</script>
```

## Options

```javascript
// All options with default values
{
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
    pagerPosition: "bottom"
}
```

### Options detail

List of `option names` ( *expected values* )

#### Get data

- `source` ( *string* || *object* || *function* ) : data fetching method: function, plugin name (string) or plugin name with config (object). - *see __Source Plugins__ below*
- `url`  ( *string* ) : server url where data are fetch (with POST params data). Used by `default` source.
- `data` ( *false* || *array* ) : local data (no remote fetch). If not `false`, `source` will be automatically set to `"data"`.
- `autoload` ( *boolean* ) : auto load data. If set to `false`, you need to load manualy the data with `datagrid.fetch()` method.
- `paramsDefault` ( *object* ) : default params added to the data request.
- `paramsMapping` ( *object* ) : you can map param names used for paging and sorting (keys used: see default value).
- `parse`( *function* ) : callback function that parse data before render. By default, decode data in `JSON` if data is a `string`.

#### Render data

- `col`	( *array* ) : array of column definition objects. - *see __Column options__ below*
- `attr` ( *false* || *object* ) : an object of attribute-value pairs: generate the table element attributes.
- `attrSortable` ( *false* || *object* ) : an object of attribute-value pairs: params for `$(th).attr()` if column is sortable.
- `noData` ( *string* || *function* ) : `string`: it will be displayed instead of the table if there is no data. `function`: the result returned by the function will be displayed.

#### Plugins

- `sorter` ( *string* || *object* ) : display text or icon on table header when columns are sorted (asc or desc). - *see __Plugins__ below*
- `pager` ( *string* || *object* ) : render the pager. `default` pager write page numbers in a `span`, all in a `div`. - *see __Plugins__ below*
- `pagerPosition` ( *false* || *"top"* || *"bottom"* || *["top","bottom"]* ) : display the pager on `"bottom"` of the `table`, or on the `"top"`, or both with `["top","bottom"]`.

#### Events

- `onBefore` ( *false* || *function* ) : callback `function()`. Scope is `datagrid`.
- `onData` ( *false* || *function* ) : callback `function( { "total": Total number of data without paging, "data": [ Array of row ] } )`
- `onRowData` ( *false* || *function* ) : callback `function( data[ numrow ], numrow, $tr )`
- `onComplete` ( *false* || *function* ) : callback `function()`. Scope is `datagrid`.


## Columns

### Column options

```javascript
// All column options with default values
{
	field: "",			// Field name
	title: "",			// Title display in the `th`content
	attrHeader: {},		// Param for `$(th).attr()`
	attr: {},			// Param for `$(td).attr()`
	sortable: false,	// `true` activate column sort on `th` click
	render: "default"	// *see cell rendering below*
}
```

### Cell Rendering

How to display `td` content depends on column `render` value.

- Use a __plugin__ registered with `"plugin-name"` (`"default"` plugin just display `field` value)

```javascript
render: "plugin-name"
```

- Use a registered __plugin__ `"plugin-name"` with `params`

```javascript
render: { "plugin-name": params }
```

- Use a callback __function__

```javascript
render: function( data ){
	// scope (this) is the `$(td)` in the callback
	// fill `td` with `$(td).html( returned value )`
	return data.value;

	// if you return false, `td` content will not be changed
	// you can update cell with `this.html()`, `this.append()`, ...
	this.html( data.value );
	return false;

	// `data` is an object like this
	data = {
		value: "the value of the field key",
		field: "the field key name",
		row: "row data object (row.fieldname = value)", 
		colindex: "column number (first is 0)"
	}
}
```



# Flow of data and events

### Fetch

To fetch data and launch the flow, you need to call datagrid `fetch( filters )` method.

It will be automatically executed when `option.autoload = true`.

`filters` is an optional object of attribute-value pairs. They are merged with paging and sorting params and send when fetching data.

Fetching data do not reset previous params (usefull with auto filters). You can reset params to default with `reset()` method.

```javascript
// Scope (this) in the callback is `datagrid` (the plugin).
"onBefore()" event is called (if defined) before fetching data.
```

How data is fetched depends on `source` option type:

#### string or object

Plugin will be used (if it exists).

`"default"` plugin use `$.post( options.url )` to get data. *see __Source plugin__ below*

#### deferred function  

`$.when( options.source() )` is used.

Scope (`this`) in the callback is the datagrid instance.

So you can get datagrid params with `params()` method.

After data is fetched from source, `render( data )` is called automatically when you `defer.resolve( data )`.

```javascript
// example with deferred $.get()
"source": function() {
    return $.get( "url", this.params() );
}
```

```javascript
// example with deferred function
"source": function() {
    return $.Deferred(function( defer ) {
        async_call( 
            callback_success( data ) {
                defer.resolve( data );
            },
            callback_error( error ) {
                defer.reject( error );
            }
        );
    }).promise();
}
```

### Parse

Data is parsed by `parse()` method. Default method parse data with `JSON.parse()` (if data is a string).

Method can be changed with datagrid `parse` option.

### Data Format

Data format expected to render the datagrid is an object like this:
```javascript
{
	total: Number of rows (without pagination),
	data: [{
			"fieldname1": value1,
			"fieldname2": value2,
			...
		},
		{
			"fieldname1": value3,
			"fieldname2": value4,
			...
		}
	}]
}
```


### Render

HTML table is displayed when `datagrid.render( data )` method is called.

```javascript
// Data is in expected format.
// Data returned replace old data. Return false or nothing to not change data.
"onData( data )" event is called (if defined).
```

If a `sorter` plugin is defined, click events are attached on `th` (if column `sortable` option is set to `true`)

```javascript
// Usefull to change attributes of a `tr`.
// Data returned replace old data. Return false or nothing to not change data.
"onRowData( rowdata, numrow, $tr )" event is called on each "tr" line (if defined).
```

Each cell is displayed (*see cell rendering*)

```javascript
"onComplete()" event is called (if defined) when all is rendered.
```



# Methods

Methods can be called in 2 ways:

- With selector used to create datagrid

```javascript
$( selector ).datagrid( "methodName", methodParams );
```

- Or with a reference to the datagrid instance

```javascript
datagrid.methodName( methodParams );
```

You can get a reference to the datagrid instance with

```javascript
$( selector ).datagrid( "datagrid" );

// it's chainable
$( selector ).datagrid( "datagrid" ).methodName( methodParams );
```

### Methods list

```javascript
// fetch source (get data). `filters` is an object of attribute-value pairs (optional).
$( selector ).datagrid( "fetch", filters );
```

```javascript
// get page number (first page is 1).
$( selector ).datagrid( "page" );
// set page number. `fetch()` is not called.
$( selector ).datagrid( "page", page );
```

```javascript
// get paging number (default paging is 15).
$( selector ).datagrid( "paging" );
// set paging number. `fetch()` is not called.
$( selector ).datagrid( "paging", paging );
```

```javascript
// get orderby (default orderby is "").
$( selector ).datagrid( "orderby" );
// set orderby. `fetch()` is not called.
// sorter plugin use field name.
$( selector ).datagrid( "orderby", orderby );
```

```javascript
// get direction (default direction is "").
$( selector ).datagrid( "direction" );
// set direction. `fetch()` is not called.
// sorter plugin use "asc" or "desc".
$( selector ).datagrid( "direction", direction );
```

```javascript
// get params used for data request.
$( selector ).datagrid( "params" );
// reset params to default.
$( selector ).datagrid( "reset" );
```

```javascript
// render HTML table.
$( selector ).datagrid( "render", data );
```

```javascript
// define selected form element(s) (and children) as automatic filters. *see __Filters__ below*
$( selector ).datagrid( "filters", selector );
```


# Filters

You can magically add automatic filters with the `filters( selector )` method.

It works with all form elements.

```javascript
// just pass a $element (jquery element) or a "selector" string to the filters method
$( selector ).datagrid( "filters", $element );

// you can also use `datagrid` reference
$( selector ).datagrid( "datagrid").filters( $element );
```

All form elements (input, select, textarea) contents in the `$element` win a `change` event that automatically call `datagrid.fetch()`.

The changed element value is added to the sent params (key is the html element name).

You can disable an element by adding a `"data-datagrid-filter"="disable"` attribute.


# Plugins

If you don't specify a plugin, `default` plugin is used.

Plugin are used to:

- fetch data (`source` plugins)
- display information on sorted columns header (`sorter` plugins)
- display formated data in the table cells (`cell` plugins)
- display pagination (`pager` plugins).

### Use a plugin

For each plugin's type, the plugin name is unique. If you add 2 plugins on the same type with the same name, the second will replace the first.

```javascript
// with default options (or if plugin has no options)
"plugin-type": "plugin-name"
```

```javascript
// with options (depends on plugin)
"plugin-type": { "plugin-name": options }
```

### Create a plugin

All plugins are created like this

```javascript
$.fn.datagrid( "plugin", "plugin-type", "plugin-name", callback );
```

- `"plugin-type"` is a `String`. Allowed values are `"source"`, `"cell"`, `"sorter"` or `"pager"`.
- `"plugin-name"` is what you want (just a `String`). If you use `"default"` name, you'll change default plugin.
- `callback` is a `Function`. Arguments send to the function and expected return value depends on plugin's type (see each type for more information).

### Extend a plugin

You can also extend existing plugins

```javascript
$.fn.datagrid( "plugin", "plugin-type", "new-plugin-name", "extended-plugin-name", options );
```

- `"plugin-type"` is a `String`. Value need to match with plugin extended.
- `"new-plugin-name"` is the name of your new plugin (a `String`).
- `"extended-plugin-name"` is the name of the plugin extended (the "source"). You can extend `"default"` plugin.
- `options` is an `Object` passed as last argument to `"extended-plugin-name"` callback when `"new-plugin-name"` is called. `options` are merged.

And off course you can extend an extended plugin! :-)


## Source plugin

`source` plugin is used to fetch data.

In the callback, `this` is the instance of the datagrid plugin. So you can get datagrid params with `params()` method.

To display the HTML table, you need to call datagrid `render( data )` method.


#### Source plugin "default" (alias "post")

`"default"` plugin (alias `"post"`) call `$.post()` to get data. The only option is `url`. If not set, it use datagrid `url` option.


#### Source plugin "data"

`"data"` plugin is used for local data. You can change sorter and filter functions by your own with `sorter` and `filter` options. If `data` option is filled, it will be used instead of datagrid `data` option. All options are optional.

```javascript
$( selector ).datagrid({
    source: {
        data: {
            sorter: function( data, key, comparator ) {
                // `data`: all the data
                // `key`: sorted fieldname
                // `comparator`:  `1` (asc) or `-1` (desc)
                return sortedData;
            },
            filter: function( data, filters ) {
                // `data`: all the data
                // `filters`: object of attribute-value pairs
                return filteredData;
            },
            data: [] // array of object (attribute-value pairs)
        }
    }
});
```


#### Source plugin: create custom

```javascript
// example: "get" instead of "post" ajax
$.fn.datagrid( "plugin", "source", "get", function( sourceOptions ) {
    var options = {
        url: ""
    };
    if ( sourceOptions ) {
        $.extend( options, sourceOptions );
    }
    var datagrid = this;
    $.get( options.url, datagrid.params(), function( result ) {
        datagrid.render( result );
    });
});
```


## Cell plugin

`cell` plugin is used to render `<td>` content.


#### Cell plugin "default"

`"default"` plugin render the cell value and has no options.


#### Cell plugin: create custom

```javascript
// example: "date" display.
// use awesome moment.js (http://momentjs.com).
$.fn.datagrid( "plugin", "cell", "date", function( data, cellOptions ) {
	var options = {
		format: "DD/MM/YYYY"
	};
	if ( cellOptions ) {
		$.extend( options, cellOptions );
	}
    return moment( data.value ).format( options.format );
});
```

And you can extend it like other plugins

```javascript
// example: "date-us" display.
$.fn.datagrid( "plugin", "cell", "date-us", "date", { format: "MM/DD/YYYY" } );
```


## Sorter plugin

`sorter` plugin is used to display information on sorted column (icons, chevron, arrow, ... or what you want !).


#### Sorter plugin "default"

`"default"` plugin options are `{ up: " ↑", down: " ↓" }`.

In the callback, `this` is the `$(th)`. You don't need to return value. Use `this` to change the `<th>` content.

Column title is already displayed when callback is executed. You can use `this.html()` to get title.


#### Sorter plugin: create custom

You can extend `"default"` plugin like this

```javascript
$.fn.datagrid( "plugin", "sorter", "text", "default", { up: " - up", down: " - down" } );
```

Or define a new plugin with a callback function. `ascendant` argument is a `Boolean` (`true` for ascendant sorted column, `false` for descendant).

```javascript
// example: just write "up" or "down"
$.fn.datagrid( "plugin", "sorter", "text", function( ascendant, sorterOptions ) {
    if ( ascendant ) {
        this.append( " up" );
    } else {
        this.append( " down" );
    }
});
```

You don't need to handle `click` events on sortable columns. `sorter` plugins are just renderers.


## Pager plugin

`pager` plugin is used to display pager section (returns HTML).


#### Pager plugin "default"

`"default"` plugin handle `click` events on page items. 

Default options are

```javascript
{
	// pager element wrapper
    container: "div",
    // pager element wrapper attributes set by `container.attr( attrContainer )`
    attrContainer: {},
    // if `item` is "li", append an `ul` element to the `container` and set `ul` attributes with `ul.attr( attrUl )`
    attrUl: {},
    // html element used for pages: "span", "div", "li" (auto insert ul)
    item: "span",
    // attributes set to active page item (current page)
    attrItemActive: {},
    // attributes set to disabled page items
    attrItemDisabled: {},
    // html display before page number
    before: " ",
    // html display after page number
    after: " ",
    // if `link = true`, wrap page number with an `a` HTML tag
    link: false,
    // if `firstPage !== false`, add a page item "first"
    // Display value as text (for example `firstPage: "first page"`)
    firstPage: false,
    // if `prevPage !== false`, add a page item "previous"
    // Display value as text (for example `prevPage: "previous page"`)
    prevPage: false,
    // if `nextPage !== false`, add a page item "next"
    // Display value as text (for example `nextPage: "next page"`)
    nextPage: false,
    // if `lastPage !== false`, add a page item "last"
    // Display value as text (for example `lastPage: "last page"`)
    lastPage: false,
    // if `hideDisabled = true`, hide disabled pages
    // (for example, hide `firstPage` and `prevPage` when current page is 1)
    hideDisabled: false,
    // behavior = false (show all pages)
    // behavior = "sliding" (current page always on middle of the pager)
    // behavior = { "sliding": { "pages": 3 } } (change number of pages displayed before and after current page)
    behavior: false
}
```


#### Pager plugin: create custom

You can write you own pager from scratch with a callback function.

`this` in this callback is the datagrid instance.

```javascript
$.fn.datagrid( "plugin", "pager", "scratch-pager", function( page, lastpage, pagerOptions ) {
    // your pager logic, based on "page" (current page) and "lastpage"
    var datagrid = this;
	var html = ...;
	// you must return html pager
    return html;
});
```

You don't need to handle `click` events on page items: they are automatically attached on elements with `datagrid-page` class. You just need to set target page with `data-page` attribute.


# License

jquery.datagrid is distributed under MIT License.
