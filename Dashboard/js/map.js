// Resoluties (pixels per meter) van de zoomniveaus:
var res = [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420];

// Juiste projectieparameters voor Rijksdriehoekstelsel (EPSG:28992):
var RD = L.CRS.proj4js('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs', new L.Transformation(1, 285401.920, -1, 903401.920));
RD.scale = function(zoom) {
    return 1 / res[zoom];
};
var map = new L.Map('map', {
  continuousWorld: true,
  crs: RD,
  layers: [
    new L.TileLayer('http://geodata.nationaalgeoregister.nl/tms/1.0.0/brtachtergrondkaart/{z}/{x}/{y}.png', {
        tms: true,
        minZoom: 3,
        maxZoom: 13,
        attribution: 'Kaartgegevens: © <a href="http://www.cbs.nl">CBS</a>, <a href="http://www.kadaster.nl">Kadaster</a>, <a href="http://openstreetmap.org">OpenStreetMap</a><span class="printhide">-auteurs (<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>).</span>',
        continuousWorld: true
    })
  ],
  center: new L.LatLng(52.379189,4.899431),		//was: 53.219231,6.57537
  zoom: 7
});

var mapSvg = d3.select(map.getPanes().overlayPane).append("svg"),
g = mapSvg.append("g").attr("class", "leaflet-zoom-hide");
    
// Verdeel het domein van de waarden in 7 klassen en ken deze een kleur toe op basis van ColorBrewer
var color = d3.scale.quantize().domain([0, 100]).range(colorbrewer.OrRd[7]);	//was 0, 85 - in OPP full range is 0-1970

// THE MAP USES EPSG:4326 OR WGS84 ENCODING (SRS) - USE QGIS TO CHANGE THE FOMAT - THEN SAVE AS WITH NEW ENCODING - THEN SAVE AS JSON
d3.json("amsterdam.geojson", function(collection) {		// was: groningen.geojson
    var bounds = d3.geo.bounds(collection),
    path = d3.geo.path().projection(project);

    var feature = g.selectAll("path")
        .data(collection.features);
        
    feature
        .enter()
        .append("path")
        .attr("fill", function(d) {
             // geef iedere buurt de kleur die bij de klasse hoort
             return color(d.properties.OPP);				// was: P_EENP_HH
        })            
        .append("title");

    feature
        .select("title")
        .text(function(d) {
            // geef iedere buurt een titel met de buurtnaam en het percentage eenpersoonshuishoudens
            return d.properties.BCNAAM + ": " + d.properties.OPP.toString();		//was: BU_NAAM 	//was: P_EENP_HH
			//return d.properties.BCNAAM;		//was: BU_NAAM 	//was: P_EENP_HH
        });
            
    map.on("viewreset", reset);
    reset();

    function reset() {
        var bottomLeft = project(bounds[0]),
            topRight = project(bounds[1]);
            mapSvg
                .attr("width", topRight[0] - bottomLeft[0])
                .attr("height", bottomLeft[1] - topRight[1])
                .style("margin-left", bottomLeft[0] + "px")
                .style("margin-top", topRight[1] + "px");

            g
                .attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");
            feature
                .attr("d", path);
        }

    function project(x) {
        var point = map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
       return [point.x, point.y];
    }
});
