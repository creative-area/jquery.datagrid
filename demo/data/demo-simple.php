<?php
require_once "config.db.php";

$page = (int)$_POST['page'];
if ( $page < 1 ) $page = 1;
$paging = (int)$_POST['paging'];
if ( $paging <= 0 ) $paging = 20;
$orderby = $_POST['orderby'];
$direction = $_POST['direction'];

// filters
$aFilters = array();
$sql_filters = '';

$Continent = ( isset($_POST['Continent']) ) ? $_POST['Continent'] : false;
$ContinentAllowed = array(
	"Asia",
	"Europe",
	"North America",
	"Africa",
	"Oceania",
	"Antarctica",
	"South America"
);
if ( !empty($Continent) && in_array($Continent, $ContinentAllowed) ) {
	$aFilters[] = ' Continent = "'.$Continent.'" ';
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

$result = array(
	'data' => array(),
	'total' => 0
);

// total
$sql_all = 'SELECT COUNT(*) FROM Country'.$sql_filters;
$result_total = mysql_query($sql_all);
$row_total = mysql_fetch_array($result_total);
$result['total'] = $row_total[0];

// data
$sql = '
	SELECT *, ( IF( Continent = "Asia", "Y", "N" ) ) AS is_asia
	FROM Country
	'.$sql_filters.'
	'.( ( !empty($orderby) ) ? 'ORDER BY '.mysql_real_escape_string($orderby).' '.mysql_real_escape_string($direction).'' : '' ).'
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
