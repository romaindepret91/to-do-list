'use strict';

/**
 * Initialise la connexion de la requête AJAX
 * @returns nouvelle requête HTTP
 */
export const initAjaxRequest = function() {

    const   xhr = new XMLHttpRequest();
    xhr.open('POST', './requetes/requeteAsync.php');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    return xhr;
}

