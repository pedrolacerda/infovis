var heatmapMargin = { top: 15, right: 0, bottom: 10, left: 20 },
    heatmapWidth = heatmapWidthDashboard - heatmapMargin.left - heatmapMargin.right,
    heatmapHeight = heatmapHeightDashboard - heatmapMargin.top - heatmapMargin.bottom,
    buckets = 9,
    buurts = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a"], //[TO-DO] Create a set of nighborhoods dynamically
    variables = ["V1", "V2", "V3", "V4", "V5", "V6", "V7"], //[TO-DO] Create a set of variables dynamically
    colors = colorbrewer.OrRd[9]; //[TO-DO] create a dynamic colorbrewer pallet

/*
This function checks if the grid size fits both the height and the width of the width
*/
var defineGridSize = function() {
      var expectedValue = Math.floor(heatmapWidth / buurts.length);

      if((expectedValue * variables.length) > heatmapHeight){
          return (heatmapHeight / variables.length);
      } else {
        return expectedValue;
      }
};

var gridSize = defineGridSize();
    
var legendElementWidth = gridSize;

var heatmapSvg = d3.select("#heatmap").append("svg")
    .attr("width", heatmapWidth + heatmapMargin.left + heatmapMargin.right)
    .attr("height", heatmapHeight + heatmapMargin.top + heatmapMargin.bottom)
    .append("g")
    .attr("transform", "translate(" + heatmapMargin.left + "," + heatmapMargin.top + ")");

var variablesLabels = heatmapSvg.selectAll(".dayLabel")
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
        .attr("title", function(d) { return d.value; })
        .style("fill", colors[0]);

    cards.transition().duration(1000)
        .style("fill", function(d) { return colorScale(d.value); });

    cards.select("title").text(function(d) { return d.value; });

    //[TO-DO] Display the normalized value and the name of the neighborhoods and variables instead of the number
    
    cards.exit().remove();

/* To activate the legend, just remove the comment

    var legend = heatmapSvg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; });

    legend.enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", heatmapHeight) //-60 added by hand
      .attr("width", legendElementWidth)
      .attr("height", gridSize / 2)
      .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return "≥ " + Math.round(d); })
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", (heatmapHeight + gridSize)); //-60 added by hand

    legend.exit().remove();
  */

  });  
};

heatmapChart("file:///C:/Users/Pedro/Documents/GitHub/infovis/Dashboard/data/heatmap.tsv");