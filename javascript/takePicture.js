
var click = new Click();
var db = new DropboxClick();



// Funciones al cargar secciones

Lungo.dom('#main').on('load', function(event){
    click.bindData("data-click");
});



//SELECT AND CHOOSE A PROFILE PICTURE, CROP AND REDIM THAT IMAGE

//second input element in the document, element [0] is the one in camera input
	var fileChooser = document.getElementsByTagName('input')[1];
	var content = document.getElementById('pic');

	if (typeof window.FileReader === 'undefined') {
	    content.className = 'fail';
	    content.innerHTML = 'File API &amp; FileReader API are not supported in your browser.  Try on a new-ish Android phone.';
	}

	fileChooser.onchange = function (e) {
	    //e.preventDefault();
	    
	    var canvas = document.getElementById('pic');
	    var context = canvas.getContext("2d");
	    var imageObj = new Image();
	    //var pixelRatio = window.devicePixelRatio;
	    //context.scale(pixelRatio, pixelRatio);

	    imageObj.onload = function() {
	        var sourceX = 0;
	        var sourceY = 0;
	        var destX = 0;
	        var destY = 0;

	        if (canvas.width > canvas.height) {
	            var stretchRatio = ( imageObj.width / canvas.width );
	            var sourceWidth = Math.floor(imageObj.width);
	            var sourceHeight = Math.floor(canvas.height*stretchRatio);
	            sourceY = Math.floor((imageObj.height - sourceHeight)/2);
	        } else {
	            var stretchRatio = ( imageObj.height / canvas.height );
	            var sourceWidth = Math.floor(canvas.width*stretchRatio);
	            var sourceHeight = Math.floor(imageObj.height);
	            sourceX = Math.floor((imageObj.width - sourceWidth)/2);
	        }
	        //var destWidth = Math.floor(canvas.width / pixelRatio);
	        //var destHeight = Math.floor(canvas.height / pixelRatio);
		var destWidth = Math.floor(canvas.width);
	        var destHeight = Math.floor(canvas.height);		

	        context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
	    };

	    


	    var file = fileChooser.files[0],
	        reader = new FileReader();
	        
	    reader.onerror = function (event) {
	        content.innerHTML = "Error reading file";
	    }

	    reader.onload = function (event) {
	        var imag = new Image();

	        // files from the Gallery need the URL adjusted
	        if (event.target.result && event.target.result.match(/^data:base64/)) {
	            imag.src = event.target.result.replace(/^data:base64/, 'data:image/jpeg;base64');
	        } else {
	            imag.src = event.target.result;
	        }

	        // Guess photo orientation based on device orientation, works when taking picture, fails when loading from gallery
	        if (navigator.userAgent.match(/mobile/i) && window.orientation === 0) {
	            imag.height = 250;
	            imag.className = "gira";
	        } else {
	            imag.width = 400;
		    imag.className = "gira";
	        }

	        imageObj.src = imag.src;
	        content.innerHTML = '';
	        content.appendChild(imag);
	    };
	    
	    reader.readAsDataURL(file);

	    return false;
	}






//MOSTRAR CAMPOS EXIF DE FOTO TOMADA DESDE CAMERA ICON

	document.getElementById("fotoExif1").addEventListener("change", click.ficheroSeleccionado, false);
	document.getElementById("fotoExif2").addEventListener("change", click.ficheroSeleccionado, false);


	/*
	document.getElementById('fotoExif').onchange = function(e) {
	    EXIF.getData(e.target.files[0], function() {
	    	alert('saco campos con onchange');
	        alert(EXIF.pretty(this));
	    });
	    click.ficheroSeleccionado(e);
	}
	*/

