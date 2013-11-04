$( document ).ready( function() {
	$('h1').first().append(function(){
		return [
			'<div class="pull-right btn-group">',
				'<button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">',
					'view another demo <span class="caret"></span>',
				'</button>',
				'<ul class="dropdown-menu" role="menu">',
					'<li><a href="demo-simple.html">simple</a></li>',
					'<li><a href="demo-cell-rendering.html">cell rendering</a></li>',
				'</ul>',
			'</div>'
		].join('');
	});
});