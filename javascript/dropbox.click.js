/********************************************
/*       Dropbox Javascript Library         *
/********************************************
/*                                          *
/* This file is part of Click               *
/* @author Beatriz Martinez Rubio           *
/* @version 11/11/2013                      *
*********************************************/


function DropboxClick(){

	this.authenticate = authenticate;
	this.isAuthenticated = isAuthenticated;

	function authenticate(){
		var data = JSON.stringify({'return': document.URL, "token" : click.getToken(), cod : 'dropboxauth'});
		post_to_url("https://moncadaisla.es/click/lib/getDBtoken.php?clickToken="+window.btoa(click.getToken())+"&return="+document.URL,{'data': data});
	
	}
	
	function isAuthenticated(){
		return true;
	}
	
}

function post_to_url(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
}