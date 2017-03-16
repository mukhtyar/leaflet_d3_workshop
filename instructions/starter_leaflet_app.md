###Build a starter Leaflet app

This exercise covers the basics for creating a basic starter Leaflet web map.
The starter map simply loads a default base map, centers and zooms it in.
If you are new to Leafet you can get the examples and API documentation [here](http://leafletjs.com/).

###Steps

1. Copy and paste the code below into the workshop/0-setup/src/starter_leaflet_app.html.

    ```html

    <!-- Javascript code for your app goes in between script tags below -->
    <script type='text/javascript'>
      var map = L.map('map').setView([38.55, -121.46], 9);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
    </script>


    ```

2. In Chrome, navigate to `http://localhost:8000/0-setup/src/starter_leaflet_app.html`. You should see a map centered on Sacramento, California.

3. __Note__: Four things you need to add a Leaflet map to a web page
 * Leaflet CSS file
 * Leaflet JavaScript file
 * A div element with a certain id where you want your map to be 
 * A defined height for your map div

4. If you make changes to your html, css or js file make sure you refresh browser to see your changes

###Bonus

* If you are going to do any serious web development learn about using front-end development tools. A comprehensive guide [here](https://www.gitbook.com/book/frontendmasters/front-end-handbook/details). Lot's more on the web.
