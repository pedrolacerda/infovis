var visualizationParameters = {
	properties: [], // List of properties
	varInterest: "", //Variable of Interest
	denominator: "", // Variable to be the denominator
	year: "2011", // Year selected
	neighborhoods: [], // List of neighborhoods
	transformation: ""
};

function appendOption(select, value, text) {
	select.append($('<option>', {
    	value: value,
    	text: text
	}));
}

function initCheckboxes() {
	$(':checkbox').prop('checked', false);
}

initCheckboxes();

// Save the values selected into arrays and add the variable to the variables and denominator list
$('.economic-checkbox').change(function() {
	if(this.checked){
		visualizationParameters.properties.push(this.value);

		 appendOption($('#var-interest'), this.value, this.nextSibling.textContent);
  		 $('#var-interest').selectpicker('refresh');
  		 appendOption($('#denominator'), this.value, this.nextSibling.textContent);
  		 $('#denominator').selectpicker('refresh');

	}else{
		visualizationParameters.properties.splice(visualizationParameters.properties.indexOf(this.value),1);

		$('#').find('[value='+this.value+']').remove();
		$('#var-interest').selectpicker('refresh');
		$('#denominator').find('[value="'+this.value+'"]').remove();
		$('#denominator').selectpicker('refresh');

	}
});

$('.infra-checkbox').change(function() {
	if(this.checked){
		visualizationParameters.properties.push(this.value);

		 appendOption($('#var-interest'), this.value, this.nextSibling.textContent);
  		 $('#var-interest').selectpicker('refresh');
  		 appendOption($('#denominator'), this.value, this.nextSibling.textContent);
  		 $('#denominator').selectpicker('refresh');

	}else{
		visualizationParameters.properties.splice(visualizationParameters.properties.indexOf(this.value),1);

		$('#var-interest').find('[value="'+this.value+'"]').remove();
		$('#var-interest').selectpicker('refresh');
		$('#denominator').find('[value='+this.value+']').remove();
		$('#denominator').selectpicker('refresh');
	}	
});

$('.social-checkbox').change(function() {
	if(this.checked){
		visualizationParameters.properties.push(this.value);

		appendOption($('#var-interest'), this.value, this.nextSibling.textContent);
  		 $('#var-interest').selectpicker('refresh');
  		 appendOption($('#denominator'), this.value, this.nextSibling.textContent);
  		 $('#denominator').selectpicker('refresh');
	}else{
		visualizationParameters.properties.splice(visualizationParameters.properties.indexOf(this.value),1);

		$('#var-interest').find('[value='+this.value+']').remove();
		$('#var-interest').selectpicker('refresh');
		$('#denominator').find('[value="'+this.value+'"]').remove();
		$('#denominator').selectpicker('refresh');
	}	
});

$('.buurt-checkbox').change(function() {
	if(this.checked){
		visualizationParameters.neighborhoods.push(this.value);
	}else{
		visualizationParameters.neighborhoods.splice(visualizationParameters.properties.indexOf(this.value),1);
	}	
});


//Check-all function for all checkboxes
$('#economic-check-all').change(function() {

	var selectedElements = $('.economic-checkbox');

	if ($('#economic-check-all').prop('checked')){
		$('.economic-checkbox').prop('checked', true);
		
		for (var i = 0; i < selectedElements.length; i++) {
			if(visualizationParameters.properties.indexOf(selectedElements[i].value) == -1){
				visualizationParameters.properties.push(selectedElements[i].value);

				 appendOption($('#var-interest'), selectedElements[i].value, selectedElements[i].nextSibling.textContent);
		  		 $('#var-interest').selectpicker('refresh');
		  		 appendOption($('#denominator'), selectedElements[i].value, selectedElements[i].nextSibling.textContent);
		  		 $('#denominator').selectpicker('refresh');
			}
		}
	} else {
		selectedElements.prop('checked', false);
		for (var i = 0; i < selectedElements.length; i++) {
			visualizationParameters.properties.splice(visualizationParameters.properties.indexOf(selectedElements[i].value),1);

			$('#var-interest').find('[value="'+selectedElements[i].value+'"]').remove();
			$('#var-interest').selectpicker('refresh');
			$('#denominator').find('[value="'+selectedElements[i].value+'"]').remove();
			$('#denominator').selectpicker('refresh');
		}
	}
});

