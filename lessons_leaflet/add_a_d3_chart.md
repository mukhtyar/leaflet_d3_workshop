###Add a D3 chart

In this exercise we are going to experiment with adding a bar chart created with D3.
 
If you are new to D3 you can get API documentation [here](https://d3js.org/).

###Steps

1. If you are new to D3 and data visualization, Scott Murray's [book](http://alignedleft.com/work/d3-book) is a great resource.

2. Once you are familiar with basic D3 concepts, the best way to start creating visualization components and learn more is by searching for blocks. [This](http://blockbuilder.org/) is a great place to start. 

2. Load the D3 javascript library. This has already been done for you for this exercise. If you are interested you can look at the `exercises/add_a_d3_chart.html` file in your code editor - it's towards the end.

3. A search for D3 barchart brings up [this block](https://bl.ocks.org/mbostock/3885304) by Mike Bostock, D3's creator. 

4. Open `exercises/js/add_a_d3_chart.js` in your code editor.

5. Copy and paste the code below into `exercises/js/add_a_d3_chart.js`. I have modified the code slightly to work with our data (Lyme Disease Incidence Rate for Total Population in California `data/lyme_disease_ca_2001-2014.csv`).

    ```javascript
/********************************************************************************
    ADD A D3 CHART
  ********************************************************************************/

  var margin = {top: 10, right: 20, bottom: 45, left: 30},
    width = 450 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  // Create a parsing function for date
  var parseDate = d3.time.format("%Y").parse;

  // Define scales
  var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .2);

  var yScale = d3.scale.linear().range([height, 0]);

  // Define axes
  var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .tickFormat(d3.time.format("%Y"));

  var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(10);

  // Create new svg element
  var svg = d3.select(".chart-canvas").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Use d3.csv to convert a csv file into an array of objects
  // This method is also asynchronous like jQuery's $.getJSON method
  d3.csv("data/lyme_disease_ca_2001-2014.csv", function(error, data) {

    // Convert string Year into date type and add a new attribute d.date
    // Convert Rate into a number type add a new attribute d.value
    data.forEach(function(d) {
        d.date = parseDate(d.Year);
        d.value = +d.Rate;
    });
  
    // Update domain for x and y scales using values from the data
    xScale.domain(data.map(function(d) { return d.date; }));
    yScale.domain([0, d3.max(data, function(d) { return d.value; })]);

    // Add x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

    // Add y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Count");

    // Add bars
    svg.append("g")
      .attr("class", "bars")
      .selectAll("bar")
        .data(data)
      .enter().append("rect")
        .style("fill", "DCDADA")
        .attr("x", function(d) { return xScale(d.date); })
        .attr("width", xScale.rangeBand())
        .attr("y", function(d) { return yScale(d.value); })
        .attr("height", function(d) { return height - yScale(d.value); });

  });
    ```

6. In Chrome, navigate to `http://localhost:8000/add_a_d3_chart.html`. 

7. A bar chart of Lyme Disease Incidence Rate is created in the sidebar. 

8. Experiment with plotting another field on the y axis - Count. The only thing you have to change is the following code (besides the y axis label):

```javascript
   data.forEach(function(d) {
        d.date = parseDate(d.Year);
        d.value = +d.Count;
    });
```


__Step through the code, read the comments to understand what's happening at each step. Ask questions!__

__Remember to refresh your browser to see your changes.__
