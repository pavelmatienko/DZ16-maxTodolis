const listTodosElement = document.querySelector('.js-my-List-Todo');
const addButtonElement = document.querySelector('.js-button');
const actionFormElement = document.forms.action;

init();

function init() {
    getTodos();
    createAddActionEventListener();
    createDeleteActionEventListener();
    createActionCompleteEventListener();
}

//EVENT LISTENERS

function createAddActionEventListener() {
    addButtonElement.addEventListener('click', () => {
        createAction();
    })
}

function createDeleteActionEventListener() {
    listTodosElement.addEventListener('click', (event) => {
        if(event.target.classList.contains('js-action-delete')){
            deleteAction(event);
        }
    })
}

function createActionCompleteEventListener() {
    listTodosElement.addEventListener('click', (event) => {
        if(event.target.classList.contains('js-action')){
            event.target.style.background = '#00ff00';
        }
    })
}

// LOGIC

function getTodos() {
    const promise = sendGetTodosRequest();
    promise.then((todos) => {
        renderTodos(todos);
    })
}

function createAction() {
    const action = getActionFormData();
    const promise = sendPostActionRequest(action);
    promise.then(action =>{
        cleanForm();
        renderAction(action);
    });
}

function deleteAction(event) {
    const parentTableRow = event.target.closest('li');
    const id = parentTableRow.dataset.id;
    const promise = sendDeleteActionRequest(id);

    promise.then(() => {
        const tableRow = listTodosElement.querySelector(`li[data-id="${id}"]`);
        tableRow.remove();
    })
}

// REQUESTS

function sendGetTodosRequest() {
    return fetch('https://jsonplaceholder.typicode.com/todos').then((response) => response.json());
}

function sendPostActionRequest(action) {
    return fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(action),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((response) => response.json())
}

function sendDeleteActionRequest(id) {
    return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE',
    });
}

// RENDER

function renderTodos(todos) {
    const tableRows = todos.map(action => getTableRow(action));
    listTodosElement.innerHTML = tableRows.join('');
}

function renderAction(action) {
    const tableRow = getTableRow(action)
    listTodosElement.insertAdjacentHTML('afterbegin', tableRow);
}

function getTableRow(action) {
    return`
        <li data-id="${action.id}" class ="js-action">${action.title}<i class="far fa-trash-alt action js-action-delete"></i></li>
    `;
}

//FORM UTILS

function getActionFormData() {
    const formData = new FormData(actionFormElement);

    return {
        title: formData.get('title'),
    }
}

function cleanForm() {
    actionFormElement.reset();
}
