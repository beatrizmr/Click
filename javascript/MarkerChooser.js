/********************************************
/*         Click MarkerChooser              *
/********************************************
/*                                          *
/* This file is part of Click               *
/* @author Beatriz Martinez Rubio           *
/* @version 11/11/2013                      *
*********************************************/



function MarkerChooser(){
	//location_A_azulO.svg
	this.colors = new Array("azulO","azulC","verde","rosa");
	this.nextColor = 0;

	this.getFileName = getFileName;

	/**
	/* Returns filename of marker given a name
	/* @param first name of the person
	/* @returns file name of the image marker
	**/
	function getFileName(name){

		filename = "location_"+name.charAt(0).toUpperCase()+"_"+this.colors[this.nextColor]+".svg";

		if(this.nextColor < (this.colors.length - 1))
			this.nextColor++;
		else
			this.nextColor = 0;

		return filename;
	}

}