    // Resoluties (pixels per meter) van de zoomniveaus:
    var res = [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420];

    // Juiste projectieparameters voor Rijksdriehoekstelsel (EPSG:28992):
    var RD = L.CRS.proj4js('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs', new L.Transformation(1, 285401.920, -1, 903401.920));
    RD.scale = function(zoom) {
        return 1 / res[zoom];
    };

function plotMap(mapJson, selectedProperty){

    var mapBuckets = 9;
    var mapColors = colorbrewer.OrRd[9];

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

    //Forces the size of the widget where the map is
    $("#map").height(mapHeight);
        
    // Verdeel het domein van de waarden in 7 klassen en ken deze een kleur toe op basis van ColorBrewer
   // var color = d3.scale.quantize().domain([0, 100]).range(colorbrewer.OrRd[9]);	//was 0, 85 - in OPP full range is 0-1970

    // THE MAP USES EPSG:4326 OR WGS84 ENCODING (SRS) - USE QGIS TO CHANGE THE FOMAT - THEN SAVE AS WITH NEW ENCODING - THEN SAVE AS JSON
    d3.json(mapJson, function(collection) {		// was: groningen.geojson

      var color = d3.scale.quantile()
        .domain([d3.min(collection.features, function (d) { return d.properties[selectedProperty]; }), d3.max(collection.features, function (d) { return d.properties[selectedProperty]; })]) //This receives the input range
        .range(mapColors); //This gives the output range

      mapColor = color;

        var bounds = d3.geo.bounds(collection),
        path = d3.geo.path().projection(project);

        var feature = g.selectAll("path")
            .data(collection.features);

        feature
            .enter()
            .append("path")
            .attr("fill", function(d) {
              if(visualizationParameters.neighborhoods.indexOf(d.properties.BU_CODE) != -1){
                return color(d.properties[selectedProperty]);
              } else {
                return "black";
              }
                
            })
            .attr("neighborhood", function(d) {return d.properties.BU_CODE; })

        feature
            .on("click", function(d){
                //if the area is not selected
                if(!d3.select(this).classed("selected")){
                    //select the neighborhoods in all charts
                    selectNeighborhoods(d.properties.BU_CODE);

                } else {
                    //select the neighborhoods in all charts
                    deselectNeighborhoods(d.properties.BU_CODE);
                }
            });
        feature
            .on("mouseover", function(d){
            
                   //Update the tooltip position and value
                   d3.select("#map-tooltip")
                     .style("left", (d3.event.pageX+10) + "px")
                     .style("top", (d3.event.pageY-10) + "px")
                     .select("#map-value")
                     .text("Code: " + d.properties.BU_CODE + " | Neighborhood: " + d.properties.BU_NAME.toString() + " | Value: " + d.properties[selectedProperty]);  

                   //Show the tooltip
                   d3.select("#map-tooltip").classed("hidden", false);
            })
            .on("mouseout", function(){
                   d3.select(this).classed("cell-hover",false);
                   //d3.selectAll(".rowLabel").classed("text-highlight",false);
                   //d3.selectAll(".colLabel").classed("text-highlight",false);
                   d3.select("#map-tooltip").classed("hidden", true);
            })
                
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
}