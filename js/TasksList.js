
import { initAjaxRequest } from "./initAjaxRequest.js";

const   _elTasksList = new WeakMap(),
        _criteriaSelected = new WeakMap(),
        _displayTasks = new WeakMap(),
        _changeTaskStatus = new WeakMap(),
        _displayModaleDetails = new WeakMap(),
        _deleteTask = new WeakMap(),
        elTaskDetailsTemplate = document.getElementById('task-details-temp'),
        elModaleDetails = document.getElementById('modale-details'),
        elTaskTemplate = document.getElementById('task-temp'),
        elFormSort = document.querySelector('[name="sortTasksForm"]');

/** Classe qui gère les comportements des composants de la liste de tâches */ 
export class TasksList {
    /**
     * 
     * @param {htlmElement} elTasksList - liste de tâches
     */
    constructor(elTasksList) {

        if(!(elTasksList instanceof HTMLElement) || !elTasksList.classList.contains('tasks-list')) throw new Error('Must be an HTML element of class "tasks-list".');

        _elTasksList.set(this, elTasksList); // Élément liste de tâches

        _criteriaSelected.set(this, elFormSort.elSelectSort.value); // Critère de tri 

        /**
         * Méthode qui affiche la liste des tâches et initialise les comportements de ses composants
         */
        _displayTasks.set(this, function() {

            const   xhr = initAjaxRequest();

            let     tasksData,
                    xhrBody = 'action=display';
            
            this.criteriaSelected === 'taskname/taskImportance' ? xhrBody += '&order=tache' : xhrBody += '&order=importance';
            
            xhr.send(xhrBody);
            xhr.onload = function() {
                if(xhr.status !== 200) throw new Error(`Erreur: ${xhr.status}: ${xhr.statusText}`);
                else {
                    tasksData = JSON.parse(xhr.response);
                    this.elTasksList.innerHTML = '';
                    // Génération des éléments de la liste avec le template associé
                    for(let task of tasksData){
                        let htmlContentTemplate = elTaskTemplate.innerHTML;
                        const fGenerateHtml = new Function('taskName', 'taskImportance', 'taskDescription','taskId', 'taskStatus', "return(`"+htmlContentTemplate+"`)");
                        htmlContentTemplate = fGenerateHtml(task['tache'], task['importance'], task['description'] === '' ? 'Aucune description disponible' : task['description'], task['id'], task['status'] == 0 ? false : true);
                        this.elTasksList.insertAdjacentHTML('beforeend', htmlContentTemplate);
                    };

                    const   elTasks = this.elTasksList.querySelectorAll('.task');
                    // Initialisation des comportements des éléments
                    elTasks.forEach(function(elTask) {
        
                        const   elChangeTaskStatus = elTask.querySelector('.task-info'),
                                elDeleteTask = elTask.querySelector('.delete-task'),
                                elShowTaskDetails = elTask.querySelector('.show-task-details');
                        // Changement de statut
                        elChangeTaskStatus.addEventListener('click', function(evt) {
                            this.changeTaskStatus(evt);
                        }.bind(this));
                        // Suppression de la tâche
                        elDeleteTask.addEventListener('click', function(evt) {
                            this.deleteTask(evt);
                        }.bind(this));
                        // Affichage des détails de la tâche
                        elShowTaskDetails.addEventListener('click', function(evt) {
                            const   taskId = evt.target.parentNode.dataset.taskId;
                            location = `#taches/tache/${taskId}`; // Modifie l'url 
                        }.bind(this));
                    }.bind(this));
                    // Affiche la modale au changement d'url
                    window.addEventListener('hashchange', function() {
                        if(location.hash !== '#taches/') {
                            let taskId = location.hash.split('/').pop();
                            this.displayModaleDetails(taskId);
                        }
                    }.bind(this));
                };
            }.bind(this);
        }.bind(this));
        /**
         * Méthode qui change le statut de la tâche
         */
        _changeTaskStatus.set(this, function(evt) {

            const   xhr = initAjaxRequest(),
                    elTask = evt.target.classList.contains('task-description')? evt.target.parentNode : evt.target,
                    taskId = elTask.dataset.taskId,
                    taskStatus = elTask.dataset.taskStatus === 'false' ? '1' : '0',
                    xhrBody = `action=changeStatus&id=${taskId}&status=${taskStatus}`;
                 
            xhr.send(xhrBody);
            xhr.onload = function() {
                if(xhr.status !== 200) throw new Error(`Erreur: ${xhr.status}: ${xhr.statusText}`);
                else {
                    elTask.dataset.taskStatus = elTask.dataset.taskStatus === 'true' ? 'false' : 'true';
                };
            }.bind(this);
        });
        /**
         * Méthode qui affiche les détails de la tâche dans une fenêtre modale
         */
        _displayModaleDetails.set(this, function(taskId) {

            const   xhr = initAjaxRequest();

            let tasksData,
                xhrBody = 'action=display';

            this.criteriaSelected === 'taskname/taskImportance' ? xhrBody += '&order=tache' : xhrBody += '&order=importance';
            
            xhr.send(xhrBody);
            xhr.onload = function() {
                if(xhr.status !== 200) throw new Error(`Erreur: ${xhr.status}: ${xhr.statusText}`);
                else {
        
                    tasksData = JSON.parse(xhr.response);

                    let     htmlContentTemplate = elTaskDetailsTemplate.innerHTML,
                            done = '';

                    const   taskIndex = tasksData.findIndex(task =>{return task['id'] == taskId;}),
                            fGenerateHtml = new Function('taskId', 'taskName', 'taskDescription', 'taskImportance', 'taskStatus', 'taskDate', "return(`"+htmlContentTemplate+"`)");
                    // Si l'index de la tâche existe dans la BD, on affiche la modale avec le template associé
                    if(taskIndex !== -1) {
                        tasksData[taskIndex]['status'] === '0' ? done = 'non' : done = 'oui';
                        htmlContentTemplate = fGenerateHtml(taskIndex+1, tasksData[taskIndex]['tache'], tasksData[taskIndex]['description'] === '' ? 'Aucune description disponible' : tasksData[taskIndex]['description'], tasksData[taskIndex]['importance'], done, tasksData[taskIndex]['date'] === null ? 'Non renseignée' : tasksData[taskIndex]['date']);
    
                        elModaleDetails.innerHTML = '';
                        elModaleDetails.insertAdjacentHTML('beforeend', htmlContentTemplate);
                        elModaleDetails.close();
                        elModaleDetails.showModal();
    
                        const closeModaleBtn = elModaleDetails.querySelector('.closeModaleBtn');
                        // Comportement au click sur le bouton qui ferme la fenêtre modale
                        closeModaleBtn.addEventListener('click', function() {
                            elModaleDetails.close();
                            location = '#taches/';
    
                        });
                    }
                    // Sinon, on "nettoie" l'url
                    else {
                        const cleanedUrl = location.origin + location.pathname + '#taches/';
                        history.replaceState(null, null, cleanedUrl);
                        elModaleDetails.close();
                    }
                };
            }.bind(this);
        });
        /**
         * Méthode qui supprime une tâche
         */
        _deleteTask.set(this, function(evt) {

            const   xhr = initAjaxRequest(),
                    encodedTeamId = encodeURIComponent(evt.target.parentNode.dataset.taskId),
                    xhrBody = `id=${encodedTeamId}&action=delete`;

            xhr.send(xhrBody);
            xhr.onload = function() {
                if(xhr.status !== 200) throw new Error(`Erreur: ${xhr.status}: ${xhr.statusText}`);
                else {
                    this.displayTasks(this.criteriaSelected);
                };
            }.bind(this);
        }.bind(this));
        
        // Appel de la méthode d'affichage des tâches à l'instanciation
        this.displayTasks(this.criteriaSelected);
           
    }

    get elTasksList() {
        return _elTasksList.get(this);
    }

    get criteriaSelected() {
        return _criteriaSelected.get(this);
    }

    set criteriaSelected(value) {
        if(value === 'taskname/taskImportance' || value === 'taskImportance/taskname')  _criteriaSelected.set(this, value);
    }

    get displayTasks() {
        return _displayTasks.get(this);
    }

    get changeTaskStatus() {
        return _changeTaskStatus.get(this);
    }

    get displayModaleDetails() {
        return _displayModaleDetails.get(this);
    }

    get deleteTask() {
        return _deleteTask.get(this);
    }
}