//Recogida de datos de los sensores

	init3();
	getLocation();
	var count=0;
	function init(){
		if(window.DeviceOrientationEvent){
			console.log("DeviceOrientation is supported on this device");
		}
	}

	function init2(){
		if(window.DeviceOrientationEvent){
			window.addEventListener('deviceorientation',devOrientHandler,false);
		}
	}

	function init3(){
		if(window.DeviceOrientationEvent){
			window.addEventListener('deviceorientation',function(eventData){
				var tiltLR=eventData.gamma;
				var tiltFB=eventData.beta;
				var dir=eventData.alpha
				var motUD=null;
				deviceOrientationHandler(tiltLR,tiltFB,dir,motUD);
			},false);
		}
	}

	function deviceOrientationHandler(tiltLR,tiltFB,dir,motionUD){
		document.getElementById("doTiltLR").innerHTML=Math.round(tiltLR);
		document.getElementById("doTiltFB").innerHTML=Math.round(tiltFB);
		document.getElementById("doDirection").innerHTML=Math.round(dir);

	}


// Hacer cuadrados los elementos 
 Element.prototype.getElementWidth = function() {
 	   if (typeof this.clip !== "undefined") {
 	      return this.clip.width;
 	   } else {
 	      if (this.style.pixelWidth) {
 	         return this.style.pixelWidth;
 	      } else {
         return this.offsetWidth;
       }
 	   }
	};


	window.onload=function() {
		var myBlock = document.getElementById('fotoPerfil');
		myBlock.style.height = myBlock.getElementWidth()+"px";
	};



// Recargar al hacer pull
var pull_example = new Lungo.Element.Pull('#lista', {
    onPull: "Pull down to refresh",      //Text on pulling
    onRelease: "Release to get new data",//Text on releasing
    onRefresh: "Refreshing...",          //Text on refreshing
    callback: function() {               //Action on refresh
        alert("Pull & Refresh completed!");
        pull_example.hide();
    }
});



// //Carousel
// var el = $$('[data-control=carousel]')[0];

// var example = Lungo.Element.Carousel(el, function(index, element) {
// 	Lungo.dom('[data-direction=left]').tap(example.prev);
// 	Lungo.dom('[data-direction=right]').tap(example.next);
// });

Lungo.dom('#section2').on('hold', function(event){
    alert("Loaded section 2");
});


//.......................
// DATASTORE API DROPBOX
//.......................
	//var APP_KEY = 'nulhno9puyovgkj';
	var APP_KEY = 'x6ipo0jmmaxu80s';

	var client = new Dropbox.Client({key: APP_KEY});
	var usersTable;

	document.getElementById('linkDropbox').onclick = function() {
		alert("want to link to Dropbox");				
	    client.authenticate();
	}

	// Try to finish OAuth authorization.
	client.authenticate({interactive: false}, function (error) {
	    if (error) {
	        alert('Authentication error: ' + error);
	    }
	});

	//introduciendo primera fila ID=1, columnas Name y Password.
	//Cada fila de la tabla, es una var
	function insertUser(Name, LastName, UserName, UPassword) {
		alert("llamada a insertUser");
		console.log("con nombre="+ Name +" apellido="+LastName+" usuario= "+UserName+"contraseña: "+UPassword);
		usersTable.insert({
			name: Name,
			lastName: LastName,
			userName: UserName,
			uPassword: UPassword,
			created: new Date()
		});
	}


	if (client.isAuthenticated()) {
		alert("cliente autenticado!");
		document.getElementById('newAccButt').removeAttribute("disabled");
		//document.getElementById('newAccButt').disabled = false;
	    // Client is authenticated. Display UI.

	    //A datastore for the app
		var datastoreManager = client.getDatastoreManager();
		alert("creada datastore manager");

		
		datastoreManager.openDefaultDatastore(function (error, datastore) {
		    if (error) {
		        alert('Error opening default datastore: ' + error);
		    }

		    //define a table named users
		    usersTable = datastore.getTable('users');
		    alert("creada tabla usuarios");
		    

			//accediendo a datos del nombre
			//var Name = firstUser.get('Name');

			//editando contraseña
			//firstUser.set('UPassword', 'contraseña2');

			//remove a record, borrar una fila de la tabla
			//firstUser.deleteRecord();
		});

	}

	document.getElementById('crearUsuario').onclick = function() {
		//faltan mil comprobaciones...........
		if(document.getElementById('txt-signupUserName').value.length > 0){
			click.newUser(document.getElementById('txt-signupUserName').value, document.getElementById('txt-signupName').value, document.getElementById('txt-signupLastname').value, document.getElementById('txt-signupEmail').value, document.getElementById('txt-signupPssword').value);
			
		}
		return false;
	}




	document.getElementById('loginButton').onclick = function() {
		//TODO Faltan comprobaciones
		var userName = document.getElementById('txt-signup-name').value;
		var userPassword = document.getElementById('txt-signup-password').value;

		loginUser(userName, userPassword);

		
	}

	
	function loginUser(login, password){
		var url = "http://pfc.martinezrubio.com.es/click/login.php"
		var data = {data: JSON.stringify({login: login, password: password})};
		var parseResponse = function(result){
			if(result.status == "200"){
				click.setToken(result.token);

				/* Load initial user data */
				showGroupList();


				Lungo.Router.section("main");
				Lungo.Notification.show(
					"check",                //Icon
					"Welcome",       		//Title
					3,                      //Seconds
					null       				//Callback function
				);

				}
			else{
				Lungo.Notification.show(
					"ban-circle",           //Icon
					"Login incorrecto",     //Title
					3,                      //Seconds
					null       				//Callback function
				);

			}
		}
		Lungo.Service.post(url, data, parseResponse, "json");
}





