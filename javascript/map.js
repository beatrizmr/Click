/********************************************
/*         Click Maps Library               *
/********************************************
/*                                          *
/* This file is part of Click               *
/* @author Beatriz Martinez Rubio           *
/* @version 11/11/2013                      *
*********************************************/

//Localizacion longitude y latitude
/**
/* Get the current position of the user
*/
function getLocation(){
	if (navigator.geolocation){
    	navigator.geolocation.getCurrentPosition(showPosition,showError);
    }else{
    	document.getElementById("outLatitude").innerHTML="Geolocation is not supported by this browser.";
    }
}

/**
/* Get latitude and longitude of the position
/* @param position
*/
function showPosition(position){
	var ilongitud = position.coords.longitude;
	var ilatitud = position.coords.latitude;
	document.getElementById("outLatitude").innerHTML = ilatitud;
	document.getElementById("outLongitude").innerHTML = ilongitud;
}


/**
/* Get latitude and longitude of the position
/* @param position
*/
function showError(error){
	switch(error.code){
		case error.POSITION_UNAVAILABLE:
     		x.innerHTML="Your position information is not available"
      		break;
    	case error.PERMISSION_DENIED:
      		x.innerHTML="User denied the request for Geolocation."
      		break;
    	case error.POSITION_UNAVAILABLE:
      		x.innerHTML="Location information is unavailable."
      		break;
    	case error.TIMEOUT:
      		x.innerHTML="The request to get user location timed out."
     		break;
    	case error.UNKNOWN_ERROR:
     		x.innerHTML="An unknown error occurred."
      		break;
    }
}



//show the map
//var directionsDisplay;  //para la ruta
var directionsService = new google.maps.DirectionsService();  //para la ruta
var map;
var mVisible = true;
// Aqui va a guardarse la position del usuario cada vez que se llame a la funcion initialize
var userPointer;
var lat_lng = new Array();


var merce = new google.maps.LatLng(41.850033, -87.6500523);

