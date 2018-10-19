// Earthquake data link - >4.5 mag in last month
var quakeLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

d3.json(quakeLink, function(data) {
    console.log(data);
    createFeatures(data.features);
});

function createFeatures(quakeData) {       
  var quakes = L.geoJson(quakeData, {
    onEachFeature: function (feature, layer){
      layer.bindPopup("<h3>" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    },

//  It appears that the getRadius function isn't aligning magnitude with size exactly like I expect?
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: getRadius(feature.properties.mag),
          fillColor: getColor(feature.properties.mag),
          fillOpacity: .6,
          color: "black",
          weight: .5
      })
    }
  });

  createMap(quakes)
}

// End createFeatures


function createMap(quakes) {

  var satelliteMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 12,
      id: 'mapbox.satellite',
      accessToken: API_KEY
        }); 
 
  var lightMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 12,
      id: 'mapbox.light',
      accessToken: API_KEY
        }); 

  var baseMaps = {
    "Satellite Map": satelliteMap,
    "Light Map": lightMap
  };

  var overlayMap = {
    Earthquakes: quakes,
  };

  var myMap = L.map("map", {
    center: [32.0, -8.00],
    zoom: 2.3,
    layers: [lightMap, quakes]
  });

  L.control.layers(baseMaps, overlayMap, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
              grades = [4, 5, 6, 7, 8],
              labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);
}

// End createMap function(s)

// Start misc. functions supporting createFeatures and createMap

function getRadius(value){
    return value*70000
  }

  function getColor(d) {
    return d > 8 ? '#ff0000' :
    d > 7  ? '#ff8000' :
    d > 6  ? '#ffff00' :
    d > 5  ? '#80ff00' :
    d > 4   ? '#00ff00' :
              '#00ffbf';
  }


