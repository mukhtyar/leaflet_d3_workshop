(function(){

  /********************************************************************************
    INITIALIZE MAP
  ********************************************************************************/

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

  // Create a new basemap
  var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
  });

  map.addLayer(CartoDB_Positron);
  map.setZoom(6);


  /********************************************************************************
    ADD TICK LOCATIONS
  ********************************************************************************/





  /********************************************************************************
    ADD LAYER CONTROL
  ********************************************************************************/













})();
