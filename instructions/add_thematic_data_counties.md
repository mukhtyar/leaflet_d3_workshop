###Add thematic data counties

In this exercise we are going to adding topojson file to Leaflet map. We will see how to create a topojson file, add the topojson layer to Leaflet, create and use a color scale for styling our polygons and adding a legend. 

Leaflet API documentation and more examples [here](http://leafletjs.com/).

###Steps

1. The geojson files we have been working with are small. Larger geojson files can take longer to load depending on size and network speed. And on the web you never want to keep your user waiting :-) There are couple of ways you can deal with larger files.

2. Use the topojson format. Topojson is an extension of GeoJSON that encodes topology. The following code adds the js library with topojson specification and extends the Leaflet GeoJSON object to load topojson files. This has already been done for you for this exercise. If you are interested you can look at the `exercises/js/add_thematic_data_counties.html` file in your code editor towards the end.

 ```html
    <!-- Load TopoJSON from CDN -->
    <!-- TopoJSON is an extension of GeoJSON that encodes topology -->
    <!-- https://github.com/mbostock/topojson/wiki -->
    <script src="//cdnjs.cloudflare.com/ajax/libs/topojson/1.6.20/topojson.js"></script>

    <!-- Javascript code for extending Leaflet's L.geoJson layer to read topojson files -->
    <script>
      // Copyright (c) 2013 Ryan Clark
      // https://gist.github.com/rclark/5779673
      L.TopoJSON = L.GeoJSON.extend({
        addData: function(jsonData) {    
          if (jsonData.type === "Topology") {
            for (key in jsonData.objects) {
              geojson = topojson.feature(jsonData, jsonData.objects[key]);
              L.GeoJSON.prototype.addData.call(this, geojson);
            }
          }    
          else {
            L.GeoJSON.prototype.addData.call(this, jsonData);
          }
        }  
      });
    </script>
 ```