//Timeline Comments 
	var f = new Date();
	var perfilTlinePic = document.getElementsByClassName('imgTlineComment')[0];
	perfilTlinePic.src = 'http://cdn.tapquo.com/lungo/icon-144.png';
		
	var TimeTlineComm = document.getElementsByClassName('timeTlineCommet')[0];	
	TimeTlineComm.innerHTML = f.getHours()+':'+f.getMinutes();	

	var PersonName = document.getElementsByClassName('commentPerson')[0];	
	PersonName.innerHTML = "pmoncada";

	var CaommDate = document.getElementsByClassName('commentDate')[0];	
	CaommDate.innerHTML = f.getDay()+'/'+f.getMonth()+'/'+f.getFullYear();

		
	var groupColor;

	 function insertItem(newListItem) {
	 	var commentText = document.getElementById('txtComment').value;
	 	var Timelineul=document.getElementsByTagName('ul')[0];

	 	comentario = construirComentario("pmoncada", commentText, "http://cdn.tapquo.com/lungo/icon-144.png", groupColor);
	 	Timelineul.insertAdjacentHTML("beforeend", comentario);
	 	document.getElementById('txtComment').value = "";
	}

	function construirComentario(name,text, pic, color){
		var d = new Date();
		return '<li class="thumb big colorGroup" style="box-shadow: '+getBoxShadowStyle(color)+';"> \
                        <img class="imgTlineComment" src="'+pic+'" >\
                        <div>\
                            <div class="timeTlineCommet on-right text tiny">'+d.getHours()+':'+d.getMinutes()+'</div>\
                            <strong class="commentPerson" style="color:none;">'+name+'</strong>\
                            <span class="commentDate text tiny opacity" style="color:none;">'+(d.getDay()+1)+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'</span>\
                            <small>'+text+'</small>\
                        </div>\
                    </li>';
	}

	function insertGroupAside(group){
			var groupList = document.getElementById("aside-group-list");
			groupList.insertAdjacentHTML("beforeend", group);
	}

	function insertContact(contact, contactGrView){
			var contactList = document.getElementById("contacts-view-list");
			var contactListGrView = document.getElementById("chooseContacts-view-list");
			contactListGrView.insertAdjacentHTML("beforeend", contactGrView);
			contactList.insertAdjacentHTML("beforeend", contact);
	}

	function insertAllContact(contact){
			var allContactList = document.getElementById("allContacts-view-list");
			allContactList.insertAdjacentHTML("beforeend", contact);
	}

	function insertGroupNew(data){
		var groupNews = document.getElementById("group-news-list");
			groupNews.insertAdjacentHTML("beforeend", data);
	}

	function appendHtml(id, data, where){
		var element = document.getElementById(id);
		element.insertAdjacentHTML(where, data);
	}

	function construirContacto(login, name, surname, photo, date){
		//return '<li class="thumb" onclick="javascript:click.addContact(id)" >\
		return '<li class="thumb">\
                    <img class="contactIMG" src="'+photo+'" />\
                    <div>\
                        <strong class="contactName">'+name+' '+surname+'</strong>\
                        <small class="contactState">'+login+'</small>\
                        <div class="on-right tiny sname">'+date+'</div>\
                    </div>\
                </li>';
	}



	function buildContactGrView(state, name, surname, photo){
		//return '<li class="thumb" onclick="javascript:click.addContact(id)" >\
		return '<li class="thumb liGrView">\
                            <img class="contactIMG" src="'+photo+'" />\
                            <div>\
                                <div class="on-right tiny">\
                                    <input class="checkContact" type = "checkbox"/>\
                                </div>\
                                <strong class="contactName nameGrView">'+name+' '+surname+'</strong>\
                                <small class="contactState">'+state+'</small>\
                            </div>\
                        </li>';
	}

	function construirUser(login, name, surname, photo){
		//return '<li class="thumb" onclick="javascript:click.addContact(id)" >\
		return '<li class="liNav thumb">\
                            <img class="contactIMG" src="'+photo+'" />\
                            <div class ="textNav">\
                                <strong class="nameNav">'+name+' '+surname+'</strong>\
                                <small class="nameNav">'+login+'</small>\
                            </div>\
                        </li>';
	}


	document.getElementById("txtComment").addEventListener("change", function(){insertItem('Es una prueba')}, false);

	function showArticle(section, article){

	//Patch bug Lungo, hay que quitar antes el class active de cualquier articulo de la seccion a la que queremos ir

	sec = document.getElementById(section);
	ch = sec.children;

	for(i=0; i<ch.length; i++){
       if(ch[i].id == article)
               ch[i].classList.add("active");
       else
               ch[i].classList.remove("active");
	}

	Lungo.Router.section(section);

}


