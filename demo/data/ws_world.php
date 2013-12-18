<?php
require_once "config.db.php";

$page = (int)$_POST['p'];
if ( $page < 1 ) $page = 1;
$paging = (int)$_POST['pp'];
if ( $paging <= 0 ) $paging = 20;
$o = $_POST['o'];
$d = $_POST['d'];

// filters
$aFilters = array();
$sql_filters = '';

$Continent = ( isset($_POST['Continent']) ) ? $_POST['Continent'] : false;
if ( !empty($Continent) ) {
	$aFilters[] = ' Continent = "'.$Continent.'" ';
}
$excludeZeroPopulation = ( isset($_POST['excludeZeroPopulation']) ) ? $_POST['excludeZeroPopulation'] : false;
if ( !empty($excludeZeroPopulation) ) {
	$aFilters[] = ' Population > 0 ';
}
$PopulationInterval = ( isset($_POST['PopulationInterval']) ) ? $_POST['PopulationInterval'] : false;
if ( !empty($PopulationInterval) ) {
	switch( $PopulationInterval ) {
		case 1:
			$aFilters[] = ' Population < 1000000 ';
		break;
		case 2:
			$aFilters[] = ' Population >= 1000000 AND Population < 100000000 ';
		break;
		case 3:
			$aFilters[] = ' Population >= 100000000 ';
		break;
	}
}
$ContinentMulti = ( isset($_POST['ContinentMulti']) ) ? $_POST['ContinentMulti'] : false;
if ( !empty($ContinentMulti) ) {
	$aFilters[] = ' Continent IN ("'.implode('","', $ContinentMulti).'") ';
}
$SurfaceArea = ( isset($_POST['SurfaceArea']) ) ? $_POST['SurfaceArea'] : false;
$SurfaceArea = ( $SurfaceArea != "null" ) ? $SurfaceArea : "";
if ( !empty($SurfaceArea) ) {
	$aTemp = array();
	if ( in_array(1, $SurfaceArea) ) {
		$aTemp[] = ' SurfaceArea >= 1000000 ';
	}
	if ( in_array(2, $SurfaceArea) ) {
		$aTemp[] = ' SurfaceArea >= 100000 AND SurfaceArea < 1000000 ';
	}
	if ( in_array(3, $SurfaceArea) ) {
		$aTemp[] = ' SurfaceArea < 100000 ';
	}
	if ( sizeof( $aTemp ) > 0 ) {
		$aFilters[] = ' ( '.implode(' OR ', $aTemp ).' ) ';
	}
}

if ( sizeof($aFilters) > 0 ) {
	$sql_filters = ' WHERE '.implode(' AND', $aFilters);
}

$r = array(
	'data' => array(),
	'total' => 0
);

// total
$sql_all = 'SELECT COUNT(*) FROM Country'.$sql_filters;
$result_total = mysql_query($sql_all);
$row_total = mysql_fetch_array($result_total);
$r['total'] = $row_total[0];

// data
$sql = '
	SELECT *
	FROM Country
	'.$sql_filters.'
	'.( ( !empty($o) ) ? 'ORDER BY '.$o.' '.$d.'' : '' ).'
	LIMIT '.( ($page-1)*$paging ).', '.$paging.'
';
$result = mysql_query($sql);
while ( $row = mysql_fetch_assoc($result) ) {
	$r['data'][] = $row;
}

// for debug
$r['post'] = $_POST;
$r['sql'] = $sql;

echo json_encode($r);
?>