$('#infra-check-all').change(function() {

	var selectedElements = $('.infra-checkbox');

	if ($('#infra-check-all').prop('checked')){
		$('.infra-checkbox').prop('checked', true);
		
		for (var i = 0; i < selectedElements.length; i++) {
			if(visualizationParameters.properties.indexOf(selectedElements[i].value) == -1){
				visualizationParameters.properties.push(selectedElements[i].value);

				 appendOption($('#var-interest'), selectedElements[i].value, selectedElements[i].nextSibling.textContent);
		  		 $('#var-interest').selectpicker('refresh');
		  		 appendOption($('#denominator'), selectedElements[i].value, selectedElements[i].nextSibling.textContent);
		  		 $('#denominator').selectpicker('refresh');
			}
		}
	} else {
		selectedElements.prop('checked', false);
		for (var i = 0; i < selectedElements.length; i++) {
			visualizationParameters.properties.splice(visualizationParameters.properties.indexOf(selectedElements[i].value),1);

			$('#var-interest').find('[value="'+selectedElements[i].value+'"]').remove();
			$('#var-interest').selectpicker('refresh');
			$('#denominator').find('[value="'+selectedElements[i].value+'"]').remove();
			$('#denominator').selectpicker('refresh');
		}
	}
});

$('#social-check-all').change(function() {

	var selectedElements = $('.social-checkbox');

	if ($('#social-check-all').prop('checked')){
		$('.social-checkbox').prop('checked', true);

		for (var i = 0; i < selectedElements.length; i++) {
			if(visualizationParameters.properties.indexOf(selectedElements[i].value) == -1){
				visualizationParameters.properties.push(selectedElements[i].value);

				appendOption($('#var-interest'), selectedElements[i].value, selectedElements[i].nextSibling.textContent);
		  		 $('#var-interest').selectpicker('refresh');
		  		 $('.selectpicker').selectpicker('width', selectWidth);
		  		 appendOption($('#denominator'), selectedElements[i].value, selectedElements[i].nextSibling.textContent);
		  		 $('#denominator').selectpicker('refresh');
		  		 $('.selectpicker').selectpicker('width', selectWidth);
			}
		}

	} else {
		$('.social-checkbox').prop('checked', false);

		for (var i = 0; i < selectedElements.length; i++) {
			visualizationParameters.properties.splice(visualizationParameters.properties.indexOf(selectedElements[i].value),1);

			$('#var-interest').find('[value="'+selectedElements[i].value+'"]').remove();
			$('#var-interest').selectpicker('refresh');
			$('#denominator').find('[value="'+selectedElements[i].value+'"]').remove();
			$('#denominator').selectpicker('refresh');
		}

	}
});

$('#neighborhoods-check-all').change(function() {

	var selectedElements = $('.buurt-checkbox');

	if ($('#neighborhoods-check-all').prop('checked')){
		$('.buurt-checkbox').prop('checked', true);

		for (var i = 0; i < selectedElements.length; i++) {
			if(visualizationParameters.properties.indexOf(selectedElements[i].value) != -1){
				visualizationParameters.properties.push(selectedElements[i].value);
			}
		}

	} else {
		$('.buurt-checkbox').prop('checked', false);

		for (var i = 0; i < selectedElements.length; i++) {
			visualizationParameters.neighborhoods.splice(visualizationParameters.properties.indexOf(selectedElements[i].value),1);
		}
	}
});

// Capture variable of interest
$("#var-interest").change(function() {
	visualizationParameters.varInterest = $('#var-interest').selectpicker('val');
});

// Capture denominator
$("#denominator").change(function() {
	visualizationParameters.denominator = $('#denominator').selectpicker('val');
});

// Capture year
$("#slider").change(function() {
	visualizationParameters.year = $('#slider').val();
});

// Capture transformation
$("#transformations").change(function() {
	visualizationParameters.transformation = $('#transformations').selectpicker('val');
});

var pageHeight = $( window ).height();

var widgetHeight = pageHeight/3;

var secondaryChartsWidth = $("#secondary-charts").width();

