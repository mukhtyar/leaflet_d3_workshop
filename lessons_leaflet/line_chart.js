import * as d3 from 'd3';

const chart = () => {
  /**
  * PUBLIC VARIABLES FOR THIS CHART
  **/

  let margin = { top: 50, right: 50, bottom: 100, left: 60 };
  let width = 1000;
  let height = 480;
  let chartClass = 'lineAreaChart';
  let xValue = (d) => d.date;
  let yValue = (d) => +d.value;
  let xDomain = [new Date(1950, 0, 1), new Date(2099, 11, 31)];
  let yDomain = [20, 100];
  let colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  let xAxisTickFormat = d3.timeFormat('%Y');
  let yAxisTickFormat = null;
  let xScale = d3.scaleTime();
  let yScale = d3.scaleLinear();
  let xAxis = d3.axisBottom().tickSizeOuter(0);
  let yAxis = d3.axisLeft().tickSizeOuter(0);
  let xAxisLabel = '';
  let yAxisLabel = '';
  let data = [];
  let t = d3.transition()
    .duration(750);

  /**
  * PRIVATE VARIABLES FOR THIS CHART
  **/
  let svgEnter;
  let chartW = 1000;
  let chartH = 480;
   // Second X scale for brush slider
  const xScaleBrush = d3.scaleTime();
  // X Axis for brush slider
  const xAxisBrush = d3.axisBottom(xScaleBrush);
  let brush;
  let brushContext;
  const dispatcher = d3.dispatch('click', 'mouseout');
  const formatMonth = d3.timeFormat('%m');
  const formatYear = d3.timeFormat('%Y');

  /**
  * PRIVATE FUNCTIONS
  **/
  function brushed() {
    if (!d3.event.sourceEvent) return;
    const s = d3.event.selection || xScaleBrush.range();
    xScale.domain(s.map(xScaleBrush.invert, xScaleBrush));
    exports.redraw();
  }

  function makeXgridlines() {
    return d3.axisBottom(xScale)
      .tickSize(-chartH)
      .tickFormat('');
  }

  function makeYgridlines() {
    return d3.axisLeft(yScale)
      .tickSize(-chartW)
      .tickFormat('');
  }

  // Line function
  const line = d3.line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)));

  // Area function
  const area = d3.area()
    .x((d) => xScale(xValue(d)))
    .y0((d) => yScale(+d.min))
    .y1((d) => yScale(+d.max));

  /**
  * WHAT IS EVALUATED BY '.call()'
  **/

  function exports(selection) {
    selection.each(function (_data) {
      data = _data;
      chartW = width - margin.left - margin.right;
      chartH = height - margin.top - margin.bottom;

      xScale
        .range([0, chartW])
        .domain(xDomain);

      yScale
        .rangeRound([chartH, 0])
        .domain(yDomain);

      // Setup brush
      xScaleBrush
        .range([0, chartW])
        .domain(xScale.domain());

      brush = d3.brushX()
        .extent([[0, 0], [chartW, 20]])
        .on('end', brushed);

      // Select the svg element, if it exists.
      const svg = d3.select(this).selectAll('svg').data([data]);

      // Append the elements which need to be inserted only once to svgEnter
      // Following is a list of elements that area inserted into the svg once
      svgEnter = svg.enter()
          .append('svg')
          .classed(chartClass, true);

      // Add defintions of graphical objects to be used later inside
      // a def container element.
      const defs = svgEnter.append('defs');

      // Add a clip path for hiding parts of graph out of bounds
      defs.append('clipPath')
        .attr('id', 'clip')
        .append('rect')
          .attr('width', chartW)
          .attr('height', chartH);

      // Add a group element called Container that holds all elements in the chart
      const container = svgEnter
        .append('g')
        .classed('container', true);

      // Add group element to Container for x axis
      container.append('g').classed('x-axis-group axis', true);
      container.append('g').classed('x-axis-grid', true);

      // Add group element to Container to hold data that will be drawn as area
      container.append('g').classed('timeseries-area', true);

      // Add group element to Container for y axis
      container.append('g').classed('y-axis-group axis', true);
      container.append('g').classed('y-axis-grid', true);

      // Add group element to Container tp hold data that will be drawn as lines
      container.append('g').classed('timeseries-line', true);

      // Add group element to hold annotations, explanatory text, legend
      const annotation = container.append('g').classed('annotation', true);

      // Add group element to hold brush
      brushContext = svgEnter.append('g').classed('context', true);
      brushContext.append('g').classed('brush-axis', true);
      brushContext.select('.brush-axis').call(xAxisBrush);
      brushContext
        .append('g').attr('class', 'brush')
        .call(brush)
        .call(brush.move, xScale.range());

      // Add X axis label to annotation
      annotation.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - (chartW / 2))
        .attr('x', 0 - margin.left)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .classed('x-axis-label', true)
        .text(xAxisLabel);

      // Add Y axis label to annotation
      annotation.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (chartH / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .classed('y-axis-label', true)
        .text(yAxisLabel);

      // Hover line for click events
      container.append('g')
        .append('line')
          .classed('hover-line', true)
          .attr('x1', 0)
          .attr('x2', 0)
          .attr('y1', 0)
          .attr('y2', chartH)
          .style('stroke-opacity', 0);

      // Invisible rect for mouse tracking since you
      // can't catch mouse events on a g element
      container.append('svg:rect')
        .attr('width', chartW)
        .attr('height', chartH)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function () {
          dispatcher.call('mouseout', this, null);
        })
        .on('click', function () {
          // Dispatch click event
          dispatcher.call('click', this, xScale);
        });

      // End of all the elements appended to svg only once
      // Following actions happen every time the svg is generated
      svgEnter = svgEnter.merge(svg);

      // Update the outer dimensions.
      svgEnter
        .attr('width', width)
        .attr('height', height);

      // Update the inner dimensions.
      svgEnter.select('g.container')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      svgEnter.select('g.x-axis-group')
        .attr('transform', `translate(0, ${chartH})`);

      svgEnter.select('g.x-axis-grid')
        .attr('transform', `translate(0, ${chartH})`);

      svgEnter.select('g.context')
        .attr('transform', `translate(${margin.left}, ${chartH + 80})`);

      brush.move(svgEnter.select('g.brush'), xScale.range());
    });
  }

  /**
  * PUBLIC GETTERS AND SETTERS FOR THE CHART
  **/

  exports.width = function (_) {
    if (!_) return width;
    width = parseInt(_);
    return this;
  };

  exports.height = function (_) {
    if (!_) return height;
    height = parseInt(_);
    return this;
  };

  exports.margin = function (_) {
    if (!_) return margin;
    margin = _;
    return this;
  };

  exports.chartClass = function (_) {
    if (!_) return chartClass;
    chartClass = _;
    return this;
  };

  exports.colorScale = function (_) {
    if (!_) return colorScale;
    colorScale = _;
    return this;
  };

  exports.xValue = function (_) {
    if (!_) return xValue;
    xValue = _;
    return this;
  };

  exports.yValue = function (_) {
    if (!_) return yValue;
    yValue = _;
    return this;
  };

  exports.xDomain = function (_) {
    if (!_) return xDomain;
    xDomain = _;
    xScale.domain(xDomain);
    return this;
  };

  exports.yDomain = function (_) {
    if (!_) return yDomain;
    yDomain = _;
    yScale.domain(yDomain);
    return this;
  };

  exports.xScale = function (_) {
    if (!_) return xScale;
    xScale = _;
    return this;
  };

  exports.yScale = function (_) {
    if (!_) return yScale;
    yScale = _;
    return this;
  };

  exports.xAxis = function (_) {
    if (!_) return xAxis;
    xAxis = _;
    return this;
  };

  exports.yAxis = function (_) {
    if (!_) return yAxis;
    yAxis = _;
    return this;
  };

  exports.xAxisLabel = function (_) {
    if (!_) return xAxisLabel;
    xAxisLabel = _;
    return this;
  };

  exports.yAxisLabel = function (_) {
    if (!_) return yAxisLabel;
    yAxisLabel = _;
    return this;
  };

  exports.xAxisTickFormat = function (_) {
    if (!_) return xAxisTickFormat;
    xAxisTickFormat = _;
    return this;
  };

  exports.yAxisTickFormat = function (_) {
    if (!_) return yAxisTickFormat;
    yAxisTickFormat = _;
    return this;
  };

  exports.t = function (_) {
    if (!_) return t;
    t = _;
    return this;
  };

  /**
  * PUBLIC FUNCTIONS FOR THE CHART
  **/
  exports.getColor = function (seriesName) {
    if (!seriesName) return '#000';
    return colorScale(seriesName);
  };

  exports.getBase = function () {
    return svgEnter;
  };

  exports.updateData = function (_data) {
    data = _data;
    svgEnter.data([data]);
  };

  exports.redraw = function () {
    // Redraw axes
    this.drawAxes();

    // Redraw area
    svgEnter.select('g.timeseries-area').selectAll('path')
      .each(function (d, i) {
        d3.select(this)
          .attr('d', area(d.values));
      });

    // Redraw lines
    svgEnter.select('g.timeseries-line').selectAll('path')
      .each(function (d, i) {
        d3.select(this)
          .attr('d', line(d.values));
      });
  };

  exports.drawAxes = function () {
    // X axis
    // Set scale and tick format
    xAxis.scale(xScale).tickFormat(xAxisTickFormat);
    // Draw axis
    svgEnter.select('.x-axis-group')
      .call(xAxis);
    // Draw gridlines
    svgEnter.select('.x-axis-grid')
      .call(makeXgridlines());
    // Add axis label
    svgEnter.select('.x-axis-label')
      .text(xAxisLabel);

    // Y axis
    // Set scale and tick format
    yAxis.scale(yScale).tickFormat(yAxisTickFormat);
    // Draw axis
    svgEnter.select('.y-axis-group')
      .call(yAxis);
    // Draw gridlines
    svgEnter.select('.y-axis-grid')
      .call(makeYgridlines());
    // Add axis label
    svgEnter.select('.y-axis-label')
      .text(yAxisLabel);
  };


  exports.drawArea = function (areaData) {
    if (typeof areaData !== 'object') {
      return;
    }
    const areaGroupContainer = svgEnter.select('g.timeseries-area');
    const areaGroup = areaGroupContainer.selectAll(`path.${areaData.name}`).data([areaData]);

    // EXIT old elements not present in new data
    areaGroup.exit()
      .transition(t)
      .remove();

    // UPDATE old elements present in new data
    areaGroup
      .transition(t)
      .attr('d', (d) => area(d.values));

    // ENTER new elements present in new data
    areaGroup.enter()
      .append('path')
        .attr('class', `area ${areaData.name}`)
        .transition(t)
        .attr('d', (d) => area(d.values));
  };

  exports.drawLine = function (lineData) {
    if (typeof lineData !== 'object') {
      return;
    }
    const lineGroupContainer = svgEnter.select('g.timeseries-line');
    const lines = lineGroupContainer.selectAll(`path.${lineData.name}`).data([lineData]);

    // EXIT old elements not present in new data
    lines.exit()
      .transition(t)
      .remove();

    // UPDATE old elements present in new data
    lines
      .transition(t)
      .attr('d', (d) => line(d.values));

    // ENTER new elements present in new data
    lines.enter()
      .append('path')
        .attr('class', `line ${lineData.name}`)
        .transition(t)
        .attr('d', (d) => line(d.values))
        .style('stroke', (d) => colorScale(d.name));
  };

  exports.updateVisibleLines = function (showSeries = [], filterSeries = []) {
    svgEnter.select('g.timeseries-line').selectAll('path')
      .each(function () {
        const selection = d3.select(this);
        const name = selection.attr('class').replace('line ', '');
        if (showSeries.indexOf(name) > -1 || filterSeries.indexOf(name) > -1) {
          selection.style('opacity', 1);
        } else {
          selection.style('opacity', 0);
        }
      });
  };

  exports.clear = function () {
    const lines = svgEnter.select('g.timeseries-line').selectAll('path');
    if (!lines.empty()) {
      lines.transition().remove();
    }
    const areas = svgEnter.select('g.timeseries-area').selectAll('path');
    if (!areas.empty()) {
      areas.transition().remove();
    }
  };

  exports.setNoData = function () {
    const lines = svgEnter.select('g.timeseries-line').selectAll('path');
    if (!lines.empty()) {
      lines.transition().remove();
    }
    const areas = svgEnter.select('g.timeseries-area').selectAll('path');
    if (!areas.empty()) {
      areas.transition().remove();
    }
  };

  exports.on = function () {
    const value = dispatcher.on.apply(dispatcher, arguments);
    return value === dispatcher ? exports : value;
  };


  return exports;
};

export default chart;
