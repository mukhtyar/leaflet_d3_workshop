###Create multiple D3 bar charts, use same domains

This is a example of how we can refactor code from our previous exercise to use the same x axis domain for all the charts. 
 
If you are new to D3 you can get API documentation [here](https://d3js.org/).

###Steps


1. For this exercise we will use the full csv file with Diseases Incidence Rate for California and all counties `data/lyme_disease_2001-2014.csv`

2. For this particular dataset, y values range from 0 to 65 with most being below 1. A linear scale for y axis may not be the most appropriate representation for this dataset. So while we are keeping the x axis steady for all charts, we are not going to do it for y axis. Of course this is just for demonstation purposes. You will need to do what's appropriate for your data.

3. Refactored code


  ```javascript
  
    /********************************************************************************
      CREATE MULTIPLE D3 BAR CHARTS
    ********************************************************************************/
  
      var data;
  
    // Use d3.csv to convert a csv file into an array of objects
    // This method is also asynchronous like jQuery's $.getJSON method
    d3.csv("data/lyme_disease_2001-2014.csv", function(error, _data) {
      data = _data;

      /** NEW **/
      // Convert string Year into date type and add a new attribute d.date
      // Convert Rate into a number type add a new attribute d.value
      data.forEach(function(d) {
        d.date = parseDate(d.Year);
        d.value = +d.Rate;
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
        return (item.County == county && item.Sex == 'Total');
      });
      
      var maleData = data.filter( function(item) {
        return (item.County == county && item.Sex == 'Male');
      });
  
      var femaleData = data.filter( function(item) {
        return (item.County == county && item.Sex == 'Female');
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
