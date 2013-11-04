<?php
require_once "config.db.php";

$page = (int)$_POST['page'];
if ( $page < 1 ) $page = 1;
$paging = (int)$_POST['paging'];
if ( $paging <= 0 ) $paging = 20;
$orderby = $_POST['orderby'];
$direction = $_POST['direction'];

$result = array(
	'data' => array(),
	'total' => 0
);

// total
$sql_all = 'SELECT COUNT(*) FROM Country';
$result_total = mysql_query($sql_all);
$row_total = mysql_fetch_array($result_total);
$result['total'] = $row_total[0];

// data
$sql = '
	SELECT *
	FROM Country
	'.( ( !empty($orderby) ) ? 'ORDER BY '.$orderby.' '.$direction.'' : '' ).'
	LIMIT '.( ($page-1)*$paging ).', '.$paging.'
';
$data = mysql_query($sql);
while ( $row = mysql_fetch_assoc($data) ) {
	foreach ($row as $key => $value) {
		$row[ $key ] = utf8_encode($row[ $key ]);
	}
	$result['data'][] = $row;
}

echo json_encode($result);
?>