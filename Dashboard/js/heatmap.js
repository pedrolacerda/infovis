var heatmapMargin = { top: 50, right: 10, bottom: 50, left: 100 },
  heatmapWidth = heatmapWidthDashboard - heatmapMargin.left - heatmapMargin.right,
  heatmapHeight = heatmapHeightDashboard - heatmapMargin.top - heatmapMargin.bottom;
  //gridSize = Math.floor(width / 24),
  //legendElementWidth = cellSize*2.5,
  var heatmapBuckets = 9;
  var heatmapColors = colorbrewer.OrRd[9]; //[TO-DO] create a dynamic colorbrewer pallet
  var hcrow = []; // change to gene name or probe id
  var hccol = []; // change to gene name or probe id
  var heatmapRowLabel = [];
  var heatmapColLabel = [];
  var col_number;
  var row_number;
  
  cellSize=23; //[TO-DO] dynamically define the cell size

d3.tsv("data/heatmap.tsv",
function(d, i) {
  return {
    row:   d.variable,
    col:   d.buurt,
    value: +d.value,
    normValue: +d.normalizedValue
  };
},
function(error, data) {
  var colorScale = d3.scale.quantile()
      .domain([0, heatmapBuckets - 1, d3.max(data, function (d) { return d.value; })]) //[TO-DO] adjust the domain for the specific that we have
      .range(heatmapColors);

  var structuredData = d3.nest()
          .key(function(d) { return d.row; })
          .entries(data);

  var temp = structuredData;

  //Insert the row labels
  for(var i=0; i<structuredData.length; i++){
    heatmapRowLabel.push(structuredData[i].key);
    hcrow.push(i+1);
  }

  //Insert the column labels
  for(var i=0; i<structuredData[0].values.length; i++){
    heatmapColLabel.push(structuredData[0].values[i].col);
    hccol.push(i+1);
  }

  //Define the number of rows and columns
  col_number = heatmapColLabel.length;
  row_number = heatmapRowLabel.length;  

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
      .attr("y", function (d, i) { return hcrow.indexOf(i+1) * cellSize; })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + cellSize / 1.5 + ")")
      .attr("class", function (d,i) { return "rowLabel mono r"+i;} ) 
      .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
      .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
      .on("click", function(d,i) {rowSortOrder=!rowSortOrder; sortbylabel("r",i,rowSortOrder);d3.select("#heatmap-order").property("selectedIndex", 1).node().focus();})
      ;

  var heatmapColLabels = heatmapSvg.append("g")
      .selectAll(".colLabelg")
      .data(heatmapColLabel)
      .enter()
      .append("text")
      .text(function (d) { return d; })
      .attr("x", 0)
      .attr("y", function (d, i) { return hccol.indexOf(i+1) * cellSize; })
      .style("text-anchor", "left")
      .attr("transform", "translate("+cellSize/2 + ",-6) rotate (-90)")
      .attr("class",  function (d,i) { return "colLabel mono c"+i;} )
      .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
      .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
      .on("click", function(d,i) {colSortOrder=!colSortOrder;  sortbylabel("c",i,colSortOrder);d3.select("#heatmap-order").property("selectedIndex", 1).node().focus();})
      ;

  var heatMap = heatmapSvg.append("g").attr("class","g3")
        .selectAll(".cellg")
        .data(data,function(d){return d.row+":"+d.col;})
        .enter()
        .append("rect")
        .attr("x", function(d) { return heatmapColLabel.indexOf(d.col) * cellSize; })
        .attr("y", function(d) { return heatmapRowLabel.indexOf(d.row) * cellSize; })
        .attr("class", function(d){return "cell cell-border cr"+(d.row-1)+" cc"+(d.col-1);})
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("title", function(d) { return d.normValue })
        .style("fill", function(d) { return colorScale(d.value); })
        /*.on("click", function(d) {
               var rowtext=d3.select(".r"+(d.row-1));
               if(rowtext.classed("text-selected")==false){
                   rowtext.classed("text-selected",true);
               }else{
                   rowtext.classed("text-selected",false);
               }
        })*/
        .on("mouseover", function(d){
               //highlight text
               d3.select(this).classed("cell-hover",true);
               d3.selectAll(".rowLabel").classed("text-highlight",function(r,ri){ return ri==(d.row-1);});
               d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(d.col-1);});
        
               //Update the tooltip position and value
               d3.select("#heatmap-tooltip")
                 .style("left", (d3.event.pageX+10) + "px")
                 .style("top", (d3.event.pageY-10) + "px")
                 .select("#heatmap-value")
<<<<<<< HEAD
                 .text("Row: " + (heatmapRowLabel.indexOf(d.row)+1) + " | Col: " + (heatmapColLabel.indexOf(d.col)+1) + " | Value: " + d.value);  
=======
                 .text("Row: " + correlationRowLabel[d.row-1] + " Col: " + correlationColLabel[d.col-1] + " Value: " + d.value);  
>>>>>>> parent of 116f84b... Left menu capturing all events and data
               //Show the tooltip
               d3.select("#heatmap-tooltip").classed("hidden", false);
        })
        .on("mouseout", function(){
               d3.select(this).classed("cell-hover",false);
               d3.selectAll(".rowLabel").classed("text-highlight",false);
               d3.selectAll(".colLabel").classed("text-highlight",false);
               d3.select("#heatmap-tooltip").classed("hidden", true);
        });

