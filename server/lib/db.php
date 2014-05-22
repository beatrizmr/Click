<?php

/********************************************
/*         Database handler class           *
/********************************************
/*                                          *
/* This file is part of Click               *
/* @author Beatriz Martinez Rubio           *
/* @version 11/11/2013                      *
*********************************************/

require_once(dirname(__FILE__)."/../config/database.config.php");

class dbClick extends mysqli
{
	
	private $mysqli;
	
	/**
	/* Constructor for dbClick handler
	*/	
	public function dbClick()
	{
		$config = new dbConfig();		
		$this->mysqli = new mysqli($config->host, $config->user, $config->password, $config->db);
		
		if ($this->mysqli->connect_error)
		{
			die('Error de Conexión (' . $this->mysqli->connect_errno . ') '
				. $this->mysqli->connect_error);
		}
	}
	
	
	public function query($query)
	{
		return $this->mysqli->query($query);
	}
	
	
	public function fetch_array($result)
	{
		return $result->fetch_array(MYSQLI_ASSOC);
	}
	
	public function lastId()
	{
		return $this->mysqli->insert_id;
	}
	
	

}

?>