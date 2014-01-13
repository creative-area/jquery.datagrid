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

Just load `jquery.datagrid-draft.js` (and optional plugin scripts if you want to use them)

A simple example

```html
<script type="text/javascript" src="jquery.datagrid-draft.js"></script>
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
	source: "post",
	url: "",
	paramsDefault: {},
	paramsMapping: {
		page: "page",
		paging: "paging",
		orderby: "orderby",
		direction: "direction"
	},
	autoload: true,
	col: [],
	attr: false,
	noData: "no data",
	sorter: false,
	pager: "default",
	pagerPosition: "bottom",
	onBefore: false,
	onSourceData: false,
	onData: false,
	onRowData: false,
	onComplete: false
}
```

### Options detail

List of `option names` ( *expected values* )

#### Get data

- `source` ( *string* || *function* ) : data fetching method: "post", function or plugin name (string).
- `url`  ( *string* ) : server url where data are fetch (with POST params data).
- `paramsDefault` ( *object* ) : default params added to the data request.
- `paramsMapping` ( *object* ) : you can map param names used for paging and sorting (keys used: see default value).
- `autoload` ( *boolean* ) : auto load data. If set to `false`, you need to load manualy the data with `datagrid.getData()` method.

#### Render data

- `col`	( *array* ) : array of column definition objects. - *see __Column options__ below*
- `attr` ( *false* || *object* ) : an object of attribute-value pairs: generate the table element attributes. `false` for no attributes.
- `noData` ( *string* || *function* ) : `string`: it will be displayed instead of the table if there is no data. `function`: the result returned by the function will be displayed.

#### Plugins

- `sorter` ( *false* || *string* || *object* ) : display text or icon on table header when columns are sorted (asc or desc). - *see __Plugins__ below*
- `pager` ( *false* || *string* || *object* ) : render the pager. `default` pager write page numbers in a `span`, all in a `div`. - *see __Plugins__ below*
- `pagerPosition` ( *false* || *"top"* || *"bottom"* || *["top","bottom"]* ) : display the pager on `"bottom"` of the `table`, or on the `"top"`, or both with `["top","bottom"]`.

#### Events

- `onBefore` ( *false* || *function* ) : callback `function()`. Scope is `datagrid`.
- `onSourceData` ( *false* || *function* ) : callback `function( data )`
- `onData` ( *false* || *function* ) : callback `function( { "total": Total number of data without paging, "data": data } )`
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
	render: false		// *see cell rendering below*
}
```

### Cell Rendering

How to display `td` content depends on column `render` value:

- `false` : display `field` value.
- `"plugin-name"` : use a plugin registered with `plugin-name`.
- `{ "plugin-name": params }` : use a plugin registered with `plugin-name`, with `params`.
- `function( data )` : return content displayed in `td`. Scope is the `$(td)` in the callback. `data` is an object:

```javascript
data = {
	value: "the value of the field key",
	field: "the field key name",
	row: "row data object (row.fieldname = value)", 
	colindex: "column number (first is 0)"
}
```


# Flow of data and events

## Get Data

To get the data and launch the flow, you need to call `datagrid.getData( filters )` (it will be automatically executed with `option.autoload = true`).

> `onBefore()` event is called (if defined). Scope in the callback is `datagrid`.

`filters` is an object of attribute-value pairs. They are merged with paging and sorting params and send when fetching data.

How data is fetch depends on `source` option:

- **"post"** : `$.post( options.url )` is used to get data.

- **function** : `$.when( options.source( params ) )` is used. Scope in the callback is `datagrid` object.

- **string** (other than `"post"`) : a plugin will be used (if it exists). *see __Source plugin__ below*

When data is fetched by the source, `datagrid.renderData( data )` is called. You can change data with the next event:

> `onSourceData( data )` event is called (if defined). Data is in raw form. Must return changed data.

If returned data is a json string, it will be changed with `JSON.parse()`.

#### Data Format

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

## Render Data

HTML table is displayed with `datagrid.renderData( data )` method.

> `onData( data )` event is called (if defined). Data is in expected format. Must return changed data.

If a `sorter` plugin is defined, clic events are attached on `th` (if column `sortable` option is set to `true`)

> `onRowData( rowdata, numrow, $tr )` event is called on each `tr` line (if defined). Must return changed data.<br>
> Usefull to change attributes of a `tr`.

Each cell is displayed (*see cell rendering*)

> `onComplete()` event is called when all is rendered (if defined).


# Methods

- `datagrid.getData( filters )` : fetch source and render data.
- `datagrid.getOption( option )` : get option value.
- `datagrid.setOption( option, value )` : set option value.
- `datagrid.getPage()` : get page number (first page is 1).
- `datagrid.setPage( page )` : set page number used in `getData()`.
- `datagrid.getParams()` : get params used for data request.
- `datagrid.getParamsUsed()` : get params used for data request (duplicate ?).
- `datagrid.renderData( data )` : render data. Called internally when data are fetched.
- `datagrid.addFilter( selector )` : define selected form element(s) (and his children) as automatic filters. *see __Filters__ below*
- `datagrid.getPagerLimits( behavior, lastpage )` : helper method for pager plugin. *see __Pager plugin__ below*


# Filters

You can magically add automatic filters. It works with all form elements.

```javascript
var datagrid = $( selector ).datagrid({
    // options
});

// just pass a $element to the addFilter method
datagrid.addFilter( $element );
```

All form elements (input, select, taxtarea) contents in the `$element` win a `change` event that automatically call `datagrid.getData()`.

The changed element value is added to the sent params (key is html name).


# Plugins

## Source plugin

## Cell Plugin

## Sorter Plugin

Add a newplugin

```javascript
$.fn.datagrid( function() {
	// sortable plugin
	this.addPlugin( "sortable", "sortablePluginName", function( ascendant, sortableOptions ) {
		// this is the $(th) of the sorted column
		// ascendant is a boolean : true if ascendant, false if descendant
		// sortableOptions are set when you use sorter option with { "pluginName": sortableOptions }
		if ( ascendant ) {
			this.append( " up" );
		} else {
			this.append( " down" );
		}
	});
});
```

## Pager Plugin