/* To insert legend uncomment here

  var legend = heatmapSvg.selectAll(".legend")
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

// Change ordering of cells

  function sortbylabel(rORc,i,sortOrder){

       var t = heatmapSvg.transition().duration(3000);
       var log2r=[];
       var sorted; // sorted is zero-based index
       d3.selectAll(".c"+rORc+i) 
         .filter(function(ce){
            log2r.push(ce.value);
          });

       if(rORc=="r"){ // sort value of a row

         sorted=d3.range(col_number).sort(function(a,b){if(sortOrder){ return log2r[b]-log2r[a];}else{ return log2r[a]-log2r[b];}});

         t.selectAll(".cell")
           .attr("x", function(d) { console.log(sorted.indexOf(heatmapColLabel.indexOf(d.col))); return sorted.indexOf(heatmapColLabel.indexOf(d.col)) * cellSize; });

         t.selectAll(".colLabel")
          .attr("y", function (d, i) { return sorted.indexOf(i) * cellSize; });

       }else{ // sort value of a column

        sorted=d3.range(row_number).sort(function(a,b){if(sortOrder){ return log2r[b]-log2r[a];}else{ return log2r[a]-log2r[b];}});

         t.selectAll(".cell")
           .attr("y", function(d) { console.log(sorted.indexOf(heatmapRowLabel.indexOf(d.row))); return sorted.indexOf(heatmapRowLabel.indexOf(d.row)) * cellSize; });

         t.selectAll(".rowLabel")
          .attr("y", function (d, i) { return sorted.indexOf(i) * cellSize; });

       }
  }


  d3.select("#heatmap-order").on("change",function(){
    order(this.value);
  });
  
  function order(value){
   if (value=="row"){

    var t = heatmapSvg.transition().duration(3000);
    t.selectAll(".cell")
      .attr("y", function(d) { return (d.row - 1) * cellSize; });

    t.selectAll(".rowLabel")
      .attr("y", function (d, i) { return i * cellSize; });

   }else if (value=="column"){

    var t = heatmapSvg.transition().duration(3000);
    t.selectAll(".cell")
      .attr("x", function(d) { return (d.col - 1) * cellSize; });

    t.selectAll(".colLabel")
      .attr("y", function (d, i) { return i * cellSize; });

   }
  }

  // 
  var sa=d3.select(".g3")
      .on("mousedown", function() {
          if( !d3.event.altKey) {
             d3.selectAll(".cell-selected").classed("cell-selected",false);
             d3.selectAll(".rowLabel").classed("text-selected",false);
             d3.selectAll(".colLabel").classed("text-selected",false);
          }
         var p = d3.mouse(this);
         sa.append("rect")
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
         var s = sa.select("rect.selection");
      
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

             d3.selectAll('.cell').filter(function(cell_d, i) {
                 if(
                     !d3.select(this).classed("cell-selected") && 
                         // inner circle inside selection frame
                     (this.x.baseVal.value)+cellSize >= d.x && (this.x.baseVal.value)<=d.x+d.width && 
                     (this.y.baseVal.value)+cellSize >= d.y && (this.y.baseVal.value)<=d.y+d.height
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
         sa.selectAll("rect.selection").remove();
      
             // remove temporary selection marker class
         d3.selectAll('.cell-selection').classed("cell-selection", false);
         d3.selectAll(".text-selection").classed("text-selection",false);
      })
      .on("mouseout", function() {
         if(d3.event.relatedTarget.tagName=='html') {
                 // remove selection frame
             sa.selectAll("rect.selection").remove();
                 // remove temporary selection marker class
             d3.selectAll('.cell-selection').classed("cell-selection", false);
             d3.selectAll(".correlationRowLabel").classed("text-selected",false);
             d3.selectAll(".colLabel").classed("text-selected",false);
         }
      })
      ;
});