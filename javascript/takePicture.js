/********************************************
/*         Click TakePicture Library        *
/********************************************
/*                                          *
/* This file is part of Click               *
/* @author Beatriz Martinez Rubio           *
/* @version 11/11/2013                      *
*********************************************/




/**
/* Patch for hidding aside menu in tablets
**/
menuAside = document.getElementById("features");
menuAside.onclick = function(){menuAside.classList.remove("show")}



/**
/* Patch bug Lungo, is needed to remove the active class of any article of the section we want to link to
**/
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



/**
/* Function executed when loading section main
**/
Lungo.dom('#main').on('load', function(event){
    click.bindData("data-click");
});



/**
/* Function executed when loading section2__________________________________________________no existe el elemento #section2
**/
Lungo.dom('#section2').on('hold', function(event){
    alert("Loaded section 2");
});



/**
/* Select, from the device or from the camera a profile picture, __________________________ESTO NO VA A HACER FALTA, DEVUELTA DE TAMAÑO GUAY
/* crop and redim that image
**/
//second input element in the document, element [0] is the one in camera input
// var fileChooser = document.getElementsByTagName('input')[1];
// var content = document.getElementById('pic');

// if (typeof window.FileReader === 'undefined') {
//     content.className = 'fail';
//     content.innerHTML = 'File API &amp; FileReader API are not supported in your browser.  Try on a new-ish Android phone.';
// }

// fileChooser.onchange = function (e) {
//     //e.preventDefault();    
//     var canvas = document.getElementById('pic');
//     var context = canvas.getContext("2d");
//     var imageObj = new Image();
//     //var pixelRatio = window.devicePixelRatio;
//     //context.scale(pixelRatio, pixelRatio);

//     imageObj.onload = function() {
//         var sourceX = 0;
//         var sourceY = 0;
//         var destX = 0;
//         var destY = 0;

//         if (canvas.width > canvas.height) {
//             var stretchRatio = ( imageObj.width / canvas.width );
//             var sourceWidth = Math.floor(imageObj.width);
//             var sourceHeight = Math.floor(canvas.height*stretchRatio);
//             sourceY = Math.floor((imageObj.height - sourceHeight)/2);
//         } else {
//             var stretchRatio = ( imageObj.height / canvas.height );
//             var sourceWidth = Math.floor(canvas.width*stretchRatio);
//             var sourceHeight = Math.floor(imageObj.height);
//             sourceX = Math.floor((imageObj.width - sourceWidth)/2);
//         }
//         //var destWidth = Math.floor(canvas.width / pixelRatio);
//         //var destHeight = Math.floor(canvas.height / pixelRatio);
// 	var destWidth = Math.floor(canvas.width);
//         var destHeight = Math.floor(canvas.height);		

//         context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
//     }; 

//     var file = fileChooser.files[0],
//         reader = new FileReader();
        
//     reader.onerror = function (event) {
//         content.innerHTML = "Error reading file";
//     }

//     reader.onload = function (event) {
//         var imag = new Image();

//         // files from the Gallery need the URL adjusted
//         if (event.target.result && event.target.result.match(/^data:base64/)) {
//             imag.src = event.target.result.replace(/^data:base64/, 'data:image/jpeg;base64');
//         } else {
//             imag.src = event.target.result;
//         }

//         // Guess photo orientation based on device orientation, works when taking picture, fails when loading from gallery
//         if (navigator.userAgent.match(/mobile/i) && window.orientation === 0) {
//             imag.height = 250;
//             imag.className = "gira";
//         } else {
//             imag.width = 400;
// 	    	imag.className = "gira";
//         }

//         imageObj.src = imag.src;
//         content.innerHTML = '';
//         content.appendChild(imag);
//     };
    
//     reader.readAsDataURL(file);

//     return false;
// }



/**
/* Send the values of the fields when click Create a new user button and send them to click.newUser
**/
document.getElementById('crearUsuario').onclick = function() {
	//faltan mil comprobaciones...........
	if(document.getElementById('txt-signupUserName').value.length > 0){
		click.newUser(document.getElementById('txt-signupUserName').value, document.getElementById('txt-signupName').value, document.getElementById('txt-signupLastname').value, document.getElementById('txt-signupEmail').value, document.getElementById('txt-signupPssword').value);		
	}
	return false;
}



/**
/* send the values os userName and userPassword when click login button and send them to loginUser function
/*
*/
document.getElementById('loginButton').onclick = function() {
	//TODO Faltan comprobaciones
	var userName = document.getElementById('txt-signup-name').value;
	var userPassword = document.getElementById('txt-signup-password').value;

	loginUser(userName, userPassword);	
}



/**
/* This funcion loads user's profile photo
/*
*/
function loadProfilePhoto(){	
	function setProfilePhoto(data){
		document.getElementById("profilePhoto").setAttribute("src", data);
	}
	click.getKey("photo", setProfilePhoto);
}



