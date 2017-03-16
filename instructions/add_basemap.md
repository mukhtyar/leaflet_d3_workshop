###Add basemaps

This exercise covers the basics for creating a Leaflet map element and adding a basemap to it.

Leaflet API documentation and more examples [here](http://leafletjs.com/).

###Steps

1. Open `exercises/js/add_basemap.js` in your code editor

2. Copy and paste the code below into `exercises/js/add_basemap.js`

    ```javascript

      /********************************************************************************
       INITIALIZE MAP
      ********************************************************************************/

      //Initialize a new Leaflet map object
      //Pass an object of options to initialization function
        var map = L.map('map', {
          center: [37, -120],
          zoom: 7,
          minZoom: 5,
          maxZoom: 12,
          attributionControl: true,
          touchZoom: false,
          scrollWheelZoom: false
        });

      /********************************************************************************
       ADD BASEMAP
      ********************************************************************************/

      //Initialize a new Leaflet layer
      var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        subdomains: 'abcd',
        maxZoom: 19
      });

      //Add layer to map
      map.addLayer(CartoDB_Positron);

    ```

3. In Chrome, navigate to `http://localhost:8000/add_basemap.html`. You should see a map of California showing a basemap with map tiles provided by CartoDB.

4. __Note__: Four things you need to add a Leaflet map to a web page
 * Leaflet CSS file
 * Leaflet JavaScript file
 * A div element with a certain id or class where you want your map to be 
 * A defined height for your map div

5. Experiment with different basemaps such as `Stamen Watercolor` or `CartoDB DarkMatter`. You can browse basemap options [here](http://leaflet-extras.github.io/leaflet-providers/preview/index.html).

__Remember to refresh your browser to see your changes.__

###Bonus

* Experiment with some api features such as setting zoom and changing the map center. See [here](http://leafletjs.com/reference.html#map-set-methods). e.g.
    ```javascript
      map.setZoom(12);
    ```
