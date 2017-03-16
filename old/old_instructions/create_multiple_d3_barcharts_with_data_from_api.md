###Create multiple D3 bar charts, use same domains

This is a example of how we can refactor code from our previous exercise to get data from the CDPH Open Data Portal instead of a csv file. 
 
If you are new to D3 you can get API documentation [here](https://d3js.org/).

###Steps


1. URL for this data set is `https://chhs.data.ca.gov/resource/jf5m-3fs6.json?disease=Lyme%20Disease&$limit=3000`

2. If you paste this url and look at what you get, you will notice the response is an array of objects in JSON. Note the attribute names start with lowercase letters. Our csv file has attribute names starting with uppercase letters. So we need to modify our code slightly to use the api. 

3. Refactored code


  ```javascript
  
    /********************************************************************************
      CREATE MULTIPLE D3 BAR CHARTS
    ********************************************************************************/
  
      var data;
  
    // Use d3.json
    // This method is also asynchronous like jQuery's $.getJSON method
    d3.json("https://chhs.data.ca.gov/resource/jf5m-3fs6.json?disease=Lyme%20Disease&$limit=3000", function(error, _data) {
      data = _data;

      /** NEW **/
      // Convert string Year into date type and add a new attribute d.date
      // Convert Rate into a number type add a new attribute d.value
      data.forEach(function(d) {
        d.date = parseDate(d.year);
        d.value = +d.rate;
      });

      // Calculate X axis domain from entire dataset instead of a subset of data
      xDomain = data.map(function(d) { return d.date; });

      // Calculate Y axis domain from entire dataset instead of a subset of data
      yDomain = [0, d3.max(data, function(d) { return d.value; })];

      //Now that the data is back we can set the chart domains
      totalsChart.xDomain(xDomain);
      //totalsChart.yDomain(yDomain);

      maleChart.xDomain(xDomain);
      //maleChart.yDomain(yDomain);

      femaleChart.xDomain(xDomain);
      //femaleChart.yDomain(yDomain);
      /*********END NEW*****************/


      renderChart(data, 'California');
    });
  
    // Create an instance of a barChart 
    // Neither data nor selection has yet been passed to the chart, so nothing will
    // actually happen based upon this function call
    var totalsChart = barChart();
  
    // Pass attributes using the setters provided by barChart
    // Note you cannot set any attributes here that depend on the data
    // e.g. domains because the data may not have come back yet.
    var sidebarW = $('.sidebar').width() - 50;
    totalsChart.width(sidebarW);
    totalsChart.height(200);
    totalsChart.axisLabel('Total');
    // Bind events
    totalsChart.on('barMouseover', function (el) {
      var d = el.__data__;
      var tooltip = '<p>Year: ' + d.Year +
                      ' Rate: ' + d.Rate + '</p>';
      $(".tooltip").append(tooltip);    
    });
    totalsChart.on('barMouseleave', function(){
      $(".tooltip").empty();
    })
  
    // Create a second instance of barChart 
    var maleChart = barChart();
    maleChart.width(sidebarW/2);
    maleChart.height(200);
    maleChart.axisLabel('Male');
  
    // Create a third instance of barChart 
    var femaleChart = barChart();
    femaleChart.width(sidebarW/2);
    femaleChart.height(200);
    femaleChart.axisLabel('Female');
  
  
    function renderChart(data, county) {
  
      var totalsData = data.filter( function(item) {
        return (item.county == county && item.sex == 'Total');
      });
      
      var maleData = data.filter( function(item) {
        return (item.county == county && item.sex == 'Male');
      });
  
      var femaleData = data.filter( function(item) {
        return (item.county == county && item.sex == 'Female');
      });
  
  
      // Select the chart-canvas div in HTML, bind data to it, draw the chart  
      d3.select(".chart-canvas.total")
        .datum(totalsData)
        .call(totalsChart);
  
      d3.select(".chart-canvas.male")
        .datum(maleData)
        .call(maleChart);
  
  
      d3.select(".chart-canvas.female")
        .datum(femaleData)
        .call(femaleChart);
    }
  
  ```




__Step through the code, read the comments to understand what's happening at each step. Ask questions!__

__Remember to refresh your browser to see your changes.__
