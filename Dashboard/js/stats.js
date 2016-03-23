var statData = [];

/***************************************************************************
	This function loads the data from the JSON file and converts it.
 ***************************************************************************/
function initData() {
	d3.json("data/amsterdam.geojson", function (json) {
		for (var i=0; i<json.features.length; i++) {
			statData.push(json.features[i].properties);
		}
	});
}

/***************************************************************************
	This function retrieves the values for a specific variable for all
	the selected neighborhoods.
 ***************************************************************************/
function getValues(varName, arrNeighborhoods) {
	var returns = [];
	// Loop through all features, find if the active neighborhood
	// 		is selected, if so add the value to the array and return.
	for (var i=0; i<statData.length; i++) {
		if (arrNeighborhoods.indexOf(statData[i]["BU_CODE"]) != -1) {
			returns.push(statData[i][varName]);
		}
	}
	return returns;
}

/***************************************************************************
	This function calculated the Pearson's correlation coefficient r
	Please note that this function does not check that both arrays need
	to have the same sizeToContent and no NULL values are not handled.
 ***************************************************************************/
function calcPearson(arrX, arrY) {
	var r;
	var n = arrX.length;
	var sum_x = 0;
	var sum_y = 0;
	var mean_x = 0;
	var mean_y = 0;
	var sum_cov = 0;
	var sum_x_mx2 = 0;
	var sum_y_my2 = 0;

	for (var i=0; i<n; i++) {
		sum_x += arrX[i];
		sum_y += arrY[i];
	}
	mean_x = sum_x / n;
	mean_y = sum_y / n;

	for (var i=0; i<n; i++) {
		sum_cov += (arrX[i]-mean_x) * (arrY[i]-mean_y)
		sum_x_mx2 += Math.pow((arrX[i]-mean_x), 2);
		sum_y_my2 += Math.pow((arrY[i]-mean_y), 2);
	}
	
	r = sum_cov / (Math.sqrt(sum_x_mx2) * Math.sqrt(sum_y_my2));
	return r;
}

/***************************************************************************
	This function calculated the regression slope and intercept.
	Please note that this function does not check that both arrays need
	to have the same sizeToContent and no NULL values are not handled.
 ***************************************************************************/
function calcRegress(arrY, arrX) {
	var lr = {};
	var n = arrY.length;
	var sum_x = 0;
	var sum_y = 0;
	var sum_xy = 0;
	var sum_xx = 0;
	var sum_yy = 0;

	for (var i=0; i<n; i++) {
		sum_x += arrX[i];
		sum_y += arrY[i];
		sum_xy += (arrX[i]*arrY[i]);
		sum_xx += (arrX[i]*arrX[i]);
		sum_yy += (arrY[i]*arrY[i]);
	} 

	lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
	lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
	lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

	return lr;
}

/***************************************************************************
	This function calculated the exepcted values of the given array
	based on the retrieved parameters from the regression function.
 ***************************************************************************/
function expectedValues(slope, intercept, arrX) {
	var expected = [];
	for (var i=0; i<arrX.length; i++) {
		x = arrX[i];
		Ex = (slope * x) + intercept;
		expected.push([x, Ex, x-Ex]);
	}
	return expected;
}

/***************************************************************************
	This function normalizes the data given in an array, where the lowest
	value is 0 and the highest is 1, NULL values are not handled.
 ***************************************************************************/
function normalize(arrX) {
	var arrayNorm = [];
	var n = 0;
	min_x = Math.min.apply(null, arrX);
	max_x = Math.max.apply(null, arrX);
	for (var i=0; i<arrX.length; i++) {
		n = (arrX[i]-min_x) / (max_x-min_x);
		arrayNorm.push(n*100);
	}
	return arrayNorm;
}

/***************************************************************************
	This function trasnposes the array, so switches the rows to the columns.
 ***************************************************************************/
function transpose(a) {

  // Calculate the width and height of the Array
  var w = a.length ? a.length : 0,
    h = a[0] instanceof Array ? a[0].length : 0;

  // In case it is a zero matrix, no transpose routine needed.
  if(h === 0 || w === 0) { return []; }

  var i, j, t = [];

  // Loop through every item in the outer array (height)
  for(i=0; i<h; i++) {

    // Insert a new row (array)
    t[i] = [];

    // Loop through every item per item in outer array (width)
    for(j=0; j<w; j++) {

      // Save transposed data.
      t[i][j] = a[j][i];
    }
  }

  return t;
};


function dataHeatmap(arrVariables, arrNeighborhoods) {
	var aNeighborhoods = [];
	var aVariables = [];
	var aCorrelations = [];
	var aReturns = [];
	
	console.log('dataHeatmap - ' + arrVariables);
	console.log('dataHeatmap - ' + arrNeighborhoods);
	
	//Lookup the neighborhood ID in our data and get the name.
	for (var i=0; i<arrNeighborhoods.length; i++) {
		var res = statData
			.map(function (element) { return element.BU_CODE; })
			.indexOf(arrNeighborhoods[i]);
		
		var iNeighborhood = {id: statData[res].BU_CODE, name: statData[res].BU_NAME}
		aNeighborhoods.push(iNeighborhood);
	}

	for (var i=0; i<arrVariables.length; i++) {
		var iVariables = {name: arrVariables[i] }
		aVariables.push(iVariables);
	}

	// Loop throught the variables (rows)
	// Then loop throught the neighborhoods (cols)
	// Retrieve the proper value for the combination in data
	// Store the row
	for (var i=0; i<arrVariables.length; i++) {
		for (var j=0; j<arrNeighborhoods.length; j++) {
			var res = statData
				.map(function (element) { return element.BU_CODE; })
				.indexOf(arrNeighborhoods[j]);
			
			var iCorrelation = {row: i, col: j, value: statData[res][arrVariables[i]], normalizedValue: 0 }
			aCorrelations.push(iCorrelation);
		}
	}
	
	aReturns = {neighborhoods: aNeighborhoods, variables: aVariables, correlations: aCorrelations};
	return aReturns;
}