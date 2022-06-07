<?php
	$connexion = connectDB();
	
	function connectDB() {

		define("SERVER", "localhost");
		define("USERNAME", "root"); //("USERNAME", "e2195318");
		define("PASSWORD", "root"); //("PASSWORD", "IUrGPqcQ7tkvGcgx2Dzc");
		define("DBNAME", "to-do-list"); //("DBNAME", "e2195318");

		$laConnexion = mysqli_connect(SERVER, USERNAME, PASSWORD, DBNAME);
				
		if (!$laConnexion) {

			trigger_error("Erreur de connexion : " . mysqli_connect_error());
		}
		
		mysqli_query($laConnexion, 'SET NAMES "utf8"');

		return $laConnexion;
	}
	

	/**
	 * On recoit une requete sql, on l'execute et retourne le resultat.
	 * Si $last est true, on retourne plutot l'id du dernier item inseré.
	 * @param $requete
	 * @param false $last
	 * @return bool|int|mysqli_result|string
	 */
	function executeRequete($requete, $last = false) {
		global $connexion;
		if ($last) {
			mysqli_query($connexion, $requete);
			return $connexion->insert_id;
		} else {
			$resultats = mysqli_query($connexion, $requete);
			return $resultats;
		}
	}
	
	function getTasks($order = 'tache') {
		$tasks = executeRequete("SELECT * FROM taches ORDER BY $order");
		$result = [];
		while ($task = mysqli_fetch_assoc($tasks)) {
			$result[] = $task;
		} 
		echo json_encode($result);	
	}

	function addTask($taskname, $taskDescription, $taskImportance, $taskDate, $taskStatus) {
		return executeRequete("INSERT INTO taches (tache, description, importance, date, status) 
							   VALUES ('$taskname', '$taskDescription', '$taskImportance', '$taskDate', '$taskStatus')", true); 		// On veut le dernier id inseré
	}

	function changeTaskStatus($id, $status) {
		return executeRequete("UPDATE taches 
							   SET status = '$status' 
							   WHERE id = '$id'");
	}

	function deleteTask($taskId) {
		return executeRequete("DELETE FROM taches WHERE id = '$taskId'");
	}
?>