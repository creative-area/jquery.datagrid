<?php
$page = (int)$_POST['p'];
if ( $page < 1 ) $page = 1;
$paging = (int)$_POST['pp'];
if ( $paging <= 0 ) $paging = 20;
$o = $_POST['o'];
$d = $_POST['d'];

$total = 58;

$r = array(
	'data' => array(),
	'total' => 0
);

$max_element = $page * $paging;
if ( $max_element > $total ) {
	$max_element = $total;
}

for ( $i = ( $page - 1 ) * $paging ; $i < $max_element ; $i++ )  {
	$r['data'][] = array(
		'id' => ($i+1),
		'name' => 'name'.($i+1),
		'email' => 'mail'.($i+1).'@example.com'
	);
}

$r['total'] = $total;

echo json_encode($r);
?>