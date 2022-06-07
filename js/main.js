'use strict';

import { TasksForm } from './TasksForm.js';
import { TasksList } from './TasksList.js';

const   elTasksList = document.querySelector('.tasks-list'),
        elTasksForm = document.querySelector('.tasksForm'),
        myOTasksList = new TasksList(elTasksList);

new TasksForm(elTasksForm, myOTasksList);

location = `#taches/`;

        
