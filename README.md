jquery.datagrid
===============

- Get data from any source (ajax, deferred function or plugin)
- Render a simple HTML Table easy to style (UI-less)
- Semi-automatic sorter and pager (you need to code server side)
- Simple columns definition
- Plugins for cell, pager and sorter renderers
- Events on each step (you do what you want with your data)
- Convert form elements (input, select) into automatic filters

# Configuration

Just load `jquery.datagrid.js` (and optional plugin scripts if you want to use them)

A simple example

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

## Options

```javascript
// All options with default values
{
    source: "default", // plugin
    url: "",
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

- `source` ( *string* || *function* ) : data fetching method: function or plugin name (string).
- `url`  ( *string* ) : server url where data are fetch (with POST params data).
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

- Use a plugin registered with `"plugin-name"` (`"default"` plugin just display `field` value)

```javascript
{
	...
	render: "plugin-name",
	...
}
```

- Use a registered plugin `"plugin-name"` with `params`

```javascript
$( selector ).datagrid({
	...
	col: [{
		...
		render: { "plugin-name": params },
		...
	}, ...],
	...
});
```

- Use a callback function

```javascript
{
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
}
```



# Flow of data and events

### Fetch

To fetch data and launch the flow, you need to call `datagrid.fetch( filters )`<br>
It will be automatically executed when `option.autoload = true`.

`filters` is an optional object of attribute-value pairs. They are merged with paging and sorting params and send when fetching data.

```javascript
// Scope (this) in the callback is `datagrid` (the plugin).
"onBefore()" event is called (if defined) before fetching data.
```

How data is fetch depends on `source` option:

- **string** : a plugin will be used (if it exists). `"default"` plugin use `$.post( options.url )` to get data. *see __Source plugin__ below*

- **function** : `$.when( options.source( params ) )` is used. Scope (this) in the callback is `datagrid` object.

After data is fetched from the source, `datagrid.render( data )` is called.

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
// Must return changed data.
"onData( data )" event is called (if defined).
```

If a `sorter` plugin is defined, click events are attached on `th` (if column `sortable` option is set to `true`)

```javascript
// Usefull to change attributes of a `tr`.
// Must return changed data.
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
```

```javascript
// set page number. `fetch()` is not called.
$( selector ).datagrid( "page", page );
```

```javascript
// get params used for data request.
$( selector ).datagrid( "params" );
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

You can magically add automatic filters. It works with all form elements.

```javascript
var datagrid = $( selector ).datagrid({
    // options
});

// just pass a $element to the filters method
datagrid.datagrid( "filters", $element );

// you can also use `datagrid` reference
datagrid.datagrid( "datagrid").filters( $element );
```

All form elements (input, select, taxtarea) contents in the `$element` win a `change` event that automatically call `datagrid.fetch()`.

The changed element value is added to the sent params (key is the html element name).



# Plugins

All plugins are added like this

```javascript
// "pluginType" is a String : allowed values are "source", "cell", "sorter" or "pager".
// "pluginName" is what you want. If you use "default" name, you'll change default plugin.
$.fn.datagrid( "plugin", "pluginType", "pluginName", callbackFunction );
```

You can also extend existing plugins

```javascript
// "extendedPluginName" is the name of the plugin extended (the "source"). You can extend "default" plugin.
// "extendedOptions" are passed as arguments to "extendedPluginName" when "newPluginName" is called.
$.fn.datagrid( "plugin", "pluginType", "newPluginName", "extendedPluginName", extendedOptions );
```

And off course you can extend an extended plugin! :-)

### Use a plugin

With default options

```javascript
$( selector ).datagrid({
	...
	"pluginType": "pluginName",
	...
});
```

Or with params

```javascript
$( selector ).datagrid({
	...
	"pluginType": { "pluginName": pluginOptions },
	...
});
```

## Source plugin

Source plugin is used to fetch data. You need to call `self.render()` to display the HTML table.

```javascript
// example: "get" instead of "post" ajax
$.fn.datagrid( "plugin", "source", "get", function( sourceOptions ) {
    var self = this; // this is the instance of the datagrid plugin
    $.get( self.settings.url, self.params(), function( result ) {
        self.render( result );
    });
});
```

## Cell Plugin

Cell plugin is used to render a table cell (`td`).

```javascript
// example: "date" display. Use moment.js (http://momentjs.com).
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
// example: "date-en" display.
$.fn.datagrid( "plugin", "cell", "date-en", "date", { format: "MM/DD/YYYY" } );
```

## Sorter Plugin

Sorter plugin is used to display information on sorted column (chevron, arrow, ... or what you want !).

In the callback, `this` is the `$(th)`.

`"default"` plugin options are `{ up: " ↑", down: " ↓" }`.

So you can extend it like this

```javascript
$.fn.datagrid( "plugin", "sorter", "text", "default", { up: " - up", down: " - down" } );
```

Or define a new plugin

```javascript
// example: just write "up" or "down"
$.fn.datagrid( "plugin", "sorter", "text", function( ascendant, sorterOptions ) {
    if ( ascendant ) {
        this.append( "up" );
    } else {
        this.append( "down" );
    }
});
```

## Pager Plugin

Pager plugin is used to display pager section (returns HTML).

`"default"` plugin options are

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
    // behavior = "paging" (TODO)
    behavior: false
}
```

You can write you own pager from scratch

```javascript
$.fn.datagrid( "plugin", "pager", "scratch-pager", function( page, lastpage, pagerOptions ) {
    // your pager logic, based on "page" (current page) and "lastpage"
	var html = ...;
	// you must return html pager
    return html;
});
```