var mapHeight,
	heatmapWidthDashboard,
	heatmapHeightDashboard,
	networkWidth,
	networkHeight,
	correlationWidgetWidth,
	correlationWidgetHeight;


$("#main-chart").height(pageHeight - 10);

var swapper = [];

$(document).on('click', '.swapper', function () {
	//some error in the DOM structure required this "workaround"
	if(this.parentNode.id == "bottom-widget-container"){
		swapper.push("heatmap");
	}else{
		swapper.push(this.parentNode.id);
	}

	//If there is two selected, swap them
	if (swapper.length == 2){
		swapWidgets(swapper[0], swapper[1]);
		swapper = [];
	}
	console.log(swapper);
})

var swapWidgets = function(id1, id2){
	var temp = "placeholder";

	//Typical swap
	$("#"+id1).attr("id", temp);
	$("#"+id2).attr("id", id1);
	$("#"+temp).attr("id", id2);

	//Clean the area
	$("#"+id1).children().remove();
	$("#"+id2).children().remove();

	//Define charts new positions
	setCurrentSizeValues(); 

	if(id1 == "map" || id2 == "map"){
		plotMap("data/amsterdam.geojson", "BIRTH_2014");
	}
	if(id1 == "heatmap" || id2 == "heatmap") {
		plotHeatmap("data/heatmap.json");	
	} 
	if(id1 == "network-diagram" || id2 == "network-diagram") {
		plotNetworkDiagram("data/network-diagram.json");
	}
	if(id1 == "correlation" || id2 == "correlation") {
		plotCorrelationMatrix("data/correlation-matrix.json");
	}

	//Reinsert swapper button into the widgets
	$("#"+id1).append("<div class='button swapper'><button type='button' class='btn btn-primary btn-block'><span class='glyphicon glyphicon-retweet' aria-hidden='true'></span></button></div>");
	$("#"+id2).append("<div class='button swapper'><button type='button' class='btn btn-primary btn-block'><span class='glyphicon glyphicon-retweet' aria-hidden='true'></span></button></div>");
}

/*
	It sets the right Height and Width for each widget given its position on the screen.
*/

var mainChartWidth = $("#main-chart").width();

var setCurrentSizeValues = function() {
	
	if($("#map").parent().attr("id") == "main-chart"){
		mapHeight = $("#main-chart").height() - 40;
	} else {
		mapHeight = widgetHeight;
	};

	if($("#heatmap").parent().attr("id") == "main-chart"){
		heatmapWidthDashboard = mainChartWidth;
		heatmapHeightDashboard = $("#main-chart").height() - 40;
	} else {
		heatmapWidthDashboard = secondaryChartsWidth;
		heatmapHeightDashboard = widgetHeight;
	};

	if($("#network-diagram").parent().attr("id") == "main-chart"){
		networkWidth = mainChartWidth;
		networkHeight = $("#main-chart").height() - 40;
	} else {
		networkWidth = secondaryChartsWidth;
		networkHeight = widgetHeight;
	};

	if($("#correlation").parent().attr("id") == "main-chart"){
		correlationWidgetWidth = mainChartWidth;
		correlationWidgetHeight = $("#main-chart").height() - 40;
	} else {
		correlationWidgetWidth = secondaryChartsWidth;
		correlationWidgetHeight = widgetHeight+150;
	};
};

function selectNeighborhoods(buurt){

	//put the clicked neighborhood in the list of selected neighborhoods
    visualizationParameters.neighborhoods.push(buurt);

	//highlight the area of the neighborhood on the map
    d3.selectAll(".leaflet-zoom-hide").selectAll("path").filter(function(d){ return d.properties.BU_CODE == buurt; }).classed("selected",true);
    d3.selectAll(".leaflet-zoom-hide").selectAll("path").filter(function(d){ return d.properties.BU_CODE == buurt; }).classed("selected",true);

    //gets the index of the column of the selected neighborhood in the heatmap
    var colIdx = d3.selectAll(".heatmapColLabel").filter(function(d,i) { return d == buurt; }).attr("col");
                    
    //highlight the selected neighborhood in the Heatmap
    d3.selectAll(".g3").selectAll(".cc"+colIdx)
        .classed("cell-selected", true);

    //highlight the selected neighborhood in the Network Diagram
    d3.selectAll(".node").filter(function(d,i) { return d.id == buurt}).classed("selected", true);
}

