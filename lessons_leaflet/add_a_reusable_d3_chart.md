###Add a reusable D3 chart

In this exercise we are going to experiment with adding a bar chart created with D3.
 
If you are new to D3 you can get API documentation [here](https://d3js.org/).

###Steps

1. A reusable chart can be used for inserting the chart to any DOM element, possibly multiple times on the same page, albeit with different data. With the code you added in the earlier excercise (add_a_d3_chart), if you wanted to add a second chart to the page you have to repeat the code all over again. 

2. A good place to start is by reading [Towards Resuable Charts](https://bost.ocks.org/mike/chart/) where Mike Bostock proposes a convention for creating reusable charts.

3. [This](https://bocoup.com/weblog/reusability-with-d3) blog post and [this book](http://backstopmedia.booktype.pro/developing-a-d3js-edge/1-getting-started/) do a great job on clarifying the resuable charts api with examples and explanations.

4. Create a new js file `exercises/js/bar_chart.js` and refactor the bar chart code. This file needs to be loaded before your main applciation js file. We will also move the chart css to a separate file. This step has already been done for you for this exercise.

5. Open `exercises/js/add_a_reusable_d3_chart.js` in your code editor.

6. Copy and paste the code below into `exercises/js/add_a_reusable_d3_chart.js` 

```javascript
  /********************************************************************************
    ADD A RESUABLE D3 CHART
  ********************************************************************************/

  var data;

  // Use d3.csv to convert a csv file into an array of objects
  // This method is also asynchronous like jQuery's $.getJSON method
  d3.csv("data/lyme_disease_2001-2014.csv", function(error, _data) {

    data = _data;

    var totalsData = data.filter( function(item) {
      return (item.County == 'California' && item.Sex == 'Total');
    });

    // Create an instance of a barChart 
    // Neither data nor selection has yet been passed to the chart, so nothing will
    // actually happen based upon this function call
    var totalsChart = barChart();

    // Pass attributes using the setters provided by barChart
    totalsChart.width(450);
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

    // Select the chart-canvas div in HTML, bind data to it, draw the chart  
    d3.select(".chart-canvas.total")
      .datum(totalsData)
      .call(totalsChart);


  });
```

7. In Chrome, navigate to `http://localhost:8000/add_a_reusable_d3_chart.html`. 

8. A bar chart of Lyme Disease Incidence Rate is created in the sidebar. It should look same as the chart in previous exercise. 

9. Hover over the bar chart, a tooltip at bottom will display the data for that bar.



__Step through the code, read the comments to understand what's happening at each step. Ask questions!__

__Remember to refresh your browser to see your changes.__
