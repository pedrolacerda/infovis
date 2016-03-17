var pageHeight = $( window ).height();

var widgetHeight = pageHeight/3;

var mainChartWidth = $("#main-chart").width();

var secondaryChartsWidth = $("#secondary-charts").width();

var mapHeight,
	heatmapWidthDashboard,
	heatmapHeightDashboard,
	networkWidth,
	networkHeight,
	correlationSize;


$("#main-chart").height(pageHeight - 10);

var swapWidgets = function(id1, id2){
	//$("#map").attr("id", "heatmap")
}

/*
	This function is the most perfect example of what not to do. But it works.

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
		correlationSize = $("#main-chart").height() - 72;
	} else {
		correlationSize = widgetHeight;
	};
};

setCurrentSizeValues();