3. You can convert geojson to topojson using [mapshaper.org](http://mapshaper.org/). Compare the file sizes between geojson and topojson. You can also further reduce file size by simplifying the geometry. It depends on your app, how much detail you need to show.

4. We are also using a javascript libarary for dealing with colors called [chroma.js](http://gka.github.io/chroma.js/). The script tag for this has already been added to the html file for this exercise. This library has by Gregor Aisch, a fantastic data visualization professional, who works for NY Times. Check out more of his work [here](http://driven-by-data.net/).

5. Open `exercises/js/add_thematic_data_counties.js` in your code editor.

6. Copy and paste the code below into `exercises/js/add_thematic_data_counties.js`

    ```javascript
/********************************************************************************
    ADD COUNTY POLYGONS
  ********************************************************************************/

  // Create a new L.TopoJSON layer
  var countyLayer = new L.TopoJSON();

  // Create a chroma color scale
  var colorScale = chroma.scale(['4CB5F5', '34675C']);
  var colorScaleDataValues = [];

  // The code below is another way to use jQuery's $.getJSON method using Javascript Promises
  // See https://davidwalsh.name/write-javascript-promises
  // Use the promise object returned by the $.getJSON method. 
  // When the response is returned, the .done method is called with the callback function
  // you provide. If the request fails, the .fail method is called.
  $.getJSON('data/ca_counties_census.topo.json')
    .done(addCountyData) //call function addCountyData on success
    .fail(function() {
      $('header').append('<p>Oh no, something went wrong with the county layer!</p>');
  });


  function addCountyData(topoData){

    // This is calling the addData method of the new L.TopoJSON layer we defined earlier
    countyLayer.addData(topoData);
    
    // Add layer to map
    countyLayer.addTo(map);

    // This is calling the eachLayer method of Leaflet's L.layerGroup
    // Note inheritance: L.TopoJSON extends L.GeoJSON extends L.FeatureGroup extends L.layerGroup
    // It iterates over the layers (== polygons) of the group and calls function addToDomain
    // addToDomain function extracts Population Density values for our color scale from topojson
    countyLayer.eachLayer(addToDomain);

    // Calculate quantile breaks for color scale
    calcQuantileBreaks();

    // Add legend
    addLegend();

    // For each layer it calls function handleLayer
    // handleLayer function styles the polygons and bind events
    countyLayer.eachLayer(handleLayer);

    // Move data behind tick locations
    countyLayer.bringToBack();

    // Add layer to layer control
    layerControl.addOverlay(countyLayer, "CA Counties");
  }


  // Extracts Population Density values for our color scale from topojson
  function addToDomain(layer){
    var value = layer.feature.properties.POP2014/layer.feature.properties.SQMI;
    // Modify the topojson object in memory (not the file) and add a new attribute
    // This attribute stores the population density per square mile
    layer.feature.properties['POP2014_SQMI'] = value;
    // Add the value to our color scale
    colorScaleDataValues.push(value);
  }


  // Calculate quantile breaks for color scale
  function calcQuantileBreaks(){
    colorScale.domain(colorScaleDataValues, 5, 'quantiles');
  }


  // Add legend
  // Inspiration for this legend https://www.mapbox.com/mapbox.js/example/v1.0.0/custom-legend/
  function addLegend(){

    // Get colors from color scale
    // Returns 5 colors since we specified 5 classes earlier
    var colors = colorScale.colors();

    // Append a new span element for each color
    colors.forEach(function(hexValue){
      $('.legend').append("<span style='background:" + hexValue + ";'></span>")
    });

    // Get range from color scale
    // Returns 6 values that bound the 5 classes
    var rangeValues = colorScale.domain();

    // Append a new label element for first 2 range values
    $('.legend').append("<label>" + Math.round(rangeValues[0]) + " - " + Math.round(rangeValues[1]) + "</label>")
    
    // Filter out the first two range values and create a new array
    var labels = rangeValues.filter(function(val, idx){
      if (idx > 1) {
        return val;
      }
    });
    // Append a new label element for remaining range values
    labels.forEach(function(label){
      $('.legend').append("<label>" + Math.round(label) + "</label>")
    });
  }


  // Style each layer
  function handleLayer(layer){

    // Get population density and corresponding color (hexvalue) from color scale
    var popDensity = (layer.feature.properties.POP2014_SQMI);
    var fillColor = colorScale(popDensity).hex();  
    
    // Style polygons
    layer.setStyle({
      fillColor : fillColor,
      fillOpacity: 1,
      color:'#B7B8B6',
      weight:2,
      opacity:.5
    });
    
    // Attach events to each polygon
    layer.on({
      mouseover : enterLayer,
      mouseout: leaveLayer
    });

  }


  // Function fired when user's mouse enters the layer
  function enterLayer(){

    var county = this.feature;

    // Get county name and pop. density and create a new html string
    var countyName = county.properties.CountyNAME;
    var density = county.properties.POP2014_SQMI;
    var html = countyName + '<br/>' + Math.round(density) + ' people / square mile';

    // Append html string to p element with .info class
    $('.info').html(html);
    
    // Change style of polygon
    this.setStyle({
      weight:3,
      opacity: 1
    });

  }


  // Function fired when user's mouse leaves the layer
  function leaveLayer(){
    $('.info').text('Hover over a county');
    this.setStyle({
      weight:2,
      opacity:.5
    });
  }
    ```

7. In Chrome, navigate to `http://localhost:8000/add_thematic_data_counties.html`. 

8. If you hover over a county it will display the County name and population in the sidebar

9. Great [mapmakers cheatsheet](https://github.com/tmcw/mapmakers-cheatsheet) on other options for dealing with large files with Leaflet and web maps in general.
 


__Step through the code, read the comments to understand what's happening at each step. Ask questions!__

__Remember to refresh your browser to see your changes.__

Another [tutorial on creating choropleth map](http://leafletjs.com/examples/choropleth.html) on Leaflet homepage