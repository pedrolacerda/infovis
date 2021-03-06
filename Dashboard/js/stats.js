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
	var n;
	// Loop through all features, find if the active neighborhood
	// 		is selected, if so add the value to the array and return.
	for (var i=0; i<statData.length; i++) {
		n = arrNeighborhoods.indexOf(statData[i]["BU_CODE"])
		if (n != -1) {
			returns[n] = (statData[i][varName]);
		}
	}

	/*for (var i=0; i<arrNeighborhoods.length; i++) {
		for (var j=0; j<statData.length; j++) {
			if(statData[j].BU_CODE) === arrNeighborhoods[i]) {
				returns.push(statData[j][varName]);
				//console.log(statData[j].BU_CODE);
			}
		}		
	}*/
	//console.log(returns);
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
function calcRegress(arrX, arrY) {
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
		//sum_yy += (arrY[i]*arrY[i]);
	} 
	
	var slope = ((n*sum_xy) - (sum_x*sum_y)) / ((n*sum_xx) - (sum_x*sum_x));	
	var intercept = ((sum_y - (slope*sum_x)) / n);
	
	lr['slope'] = slope
	lr['intercept'] = intercept
	//lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

	return lr;
}

/***************************************************************************
	This function calculated the exepcted values of the given array
	based on the retrieved parameters from the regression function.
 ***************************************************************************/
function expectedValues(slope, intercept, arrX, arrY) {
	console.log(slope);
	console.log(intercept);
	var expected = [];
	for (var i=0; i<arrX.length; i++) {
		x = arrX[i];
		y = arrY[i];
		console.log(x);
		Ex = ((slope * x) + intercept);
		expected.push([x, Ex, y-Ex, Math.abs(y-Ex)]);
	}
	console.log(expected);
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

/***************************************************************************
	This function retrieves the data for the heatmap dyamically.
 ***************************************************************************/
function dataHeatmap(arrVariables, arrNeighborhoods) {
	var aNeighborhoods = [];
	var aVariables = [];
	var aCorrelations = [];
	var aReturns = [];
		
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
			//[TO-DO] Check if defined, otherwise do again...
			
			var iCorrelation = {row: i, col: j, value: statData[res][arrVariables[i]], normalizedValue: 0 }
			aCorrelations.push(iCorrelation);
		}
	}
	
	aReturns = {neighborhoods: aNeighborhoods, variables: aVariables, correlations: aCorrelations};
	return aReturns;
}

/***************************************************************************
	This function retrieves the data for the correlationmatrix dyamically.
 ***************************************************************************/
function dataCorrelation(arrVariables, arrNeighborhoods) {
	var aNeighborhoods = [];
	var aVariables = [];
	var aCorrelations = [];
	var aReturns = [];
	
	for (var i=0; i<arrVariables.length; i++) {
		var iVariables = {name: arrVariables[i] }
		aVariables.push(iVariables);
	}

	var r = 0;
	for (var i=0; i<arrVariables.length; i++) {
		var iCorrelation = {row: i, col: i, value: 1 }
		aCorrelations.push(iCorrelation);
		for (var j=i; j<arrVariables.length; j++) {
			r = calcPearson(getValues(arrVariables[i], arrNeighborhoods),getValues(arrVariables[j], arrNeighborhoods))
			var iCorrelation = {row: i, col: j, value: r }
			aCorrelations.push(iCorrelation);
		}
	}
	aReturns = {variables: aVariables, correlations: aCorrelations};
	return aReturns;
}

/***************************************************************************
	This function retrieves the data for the network diagram dyamically.
 ***************************************************************************/
function dataNetwork(varX, varY, arrNeighborhoods) {
	aNodes = [];	//id, group, size, name
	aLinks = [];	//source, target, value
	aReturns = [];
	
	var dataX = getValues(varX, arrNeighborhoods);
	var dataY = getValues(varY, arrNeighborhoods);
	var r = calcPearson(dataX, dataY);
	var lr = calcRegress(dataX, dataY);
	//--console.log(lr);
	var expect = expectedValues(lr['slope'], lr['intercept'], dataX, dataY);	//expect[3]: |x-E(x)|
	//--console.log(expect);
	
	// we have to normalize the absolute value of the differences: expect[i][3]
	// Then we convert the value by (100-norm)/10: so ranges from 0 to 10.
	// Since we still need to see the bubbles, we add 3 to them, so the size ranges from from 3 to 13.
	var diffAbsExpected = [];
	for (var i=0; i<expect.length; i++) {
		diffAbsExpected.push(expect[i][3]);
	}
	diffAbsExpected = normalize(diffAbsExpected);
	console.log(diffAbsExpected);

	var diffExpected = [];
	for (var i=0; i<expect.length; i++) {
		diffExpected.push(expect[i][2]);
	}
	diffExpected = normalize(diffExpected);
	

	//Lookup the neighborhood ID in our data and get the name.
	for (var i=0; i<arrNeighborhoods.length; i++) {
		var vGroup = 0;
		var res = statData
			.map(function (element) { return element.BU_CODE; })
			.indexOf(arrNeighborhoods[i]);
		
		if ((expect[i][2])<0) { vGroup = 1 } else { vGroup = 2}
		
		var iNode = {id: statData[res].BU_CODE, group: vGroup, size: (((100-diffAbsExpected[i])/10)+3), name: statData[res].BU_NAME}
		aNodes.push(iNode);
	}

	// Loop through the nodes and define the link with the other nodes
	console.log(diffExpected);
	for (var i=0; i<diffExpected.length-1; i++) {
		for (var j=i+1; j<diffExpected.length; j++) {
			var iLink = { source: i, target: j, value: ((100-Math.abs(diffExpected[i]-diffExpected[j]))/10) }
			aLinks.push(iLink);
		}
	}
	aReturns = {nodes: aNodes, links: aLinks};
	return aReturns;
}