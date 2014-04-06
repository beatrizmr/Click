/********************************************
/*         Click Groups Library             *
/********************************************
/*                                          *
/* This file is part of Click               *
/* @author Beatriz Martinez Rubio           *
/* @version 11/11/2013                      *
*********************************************/

/**
/* Add a group to the group list in the aside
/* @param group the name of the group is going to be add
**/
function insertGroupAside(group){
		var groupList = document.getElementById("aside-group-list");
		groupList.insertAdjacentHTML("beforeend", group);
}



/**
/* Insert what is new in the group's profile view_________________________________________________TODAVIA NO SE USA
/* @param data
**/
function insertGroupNew(data){
	var groupNews = document.getElementById("group-news-list");	
		groupNews.insertAdjacentHTML("beforeend", data);
}



/**
/* Add a group in the aside groups list
/* @param id identifier of the group
/* @param name name of the group 
/* @return the html to inner in the list
**/
function construirGroupAside(id, name){
	return '<li data-icon="edit" onClick="javascript:loadGroup('+id+',\''+name+'\')"><strong>'+name+'</strong></li>';
}



/**
/* Build the groups list in the aside
**/
function showGroupList(){
	asideGroupList = document.getElementById("asideGroupList");
	//asideGroupList.innerHTML = "";

	/**
	/* load all groups in the aside
	/* @param groups all user groups array
	**/
	function loadGroupsAside(groups){
		for(i=0; i<groups.length;i++){
			group = construirGroupAside(groups[i].id, groups[i].name);
			insertGroupAside(group);
		}
	}
	click.getGroups(loadGroupsAside);
}



/**
/* Build a new in the group profile view
/* @param title title of the new (new photo, new member...)
/* @param description description of the new
/* @param photo photo of the new
/* @param date date of the new
/* @param time time of the new
**/
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



/**
/* Show all news in group profile view
**/
function showGroupNews(){
	groupNews = document.getElementById("group-news-list");
	groupNews.innerHTML = "";

	/**
	/* Load all group news
	/* @param news group news array
	**/
	function loadGroupNews(news){
		for(i=0;i<news.length;i++){
			n = construirGroupNew(news[i].title, news[i].description, news[i].photo, news[i].date, news[i].time);
		}
	}
	//click.getGroupNews(click.getActiveGroup(), loadGroupNews);	
}



/**
/* Get the group pictures' src
/* @param src
/* @return the img html tag
**/
function construirGroupPic(src){
	return '<img src="https://moncadaisla.es/click/'+src+'" />';
}



