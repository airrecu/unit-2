
// <!-- Arrow images sourced from the Noun Project Inc -->
// <!-- Source data, State Statistics Service of Ukraine : http://database.ukrcensus.gov.ua/MULT/Database/Population/databasetree_en.asp -->
// <!-- Accessed February 27, 2022 and March 1, 2022 -->




//declare map variable globally so all functions have access
var map;
var minValue;

//step 1 create map
function createMap(){

    //create the map
    map = L.map('map', {
        center: [48.0, 31.2],
        zoom: 5
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};



//ASK about the ... under the function name
//TODO format the numbers wit commas
//TODO comment that data was pulled on certain date, source may not be available due to war
//TODO change symbology for Crimea and Sevastopol
//TODO add Wheat and sky background to webpage, add flag somewhere
//Example 1.2 line 1...PopupContent constructor function
function PopupContent(properties, attribute){
    this.properties = properties;
    this.attribute = attribute;
    this.year = attribute.split("_")[1];
    this.population = this.properties[attribute];
    this.formatted = "<p><b>City:</b> " + this.properties.Region + "</p><p><b>Population in " + this.year + ":</b> " + this.population + "</p>";
};








//calculates minimum value of the data set to use for calculating proportions
function calcMinValue(data){
    //create empty array to store all data values
    var allValues = [];
    //loop through each region
    for(var region of data.features){
        //loop through each year
        for(var year = 1985; year <= 2015; year+=5){
              //get population for current year
              var value = region.properties["Pop_"+ String(year)];
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
    var minRadius = 7;
    //Flannery Apperance Compensation formula
    //Minimimum value is hard coded here to avoid zeros.
    //alternative with the orignial code (see megacities example) would be
    //to add an if statment to check for a zero value in the denominator and return zero? Something like that
    var radius = 1.0083 * Math.pow(attValue/378353,0.5715) * minRadius

    return radius;
};





//Example 2.1 NEW FORM EXAMPLE 3.13, REPLACES ABOVE...function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Step 4: Assign the current attribute based on the first index of the attributes array
    var attribute = attributes[0];
    //check
    // console.log(attribute);


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

  


    var popupContent = new PopupContent(feature.properties, attribute);

    //bind the popup to the circle marker    
    layer.bindPopup(popupContent.formatted, { 
        offset: new L.Point(0,-options.radius)
    });



    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};


//Example 2.1 NEW FROM 3.12, REPLACES ABOVE .Add circle markers for point features to the map
function createPropSymbols(data, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};




//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(attribute){
    
    map.eachLayer(function(layer){
    
        //This function will not update to a zero value, as happens with Crimea and Sevastopol, because the zero will return false and skip here
        
        //Gareth suggested just elimanting the second part of the && function that checks for a specific attribute value
        if (layer.feature){
            //update the layer style and popup
            console.log(layer.feature.properties[attribute])
            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //Could add a condition here to show no value for Crimea by changing the color of the marker?

  



        //Example 1.3 line 6...in UpdatePropSymbols()
        var popupContent = new PopupContent(props, attribute);

        //update popup with new content    
        popup = layer.getPopup();    
        popup.setContent(popupContent.formatted).update();






        };
    });
};





// //Create sequence controls (old way, outside of the map)
// function createSequenceControls(attributes){
//     //create range input element (slider)
//     var slider = "<input class='range-slider' type='range'></input>";
//     document.querySelector("#panel").insertAdjacentHTML('beforeend',slider);

//      //set slider attributes  (1989-2021 is 33 years of data)
//      document.querySelector(".range-slider").max = 32;
//      document.querySelector(".range-slider").min = 0;
//      document.querySelector(".range-slider").value = 0;
//      document.querySelector(".range-slider").step = 1;
//      document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="reverse"></button>');
//      document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="forward"></button>');
//       //replace button content with images
//     document.querySelector('#reverse').insertAdjacentHTML('beforeend',"<img src='img/reverse.png'>")
//     document.querySelector('#forward').insertAdjacentHTML('beforeend',"<img src='img/forward.png'>")

//     //START NEW FROM EXAMPLE 3.15
//     //Below Example 3.6 in createSequenceControls()
//     //Step 5: click listener for buttons
//     document.querySelectorAll('.step').forEach(function(step){
//         step.addEventListener("click", function(){
//             //sequence  //START NEW FROM 3.16
//             var index = document.querySelector('.range-slider').value;
            
//             //Step 6: increment or decrement depending on button clicked
//             if (step.id == 'forward'){
//                 index++;
//                 //Step 7: if past the last attribute, wrap around to first attribute
//                 index = index > 32 ? 0 : index;
//             } else if (step.id == 'reverse'){
//                 index--;
//                 //Step 7: if past the first attribute, wrap around to last attribute
//                 index = index < 0 ? 32 : index;
//             };

//             //Step 8: update slider
//             document.querySelector('.range-slider').value = index;

//             // console.log(attributes[index])

//             //Called in both step button and slider event listener handlers
//             //Step 9: pass new attribute to update symbols
//             updatePropSymbols(attributes[index]);

//             //END NEW FROM 3.16
//         })
//     })

    
//     //Step 5: input listener for slider
//     document.querySelector('.range-slider').addEventListener('input', function(){            
//         //sequence
//     });

//     //Step 5: input listener for slider
//     document.querySelector('.range-slider').addEventListener('input', function(){
//         //Step 6: get the new index value
//         var index = this.value;
//         updatePropSymbols(attributes[index]);

//         // console.log(attributes[index])
//         // console.log(index)
//     });
//     //END NEW FROM EXAMPLE 3.15


// };










//Create sequence controls   NEW WAY, CHAPTER 6, LESSON 2, example 3.6
function createSequenceControls(attributes){
    
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function () {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');

             //create range input element (slider)
             container.insertAdjacentHTML('beforeend', '<input class="range-slider" type="range">')

             //add skip buttons
             container.insertAdjacentHTML('beforeend', '<button class="step" id="reverse" title="Reverse"><img src="img/reverse.png"></button>'); 
             container.insertAdjacentHTML('beforeend', '<button class="step" id="forward" title="Forward"><img src="img/forward.png"></button>');

            //disable any mouse event listeners for the container
            L.DomEvent.disableClickPropagation(container)

            return container;
        }
    });

    map.addControl(new SequenceControl());    // add listeners after adding control}
    
    //NEW WAY ABOVE ___________________________________________________________
    
    //create range input element (slider)
    // var slider = "<input class='range-slider' type='range'></input>";
    // document.querySelector("#panel").insertAdjacentHTML('beforeend',slider);

     //set slider attributes  (1989-2021 is 33 years of data)
     document.querySelector(".range-slider").max = 32;
     document.querySelector(".range-slider").min = 0;
     document.querySelector(".range-slider").value = 0;
     document.querySelector(".range-slider").step = 1;
    //  document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="reverse"></button>');
    //  document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="forward"></button>');
      //replace button content with images
    // document.querySelector('#reverse').insertAdjacentHTML('beforeend',"<img src='img/reverse.png'>")
    // document.querySelector('#forward').insertAdjacentHTML('beforeend',"<img src='img/forward.png'>")

    //START NEW FROM EXAMPLE 3.15
    //Below Example 3.6 in createSequenceControls()
    //Step 5: click listener for buttons
    document.querySelectorAll('.step').forEach(function(step){
        step.addEventListener("click", function(){
            //sequence  //START NEW FROM 3.16
            var index = document.querySelector('.range-slider').value;
            
            //Step 6: increment or decrement depending on button clicked
            if (step.id == 'forward'){
                index++;
                //Step 7: if past the last attribute, wrap around to first attribute
                index = index > 32 ? 0 : index;
            } else if (step.id == 'reverse'){
                index--;
                //Step 7: if past the first attribute, wrap around to last attribute
                index = index < 0 ? 32 : index;
            };

            //Step 8: update slider
            document.querySelector('.range-slider').value = index;

            // console.log(attributes[index])

            //Called in both step button and slider event listener handlers
            //Step 9: pass new attribute to update symbols
            updatePropSymbols(attributes[index]);

            //END NEW FROM 3.16
        })
    })

    
    //Step 5: input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function(){            
        //sequence
    });

    //Step 5: input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function(){
        //Step 6: get the new index value
        var index = this.value;
        updatePropSymbols(attributes[index]);

        // console.log(attributes[index])
        // console.log(index)
    });
    //END NEW FROM EXAMPLE 3.15


};



















//Above Example 3.10...Step 3: build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Pop_") > -1){
            attributes.push(attribute);
        };
    };

    //check result
    // console.log(attributes);

    return attributes;
};




//Gets data from file with AJAX callback function, calls other functions
function getData(map){
    //load the data
    fetch("data/UkraineOblastPopulationHistoryLatLongNONUM_ZEROS.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
             //create an attributes array
            var attributes = processData(json);
            minValue = calcMinValue(json);
            createPropSymbols(json, attributes);
            createSequenceControls(attributes);
        })
};




document.addEventListener('DOMContentLoaded',createMap)