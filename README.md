jquery.datagrid
===============

## What datagrid do

- Get data from source (ajax, deferred function)
- Render a simple HTML Table
- Easy to style (UI-less)
- Semi-automatic sorter and pager (you need to code server side)
- Simple columns definition
- Plugins for cell, pager and sorter renderers
- Events on each step (you do what you want with your data)
- Convert input in automatic filters

# Configuration

Just load `jquery.datagrid-draft.js` in your page and do `var datagrid = $(container).datagrid({options})`.

A simple example

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

## Options

Name				| Default value			| Description
 :--- 				| :--- 					| :---
__*Get data*__		|
`url` 				| `""` (empty string)	| Server url where data are fetch (with POST params data)
`source`			| `"post"`				| Data fetching method: "post" or function
`paramsDefault` 	| `{}`					| 
`paramsMapping` 	| *see params*			| 
`autoload` 			| `true`				| 
__*Render data*__	|
`col`				| `[]`					| Array of column definition objects - *see __Column options__ below*
`attr` 				| `false`				| 
`noData` 			| `"no data"`			| 
__*Plugins*__		|
`sorter` 			| `false`				| 
`pager`				| `"default"`			| 
`pagerPosition` 	| `"bottom"`			| 
__*Events*__		|
`onBefore` 			| `false`				| 
`onSourceData` 		| `false`				| 
`onData` 			| `false`				| 
`onRowData` 		| `false`				| 
`onComplete` 		| `false`				| 

## Column options

Name				| Default value			| Description
 :--- 				| :--- 					| :---
`field` 			| `""` (empty string)	| Field name
`title` 			| `""` (empty string)	| Title display in the `th`content
`attrHeader` 		| `{}`					| Param for `$(th).attr()`
`attr` 				| `{}`					| Param for `$(td).attr()`
`sortable` 			| `false`				| `true` activate column sort on `th` click
`render` 			| `false`				| *see cell rendering below*

# How to use it

## Get Data

How data is fetch depends on `source` option.

If `source = "post"` then `$.post( options.url )` is used to get data.

If `source` is a function, `$.when( options.source() )` is used. In the callback function, you get the params in first argument, and `this` is the `datagrid` object.

## Data Format Expected

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

## Cell Plugin

## Sorter Plugin

## Pager Plugin

