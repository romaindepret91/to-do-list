import { initAjaxRequest } from "./initAjaxRequest.js";
import { TasksList } from "./TasksList.js";

const   _elAddTaskForm = new WeakMap(),
        _elSortTasksForm = new WeakMap(),
        _oTasksList = new WeakMap(),
        _addTask = new WeakMap(),
        _initForm = new WeakMap();
     
/** Classe qui gère les comportements du formulaire d'ajout de tâches */
export class TasksForm {
    /**
     * 
     * @param {htmlElement} elTasksForm - élément formulaire d'ajout de tâches
     * @param {instance of class TasksList} oTasksList - instance de la classe TaskList
     */
    constructor(elTasksForm, oTasksList) {

        if(!(elTasksForm instanceof HTMLElement) || !elTasksForm.classList.contains('tasksForm')) throw new Error('Must be an HTML element of class "tasksForm".');

        if(!(oTasksList instanceof TasksList)) throw new Error('Must be an instance of class "TasksList".');

        _elAddTaskForm.set(this, elTasksForm.querySelector('[name="addTaskForm"]'));

        _elSortTasksForm.set(this, elTasksForm.querySelector('[name="sortTasksForm"]'));

        _oTasksList.set(this, oTasksList);
        /**
         * Méthode qui ajoute une tâche à la liste
         */
        _addTask.set(this, function() {

            const   errMsg = document.getElementById('msgErr'),
                    taskName = this.elAddTaskForm.taskName,
                    taskDescription = this.elAddTaskForm.taskDescription,
                    xhr = initAjaxRequest();
                    
            let     taskDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
                    xhrBody = '';

            let     encodedNewTask = {
                        importance: encodeURIComponent(this.elAddTaskForm.taskImportance.value),
                        date: encodeURIComponent(taskDate),
                        status: encodeURIComponent('0')
                    };

            if(taskName.value !== '') {

                encodedNewTask.tache = encodeURIComponent(taskName.value);
                taskDescription.value === '' ? encodedNewTask.description = encodeURIComponent('Aucune description disponible') : encodedNewTask.description = encodeURIComponent(taskDescription.value);

                for(const encodedNewTaskProp in encodedNewTask) {
                    xhrBody += `${encodedNewTaskProp}=${encodedNewTask[encodedNewTaskProp]}&`;
                } 
                xhrBody += `action=add`;

                xhr.send(xhrBody);
                xhr.onload = function() {
                    if(xhr.status !== 200) throw new Error(`Erreur: ${xhr.status}: ${xhr.statusText}`);
                    else {
                        this.oTasksList.displayTasks(this.oTasksList.criteriaSelected);
                    }
                }.bind(this);
                taskName.value = '';
                taskDescription.value = '';
                errMsg.innerHTML = '';
            }
            else errMsg.innerHTML = 'Veuillez renseigner un nom pour la nouvelle tâche';
        }.bind(this));
        /**
         * Méthode qui initialise les comportements du formulaire
         */
        _initForm.set(this, function() {
            const   elAddBtn = this.elAddTaskForm.addTaskBtn,
                    elSelectSort = this.elSortTasksForm.elSelectSort;

            elAddBtn.addEventListener('click', function(evt) {
                evt.preventDefault();
                this.addTask();

            }.bind(this));

            elSelectSort.addEventListener('change', function() {
                this.oTasksList.criteriaSelected = this.elSortTasksForm.elSelectSort.value;
                this.oTasksList.displayTasks(this.oTasksList.criteriaSelected);
            }.bind(this))
        }.bind(this));

        // Initialisation du formulaire à l'instanciation
        this.initForm();
    }

    get elAddTaskForm() {
        return _elAddTaskForm.get(this);
    }

    get elSortTasksForm() {
        return _elSortTasksForm.get(this);
    }

    get oTasksList() {
        return _oTasksList.get(this);
    }

    get addTask() {
        return _addTask.get(this);
    }

    get initForm() {
        return _initForm.get(this);
    }
}