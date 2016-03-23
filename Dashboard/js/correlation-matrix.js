function  plotCorrelationMatrix(correlationMatrixJson){  
  var correlationMargin = { top: 100, right: 10, bottom: 30, left: 100 },
    correlationWidth = correlationWidgetWidth - correlationMargin.left - correlationMargin.right,
    correlationHeight = correlationWidgetHeight - correlationMargin.top - correlationMargin.bottom,
    //gridSize = Math.floor(width / 24),
    //legendElementWidth = cellSize*2.5,
    correlationColors = {red: "red", green: "green", black: "black"},
    corhcrow = [],
    correlationRowLabel = [],
    corr_row_number,
    coorelatioinCellSize;

	
	data = correlationMatrixJson
	console.log(data);

    //Define the number of rows and columns
    corr_row_number = data.variables.length;

    corhcrow = d3.range(0, corr_row_number);

    coorelatioinCellSize = calcCellSize(correlationWidth, correlationHeight, corr_row_number, corr_row_number);

    for (var i in data.variables){
      correlationRowLabel.push(data.variables[i].name)
    }

    var correlationSvg = d3.select("#correlation").append("svg")
        .attr("width", correlationWidth + correlationMargin.left + correlationMargin.right)
        .attr("height", correlationHeight + correlationMargin.top + correlationMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + correlationMargin.left + "," + correlationMargin.top + ")")
        ;
    var rowSortOrder=false;
    var colSortOrder=false;
    var correlationRowLabels = correlationSvg.append("g")
        .selectAll(".rowLabelg")
        .data(correlationRowLabel)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return corhcrow.indexOf(i) * coorelatioinCellSize; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + coorelatioinCellSize / 1.5 + ")")
        .attr("class", function (d,i) { return "correlationRowLabel rowLabel mono r"+i;} ) 
        .attr("row", function (d,i) { return i; })
        .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
        .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
        .on("click", function(d,i) {rowSortOrder=!rowSortOrder; sortCorrBylabel("r",i,rowSortOrder);d3.select("#correlation-order").property("selectedIndex", 0).node().focus();})
        ;

    var correlationColLabels = correlationSvg.append("g")
        .selectAll(".colLabelg")
        .data(correlationRowLabel)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return corhcrow.indexOf(i) * coorelatioinCellSize; })
        .style("text-anchor", "left")
        .attr("transform", "translate("+coorelatioinCellSize/2 + ",-6) rotate (-90)")
        .attr("class",  function (d,i) { return "correlationColLabel colLabel mono c"+i;} )
        .attr("col", function (d,i) { return i; })
        .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
        .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
        .on("click", function(d,i) {colSortOrder=!colSortOrder;  sortCorrBylabel("c",i,colSortOrder);d3.select("#correlation-order").property("selectedIndex", 0).node().focus();})
        ;

    var  correlationMatrix = correlationSvg.append("g").attr("class","g4")
          .selectAll(".cellg")
          .data(data.correlations,function(d){return d.row+":"+d.col;})
          .enter()
          .append("rect")
          .attr("x", function(d) { return corhcrow.indexOf(d.col) * coorelatioinCellSize; })
          .attr("y", function(d) { return corhcrow.indexOf(d.row) * coorelatioinCellSize; })
          .attr("class", function(d){return "cell cell-border cr"+(d.row)+" cc"+(d.col);})
          .attr("width", coorelatioinCellSize)
          .attr("height", coorelatioinCellSize)
          .attr("title", function(d) { return d.value; })
          .style("fill", function(d) {
            if(d.row == d.col) return correlationColors.black;
            else return d.value >= 0 ? correlationColors.green : correlationColors.red 
          })
          .style("fill-opacity", function(d) { return Math.abs(d.value)})
          .on("click", function(d) {
                 if(this.classList.contains("cell-selected")==false){
                    selectVariables(d.row);
                 }else{
                   deselectVariables(d.row);
                 }
          })
          .on("mouseover", function(d){
                 //highlight text
                 d3.select(this).classed("cell-hover",true);
                 d3.selectAll(".rowLabel").classed("text-highlight",function(r,ri){ return ri==(d.row-1);});
                 d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(d.col-1);});
          
                 //Update the tooltip position and value
                 d3.select("#correlation-tooltip")
                   .style("left", (d3.event.pageX+10) + "px")
                   .style("top", (d3.event.pageY-10) + "px")
                   .select("#correlation-value")
                   .text("Row: " + (d.row+1) + " | Col: " + (d.col+1) + " | Correlation: " + d.value);  
                 //Show the tooltip
                 d3.select("#correlation-tooltip").classed("hidden", false);
          })
          .on("mouseout", function(){
                 d3.select(this).classed("cell-hover",false);
                 d3.selectAll(".rowLabel").classed("text-highlight",false);
                 d3.selectAll(".colLabel").classed("text-highlight",false);
                 d3.select("#correlation-tooltip").classed("hidden", true);
          });


}