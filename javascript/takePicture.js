/********************************************
/*         Click TakePicture Library        *
/********************************************
/*                                          *
/* This file is part of Click               *
/* @author Beatriz Martinez Rubio           *
/* @version 11/11/2013                      *
*********************************************/

loadSession();


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
	profilePhoto = document.getElementById("profilePhoto");
	if(localStorage.getItem("photo") != null)
		profilePhoto.setAttribute("src", "http://moncadaisla.es/click/circular.php?img="+localStorage.getItem("photo"));
	else{
		var setPhoto = function(data){
			profilePhoto.setAttribute("src", "http://moncadaisla.es/click/circular.php?img="+data);
		}
		click.getKey("photo", setPhoto);
	}		
	
}

function init(){
	/* Load initial user data */
	showGroupList();
	showAllActivity();
	click.bindData("data-click");
	loadProfilePhoto();
	updateReversePosition();
	Lungo.Router.section("main");
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
			
			/* Initilizes application user data*/
			init();
			
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
/* Tries to restore existing session
*/
function loadSession(){
	if(localStorage.token != null){
		init();
	}
		
}

/**
/* This funtions updates on screen the position of the using using the reverse positin
/* of Google Services
*/
function updateReversePosition(){
	element = document.getElementById("usrPosition");

	var doUpdate = function(data){		
		element.innerHTML = data;
		click.setData("reversePosition", data);
	}
	var setPosition = function(data){
		click.setData("position", data);
		click.reversePosition(data, doUpdate);
	}
	if(click.getData("reversePosition") != null){
		click.reversePosition(click.getData("position", doUpdate));
	}
	click.getKey("position", setPosition);

}






/**
/* Using pull and request Lungo efect____________________________________________FALTA QUE RECARGUE NOVEDADES
**/
var pull_example = new Lungo.Element.Pull('#lista', {
    onPull: "Pull down to refresh",      //Text on pulling
    onRelease: "Release to get new data",//Text on releasing
    onRefresh: "Refreshing...",          //Text on refreshing
    callback: function() {               //Action on refresh
        showAllActivity();
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
// Input profile photo
document.getElementById("inputPhotoProfile").addEventListener("change", click.ficheroSeleccionado, false);





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

/**
/* Build news in profile
/* @param title
/* @param description
/* @param photo
/* @param date
/* @param time
/* @return the img html tag
**/
function construirAllUpdate(title, description, photo, date, time){
	return '<li class="thumb big colorGroup">\
                            <img src="'+photo+'" class="imgTlineComment">\
                            <div>\
                                <div class="timeTlineCommet on-right text tiny">'+time+'</div>\
                                <strong class="commentPerson">'+title+'</strong>\
                                <span class="commentDate text tiny opacity">'+date+'</span>\
                                <small>'+description+'</small>\
                            </div>\
                        </li> ';
}


/**
/* Show all news in the group profile view
**/ 
function showAllActivity(){

	groupActivityList = document.getElementById("all-news-list");
	groupActivityList.innerHTML = "";

	/**
	/* Get all updates of the group
	/* @param updates all group news array
	**/
	function loadAllActivityList(updates){
		for(i=0;i<updates.length;i++){
			u = construirAllUpdate(updates[i].title, updates[i].description, "http://moncadaisla.es/click/"+updates[i].photo, updates[i].date, updates[i].time);
			appendHtml("all-news-list", u, "beforeend");
		}
	}
	click.getUpdates(0, loadAllActivityList);	
}


/**
/* Use this funciton to logout
/* It destroys localStorage and redirects to login page
*/
function logout(){
	localStorage.clear();
	showArticle('main_section','login-page');
}

