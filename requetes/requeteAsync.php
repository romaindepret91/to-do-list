<?php 
    require_once('fonctionsDB.php');

    $action = $_REQUEST['action'];

    switch($action) {

        case 'add': 
            if (isset($_REQUEST['tache']) && isset($_REQUEST['description']) && isset($_REQUEST['importance']) && isset($_REQUEST['date']) && isset($_REQUEST['status'])) {
        
                $taskName = htmlspecialchars($_REQUEST['tache']);
                $taskDescription = htmlspecialchars($_REQUEST['description']);
                $taskImportance = htmlspecialchars($_REQUEST['importance']);
                $taskDate = htmlspecialchars($_REQUEST['date']);
                $taskStatus = htmlspecialchars($_REQUEST['status']);
                
                $return_id = addTask($taskName, $taskDescription, $taskImportance, $taskDate, $taskStatus);
        
                echo $return_id;
            }  
            break;

        case 'display': 
            if(isset($_REQUEST['order'])){
                $order = $_REQUEST['order'];
                getTasks($order);
            }
            else getTasks();
            
            break;

        case 'delete':
            if (isset($_REQUEST['id'])) {

                $taskId = htmlspecialchars($_REQUEST['id']);
                
                deleteTask($taskId);
            }  
            break;

        case 'changeStatus':
            if(isset($_REQUEST['status']) && isset($_REQUEST['id'])) {

                $taskId = htmlspecialchars($_REQUEST['id']);
                $status = htmlspecialchars($_REQUEST['status']);

                changeTaskStatus($taskId, $status);
            }
            break;

            default:
                header('Location: index.php');
                exit;
    }
    
?>