function showContacts(){
	Lungo.Notification.show();
	contactList = document.getElementById("contacts-view-list");
	contactListChoose = document.getElementById("chooseContacts-view-list");
	contactList.innerHTML = "";
	contactListChoose.innerHTML = "";
	
	function loadContacts(contacts){

		if (contacts.length == 0){
			noContactsComment = document.getElementById("noContacts");
			noContactsGrViewComment = document.getElementById("noContactsGrView");
			
			noContactsComment.innerHTML = '<div class="greenText" id="greenNoContacts">\
                        <small>\
                            You do not have any contact yet\
                        </small>\
                    </div>\
                    <div id="noContactsComment">To add contacts, please click the Add button below, and select the users of the application which you would like to add to your groups.</div>';
		
            noContactsGrViewComment.innerHTML = '<div class="greenText" id="greenNoContacts">\
                        <small>\
                            You do not have any contact yet\
                        </small>\
                    </div>\
                    <div id="noContactsComment">Please, add some contacts first so you can add them to this group.</div>';
		
		}else{
			for(i=0;i<contacts.length;i++){
				contacto = construirContacto(contacts[i].login, contacts[i].name, contacts[i].surname, contacts[i].photo, " Mie 23/11/2012");
				contactGrView = buildContactGrView(contacts[i].state, contacts[i].name, contacts[i].surname, contacts[i].photo);
				insertContact(contacto, contactGrView);
			}
		}
		Lungo.Notification.hide();
		showAllContacts();
	}
	
	click.getContacts(loadContacts);


}

function showContactsArticle(){
	showContacts();
	showArticle('main','contactsView');

}

function showAddNewGroup(){
	showContacts();
	showArticle('main','createGrView');	
}


function showAllContacts(){
	allContactList = document.getElementById("allContacts-view-list");
	allContactList.innerHTML = "";
	
	function loadAllContacts(contacts){
		for(i=0;i<contacts.length;i++){
			contacto = construirUser(contacts[i].login, contacts[i].name, contacts[i].surname, contacts[i].photo);
			insertAllContact(contacto);
		}
	}

	click.getUsers(loadAllContacts);


}
allContactsList = document.getElementById("addCon").addEventListener("click", showAllContacts, false);




