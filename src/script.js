let newTask = document.getElementById('input-task');
let addButton = document.getElementById('add-task-button');
let tasks = document.getElementById('task-list');
let clearButton = document.getElementById('clear-button');
let firstHTML = tasks.innerHTML;

let toDoList = [];
let completedTasks = [];

if(localStorage.getItem('toDo') || localStorage.getItem('completed')) {
    toDoList = JSON.parse(localStorage.getItem('toDo'));
    completedTasks = JSON.parse(localStorage.getItem('completed'))
    displayTasks();
}

addButton.addEventListener('click', function () {
    if (newTask.value !== '') {
        let newToDo = newTask.value;

        console.log(newTask.value);
        toDoList.push(newToDo);
        newTask.value = '';
        displayTasks();
    }
});

clearButton.addEventListener('click', function () {
    toDoList = [];
    completedTasks = [];
    displayTasks();
});


function displayTasks() {
    let newHTML = '';

    for (let index = toDoList.length - 1; index >= 0; index--) {
        newHTML = newHTML + `
           <li>
               <div class="task">
                   <input class="check-as-done__checkbox" type="checkbox" onclick="completeTask(${index})">
                   <span class="task-name">${toDoList[index]}</span>
                   <button class="delete-button" onclick="deleteTask(${index})">X</button>
               </div>
           </li>`
    };

    for (let index = completedTasks.length - 1; index >= 0; index--) {
        newHTML = newHTML + `
           <li>
               <div class="task">
                   <div class="completed">
                       <span>${completedTasks[index]}</span>
                       <button class="checkmark-button" onclick="uncompleteTask(${index})"></button>
                   </div>
               </div>
           </li>`
    };

    localStorage.setItem('toDo', JSON.stringify(toDoList));
    localStorage.setItem('completed', JSON.stringify(completedTasks));
    tasks.innerHTML = firstHTML + newHTML;
}

function completeTask(index) {
    let task = toDoList[index];
    toDoList.splice(index, 1);
    localStorage.removeItem('toDo');
    completedTasks.push(task);
    displayTasks();
}

function deleteTask(index) {
    toDoList.splice(index, 1);
    localStorage.removeItem('toDo');
    displayTasks();
}

function uncompleteTask(index) {
    let task = completedTasks[index];
    completedTasks.splice(index, 1);
    toDoList.push(task);
    displayTasks();
}