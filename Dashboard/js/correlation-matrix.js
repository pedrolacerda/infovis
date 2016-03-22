function  plotCorrelationMatrix(correlationMatrixJson){  
  var correlationMargin = { top: 100, right: 10, bottom: 30, left: 100 },
    correlationWidth = correlationWidgetWidth - correlationMargin.left - correlationMargin.right,
    correlationHeight = correlationWidgetHeight - correlationMargin.top - correlationMargin.bottom,
    //gridSize = Math.floor(width / 24),
    //legendElementWidth = cellSize*2.5,
    correlationColors = {red: "red", green: "green", black: "black"},
    corhcrow = [],
    correlationRowLabel = [],
    corr_row_number;
    coorelatioinCellSize=40; //[TO-DO] dynamically define the cell size

  d3.json(correlationMatrixJson,
  /* function(d) {
    return {
      row:   +d.variable1,
      col:   +d.variable2,
      value: +d.value
    };
  },
  */
  function(error, data) {

    /*var colorScale = d3.scale.quantile()
        .domain([0, correlationBuckets - 1, d3.max(data, function (d) { return d.value; })]) //[TO-DO] adjust the domain for the specific that we have
        .range(correlationBuckets);
    */

    //Define the number of rows and columns
    corr_row_number = data.variables.length;

    corhcrow = d3.range(0, corr_row_number);

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

  /* To insert legend uncomment here

    var legend = correlationSvg.selectAll(".legend")
        .data([-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10])
        .enter().append("g")
        .attr("class", "legend");
   
    legend.append("rect")
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height+(cellSize*2))
      .attr("width", legendElementWidth)
      .attr("height", cellSize)
      .style("fill", function(d, i) { return heatmapColors[i]; });
   
    legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return d; })
      .attr("width", legendElementWidth)
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height + (cellSize*4));
  */

/* To reactivate reordering, just comment here
  // Change ordering of cells

    function sortCorrBylabel(rORc,i,sortOrder){

         var t = correlationSvg.transition().duration(3000);
         var log2r=[];
         var sorted; // sorted is zero-based index
         d3.selectAll(".c"+rORc+i) 
           .filter(function(ce){
              log2r.push(ce.value);
            });

         if(rORc=="r"){ // sort value of a row

           sorted=d3.range(corr_row_number).sort(function(a,b){if(sortOrder){ return log2r[b]-log2r[a];}else{ return log2r[a]-log2r[b];}});

           t.selectAll(".cell")
             .attr("x", function(d) { return sorted.indexOf(d.col) * coorelatioinCellSize; });

           t.selectAll(".colLabel")
            .attr("y", function (d, i) { return sorted.indexOf(i) * coorelatioinCellSize; });

         }else{ // sort value of a column

          sorted=d3.range(corr_row_number).sort(function(a,b){if(sortOrder){ return log2r[b]-log2r[a];}else{ return log2r[a]-log2r[b];}});

           t.selectAll(".cell")
             .attr("y", function(d) { return sorted.indexOf(d.row) * coorelatioinCellSize; });

           t.selectAll(".rowLabel")
            .attr("y", function (d, i) { return sorted.indexOf(i) * coorelatioinCellSize; });

         }
    }
*/
/* To activate the ordering, just uncomment here 

    d3.select("#correlation-order").on("change",function(){
      order(this.value);
    });
    
    function order(value){
     if (value=="row"){

      var t = correlationSvg.transition().duration(3000);
      t.selectAll(".cell")
        .attr("y", function(d) { return (d.row) * coorelatioinCellSize; });

      t.selectAll(".rowLabel")
        .attr("y", function (d, i) { return i * coorelatioinCellSize; });

     }else if (value=="column"){

      var t = correlationSvg.transition().duration(3000);
      t.selectAll(".cell")
        .attr("x", function(d) { return (d.col) * coorelatioinCellSize; });

      t.selectAll(".colLabel")
        .attr("y", function (d, i) { return i * coorelatioinCellSize; });

     }
    }
/*
    /*
    var correlation_sa=d3.select(".g4")
        .on("mousedown", function() {
            if( !d3.event.altKey) {
               d3.selectAll(".cell-selected").classed("cell-selected",false);
               d3.selectAll(".rowLabel").classed("text-selected",false);
               d3.selectAll(".colLabel").classed("text-selected",false);
            }
           var p = d3.mouse(this);
           correlation_sa.append("rect")
           .attr({
               rx      : 0,
               ry      : 0,
               class   : "selection",
               x       : p[0],
               y       : p[1],
               width   : 1,
               height  : 1
           })
        })
        .on("mousemove", function() {
           var s = correlation_sa.select("rect.selection");
        
           if(!s.empty()) {
               var p = d3.mouse(this),
                   d = {
                       x       : parseInt(s.attr("x"), 10),
                       y       : parseInt(s.attr("y"), 10),
                       width   : parseInt(s.attr("width"), 10),
                       height  : parseInt(s.attr("height"), 10)
                   },
                   move = {
                       x : p[0] - d.x,
                       y : p[1] - d.y
                   }
               ;
        
               if(move.x < 1 || (move.x*2<d.width)) {
                   d.x = p[0];
                   d.width -= move.x;
               } else {
                   d.width = move.x;       
               }
        
               if(move.y < 1 || (move.y*2<d.height)) {
                   d.y = p[1];
                   d.height -= move.y;
               } else {
                   d.height = move.y;       
               }
               s.attr(d);
        
                   // deselect all temporary selected state objects
               d3.selectAll('.cell-selection.cell-selected').classed("cell-selected", false);
               d3.selectAll(".text-selection.text-selected").classed("text-selected",false);

               d3.selectAll('.cell').filter(function(cell_d, i) { //[TO-DO] Implement here the selection of a square in the chart
                   if(
                       !d3.select(this).classed("cell-selected") && 
                           // inner circle inside selection frame
                       (this.x.baseVal.value)+coorelatioinCellSize >= d.x && (this.x.baseVal.value)<=d.x+d.width && 
                       (this.y.baseVal.value)+coorelatioinCellSize >= d.y && (this.y.baseVal.value)<=d.y+d.height
                   ) {
        
                       d3.select(this)
                       .classed("cell-selection", true)
                       .classed("cell-selected", true);

                       d3.select(".r"+(cell_d.row-1))
                       .classed("text-selection",true)
                       .classed("text-selected",true);

                       d3.select(".c"+(cell_d.col-1))
                       .classed("text-selection",true)
                       .classed("text-selected",true);
                   }
               });
           }
        })
        .on("mouseup", function() {
              // remove selection frame
           correlation_sa.selectAll("rect.selection").remove();
        
               // remove temporary selection marker class
           d3.selectAll('.cell-selection').classed("cell-selection", false);
           d3.selectAll(".text-selection").classed("text-selection",false);
        })
        .on("mouseout", function() {
           if(d3.event.relatedTarget.tagName=='html') {
                   // remove selection frame
               correlation_sa.selectAll("rect.selection").remove();
                   // remove temporary selection marker class
               d3.selectAll('.cell-selection').classed("cell-selection", false);
               d3.selectAll(".rowLabel").classed("text-selected",false);
               d3.selectAll(".colLabel").classed("text-selected",false);
           }
        });
        */
  });
}