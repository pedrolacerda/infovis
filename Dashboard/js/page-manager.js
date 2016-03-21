var visualizationParameters = {
	properties: [], // List of properties
	varInterest: "", //Variable of Interest
	denominator: "", // Variable to be the denominator
	year: "2011", // Year selected
	neighborhoods: [], // List of neighborhoods
	transformation: ""
};

// Save the values selected into arrays
$('.economic-checkbox').change(function() {

	if(this.checked){
		visualizationParameters.properties.push(this.value);
	}else{
		visualizationParameters.properties.splice(visualizationParameters.properties.indexOf(this.value),1);
	}
	
});

$('.infra-checkbox').change(function() {

	if(this.checked){
		visualizationParameters.properties.push(this.value);
	}else{
		visualizationParameters.properties.splice(visualizationParameters.properties.indexOf(this.value),1);
	}
	
});

$('.social-checkbox').change(function() {

	if(this.checked){
		visualizationParameters.properties.push(this.value);
	}else{
		visualizationParameters.properties.splice(visualizationParameters.properties.indexOf(this.value),1);
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
			}
		}
	} else {
		selectedElements.prop('checked', false);
		for (var i = 0; i < selectedElements.length; i++) {
			visualizationParameters.properties.splice(visualizationParameters.properties.indexOf(selectedElements[i].value),1);
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
			}
		}

	} else {
		$('.infra-checkbox').prop('checked', false);

		for (var i = 0; i < selectedElements.length; i++) {
			if(visualizationParameters.properties.indexOf(selectedElements[i].value) == -1){
				visualizationParameters.properties.push(selectedElements[i].value);
			}
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
			}
		}

	} else {
		$('.social-checkbox').prop('checked', false);

		for (var i = 0; i < selectedElements.length; i++) {
			visualizationParameters.properties.splice(visualizationParameters.properties.indexOf(selectedElements[i].value),1);
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
	console.log(visualizationParameters.transformation)
});

var pageHeight = $( window ).height();

var widgetHeight = pageHeight/3;

var mainChartWidth = $("#main-chart").width();

var secondaryChartsWidth = $("#secondary-charts").width();

var mapHeight,
	heatmapWidthDashboard,
	heatmapHeightDashboard,
	networkWidth,
	networkHeight,
	correlationWidgetWidth,
	correlationWidgetHeight;


$("#main-chart").height(pageHeight - 10);

var swapWidgets = function(id1, id2){
	//$("#map").attr("id", "heatmap")
}

/*
	It sets the right Height and Width for each widget given its position on the screen.
*/
var setCurrentSizeValues = function() {
	
	if($("#map").parent().attr("id") == "main-chart"){
		mapHeight = $("#main-chart").height() - 72;
	} else {
		mapHeight = widgetHeight;
	};

	if($("#heatmap").parent().attr("id") == "main-chart"){
		heatmapWidthDashboard = mainChartWidth;
		heatmapHeightDashboard = $("#main-chart").height() - 72;
	} else {
		heatmapWidthDashboard = secondaryChartsWidth;
		heatmapHeightDashboard = widgetHeight;
	};

	if($("#network-diagram").parent().attr("id") == "main-chart"){
		networkWidth = mainChartWidth;
		networkHeight = $("#main-chart").height() - 72;
	} else {
		networkWidth = secondaryChartsWidth;
		networkHeight = widgetHeight;
	};

	if($("#correlation").parent().attr("id") == "main-chart"){
		correlationWidgetWidth = mainChartWidth;
		correlationWidgetHeight = $("#main-chart").height() - 72;
	} else {
		correlationWidgetWidth = secondaryChartsWidth;
		correlationWidgetHeight = widgetHeight;
	};
};

setCurrentSizeValues();