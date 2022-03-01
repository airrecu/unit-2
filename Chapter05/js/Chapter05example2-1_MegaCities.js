//declare map variable globally so all functions have access
var map;
var minValue;

//step 1 create map
function createMap(){

    //create the map
    map = L.map('map', {
        center: [0, 0],
        zoom: 2
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};

function calculateMinValue(data){
    //create empty array to store all data values
    var allValues = [];
    //loop through each city
    for(var city of data.features){
        //loop through each year
        for(var year = 1985; year <= 2015; year+=5){
              //get population for current year
              var value = city.properties["Pop_"+ String(year)];
              //add value to array
              allValues.push(value);
        }
    }
    //get minimum value of our array
    var minValue = Math.min(...allValues)

    return minValue;
}

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius

    return radius;
};

// //Step 3: Add circle markers for point features to the map
// function createPropSymbols(data){

//     //Step 4: Determine which attribute to visualize with proportional symbols
//     var attribute = "Pop_2015";

//     //create marker options
//     var geojsonMarkerOptions = {
//         fillColor: "#ff7800",
//         color: "#fff",
//         weight: 1,
//         opacity: 1,
//         fillOpacity: 0.8,
//         radius: 8
//     };

//     L.geoJson(data, {
//         pointToLayer: function (feature, latlng) {
//             //Step 5: For each feature, determine its value for the selected attribute
//             var attValue = Number(feature.properties[attribute]);

//             //Step 6: Give each feature's circle marker a radius based on its attribute value
//             geojsonMarkerOptions.radius = calcPropRadius(attValue);

//             //create circle markers
//             return L.circleMarker(latlng, geojsonMarkerOptions);
//         }
//     }).addTo(map);
// };


//New code from Example 2.1

//function to convert markers to circle markers
function pointToLayer(feature, latlng){
    //Determine which attribute to visualize with proportional symbols
    var attribute = "Pop_2015";

    //create marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string
    var popupContent = "<p><b>City:</b> " + feature.properties.City //+ "</p><p><b>" + attribute + ":</b> " + feature.properties[attribute] + "</p>";

    //new2.2
     //add formatted attribute to popup content string
     var year = attribute.split("_")[1];
     popupContent += "<p><b>Population in " + year + ":</b> " + feature.properties[attribute] + " million</p>";


    //bind the popup to the circle marker
    // layer.bindPopup(popupContent);
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-options.radius) 
    });



    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: pointToLayer
    }).addTo(map);
};



//end new 2.1 code





//Step 2: Import GeoJSON data
function getData(){
    //load the data
    fetch("data/MegaCities.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //calculate minimum data value
            minValue = calculateMinValue(json);
            //call function to create proportional symbols
            createPropSymbols(json);
        })
};

document.addEventListener('DOMContentLoaded',createMap)