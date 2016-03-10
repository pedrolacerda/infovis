var heatmapMargin = { top: 50, right: 0, bottom: 100, left: 30 },
    heatmapWidth = 960 - heatmapMargin.left - heatmapMargin.right,
    heatmapHeight = 460 - heatmapMargin.top - heatmapMargin.bottom,
    gridSize = Math.floor(heatmapWidth / 24),
    //legendElementWidth = gridSize*2,
    legendElementWidth = gridSize,
    buckets = 9,
    colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
    variables = ["V1", "V2", "V3", "V4", "V5", "V6", "V7"],
    buurts = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a"];
    datasets = ["file://///nlshgw035.nl.heiway.net/Users5$/ResenP01/My%20Documents/UvA/Infovis/Dashboard/dashboard%20-%20active/data/heatmap.tsv"];

var heatmapSvg = d3.select("#heatmap").append("svg")
    .attr("width", heatmapWidth + heatmapMargin.left + heatmapMargin.right)
    .attr("height", heatmapHeight + heatmapMargin.top + heatmapMargin.bottom)
    .append("g")
    .attr("transform", "translate(" + heatmapMargin.left + "," + heatmapMargin.top + ")");

var dvariablesLabels = heatmapSvg.selectAll(".dayLabel")
    .data(variables)
    .enter().append("text")
      .text(function (d) { return d; })
      .attr("x", 0)
      .attr("y", function (d, i) { return i * gridSize; })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
      .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

var timeLabels = heatmapSvg.selectAll(".timeLabel")
    .data(buurts)
    .enter().append("text")
      .text(function(d) { return d; })
      .attr("x", function(d, i) { return i * gridSize; })
      .attr("y", 0)
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + gridSize / 2 + ", -6)")
      .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

var heatmapChart = function(tsvFile) {
  d3.tsv(tsvFile,
  function(d) {
    return {
      variable: +d.variable,
      buurt: +d.buurt,
      value: +d.value
    };
  },
  function(error, data) {
    var colorScale = d3.scale.quantile()
        .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
        .range(colors);

    var cards = heatmapSvg.selectAll(".hour")
        .data(data, function(d) {return d.variable+':'+d.buurt;});

    cards.append("title");

    cards.enter().append("rect")
        .attr("x", function(d) { return (d.buurt - 1) * gridSize; })
        .attr("y", function(d) { return (d.variable - 1) * gridSize; })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", colors[0]);

    cards.transition().duration(1000)
        .style("fill", function(d) { return colorScale(d.value); });

    cards.select("title").text(function(d) { return d.value; });
    
    cards.exit().remove();

    var legend = heatmapSvg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; });

    legend.enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", heatmapHeight-20) //-60 added by hand
      .attr("width", legendElementWidth)
      .attr("height", gridSize / 2) 
      .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return "≥ " + Math.round(d); })
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", (heatmapHeight + gridSize)-20); //-60 added by hand

    legend.exit().remove();

  });  
};

heatmapChart(datasets[0]);