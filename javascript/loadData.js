
function Click (){

	this.endpoint = "http://moncadaisla.es/click/";
	this.jsonEndpoint = this.endpoint + "json.php";
	this.loginEndpoint = this.endpoint + "login.php";

	function setToken (token){
		localStorage.setItem("token", token);
	}

	function getToken (){
		return localStorage.getItem("token");
	}

	function setData(key, value){
		localStorage.setData(key, value);
	}

	function loadData (id, key){

		//Cargamos el valor de la clave local
		var local = localStorage.getItem(key);

		// Comprobamos si la clave existe en localStorage		
		if( local != null)
			document.getElementById(id).value = local;

		//Hacemos la petición HTTP para recuperar los datos actualizados
		var postData = {data: JSON.stringify( {"token": this.getToken(), "cod": "getKey", "key", key } ) };

		var parseResponse = function(result){
			if(result.status == "200"){
				newData = result.key;
				this.setData(key, newData);
				document.getElementById(id).value = newData;
			}
			else
				alert(result.status);
		}
		Lungo.Service.post(url, data, parseResponse, "json");



	}
}