function initialize(position) {
	//directionsDisplay = new google.maps.DirectionsRenderer(); //para la ruta

	userPointer = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	var userPointer2 = new google.maps.LatLng(position.coords.latitude+3, position.coords.longitude);

    var mapOptions = {
      center: userPointer,
      zoom: 15,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map (document.getElementById("map_canvas"), mapOptions);
    //directionsDisplay.setMap(map); //para la ruta

	var peopleControlDiv = document.createElement('div');
	var picturesControlDiv = document.createElement('div');
    var peopleControl = new PeopleControl (peopleControlDiv, map);
    var picturesControl = new PicturesControl (picturesControlDiv, map);

    peopleControlDiv.index = 1;
    picturesControlDiv.index = 2;

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(peopleControlDiv);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(picturesControlDiv);

    var imgWindowArray = [];

    function loadGroupMinPics(pics){
		for(i=0;i<pics.length;i++){
			//var picPos = new google.maps.LatLng(pics[i].position);
			//lat_lng[i] = picPos;
			var picPos = pics[i].position;
			var picPosition = picPos.split(',');
			var picLat = parseFloat(picPosition[0]);
			var picLon = parseFloat(picPosition[1]);
			lat_lng[i] = new google.maps.LatLng(picLat,picLon);
			var contentImg = '<div><img style = "width: 100px;" src="https://moncadaisla.es/click/'+pics[i].url+'" /></div>';
			imgWindowArray[i] = new google.maps.InfoWindow({
				position:  lat_lng[i],
				content: contentImg
			});
		}
		alert("num fotos: "+ lat_lng.length);
	}
	click.getThumbnails(click.getActiveGroup(), loadGroupMinPics);



	function showPictureWindows(){
		for(i=0;i<imgWindowArray.length;i++){
			imgWindowArray[i].open(map);
		}
	}

	function hidePictureWindows(){
		for(i=0;i<imgWindowArray.length;i++){
			imgWindowArray[i].close(map);
		}
	}

	

	function PicturesControl(controlDiv, map){
		controlDiv.style.marginRight = '4%';
		controlDiv.style.marginTop = '4%';
		controlDiv.style.height = '5%';
		controlDiv.style.width = '20%';

		var controlUI = document.createElement('div');
		controlUI.style.backgroundColor = '#0095c1';
		controlUI.style.textAlign = 'center';
		controlUI.style.height = '100%';
		controlUI.style.borderRadius = '7%';
		controlUI.style.opacity = '0.8';

		controlDiv.appendChild(controlUI);
		var controlText = document.createElement('div');
		controlText.style.fontFamily = 'Arial,sans-serif';
		controlText.style.fontSize = '16px';
		controlText.style.paddingLeft = '12%';
		controlText.style.paddingRight = '9%';
		controlUI.style.color = 'white';
		controlUI.style.paddingTop = '6%';
		controlText.innerHTML = '<strong>Photos</strong>';
		controlUI.appendChild(controlText);

		google.maps.event.addDomListener(controlUI, 'click', function() {
			mVisible = false,
			clearMarkers(),
			routesPics(),
			showPictureWindows()
		  //map.setCenter (merce)
		});		
	}


    function PeopleControl(controlDiv, map){

		controlDiv.style.marginRight = '4%';
		controlDiv.style.marginTop = '4%';
		controlDiv.style.height = '5%';
		controlDiv.style.width = '20%';

		var controlUI = document.createElement('div');
		controlUI.style.backgroundColor = '#0095c1';
		controlUI.style.textAlign = 'center';
		controlUI.style.height = '100%';
		controlUI.style.borderRadius = '7%';
		controlUI.style.opacity = '0.8';

		controlDiv.appendChild(controlUI);
		var controlText = document.createElement('div');
		controlText.style.fontFamily = 'Arial,sans-serif';
		controlText.style.fontSize = '16px';
		controlText.style.paddingLeft = '12%';
		controlText.style.paddingRight = '9%';
		controlUI.style.color = 'white';
		controlUI.style.paddingTop = '6%';
		controlText.innerHTML = '<strong>People</strong>';
		controlUI.appendChild(controlText);

		google.maps.event.addDomListener(controlUI, 'click', function() {
			alert("pimchado people");
			console.log("pinchado people");
			hidePictureWindows(),
			mVisible = true,
			showMarkers()
		  //map.setCenter (merce)
		});	
	}

	var userMarkers = [];

    function addUserMarker(Userposition, icon){
    	var marker = new google.maps.Marker({
	    	position: Userposition,
	    	icon: new google.maps.MarkerImage('img/marcadores/'+icon+'',
	    null, null, null, new google.maps.Size(64,64)),
	    	draggable: false,
	    	visible: mVisible,
	    	map: map    	
	    });

    	userMarkers.push(marker);
	    //marker.setMap(map);
    }

    // Sets the map on all markers in the array.
	function setAllMap(map) {
	  for (var i = 0; i < userMarkers.length; i++) {
	    userMarkers[i].setMap(map);
	  }
	}

	// Removes the markers from the map, but keeps them in the array.
	function clearMarkers() {
	  setAllMap(null);
	}

	// Shows any markers currently in the array.
	function showMarkers() {
	  setAllMap(map);
	}

	// Deletes all markers in the array by removing references to them.
	function deleteMarkers() {
	  clearMarkers();
	  userMarkers = [];
	}


    function marker(groupPeople){
    	//for(i=0;i<groupPeople.length;i++){
    		//addUserMarker(groupPeople[i].LatLng, mc.getFileName(groupPeople[i].name));
    		// var userPointer = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    		// que haya un groupPeople[i].position y hago groupPeople[i].position.latitude ...
    	//}

    	//*****************************************************
    	addUserMarker(userPointer, mc.getFileName("Beatriz"));
		addUserMarker(userPointer2, mc.getFileName("Peatriz"));
		addUserMarker(merce, mc.getFileName("Merce"));
		//****************************************************
    }
    //click.getContacts(click.getActiveGroup(), marker); // en lugar de getContacts sera  un get gente del grupo

	
}

function routesPics(){
	function calcRoute(i, directionsDisplay) {
		var request = {
			origin:lat_lng[i],
			destination:lat_lng[i+1],
			travelMode: google.maps.TravelMode.WALKING
		};

		directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(result);
			}
		});
	}

	for(i=0;i<lat_lng.length;i++){
		//alert("para ruta: "+ lat_lng.length);
		var directionsDisplay = new google.maps.DirectionsRenderer(); 
		directionsDisplay.setMap(map);
		directionsDisplay.setOptions( { suppressMarkers: true } );
		calcRoute(i, directionsDisplay);
	}
}




Lungo.dom('#map').on('load', function(event){
	navigator.geolocation.getCurrentPosition(initialize,showError);
});

// INCORPORARA CAPA A UN MAPA
//Para añadir una capa a un mapa, solo es necesario ejecutar setMap(), 
//transmitiéndole el objeto del mapa en el que se mostrará la capa. 
//De forma similar, para ocultar una capa, ejecuta setMap(), transmitiendo null


// comentarios en el mapa
/*google.maps.event.addListener(sevilla, 'click', function() {
    infowindow.open(map, sevilla);
});*/

// seter, para cambiar el centro del mapa y desplazarlo
// setCenter(google.maps.LatLng(latitud, longitud))


//FUNCIONES CONTACTOS
//    click.getContacts()
//    
//click.contacts
// email: "beatrizmr89@gmail.com"
//id: "1"
//login: "beuki"
// name: "Beatriz"
// photo: "beatriz.jpg"
// surname: "Martinez Rubio"


//click.contacts[0].name


//
//
//click.getGroups()
//
// click.groups
//cid: "1"
//  id: "1"
//name: "prueba"
//timestamp: "2013-11-17 18:00:46"
