PDOK-Leaflet and D3js
=====================

An example of how to use PDOK tiles with Leaflet and D3js. The choropleth map shows the percentage of single person households per neighbourhood in the city of Groningen.

Create GeoJSON
--------------

First you download the ESRI Shape file [Wijk- en Buurtkaart 2012] (http://www.cbs.nl/nl-NL/menu/themas/dossiers/nederland-regionaal/publicaties/geografische-data/archief/2013/2013-2012-b68-pub.htm) from Netherlands Statistics (CBS). The file with neighbourhood areas "buurt_2012_v1.shp" can be converted to GeoJSON using [ogr2ogr](http://www.gdal.org/ogr2ogr.html). The variable "P_EENP_HH" represents the percentage of single person households:

    ogr2ogr -f "GeoJSON" groningen.geojson -sql "SELECT 'BU_NAAM', 'BU_CODE', 'GM_NAAM', CAST('P_EENP_HH' AS integer) AS 'P_EENP_HH' FROM 'buurt_2012_v1' WHERE 'GM_NAAM' = 'Groningen'" -t_srs "EPSG:4326" -s_srs "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.999908 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs no_defs" buurt_2012_v1.shp

Inspect data for visualisation
------------------------------

In order to use the full value range in the choropleth map, use the ogrinfo utility to find the minimum and maximum values. Find the minimum value:

    ogrinfo -sql "select min(P_EENP_HH) from buurt_2012_v1 where GM_NAAM = 'Groningen'" buurt_2012_v1.shp buurt_2012_v1

The minimum value is 7. Find the maximum value:

    ogrinfo -sql "select max(P_EENP_HH) from buurt_2012_v1 where GM_NAAM = 'Groningen'" buurt_2012_v1.shp buurt_2012_v1
    
The maximum value is 84. The choropleth map uses the range from 0 to 85 for the classification.
