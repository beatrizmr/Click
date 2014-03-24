/********************************************
/*         Click Javascript Library         *
/********************************************
/*                                          *
/* This file is part of Click               *
/* @author Beatriz Martinez Rubio           *
/* @version 11/11/2013                      *
*********************************************/

function Click (){

	this.endpoint = "https://moncadaisla.es/click/";
	this.jsonEndpoint = this.endpoint + "json.php";
	this.loginEndpoint = this.endpoint + "login.php";
	
	/**
	/* Función que sirve para guardar el token de autenticación que ha de ser enviado al servidor
	/* para realizar cualquier operación correspondiente al usuario.
	**/
	this.setToken = setToken;
	function setToken (token){
		localStorage.clear();
		localStorage.setItem("token", token);
	}

	/**
	/* Función getter del token de autenticación
	/* Lo coge de localstorage de HTML5
	**/
	this.getToken = getToken;
	function getToken (){
		return localStorage.getItem("token");
	}
	
	/**
	/* Función que sirve para guardar el ID del grupo activo
	**/
	this.setActiveGroup = setActiveGroup;
	function setActiveGroup (gid){
		localStorage.setItem("activeGroupId", gid);
	}
	
	/**
	/* Función getter del grupo activo
	/* Lo coge de localstorage de HTML5
	**/
	this.activeGroup = getActiveGroup;
	this.getActiveGroup = getActiveGroup;
	function getActiveGroup (){
		return localStorage.getItem("activeGroupId");
	}
	
	/**
	/* Función que sirve para guardar el Nombre del grupo activo
	**/
	this.setActiveGroupName = setActiveGroupName;
	function setActiveGroupName (name){
		localStorage.setItem("activeGroupName", name);
	}
	
	/**
	/* Función getter del nombre del grupo activo
	/* Lo coge de localstorage de HTML5
	**/
	this.getActiveGroupName = getActiveGroupName;
	function getActiveGroupName (){
		return localStorage.getItem("activeGroupName");
	}

	/**
	/* Helper para guardar clave-valor en localstorage de HTML5
	**/
	this.setData = setData;
	function setData(key, value){
		localStorage.setItem(key, value);
	}
	
	/**
	/* Setter para el active group
	/* El active group será el último grupo visitado
	**/
	this.setActiveGroup = setActiveGroup;
	function setActiveGroup(gid){
		setData("activeGroup", gid);
	}
	
	/**
	/* Getter para el active group
	**/
	this.getActiveGroup = getActiveGroup;
	function getActiveGroup(gid){
		return localStorage.getItem("activeGroup");
	}
	

	/**
	/* Gets groups that the user logged in is suscribed to.
	/* @param Callback function to manage results
	**/
	this.getGroups = getGroups;
	function getGroups(callBack){
		this.getSimple("getGroups", callBack);	
	}

	/**
	/* Gets the logged user contact list
	/* @param Callback function to manage results
	**/
	this.getContacts = getContacts;
	function getContacts(callBack){
		this.getSimple("getContacts", callBack);	
	}
	
	/**
	/* Gets all users
	/* @param Callback function to manage results
	**/
	this.getUsers = getUsers;
	function getUsers(callBack){
		this.getSimple("getUsers", callBack);	
	}
	
	/**
	/* Add contact to the user's contact list
	/* @param cid User id of the contacto to add
	/* @param callBack Callback function to manage results
	/* @returns returns to the callback function '200' if succesful
	**/
	this.addContact = addContact;
	function addContact(cid, callBack){
		var postData = {data: JSON.stringify( {"token": this.getToken(), "cod": "addContact", "cid": cid } ) };
			Lungo.Service.post(this.jsonEndpoint, postData, callBack, "json");
	}
	
	/**
	/* Get photo thumbnails
	/* @param gid group id of the group to get the photos
	/* @param callBack Callback function to manage results
	/* @returns returns photos in JSON
	**/
	this.getThumbnails = getThumbnails;
	function getThumbnails(gid, callBack){
		var postData = {data: JSON.stringify( {"token": this.getToken(), "cod": "getThumbnails", "gid": gid } ) };
			Lungo.Service.post(this.jsonEndpoint, postData, callBack, "json");
	}
	
	/**
	/* Get group updates
	/* @param gid group id of the group to get the updates
	/* @param callBack Callback function to manage results
	/* @returns returns updates in JSON with fields: id	gid	uid	title	description	photo	date	time
	**/
	this.getUpdates = getUpdates;
	function getUpdates(gid, callBack){
		var postData = {data: JSON.stringify( {"token": this.getToken(), "cod": "getUpdates", "gid": gid } ) };
			Lungo.Service.post(this.jsonEndpoint, postData, callBack, "json");
	}
	
	/**
	/* Add users to a group
	/* @param gid group of the user
	/* @param users array of user ids
	/* @param callBack Callback function to manage results
	/* @returns returns to the callback function '200' if succesful
	**/
	this.addUsersToGroup = addUsersToGroup;
	function addUsersToGroup(gid, users, callBack){
		var postData = {data: JSON.stringify( {"token": this.getToken(), "cod": "addUsersToGroup", "gid": gid, "users": users } ) };
			Lungo.Service.post(this.jsonEndpoint, postData, callBack, "json");
	}
	
	/**
	/* This function makes simple POST to server to get simple data. Simple data 
	/* is defined as that 
	/* 
	/* @param Callback function to manage results
	**/
	this.getSimple = getSimple;
	function getSimple(cod, callback){
		var postData = {data: JSON.stringify( {"token": this.getToken(), "cod": cod} ) };
		Lungo.Service.post(this.jsonEndpoint, postData, callback, "json");	
	}

	/**
	/* Sirve para cargar el valor de una clave de dato de usuario
	/* Lo carga en el tag HTML con el id indicado
	/* Se puede forzar a actualizar el contenido local con el del servidor
	/* con el parámetor update.
	*/
	this.loadData = loadData;
	function loadData (key, id, update){
		var element;

		if(arguments.length > 1)
			setContent = true;
		else
			setContent = false;

		if(setContent)
				element = document.getElementById(id);


		//Cargamos el valor de la clave local
		var local = localStorage.getItem(key);

		// Comprobamos si la clave existe en localStorage		
		if( local != null){
			if(setContent)
				element.innerHTML = local;
			else
				return local;
		}
		
		/* Actualizamos contenido del servidor si no existe o se fuerza mediante parÃ¡metro */
		if( (local == null) || (arguments.length == 3 && update == true) ){

			//Hacemos la peticiÃ³n HTTP para recuperar los datos actualizados
			var postData = {data: JSON.stringify( {"token": this.getToken(), "cod": "getKey", "key": key } ) };

			// Funcion de callback de la peticiÃ³n ajax
			var parseResponse = function(result){
				if(result.status == "200"){
					newData = result.key;
					setData(key, newData);

					if(setContent)
						element.innerHTML = newData;
					else
						return newData;
					
				}
				else
					alert(result.status);
			}

			// PeticiÃ³n ajax
			Lungo.Service.post(this.jsonEndpoint, postData, parseResponse, "json");

		}

	}

	


	/**
	/* Funcion que se encarga de poner el valor adecuado en cada campo con el atributo indicado
	/* Ejemplo: <div id="usrName" data-click="name"></div>
	/* y ejecutando bindData("data-click") pondrÃ¡ dentro del <div> "usrName" el valor de la clave "name"
	*/
	this.bindData = bindData;
	function bindData(attribute){
		elements = getAllElementsWithAttribute(attribute);

		for(i in elements){
			key = elements[i].getAttribute(attribute);
			id = elements[i].getAttribute("id");
			this.loadData(key, id);

		}

	}
	
	/** 
	/* Funcion para crear un nuevo usuario.
	/*
	*/
	this.newUser = newUser;
	function newUser(login, name, surname, email, password){
		var postData = {data: JSON.stringify( {"token": this.getToken(), "cod": "new_user", "new_user": {"login": login, "name": name, "surname": surname, "email": email, "password": password} })};
		var parseResponse = function(result){
				if(result.status == "200"){
					Lungo.Router.section("main_section");
					Lungo.Notification.show(
					"check",                //Icon
					"User "+login+" created",         //Title
					3,                      //Seconds
					null       				//Callback function
				);
				}
				else
					alert(result.status);
			}
		Lungo.Service.post(this.jsonEndpoint, postData, parseResponse, "json");
	}
	/**
	/* Función para obtener los elementos con un determinado atributo
	/* 
	*/
	function getAllElementsWithAttribute(attribute){
	  var matchingElements = [];
	  var allElements = document.getElementsByTagName('*');
	  for (var i = 0; i < allElements.length; i++)
	  {
	    if (allElements[i].getAttribute(attribute))
	    {
	      matchingElements.push(allElements[i]);
	    }
	  }
	  return matchingElements;
	}
	
	
	/** 
	/* Funcion para convertir ima imagen a String Base64
	/* La usaremos para guardar imágenes en localstorage.
	*/
	function convertImgToBase64(url, callback, outputFormat){
		var canvas = document.createElement('CANVAS');
		var ctx = canvas.getContext('2d');
		var img = new Image;
		img.crossOrigin = 'Anonymous';
		img.onload = function(){
			canvas.height = img.height;
			canvas.width = img.width;
			ctx.drawImage(img,0,0);
			var dataURL = canvas.toDataURL(outputFormat || 'image/png');
			callback.call(this, dataURL);
			// Clean up
			canvas = null; 
		};
		img.src = url;
	}
	
	/**
	/* Añade una imagen a un tag html dado mediante id
	/* Nos servirá para insertar imágenes en un <div>.
	*/
	this.appendImg = appendImg;
	function appendImg(id, src){
		var img = document.createElement("img");
		img.src = src;
		var src = document.getElementById(id);
		src.appendChild(img);
	}
	
	this.loadGroup = loadGroup;
	function loadGroup(id){
	
	}
	
	this.ficheroSeleccionado = ficheroSeleccionado;
	function ficheroSeleccionado(e) {		
        if (e.target.files.length > 0) {
            subirFichero(e.target.files[0]);
        }
    }
 
	
	/**
	/* Subir fichero a DropBox
	/*
	*/
    function subirFichero(file) {
	
		if(click.activeGroup() == null){alert("Select a group first"); return;}
		
		Lungo.Notification.confirm({
			icon: 'user',
			title: 'Upload photo',
			description: 'Do you want to upload the photo and share it with the group?',
			accept: {
				icon: 'checkmark',
				label: 'Yes',
				callback: function(){
							var xhr = new XMLHttpRequest();
							var formData = new FormData();
							formData.append("file", file);
							/*
							xhr.addEventListener("error", function(e) {
								alert("Error subiendo el archivo.");
								var progress = document.getElementById("progress");
								progress.value = 0;
							}, false);
							*/
							xhr.addEventListener("load", function(e) {
							
								var afterNotification = function(){
									setTimeout(function(){Lungo.Notification.hide()},3000);
								};
								Lungo.Notification.success(
									"Success",                  //Title
									"Photo uploaded succesfully",     //Description
									"check",                    //Icon
									3,                          //Time on screen
									afterNotification           //Callback function
								);
											
								//alert("fichero subido: " + e.target.status + "->" + e.target.statusText);
							});
							
							/*	
							xhr.upload.addEventListener("progress", function(e) {
								if (e.lengthComputable) {
									var progress = document.getElementById("progress");
									progress.max = e.total;
									progress.value = e.loaded;
								}
							}, false);
							*/
							xhr.open('POST', "http://moncadaisla.es/click/dropbox.endpoint.php?clickToken="+window.btoa(getToken())+"&cod=upload&gid="+click.getActiveGroup(), true);
							xhr.send(formData);
						}
			},
			cancel: {
				icon: 'close',
				label: 'No',
				callback: function(){ }
			}
		});
		
		
	}
	
	
	
}

