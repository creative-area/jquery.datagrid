$( document ).ready( function() {
	// simple
	var dgs = $( "#dg-demo-static-data" ).datagrid({
		data: countries,
		col: [{
			field: "Continent",
			title: "Continent",
			sortable: true
		},{
			field: "Name",
			title: "Name",
			sortable: true
		},{
			field: "Population",
			title: "Population",
			sortable: true
		},{
			field: "SurfaceArea",
			title: "Surface",
			sortable: true
		}],
		attr: { "class": "table table-bordered table-condensed" },
		sorter: "bootstrap",
		pager: "bootstrap",
		paramsDefault: {paging:20}
	});

	// simple
	var dg1 = $( "#dg-demo-simple" ).datagrid({
		url: "data/demo-simple.php",
		col: [{
			field: "Continent",
			title: "Continent",
			sortable: true
		},{
			field: "Name",
			title: "Name",
			sortable: true
		},{
			field: "Population",
			title: "Population",
			sortable: true
		},{
			field: "SurfaceArea",
			title: "Surface",
			sortable: true
		}],
		attr: { "class": "table table-bordered table-condensed" },
		sorter: "bootstrap",
		pager: "bootstrap",
		paramsDefault: {paging:20}
	});

	// cell rendering
	var dg2 = $( "#dg-demo-cell-rendering" ).datagrid({
		url: "data/demo-simple.php",
		col: [{
			field: "Continent",
			title: "Continent",
			attrHeader: { "width": "20%" },
			render: { "fa-button" : {
				style: "default",
				size: "xs",
				icon: "plane"
			} },
			sortable: true
		},{
			field: "Name",
			title: "Name",
			attrHeader: { "width": "35%" },
			sortable: true
		},{
			field: "Population",
			title: "Population",
			attrHeader: { "width": "15%", "style": "text-align: right;", "nowrap": "nowrap" },
			attr: { "style": "text-align: right;", "nowrap": "nowrap" },
			sortable: true,
			render: function( data ) {
				var r = "<span ";
				if ( +data.value == 0) {
					r += "class='label label-warning'";
					data.value = "None";
				} else if ( +data.value > 100000000 ) {
					this.addClass( "success" );
				} else if ( +data.value > 10000000 ) {
					this.addClass( "warning" );
				}
				r += ">";
				if ( +data.value > 1000000 ) {
					r += Math.round(data.value/1000000) + " million";
				} else {
					r += data.value;
				}
				r += "</span>";
				return r;
			}
		},{
			field: "SurfaceArea",
			title: "Surface",
			attrHeader: { "width": "15%", "style": "text-align: right;", "nowrap": "nowrap" },
			attr: { "style": "text-align: right;", "nowrap": "nowrap" },
			sortable: true,
			render: function( data ) {
				return Math.round( data.value ) + " km<sup>2</sup>";
			}
		},{
			field: "SurfaceArea",
			title: "Density",
			attrHeader: { "width": "15%", "style": "text-align: right;", "nowrap": "nowrap" },
			attr: { "style": "text-align: right;", "nowrap": "nowrap" },
			render: function( data ) {
				return ( +data.value > 0 ) ? Math.round( data.row.Population / data.value ) + " p/km<sup>2</sup>" : 'N/A';
			}
		}],
		attr: { "class": "table table-bordered table-condensed" },
		sorter: "bootstrap",
		pager: "bootstrap",
		paramsDefault: {paging:45}
	});

	// filters
	var dg3 = $( "#dg-demo-filters" ).datagrid({
		url: "data/demo-simple.php",
		col: [{
			field: "Continent",
			title: "Continent",
			sortable: true
		},{
			field: "Name",
			title: "Name",
			sortable: true
		},{
			field: "Population",
			title: "Population",
			sortable: true
		},{
			field: "SurfaceArea",
			title: "Surface",
			sortable: true
		}],
		attr: { "class": "table table-bordered table-condensed" },
		sorter: "bootstrap",
		pager: "bootstrap",
		paramsDefault: {paging:20}
	});
	dg3.datagrid( "filters", "#dg-demo-filters-area" );
	// dg3.datagrid( "datagrid" ).filters( "#dg-demo-filters-area" );
	
	// events
	$eventsInfo = $( "#dg-demo-events-info" );
	$eventsArea = $( "#dg-demo-events-area" );
	var dg4 = $( "#dg-demo-events" ).datagrid({
		url: "data/demo-simple.php",
		col: [{
			field: "Continent",
			title: "Continent",
			sortable: true
		},{
			field: "Name",
			title: "Name",
			sortable: true
		},{
			field: "Population",
			title: "Population",
			sortable: true
		},{
			field: "SurfaceArea",
			title: "Surface",
			sortable: true
		}],
		attr: { "class": "table table-bordered table-condensed" },
		sorter: "bootstrap",
		pager: "bootstrap",
		paramsDefault: {paging:20},
		onBefore: function() {
			$eventsInfo.html( "Datagrid loading ..." );
			$eventsArea.hide();
		},
		onData: function( data ) {
			$eventsInfo.html( data.total + " countries" );
		},
		onRowData: function( data, num, $tr ) {
			if ( data.Population > 10000000 ) {
				$tr.addClass( "success" );
			} else if ( data.Population < 100 ) {
				$tr.addClass( "danger" );
			}
		},
		onComplete: function() {
			$eventsArea.show();
		}
	});
	dg4.datagrid( "filters", $eventsArea );

	// tab
	$('#demo-tabs a:first').tab('show')

	// highlight code
	prettyPrint();
});