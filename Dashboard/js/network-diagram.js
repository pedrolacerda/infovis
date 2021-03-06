function  plotNetworkDiagram(networkJson){ 
  var netDiagWidth = networkWidth,
      netDiagHeight = networkHeight;

  var netDiagColor = d3.scale.category10();

  var force = d3.layout.force() //[TO-DO] test other algorithm
	  .charge(-120)		// was not there
      .linkDistance(30)	// was 60
      // .linkStrength(10)
      .size([netDiagWidth, netDiagHeight]);

  var networkSvg = d3.select("#network-diagram").append("svg")
      .attr("width", netDiagWidth)
      .attr("height", netDiagHeight);

	var graph = networkJson;

    var networkNodes = graph.nodes.slice(),
        links = [],
        bilinks = [];

    graph.links.forEach(function(link) {
      var s = networkNodes[link.source],
          t = networkNodes[link.target],
          i = {}, // intermediate node
          f = link.value; // inserted this parameter to fill the line stroke

      networkNodes.push(i);
      links.push({source: s, target: i}, {source: i, target: t});
      bilinks.push([s, i, t, f]);
    });


    force
        .nodes(networkNodes)
        .links(links)
        .start();

    var link = networkSvg.selectAll(".link")
        .data(bilinks)
		.enter().append("path")
        .attr("class", "link")
        .attr("style", function(d) { return ("stroke-width:"+ d[3] + "px"); });

    var node = networkSvg.selectAll(".node")
        .data(graph.nodes)
		.enter().append("circle")
        .attr("class", "node")
        .attr("r", function(d) { return d.size }) // [TO-DO] change here to adapt circle size regarding to the correlation
        .style("fill", function(d) { return netDiagColor(d.group); })
        .on("mouseover", function(d){
          
                 //Update the tooltip position and value
                 d3.select("#network-tooltip")
                   .style("left", (d3.event.pageX+10) + "px")
                   .style("top", (d3.event.pageY-10) + "px")
                   .select("#network-value")
                   .text(d.id + ": " + d.name);

                 //Show the tooltip
                 d3.select("#network-tooltip").classed("hidden", false);
          })
          .on("mouseout", function(){
                 d3.select(this).classed("cell-hover",false);
                 d3.select("#network-tooltip").classed("hidden", true);
          })
        .on("click", function(d) {
          if(!d3.select(this).classed("selected")){
            selectNeighborhoods(d.id);
          } else {
            deselectNeighborhoods(d.id);            
          }
        })
        .call(force.drag);

    force.on("tick", function() {
      link.attr("d", function(d) {
        return "M" + d[0].x + "," + d[0].y
            + "S" + d[1].x + "," + d[1].y
            + " " + d[2].x + "," + d[2].y;
      });
      node.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    });
}