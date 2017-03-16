###Spatial analysis in your browser

In this exercise we are going to experiment with doing some spatial analysis directly in your browser.
 
Leaflet API documentation and more examples [here](http://leafletjs.com/).

###Steps

1. [Turf.js](http://turfjs.org/) is a javascript library for spatial analysis. MapBox has a great intro on using Turf that you can check out [here](https://www.mapbox.com/help/intro-to-turf/).

2. Download and load the Turf javascript library. This has already been done for you for this exercise. If you are interested you can look at the `exercises/js/spatial_analysis_in_your_browser.html` file in your code editor towards the end.

3. Open `exercises/js/spatial_analysis_in_your_browser.js` in your code editor.

4. Copy and paste the code below into `exercises/js/spatial_analysis_in_your_browser.js` inside the enterLayer function we defined in previous exercise.

    ```javascript
        // Function fired when user's mouse enters the layer
        function enterLayer(){

            var county = this.feature;

            // Get county name and pop. density and create a new html string
            var countyName = county.properties.CountyNAME;
            var density = county.properties.POP2014_SQMI;
            var html = countyName + '<br/>' + Math.round(density) + ' people / square mile';

            // Change style of polygon
            this.setStyle({
              weight:3,
              opacity: 1
            });

            /********************************************************************************
            SPATIAL ANALYSIS IN YOUR BROWSER
            ********************************************************************************/

            // Many turf functions expect a featurecollection. 
            // Use turf's featurecollection helper method to convert our geojson feature into a
            // featurecollection
            var fc = turf.featurecollection([county]);

            // Count number of tick locations within county
            var countFeature = turf.count(fc, tickLocations.toGeoJSON(), 'pt_count');
            var count = countFeature.features[0].properties.pt_count;

            // Add count to html string
            html = html + '<br/>' + count + ' collection locations';

            // Append html string to p element with .info class
            $('.info').html(html);

        }
    ```

5. In Chrome, navigate to `http://localhost:8000/spatial_analysis_in_your_browser.html`. 

6. Hover over a county to see counts of tick locations in sidebar. 

7. Experiment with other turf functions. This [google search](https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=leaflet%20turf%20jsfiddle) brings up a lot of code snippets on JS Fiddle that show what you can do with Leaflet and Turf.


__Step through the code, read the comments to understand what's happening at each step. Ask questions!__

__Remember to refresh your browser to see your changes.__