function construirGroupAside(id, name){
		return '<li data-icon="edit" onClick="javascript:loadGroup('+id+',\''+name+'\')"><strong>'+name+'</strong></li>';
}

function showGroupList(){
	asideGroupList = document.getElementById("asideGroupList");
	//asideGroupList.innerHTML = "";

	function loadGroupsAside(groups){
		for(i=0; i<groups.length;i++){
			group = construirGroupAside(groups[i].id, groups[i].name);
			insertGroupAside(group);
		}
	}
	click.getGroups(loadGroupsAside);
}

function construirGroupNew(title, description, photo, date, time){
	return '<li class="thumb big colorGroup">\
                        <img src="'+photo+'" class="imgTlineComment"/>\
                        <div>\
                            <div class="timeTlineCommet on-right text tiny">'+time+'/div>\
                            <strong class="commentPerson">'+title+'</strong>\
                            <span class="commentDate text tiny opacity">'+date+'</span>\
                            <small>\
                                '+description+'\
                            </small>\
                        </div>\
                    </li>';
}

function showGroupNews(){
	groupNews = document.getElementById("group-news-list");
	groupNews.innerHTML = "";

	function loadGroupNews(news){
		for(i=0;i<news.length;i++){
			n = construirGroupNew(news[i].title, news[i].description, news[i].photo, news[i].date, news[i].time);
		}
	}
	//click.getGroupNews(click.getActiveGroup(), loadGroupNews);
	
}

function construirGroupPic(src){
	return '<img src="https://moncadaisla.es/click/'+src+'" />';
}

function showGroupPics(){

	groupPics = document.getElementById("Grouppictures");
	groupPics.innerHTML = "";

	function loadGroupPics(pics){
		for(i=0;i<pics.length;i++){
			p = construirGroupPic(pics[i].url);
			appendHtml("Grouppictures", p, "beforeend");
		}
	}
	click.getThumbnails(click.getActiveGroup(), loadGroupPics);
	
}

function loadGroup(gid, name){
	click.setActiveGroup(gid);
	click.setActiveGroupName(name);

	document.getElementById("group-title").innerHTML = name;

	showGroupPics();
	showArticle("groupSection", "profile");
}





	function getBoxShadowStyle(color){
		a = document.getElementsByClassName("colorGroup");
		b = a[0];
		style = window.getComputedStyle(b);
		old = style.getPropertyValue("box-shadow");
		return old.replace(/rgb\(.*\)/gi,color);
	}

	//Choose the group whose members you write to in the generic timeline

	function selectColor (){
		var colorSelected = document.getElementById('colorinput').value;
		//alert(colorSelected);
		document.getElementById('selectedColor').setAttribute('style', "border-color: "+colorSelected+" !important");
		groupColor = colorSelected;
	}

	document.getElementById("colorinput").addEventListener("change", function(){selectColor()}, false);



	//Choose the color of the group that is being created
	function colorG (){
		var colorSelec = document.getElementById('colorInputGr').value;
		document.getElementById('hrefcolor').setAttribute('style', "color: "+colorSelec+" !important");
	}

	document.getElementById("colorInputGr").addEventListener("change", function(){colorG()}, false);
		

//Next and previous pictures in carrousel
	function nextPic (){
		document.getElementById('picturesContainer').setAttribute('style', "background-image: url('galeriaPrueba/8.jpg')");
	}

	function prevPic (){
		document.getElementById('picturesContainer').setAttribute('style', "background-image: url('galeriaPrueba/4.jpg')");
	}

	document.getElementById("next").addEventListener("click", function(){nextPic()}, false);
	//document.getElementById("picturesContainer").addEventListener("swipeLeft", function(){nextPic()}, false);  //NO FUNCIONA SWIPE
	document.getElementById("previous").addEventListener("click", function(){prevPic()}, false);
	//document.getElementById("picturesContainer").addEventListener("swipeRight", function(){prevPic()}, false); //NO FUNCIONA SWIPE



