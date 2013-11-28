jquery.datagrid
===============

- Get data from any source (ajax, deferred function or plugin)
- Render a simple HTML Table easy to style (UI-less)
- Semi-automatic sorter and pager (you need to code server side)
- Simple columns definition
- Plugins for cell, pager and sorter renderers
- Events on each step (you do what you want with your data)
- Convert input in automatic filters

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

Name				| Default value			| Description
 :--- 				| :--- 					| :---
__*Get data*__		|
`source`			| `"post"`				| Data fetching method: "post", function or plugin.
`url` 				| `""` (empty string)	| Server url where data are fetch (with POST params data).
`paramsDefault` 	| `{}`					| 
`paramsMapping` 	| *see below*			| 
`autoload` 			| `true`				| Auto load data. If set to `false`, you need to load manualy the data with `datagrid.getData()` method.
__*Render data*__	|
`col`				| `[]`					| Array of column definition objects. - *see __Column options__ below*
`attr` 				| `false`				| An object of attribute-value pairs: generate the table element attributes.
`noData` 			| `"no data"`			| `String`: it will be displayed instead of the table if there is no data. `Function`: the result returned by the function will be displayed.
__*Plugins*__		|
`sorter` 			| `false`				| Display text or icon on table header when columns are sorted (asc or desc). - *see __Plugins__ below*
`pager`				| `"default"`			| Render the pager. `default` pager write page numbers in a `span`, all in a `div`. - *see __Plugins__ below*
`pagerPosition` 	| `"bottom"`			| Display the pager on `"bottom"` of the `table`, or on the `"top"`, or both with `["top","bottom"]`.
__*Events*__		|
`onBefore` 			| `false`				| Callback `function()`. Scope is `datagrid`.
`onSourceData` 		| `false`				| Callback `function( data )`
`onData` 			| `false`				| Callback `function( { "total": Total number of data without paging, "data": data } )`
`onRowData` 		| `false`				| Callback `function( data[ numrow ], numrow, $tr )`
`onComplete` 		| `false`				| Callback `function()`. Scope is `datagrid`.

#### Params Mapping (paramsMapping option)

You can map param names used for paging and sorting. The defaults are:

```javascript
paramsMapping = {
	page: "page",
	paging: "paging",
	orderby: "orderby",
	direction: "direction"
}
```

## Column options

Name				| Default value			| Description
 :--- 				| :--- 					| :---
`field` 			| `""` (empty string)	| Field name
`title` 			| `""` (empty string)	| Title display in the `th`content
`attrHeader` 		| `{}`					| Param for `$(th).attr()`
`attr` 				| `{}`					| Param for `$(td).attr()`
`sortable` 			| `false`				| `true` activate column sort on `th` click
`render` 			| `false`				| *see cell rendering below*

# How to use it: the flow of data and events

## Get Data

To get the data and launch the flow, you need to call `datagrid.getData( filters )`. It will be automatically executed with `option.autoload = true`.

`onBefore` event is called (if defined).

`filters` is an object of attribute-value pairs. They are merged with paging and sorting params and send when fetching data.

How data is fetch depends on `source` option.

If `source = "post"` then `$.post( options.url )` is used to get data.

If `source` is a function, `$.when( options.source() )` is used. In the callback function, you get the params in first argument, and `this` is the `datagrid` object.

If `source` is a string other than `"post"`, a plugin will be used (if it exists). *see __Source plugin__ below*

`onSourceData` event is called (if defined) when data is received. Data is passed as argument to the callback in is raw form.

## Data Format

## Cell Rendering

## Methods

`datagrid.getOption( option )`

`datagrid.setOption( option, value )`

`datagrid.getPage()`

`datagrid.setPage( page )`

`datagrid.getParams()`

`datagrid.getParamsUsed()`

`datagrid.getPagerLimits( behavior, lastpage )`

`datagrid.getData( filters )`

`datagrid.renderData( data )`

`datagrid.addFilter( selector )`

# Plugins

## Source plugin

## Cell Plugin

## Sorter Plugin

## Pager Plugin

