###Add a geocoder

In this exercise we are going to add a geocoder control.
 
Leaflet API documentation and more examples [here](http://leafletjs.com/).

###Steps

1. There are lot of services that provide geocoding. Some geocoding API's are open sourced like Nominatim and MapZen. Which theoretically means you can create your own instances of these geocoders if you had the technical know how. Other geocoders like Google and ESRI are not.

2.  [Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim) is an open source geocoder for OSM data. There are different instances of Nominatim avaialble from different providers e.g. OSM, Mapquest, etc. with different terms of service. 

3. Another geocoder built with open source software is [MapZen](https://mapzen.com/projects/search?lng=-122.24710&lat=37.53310&zoom=12). MapZen's geocoding service is great and has generous terms of service. Their geocoding service is built on [open-source tools](https://github.com/pelias/pelias) and powered entirely by open data. 

4. Other geocoding service providers - Google, Bing, Esri, CartoDB, Mapbox, etc.

5. We will use a [leaflet plugin](https://github.com/perliedman/leaflet-control-geocoder) that adds a geocoder control to a leaflet map. You have the option of using different geocoding service with this plugin. 

6. Download and load the javascript and css files for plugin. This step has already been done for you for this exercise. If you are interested you can look at the `exercises/js/add_a_geocoder.html` file in your code editor - it's towards the end.

7. Open `exercises/js/add_a_geocoder.js` in your code editor.

8. Copy and paste the code below into `exercises/js/add_a_geocoder.js`

    ```javascript
/********************************************************************************
    ADD A GEOCODER
  ********************************************************************************/

  // Create a new geocoder that uses the Nominatim service provided by OSM
  // The countrycodes : 'us' option restricts searches to locations within US
  // For more options see https://github.com/perliedman/leaflet-control-geocoder
  var nominatim = new L.Control.Geocoder.Nominatim({
    geocodingQueryParams: {
      countrycodes: 'us'
    }
  });

  // Create a new geocoder control and pass in nominatim as the geocding service to use
  var geocoder = L.Control.geocoder({
    position: 'topleft',
    geocoder: nominatim
  }).addTo(map);

  // Intialize a new Leaflet Marker layer to store the geocding result
  var geocodeMarker = new L.Marker();

  // Overwrite the markGeocode function provided by geocoder control
  geocoder.markGeocode = function(result) {
    
    // Pans map to center
    map.setView(result.center, 8);

    // If a Leaflet Marker layer created by previous geocoding query exists, remove it from map
    if (map.hasLayer(geocodeMarker)){
      map.removeLayer(geocodeMarker);
    };

    // Update Leaflet Marker's location and popup content
    // Add to map and open popup
    geocodeMarker
      .setLatLng(result.center)
      .bindPopup(result.name || result.html)
      .addTo(map)
      .openPopup();    

  };

  // If user clicks anywhere on map remove geocoding result
  map.on('click', function(e){
    if (map.hasLayer(geocodeMarker)){
      map.removeLayer(geocodeMarker);
    };
  });
    ```

9. In Chrome, navigate to `http://localhost:8000/add_a_geocoder.html`. 

10. Search for a place name.


__Step through the code, read the comments to understand what's happening at each step. Ask questions!__

__Remember to refresh your browser to see your changes.__