/**
/* check user login and password
/*
*/	
function loginUser(login, password){
	var url = "http://pfc.martinezrubio.com.es/click/login.php"
	var data = {data: JSON.stringify({login: login, password: password})};

	var parseResponse = function(result){
		if(result.status == "200"){
			click.setToken(result.token);
			click.setData("surname", result.surname);

			/* Load initial user data */
			showGroupList();
			loadProfilePhoto();

			Lungo.Router.section("main");
			Lungo.Notification.show(
				"check",                //Icon
				"Welcome",       		//Title
				3,                      //Seconds
				null       				//Callback function
			);
		}else{
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



/**
/* Using pull and request Lungo efect____________________________________________FALTA QUE RECARGUE NOVEDADES
**/
var pull_example = new Lungo.Element.Pull('#lista', {
    onPull: "Pull down to refresh",      //Text on pulling
    onRelease: "Release to get new data",//Text on releasing
    onRefresh: "Refreshing...",          //Text on refreshing
    callback: function() {               //Action on refresh
        alert("Pull & Refresh completed!");
        pull_example.hide();
    }
});
//*****************************************************************************************************************************************************************
//*****************************************************************************************************************************************************************
//*****************************************************************************************************************************************************************
//*****************************************************************************************************************************************************************


/**
/* show pictures taked from camera icon exif information______________________________________________________ESTO SOBRA NO SE VA A USAR
**/
// Input header camera icon in main section
document.getElementById("fotoExif1").addEventListener("change", click.ficheroSeleccionado, false);
// Input header camera icon in group section
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



// /**
// /* showing sensor data, alpha, beta and gamma______________________________________________________ESTO SOBRA NO SE VA A USAR
// **/
// init3();
// getLocation();
// var count=0;

// function init3(){
// 	if(window.DeviceOrientationEvent){
// 		window.addEventListener('deviceorientation',function(eventData){
// 			var tiltLR=eventData.gamma;
// 			var tiltFB=eventData.beta;
// 			var dir=eventData.alpha
// 			var motUD=null;
// 			deviceOrientationHandler(tiltLR,tiltFB,dir,motUD);
// 		},false);
// 	}
// }

// function deviceOrientationHandler(tiltLR,tiltFB,dir,motionUD){
// 	document.getElementById("doTiltLR").innerHTML=Math.round(tiltLR);
// 	document.getElementById("doTiltFB").innerHTML=Math.round(tiltFB);
// 	document.getElementById("doDirection").innerHTML=Math.round(dir);

// }



// /**
// /* making elements with same width and height______________________________________________________ESTO SOBRA NO SE VA A USAR
// **/
// Element.prototype.getElementWidth = function() {
// 	if (typeof this.clip !== "undefined") {
// 		return this.clip.width;
// 	} else {
// 		if (this.style.pixelWidth) {
// 	    	return this.style.pixelWidth;
// 		} else {
// 			return this.offsetWidth;
// 		}
// 	}
// };

// window.onload=function() {
// 	var myBlock = document.getElementById('fotoPerfil');
// 	myBlock.style.height = myBlock.getElementWidth()+"px";
// };



// /**
// /* Datastore API DROPBOX_____________________________________________________________ no se va a usar
// **/
// //var APP_KEY = 'nulhno9puyovgkj';
// var APP_KEY = 'x6ipo0jmmaxu80s';
// var client = new Dropbox.Client({key: APP_KEY});
// var usersTable;

// document.getElementById('linkDropbox').onclick = function() {
// 	alert("want to link to Dropbox");				
//     client.authenticate();
// }

// // Try to finish OAuth authorization.
// client.authenticate({interactive: false}, function (error) {
//     if (error) {
//         alert('Authentication error: ' + error);
//     }
// });

// //introduciendo primera fila ID=1, columnas Name y Password.
// //Cada fila de la tabla, es una var
// function insertUser(Name, LastName, UserName, UPassword) {
// 	alert("llamada a insertUser");
// 	console.log("con nombre="+ Name +" apellido="+LastName+" usuario= "+UserName+"contraseña: "+UPassword);
// 	usersTable.insert({
// 		name: Name,
// 		lastName: LastName,
// 		userName: UserName,
// 		uPassword: UPassword,
// 		created: new Date()
// 	});
// }


// if (client.isAuthenticated()) {
// 	alert("cliente autenticado!");
// 	document.getElementById('newAccButt').removeAttribute("disabled");
// 	//document.getElementById('newAccButt').disabled = false;
//     // Client is authenticated. Display UI.

//     //A datastore for the app
// 	var datastoreManager = client.getDatastoreManager();
// 	alert("creada datastore manager");

	
// 	datastoreManager.openDefaultDatastore(function (error, datastore) {
// 	    if (error) {
// 	        alert('Error opening default datastore: ' + error);
// 	    }

// 	    //define a table named users
// 	    usersTable = datastore.getTable('users');
// 	    alert("creada tabla usuarios");
	    

// 		//accediendo a datos del nombre
// 		//var Name = firstUser.get('Name');

// 		//editando contraseña
// 		//firstUser.set('UPassword', 'contraseña2');

// 		//remove a record, borrar una fila de la tabla
// 		//firstUser.deleteRecord();
// 	});

// }




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



/**
/* Public a new comment in the timeline
**/
function insertItem(newListItem) {
	var commentText = document.getElementById('txtComment').value;
	var Timelineul=document.getElementsByTagName('ul')[0];

	comentario = construirComentario("pmoncada", commentText, "http://cdn.tapquo.com/lungo/icon-144.png", groupColor);
	Timelineul.insertAdjacentHTML("beforeend", comentario);
	document.getElementById('txtComment').value = "";
}



/**
/* Inner the comment html
/* @param name name of the user who writes the comment
/* @param text text of the comment
/* @param pic profile picture of the user who writes the comment
/* @param color the color of the group
**/
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

