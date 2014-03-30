/********************************************
/*         Click Contacts Library           *
/********************************************
/*                                          *
/* This file is part of Click               *
/* @author Beatriz Martinez Rubio           *
/* @version 11/11/2013                      *
*********************************************/


/**
/* Add a contact (first param) to the contact list view and the contact (second param) to the create new group view
/* @param contact contact to add to contact list view
/* @param contacGrView contact to add to create new group view
**/
function insertContact(contact, contactGrView){
		var contactList = document.getElementById("contacts-view-list");
		contactList.insertAdjacentHTML("beforeend", contact);

		var contactListGrView = document.getElementById("chooseContacts-view-list");
		contactListGrView.insertAdjacentHTML("beforeend", contactGrView);
		
}



/**
/* Add an app contact to the all-app-contacts list
/* @param contact contact to add to all app contacts list
**/
function insertAllContact(contact){
		var allContactList = document.getElementById("allContacts-view-list");
		allContactList.insertAdjacentHTML("beforeend", contact);
}



/**
/* Build a contact view in the contact list
/* @param login login of the user
/* @param name name of the us
/* @param surname surname of the user
/* @param photo profile photo of the user
/* @param date__________________________________________________________________FALTA VER SI SERA CUANDO SE UNIO, ULTIMA CONEXION...
**/
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



/**
/* Build a contact view in the list of contacts in create new group view
/* @param state state of the user
/* @param name name of the us
/* @param surname surname of the user
/* @param photo profile photo of the user
**/
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



/**
/* Build a contact view in the list of all-app-contacts add contacts view___________________________________________ESTA NO SE USA
/* @param login login of the user
/* @param name name of the us
/* @param surname surname of the user
/* @param photo profile photo of the user
**/
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



/**
/* Build a contact view in the list of all-app-contacts add contacts view
/* @param login login of the user
/* @param name name of the us
/* @param surname surname of the user
/* @param photo profile photo of the user
**/
function construirInsertarContacto(id, login, name, surname, photo){
	//return '<li class="thumb" onclick="javascript:click.addContact(id)" >\
	return '<li class="liNav thumb" onClick="javascript:agregarContacto('+id+')">\
                        <img class="contactIMG" src="'+photo+'" />\
                        <div class ="textNav">\
                            <strong class="nameNav">'+name+' '+surname+'</strong>\
                            <small class="nameNav">'+login+'</small>\
                        </div>\
                    </li>';
}




/**
/* Show all contact list in both user contacts list view and user contacts allowed to add to a new group list view
/* if no contacts show a message
**/
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



/**
/* Route to contacts Article
**/
function showContactsArticle(){
	showContacts();
	showArticle('main','contactsView');
}



/**
/* Show all app contacts list, when adding new user contacts
**/
function showAllContacts(){
	allContactList = document.getElementById("allContacts-view-list");
	allContactList.innerHTML = "";
	
	/**
	/* Get all contacts' information
	/* @param contacts all click users array
	**/
	function loadAllContacts(contacts){
		for(i=0;i<contacts.length;i++){
			contacto = construirInsertarContacto(contacts[i].id, contacts[i].login, contacts[i].name, contacts[i].surname, contacts[i].photo);
			insertAllContact(contacto);
		}
	}
	click.getUsers(loadAllContacts);
}



/**
/* Add a new user contact 
/* @param cid contact id
**/
function agregarContacto(cid){

	/**
	/* Hide all users list and show user contacts list with the new contact___________________ REVISAR DATA
	/* @param data 
	**/
	function refreshContacts(data){
		Lungo.Element.Menu.hide("options");
		showContactsArticle();

	}
	click.addContact(cid, refreshContacts);
}



/**
/* Search contact by contacts view input value
/* input id = searchNav
/* liNav, li class to filter
/* is goint to filter by nameNav
**/
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