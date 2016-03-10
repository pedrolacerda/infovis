var netDiagWidth = 600,
    netDiagHeight = 460;

var netDiagColor = d3.scale.category10();

var force = d3.layout.force()
    //.linkDistance(60)
    //.linkStrength(10)
    .size([netDiagWidth, netDiagHeight]);

var networkSvg = d3.select("#network-diagram").append("svg")
    .attr("width", netDiagWidth)
    .attr("height", netDiagHeight);

d3.json("file:///C:/Users/Pedro/Documents/GitHub/infovis/Dashboard/data/network-diagram.json", function(error, graph) {
  if (error) throw error;

  var networkNodes = graph.nodes.slice(),
      links = [],
      bilinks = [];

  graph.links.forEach(function(link) {
    var s = networkNodes[link.source],
        t = networkNodes[link.target],
        i = {}; // intermediate node
    networkNodes.push(i);
    links.push({source: s, target: i}, {source: i, target: t});
    bilinks.push([s, i, t]);
  });

  force
      .nodes(networkNodes)
      .links(links)
      .start();

  var link = networkSvg.selectAll(".link")
      .data(bilinks)
    .enter().append("path")
      .attr("class", "link")
      .attr("style", "stroke-width:3px"); // [TO-DO] change here to adapt the line stroke regarding to the correlation

  var node = networkSvg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 10) // [TO-DO] change here to adapt circle size regarding to the correlation
      .style("fill", function(d) { return netDiagColor(d.group); })
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.name; });

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
});
