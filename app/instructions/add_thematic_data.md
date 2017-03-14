###Add thematic data

In this exercise we are going to experiment with different ways of adding your thematic data to the Leaflet app. 

Leaflet API documentation and more examples [here](http://leafletjs.com/).

###Steps

1. Open `exercises/js/add_thematic_data.js` in your code editor

3. We will use jQuery and it's $.getJSON method to load a geojson file. [jQuery](https://en.wikipedia.org/wiki/JQuery) is a very popular cross-platform JavaScript library designed to simplify the client-side scripting of HTML.

4. To use jQuery you need to include a script tag in your html file to load the library. This has already been done for you for this exercise. If you are interested you can look at the `exercises/js/add_thematic_data.html` file in your code editor - it's towards the end. Many popular javascript libraries are available through CDN's (Content Delivery Networks) or you can download and host them locally.

4. Copy and paste the code below into `exercises/js/add_thematic_data.js`

    ```javascript
      /********************************************************************************
          ADD TICK LOCATIONS
      ********************************************************************************/

      // Create an empty L.geoJson object, add it to map
      // Note: we are chaining two methods here; [method chaining](http://schier.co/blog/2013/11/14/method-chaining-in-javascript.html) is a common technique for writing compact code 
      // in scenarios that involve multiple functions on same object consecutively.

      var tickLocations = L.geoJson().addTo(map);      

      // This is an example of asynchronous function
      // All code within the $.getJSON method will be executed once the client (our browser)
      // makes a request to server (in this case our local server) for data
      // and recieves data back from server
      $.getJSON("data/tick_locations.geojson", function(data) {
        tickLocations.addData(data);
      });

    ```

5. In Chrome, navigate to `http://localhost:8000/add_thematic_data.html`. You should see markers added to your map for tick locations using Leaflet's default marker style. We will see how to change the marker style in next exercise.

6. Another way to load a geojson file is to use the [Leaflet AJAX plugin](https://github.com/calvinmetcalf/leaflet-ajax). If you want to try this first add the `js/lib/leaflet.ajax.js` within script tags to your html file. Make sure any Leaflet plugin js library you use in listed after Leaflet library. And then use the following code: 

    ```javascript
      var geojsonLayer = new L.geoJson.AJAX("geojson/tick_locations.geojson");/geojsonLayer.addTo(map);
    ```


__Remember to refresh your browser to see your changes.__

###Bonus

* [Leaflet Geojson Tutorial](http://leafletjs.com/examples/geojson.html)
