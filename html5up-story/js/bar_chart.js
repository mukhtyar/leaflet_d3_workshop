function barChart() {

  // Various internal, private variables of the module.
  var margin = {top: 10, right: 20, bottom: 45, left: 30},
    width = 450,
    height = 200;

  var xRoundBands = 0.2;

  var xScale = d3.scale.ordinal();

  var yScale = d3.scale.linear();

  var xDomain, yDomain;

  var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .tickFormat(d3.time.format("%Y"));

  var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(10);

  var axisLabel = 'Rate';

  var dispatch = d3.dispatch("barMouseover", "barMouseleave");
      

  // Main internal module functionality
  function chart(selection) {
    selection.each(function(data) {
    
      // Set the domain and range of x-scale.
      xScale
          .domain(xDomain || data.map(function(d) { return d.date; }))
          .rangeRoundBands([0, width - margin.left - margin.right], xRoundBands);
         
      // Set the domain and range of y-scale.
      yScale
          .domain(yDomain || [0, d3.max(data, function(d) { return d.value; })])
          .range([height - margin.top - margin.bottom, 0])
          .nice();
          

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg").append("g");
      gEnter.append("g").attr("class", "bars");
      gEnter.append("g").attr("class", "y axis");
      gEnter.append("g").attr("class", "x axis");

      // Update the outer dimensions.
      svg .attr("width", width)
          .attr("height", height);

      // Update the inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Place x axis at the bottom of the chart
      g.select(".x.axis")
        .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
        .call(xAxis.orient("bottom"))
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", "-.55em")
          .attr("transform", "rotate(-90)" );

      // Place y-axis at the left
      g.select(".y.axis")
        .call(yAxis)
        .append("text")
          .attr("x", "3.5em")
          .attr("dy", "0.5em")
          .style("text-anchor", "end")
          .text(axisLabel);


      // Setup the enter, exit and update of the actual bars in the chart.
      var barContainer = svg.select(".bars");

      // Select the bars, and bind the data to the .bar elements.
      var bar = barContainer.selectAll(".bar").data(data);

      // If there aren't any bars create them
      bar.enter().append("rect")
        .classed("bar", true);

      // Attach events to bars
      bar.on("mouseover", function(){
          dispatch.barMouseover(this);
      })
      .on("mouseleave", dispatch.barMouseleave);


      // If exiting, i.e. deleting elements just remove it.
      bar.exit()
        .remove();

      // If updates required, update using a transition.
      bar.transition()
          .ease("linear")
        .attr("x", function(d) { return xScale(d.date); })
        .attr("width", xScale.rangeBand())
        .attr("y", function(d) { return yScale(d.value); })
        .attr("height", function(d) { return height - margin.bottom - margin.top - yScale(d.value); });


          
    });

  }

  // A series of public getter/setter functions

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.axisLabel = function(_) {
    if (!arguments.length) return axisLabel;
    axisLabel = _;
    return chart;
  };

  chart.xDomain = function(_) {
    if (!arguments.length) return xDomain;
    xDomain = _;
    return chart;
  };

  chart.yDomain = function(_) {
    if (!arguments.length) return yDomain;
    yDomain = _;
    return chart;
  };

  d3.rebind(chart, dispatch, "on");


  return chart;
}