/**
/* Build news in the group profile view_________________________________________________________IGUAL QUE construirGroupNew, mirar
/* @param title
/* @param description
/* @param photo
/* @param date
/* @param time
/* @return the img html tag
**/
function construirGroupUpdate(title, description, photo, date, time){
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
/* Append data in 'id' passed as parameter in the position indicated by 'where' parameter
/* @param id element in which append data
/* @param data the data to append
/* @param where in the id element (beforeend ...)
**/
function appendHtml(id, data, where){
	var element = document.getElementById(id);
	element.insertAdjacentHTML(where, data);
}



/**
/* Route to new group_____________________________________________________________________________________NO SE USA
**/
function showAddNewGroup(){
	showContacts();
	showArticle('main','createGrView');	
}



/**
/* Show all app contacts list, when adding new user contacts
**/
function showGroupPics(){
	groupPics = document.getElementById("Grouppictures");
	groupPics.innerHTML = "";

	/**
	/* Get all contacts' pictures
	/* @param pics all group pictures array
	**/ 
	function loadGroupPics(pics){
		for(i=0;i<pics.length;i++){
			p = construirGroupPic(pics[i].url);
			appendHtml("Grouppictures", p, "beforeend");
		}
	}
	click.getThumbnails(click.getActiveGroup(), loadGroupPics);
}



/**
/* Show all news in the group profile view
**/ 
function showGrActivity(){

	groupActivityList = document.getElementById("group-news-list");
	groupActivityList.innerHTML = "";

	/**
	/* Get all updates of the group
	/* @param updates all group news array
	**/
	function loadgroupActivityList(updates){
		for(i=0;i<updates.length;i++){
			u = construirGroupUpdate(updates[i].title, updates[i].description, "http://moncadaisla.es/click/"+updates[i].photo, updates[i].date, updates[i].time);
			appendHtml("group-news-list", u, "beforeend");
		}
	}
	click.getUpdates(click.getActiveGroup(), loadgroupActivityList);	
}



/**
/* Load the group, pictures, activity, name.. 
/* @param gid of the group
/* @param name of the group
**/
function loadGroup(gid, name){
	click.setActiveGroup(gid);
	click.setActiveGroupName(name);

	document.getElementById("group-title").innerHTML = name;

	showGroupPics();
	showGrActivity();
	showArticle("groupSection", "profile");
}



/**
/* Get the shadow color of the group and return it
**/
function getBoxShadowStyle(color){
	a = document.getElementsByClassName("colorGroup");
	b = a[0];
	style = window.getComputedStyle(b);
	old = style.getPropertyValue("box-shadow");
	return old.replace(/rgb\(.*\)/gi,color);
}



/**
/* Choose the group whose members you write to in the generic timeline ___________________________ DECIDIR SI VA A SUARSE O SE CAMBIA
**/
function selectColor (){
	var colorSelected = document.getElementById('colorinput').value;
	//alert(colorSelected);
	document.getElementById('selectedColor').setAttribute('style', "border-color: "+colorSelected+" !important");
	groupColor = colorSelected;
}

document.getElementById("colorinput").addEventListener("change", function(){selectColor()}, false);



/**
/* Choose the color of the group that is being created
**/
function colorG (){
	var colorSelec = document.getElementById('colorInputGr').value;
	document.getElementById('hrefcolor').setAttribute('style', "color: "+colorSelec+" !important");
}

document.getElementById("colorInputGr").addEventListener("change", function(){colorG()}, false);




// GALERIA DEL GRUPO

var grPhotosArray = [];
var indexGallery = 0;



/**
/* Load all group pictures
/* @param pics all group pictures array
**/
function loadGroupPhotos(pics){
	for(i=0;i<pics.length;i++){
		grPhotosArray[i] = "background-image: url('https://moncadaisla.es/click/"+pics[i].url+"')";
	}
}

click.getThumbnails(click.getActiveGroup(), loadGroupPhotos);

document.getElementById('picturesContainer').setAttribute('style', grPhotosArray[0]);



/**
/* Show next in carrousel
**/
function nextPic (){
	if (indexGallery < (grPhotosArray.length - 1)){
		indexGallery = indexGallery +1;	
	}else{
		indexGallery = 0;
	}
	document.getElementById('picturesContainer').setAttribute('style', grPhotosArray[indexGallery]);
}



/**
/* Show previous in carrousel
**/
function prevPic (){
	if (indexGallery > 0){
		indexGallery = indexGallery -1;			
	}else{
		indexGallery = grPhotosArray.length - 1;
	}
	document.getElementById('picturesContainer').setAttribute('style', grPhotosArray[indexGallery]);
}

document.getElementById("next").addEventListener("click", function(){nextPic()}, false);
//document.getElementById("picturesContainer").addEventListener("swipeLeft", function(){nextPic()}, false);  //NO FUNCIONA SWIPE
document.getElementById("previous").addEventListener("click", function(){prevPic()}, false);
//document.getElementById("picturesContainer").addEventListener("swipeRight", function(){prevPic()}, false); //NO FUNCIONA SWIPE




//zoom pictures
s = 100;



/**
/* Zoom + in carousel pictures
**/
function zom (){
	alert("acercar");
	alert("s vale"+s);
	s = s+100;
	alert("s vale"+s);
	document.getElementById('picturesContainer').setAttribute('style', "background-size:"+s+"%");
}



/**
/* Zoom - in carousel pictures
**/
function far (){
	alert("alejar");
	s = s*0.5;
	document.getElementById('picturesContainer').setAttribute('style', "background-size:"+s+"%");
}	

document.getElementById("pictures").addEventListener("pich", function(){far()}, false);  //aleja bien
document.getElementById("pictures").addEventListener("pinchOut", function(){zom()}, false); //aleja antes de acercar  NO FUNCIONA BIEN



/**
/* Search contact by group view input value
/* input id = searchGrView
/* liGrView, li class to filter
/* is goint to filter by nameGrView
**/
var searchGrView = document.getElementById('searchGrView');

searchGrView.onkeyup = function () {
    var filter = searchGrView.value.toUpperCase();
    var lisNav = document.getElementsByClassName('liGrView');

    for (var i = 0; i < lisNav.length; i++) {
        var name = lisNav[i].getElementsByClassName('nameGrView')[0].innerHTML;
        if (name.toUpperCase().indexOf(filter) == 0){ 
        	lisNav[i].classList.remove('hide');    	
        }else{
            lisNav[i].classList.add('hide');
        }
    }
}

/**
/* Use this function to create new group
/*
*/
function createNewGroup(){	

	function insertContacts(gid){
		
		var members = new Array();
		function insertSelectedContacts(cid){
			members.push(""+cid);
			checkBoxes = document.getElementsByClassName("checkContact");
			for(i=0; i<checkBoxes.length; i++){
				if(checkBoxes[i].checked)
					members.push(checkBoxes[i].value)
			}
			function loadNewGroup(d){
				loadGroup(gid, name);
			}

			click.addUsersToGroup(gid, members, loadNewGroup);
		}
		click.getKey("id", insertSelectedContacts);

	}
	
	name = document.getElementById("createGroup-name").value;
	click.createGroup(name, insertContacts);
	
}


/**
/* Build a new group memeber view
/* @param score score of the member_________________________________________________________FALTA
/* @param pircturesNum pircturesNum of the member
/* @param commentsNum commentsNum of the member
/* @param memberName memberName of the member
/* @param memberPic memberPic of the member
**/
function buildGroupMember(pircturesNum, commentsNum, memberName, memberPic){
	return '<div class="nota">\
                    <div class="contenidoMember">\
                        <div class="leftInfo">\
                            <div class="picMember">\
                                <img src="'+memberPic+'"/>\
                            </div>\
                            <div class="rating">\
                                <span>&#9734;</span><span>&#9734;</span><span>&#9734;</span><span>&#9734;</span><span>&#9734;</span>\
                            </div>\
                        </div>\
                        <div class="infoMember">\
                            <div class="info">\
                                <p>\
                                    <span class="commentPerson strong greenText">Name:</span>\
                                    <span class="opacity leftspace">'+memberName+'</span>\
                                </p>\
                                <p>\
                                    <span class="commentPerson strong greenText">Shared:</span>\
                                    <span class="small opacity leftspace icon picture"><span class="spaceSpan">'+pircturesNum+'</span></span>\
                                </p>\
                                <p>\
                                    <span class="commentPerson strong greenText">Post:</span>\
                                    <span class="small opacity leftspace icon comments-alt"><span class="spaceSpan">'+commentsNum+'</span></span>\
                                </p>\
                            </div>\
                        </div>\
                    </div>\
                </div>';
}

/**
/* Show all members in members group view
**/ 
function showGrMembers(){

	groupMembersList = document.getElementById("group-member-list");
	groupMembersList.innerHTML = "";

	/**
	/* Get all updates of the group
	/* @param updates all group news array
	**/
	function loadgroupMemberList(members){
		for(i=0;i<members.length;i++){
			//u = buildGroupMember(members[i].pircturesNum, members[i].commentsNum, members[i].name, "http://moncadaisla.es/click/"+members[i].photo);
			u = buildGroupMember(7, 5, members[i].name, members[i].photo);
			appendHtml("group-member-list", u, "beforeend");
		}
	}
	click.getUsersFromGroup(click.getActiveGroup(), loadgroupMemberList);	
}

document.getElementById("show-group-members").addEventListener("click", function(){showGrMembers()}, false);