function deselectNeighborhoods(buurt){
	//remove the clicked neighborhood from the list of selected neighborhoods
    visualizationParameters.neighborhoods.splice(visualizationParameters.neighborhoods.indexOf(buurt),1);

    //deselect the area of the neighborhood on the map
    d3.selectAll(".leaflet-zoom-hide").selectAll("path").filter(function(d){ return d.properties.BU_CODE == buurt; }).classed("selected",false);

    //gets the index of the column of the selected neighborhood
    var colIdx = d3.selectAll(".heatmapColLabel").filter(function(d,i) { return d == buurt; }).attr("col");
                    
    //deselect the selected neighborhood in the Heatmap
    d3.selectAll(".g3").selectAll(".cc"+colIdx)
        .classed("cell-selected", false);

    //deselect the selected neighborhood in the Network Diagram
    d3.selectAll(".node").filter(function(d,i) { return d.id == buurt}).classed("selected", false);
}

function selectVariables(variable){

	//put the clicked variable in the list of selected variables
    visualizationParameters.properties.push(variable);

	//highlight the row with the selected variable in the heatmap
    d3.selectAll(".g3").selectAll(".cr"+ variable)
        .classed("cell-selected", true);

	//highlight the row and column with the selected variable in the correlation matrix
    d3.selectAll(".g4").selectAll(".cc"+ variable)
        .classed("cell-selected", true);

    d3.selectAll(".g4").selectAll(".cr"+ variable)
        .classed("cell-selected", true);
}

function deselectVariables(variable){
	//remove the clicked variable from the list of selected variables
    visualizationParameters.properties.splice(visualizationParameters.properties.indexOf(variable),1);

	//deselect the row with the selected variable in the heatmap
    d3.selectAll(".g3").selectAll(".cr"+ variable)
        .classed("cell-selected", false);

	//deselect the row and column with the selected variable in the correlation matrix
    d3.selectAll(".g4").selectAll(".cc"+ variable)
        .classed("cell-selected", false);

    d3.selectAll(".g4").selectAll(".cr"+ variable)
        .classed("cell-selected", false);
}

function calcCellSize(width, height, col_number, row_number) {
  var maxWidth = width/col_number;
  var maxHeight = height/row_number;

  var fitWidth = false;
  var fitHeight = false;

  //Check if the squares defined by the numbers of rows fit the height
  if((maxWidth*row_number) > height){
    return maxHeight;
  } else {
    return maxWidth;
  }
}
setCurrentSizeValues();

//[TO-DO] Delete these lines
visualizationParameters.neighborhoods.push("A00");
visualizationParameters.neighborhoods.push("A01");
visualizationParameters.neighborhoods.push("A02");
visualizationParameters.neighborhoods.push("A03");
visualizationParameters.neighborhoods.push("A04");
visualizationParameters.neighborhoods.push("A05");
visualizationParameters.neighborhoods.push("A06");
visualizationParameters.neighborhoods.push("A07");
visualizationParameters.neighborhoods.push("K45");
visualizationParameters.neighborhoods.push("K54");
visualizationParameters.neighborhoods.push("F84");
visualizationParameters.neighborhoods.push("M29");
visualizationParameters.neighborhoods.push("N60");
visualizationParameters.neighborhoods.push("N69");
visualizationParameters.neighborhoods.push("T98");
visualizationParameters.neighborhoods.push("N65");
visualizationParameters.neighborhoods.push("M33");
visualizationParameters.neighborhoods.push("K46");
visualizationParameters.neighborhoods.push("K52");
visualizationParameters.neighborhoods.push("F76");
visualizationParameters.neighborhoods.push("F83");
visualizationParameters.neighborhoods.push("E20");
visualizationParameters.neighborhoods.push("E12");
visualizationParameters.neighborhoods.push("B10");
visualizationParameters.neighborhoods.push("E22");
visualizationParameters.neighborhoods.push("M56");
visualizationParameters.neighborhoods.push("M28");