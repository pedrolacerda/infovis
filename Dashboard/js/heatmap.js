function plotHeatmap(heatmapJson){  

  var heatmapMargin = { top: 50, right: 20, bottom: 10, left: 100 },
    heatmapWidth = heatmapWidthDashboard - heatmapMargin.left - heatmapMargin.right,
    heatmapHeight = heatmapHeightDashboard - heatmapMargin.top - heatmapMargin.bottom;
    //gridSize = Math.floor(width / 24),
    //legendElementWidth = cellSize*2.5,
    var heatmapBuckets = 9;
    var heatmapColors = colorbrewer.OrRd[9];
    var hcrow = []; 
    var hccol = []; 
    var heatmapRowLabel = [];
    var heatmapColLabel = [];
    var col_number;
    var row_number;

	  var hdata = heatmapJson;

    var colorScale = d3.scale.quantile()
        .domain([0, 100]) //This receives the input range
        .range(heatmapColors); //This gives the output range
	
    //Define the number of rows and columns
    col_number = hdata.neighborhoods.length;
    row_number = hdata.variables.length;

    hcrow = d3.range(0, row_number);
    hccol = d3.range(0, col_number);

    cellSize = calcCellSize(heatmapWidth, heatmapHeight, col_number, row_number);

    for (var i in hdata.variables){
      heatmapRowLabel.push(hdata.variables[i].name);
    }

    for (var i in hdata.neighborhoods){
      heatmapColLabel.push(hdata.neighborhoods[i].id);
    }

    var heatmapSvg = d3.select("#heatmap").append("svg")
        .attr("width", heatmapWidth + heatmapMargin.left + heatmapMargin.right)
        .attr("height", heatmapHeight + heatmapMargin.top + heatmapMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + heatmapMargin.left + "," + heatmapMargin.top + ")")
        ;
    var rowSortOrder=false; 
    var colSortOrder=false;

    var heatmapRowLabels = heatmapSvg.append("g")
        .selectAll(".rowLabelg")
        .data(heatmapRowLabel)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return hcrow.indexOf(i) * cellSize; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + cellSize / 1.5 + ")")
        .attr("class", function (d,i) { return "heatmapRowLabel rowLabel mono r"+i;} )
        .attr("row", function (d,i) { return i; })
        .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
        .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
        .on("click", function(d,i) {rowSortOrder=!rowSortOrder; sortbylabel("r",i,rowSortOrder);d3.select("#heatmap-order").property("selectedIndex", 0).node().focus();})
        ;

    var heatmapColLabels = heatmapSvg.append("g")
        .selectAll(".colLabelg")
        .data(heatmapColLabel)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return hccol.indexOf(i) * cellSize; })
        .style("text-anchor", "left")
        .attr("transform", "translate("+cellSize/2 + ",-6) rotate (-90)")
        .attr("class",  function (d,i) { return "heatmapColLabel colLabel mono c"+i;} )
        .attr("col", function (d,i) { return i; })
        .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
        .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
        .on("click", function(d,i) {colSortOrder=!colSortOrder;  sortbylabel("c",i,colSortOrder);d3.select("#heatmap-order").property("selectedIndex", 0).node().focus();})
        ;


    var heatMap = heatmapSvg.append("g").attr("class","g3")
          .selectAll(".cellg")
          .data(hdata.correlations, function(d){ return d.row+":"+d.col;})
          .enter()
          .append("rect")
          .attr("x", function(d) { return hccol.indexOf(d.col) * cellSize; })
          .attr("y", function(d) { return hcrow.indexOf(d.row) * cellSize; })
          .attr("class", function(d){return "cell cell-border cr"+(d.row)+" cc"+(d.col);})
          .attr("width", cellSize)
          .attr("height", cellSize)
          .attr("title", function(d) { return d.normalizedValue })
          .style("fill", function(d) { return colorScale(d.normalizedValue); })
          .on("click", function(d) {
                 if(this.classList.contains("cell-selected")==false){
                     //select the neighborhoods in all charts
                    selectNeighborhoods(hdata.neighborhoods[d.col].id);

                     //highlight the row and column with the selected variable in the correlation matrix
                    selectVariables(d.row);                    

                 }else{
                     deselectNeighborhoods(hdata.neighborhoods[d.col].id);

                     deselectVariables(d.row);
                 }
          })
          .on("mouseover", function(d){
                 //highlight text
                 d3.select(this).classed("cell-hover",true);
                 d3.selectAll(".rowLabel").classed("text-highlight",function(r,ri){ return ri==(d.row);});
                 d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(d.col);});
          
                 //Update the tooltip position and value
                 d3.select("#heatmap-tooltip")
                   .style("left", (d3.event.pageX+10) + "px")
                   .style("top", (d3.event.pageY-10) + "px")
                   .select("#heatmap-value")
                   .text("Row: " + (d.row+1) + " | Col: " + (d.col+1) + " | Value: " + d.value);  
                 //Show the tooltip
                 d3.select("#heatmap-tooltip").classed("hidden", false);
          })
          .on("mouseout", function(){
                 d3.select(this).classed("cell-hover",false);
                 d3.selectAll(".rowLabel").classed("text-highlight",false);
                 d3.selectAll(".colLabel").classed("text-highlight",false);
                 d3.select("#heatmap-tooltip").classed("hidden", true);
          });


  // Change ordering of cells

    function sortbylabel(rORc,i,sortOrder){

         var t = heatmapSvg.transition().duration(50);
         var log2r=[];
         var sorted; // sorted is zero-based index
         d3.selectAll(".c"+rORc+i) 
           .filter(function(ce){
              log2r.push(ce.value);
            });

         if(rORc=="r"){ // sort value of a row

           sorted=d3.range(col_number).sort(function(a,b){if(sortOrder){ return log2r[b]-log2r[a];}else{ return log2r[a]-log2r[b];}});

           t.selectAll(".cell")
             .attr("x", function(d) { return sorted.indexOf(d.col) * cellSize; });

           t.selectAll(".colLabel")
            .attr("y", function (d, i) { return sorted.indexOf(i) * cellSize; });

         }else{ // sort value of a column

          sorted=d3.range(row_number).sort(function(a,b){if(sortOrder){ return log2r[b]-log2r[a];}else{ return log2r[a]-log2r[b];}});

           t.selectAll(".cell")
             .attr("y", function(d) { return sorted.indexOf(d.row) * cellSize; });

           t.selectAll(".rowLabel")
            .attr("y", function (d, i) { return sorted.indexOf(i) * cellSize; });

         }
    }


    d3.select("#heatmap-order").on("change",function(){
      order(this.value);
    });
    
    function order(value){
     if (value=="row"){

      var t = heatmapSvg.transition().duration(500);
      t.selectAll(".cell")
        .attr("y", function(d) { return (d.row) * cellSize; });

      t.selectAll(".rowLabel")
        .attr("y", function (d, i) { return i * cellSize; });

     }else if (value=="column"){

      var t = heatmapSvg.transition().duration(500);
      t.selectAll(".cell")
        .attr("x", function(d) { return (d.col) * cellSize; });

      t.selectAll(".colLabel")
        .attr("y", function (d, i) { return i * cellSize; });

     }
    }

}