//zoom pictures
	s = 100;
	function zom (){
		alert("acercar");
		alert("s vale"+s);
		s = s+100;
		alert("s vale"+s);
		document.getElementById('picturesContainer').setAttribute('style', "background-size:"+s+"%");
	}
	function far (){
		alert("alejar");
		s = s*0.5;
		document.getElementById('picturesContainer').setAttribute('style', "background-size:"+s+"%");
	}
	

	document.getElementById("pictures").addEventListener("pich", function(){far()}, false);  //aleja bien
	document.getElementById("pictures").addEventListener("pinchOut", function(){zom()}, false); //aleja antes de acercar  NO FUNCIONA BIEN

	
	




// input id= searchNav
// clase de los li a filtrar liNav
// nameNav por lo que va a filtarar

var searchGrView = document.getElementById('searchGrView');
searchGrView.onkeyup = function () {
    var filter = searchGrView.value.toUpperCase();
    var lisNav = document.getElementsByClassName('liGrView');
    for (var i = 0; i < lisNav.length; i++) {
        var name = lisNav[i].getElementsByClassName('nameGrView')[0].innerHTML;
        if (name.toUpperCase().indexOf(filter) == 0){ 
        	//alert("coincide"+i);
        	//lisNav[i].style.display = 'list-item';
        	lisNav[i].classList.remove('hide');    	
        }else{
        	//alert("no coincide"+i);
            //lisNav[i].style.display = 'none';
            lisNav[i].classList.add('hide');

        }
    }
}

///////////////////////////////////////////////////////////////////

var searchNav = document.getElementById('searchNav');
searchNav.onkeyup = function () {
    var filter = searchNav.value.toUpperCase();
    var lisNav = document.getElementsByClassName('liNav');
    for (var i = 0; i < lisNav.length; i++) {
        var name = lisNav[i].getElementsByClassName('nameNav')[0].innerHTML;
        if (name.toUpperCase().indexOf(filter) == 0){ 
        	//alert("coincide"+i);
        	//lisNav[i].style.display = 'list-item';
        	lisNav[i].classList.remove('hide');    	
        }else{
        	//alert("no coincide"+i);
            //lisNav[i].style.display = 'none';
            lisNav[i].classList.add('hide');

        }
    }
}

//##################################################################################//
//############################## MAPS ##############################################//
//##################################################################################//

//Localizacion longitude y latitude
	function getLocation(){
		if (navigator.geolocation){
	    	navigator.geolocation.getCurrentPosition(showPosition,showError);
	    }else{
	    	document.getElementById("outLatitude").innerHTML="Geolocation is not supported by this browser.";
	    }
	}

/*	var divMap=document.getElementById('divMap');
	var divCoordenadas=document.getElementById('divCoordenadas');*/


	function showPosition(position){
		var ilongitud = position.coords.longitude;
		var ilatitud = position.coords.latitude;
		document.getElementById("outLatitude").innerHTML = ilatitud;
		document.getElementById("outLongitude").innerHTML = ilongitud;


		//Open Street Maps
/*	    var cloudmade = new CM.Tiles.CloudMade.Web({key: '139f1f8c45e84baf8ce557b4f82687a0'});
	    var map = new CM.Map('cm-example', cloudmade);
	    var myMarkerLatLng = new CM.LatLng(ilongitud, ilatitud);
		var myMarker = new CM.Marker(myMarkerLatLng, {
			title: "Me encuentro aquí"
		});    
		map.setCenter(myMarkerLatLng, 15);
		map.addOverlay(myMarker);*/
	}

	

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

var map;

function initialize(position) {
	var userPointer = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: userPointer,
      zoom: 15,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    /*var circleUser = {
    	path: google.maps.SymbolPath.CIRCLE,
    	scale: 10
    };*/


    var marker = new google.maps.Marker({
    	position: userPointer,
    	//icon: circleUser,
    	icon: 'img/usuario4.jpg',
    	scale: 5,
    	map: map
    });

    marker.setMap(map);
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



//FUNCIONES CONTACTOS PABLO
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


//click.getUsers()
