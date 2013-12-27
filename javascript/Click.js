function Click (){

	this.endpoint = "http://moncadaisla.es/click/";
	this.jsonEndpoint = this.endpoint + "json.php";
	this.loginEndpoint = this.endpoint + "login.php";

	this.setToken = setToken;
	function setToken (token){
		localStorage.clear();
		localStorage.setItem("token", token);
	}

	this.getToken = getToken;
	function getToken (){
		return localStorage.getItem("token");
	}

	this.setData = setData;
	function setData(key, value){
		localStorage.setItem(key, value);
	}

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
		
		/* Actualizamos contenido del servidor si no existe o se fuerza mediante parámetro */
		if( (local == null) || (arguments.length == 3 && update == true) ){

			//Hacemos la petición HTTP para recuperar los datos actualizados
			var postData = {data: JSON.stringify( {"token": this.getToken(), "cod": "getKey", "key": key } ) };

			// Funcion de callback de la petición ajax
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

			// Petición ajax
			Lungo.Service.post(this.jsonEndpoint, postData, parseResponse, "json");

		}

	}


	/**
	/* Función que se encarga de poner el valor adecuado en cada campo con el atributo indicado
	/* Ejemplo: <div id="usrName" data-click="name"></div>
	/* y ejecutando bindData("data-click") pondrá dentro del <div> "usrName" el valor de la clave "name"
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



	/* Función para obtener elementos por atirbuto */
	function getAllElementsWithAttribute(attribute){
	  var matchingElements = [];
	  var allElements = document.getElementsByTagName('*');
	  for (var i = 0; i < allElements.length; i++)
	  {
	    if (allElements[i].getAttribute(attribute))
	    {
	      // Element exists with attribute. Add to array.
	      matchingElements.push(allElements[i]);
	    }
	  }
	  return matchingElements;
	}
}


