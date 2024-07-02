// Element selections
const inputTask = document.querySelector('#textarea')
const todoForm = document.querySelector('.textarea__task')
const addTaskBtn = document.querySelector('.add__task')
const todoList = document.querySelector('.todo__list')
const editTaskForm = document.querySelector('.edit__form')
const cancelBtn = document.querySelector('.cancel-btn')
const addEdit = document.querySelector('.add__edit')
const inputSearch = document.querySelector('#input__search')
const selectFilter = document.querySelector('#select__filter')
let currentTodoTitle = null;

// filter object functions
const filterFunctions = {
    all: (task) => true,
    done: (task) => task.classList.contains('done'),
    todo: (task) => !task.classList.contains('done')
}

// Functions
const saveTodo = (text) => {
    const todo = document.createElement('div')
    todo.classList.add('todo')

    const todoTitle = document.createElement('h3')
    todoTitle.innerText = text
    todo.appendChild(todoTitle)

    const todoListDiv = document.createElement('div')
    todoListDiv.classList.add('task__buttons')
    todo.appendChild(todoListDiv)

    const doneBtn = document.createElement('button')
    doneBtn.classList.add('complete-task')
    doneBtn.innerHTML = '<i class="bi bi-check-circle"></i>'
    todoListDiv.appendChild(doneBtn)

    const editBtn = document.createElement('button')
    editBtn.classList.add('edit-task')
    editBtn.innerHTML = '<i class="bi bi-pencil"></i>'
    todoListDiv.appendChild(editBtn)

    const removeBtn = document.createElement('button')
    removeBtn.classList.add('remove-task')
    removeBtn.innerHTML = '<i class="bi bi-trash"></i>'
    todoListDiv.appendChild(removeBtn)

    todoList.appendChild(todo)

    inputTask.value = ''
    inputTask.focus()
}

const toggleForm = () => {
    editTaskForm.classList.toggle('hide')
    todoForm.classList.toggle('hide')
    todoList.classList.toggle('hide')
}

const updateTodo = () => {
    const inputEdit = document.querySelector('.input__edit').value
    if (currentTodoTitle) {
        currentTodoTitle.innerText = inputEdit
    }
    toggleForm()

    updateLocalStorage()
}

const filterTasks = () => {
    const searchTerm = inputSearch.value.toLowerCase()
    const tasks = document.querySelectorAll('.todo')

    tasks.forEach(task => {
        const taskText = task.querySelector('h3').innerText.toLowerCase()
        task.style.display = taskText.includes(searchTerm) ? 'flex' : 'none'
    })
}

const filterByStatus = () => {
    const filterValue = selectFilter.value
    const tasks = document.querySelectorAll('.todo')
    const filterFunction = filterFunctions[filterValue]

    tasks.forEach(task => {
        task.style.display = filterFunction(task) ? 'flex' : 'none'
    })
}

const updateLocalStorage = () => {
    const tasks = []
    document.querySelectorAll('.todo').forEach( task => {
        tasks.push({
            text: task.querySelector('h3').innerText,
            done: task.classList.contains('done')
        })
    })
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []
    tasks.forEach(task => saveTodo(task.text, task.done))
}




// Events
addTaskBtn.addEventListener('click', () => {
    const inputTaskValue = inputTask.value
    if (inputTaskValue) {
        saveTodo(inputTaskValue)
        filterByStatus()
        updateLocalStorage()
    }
})

document.addEventListener('click', (e) => {
    const targetElComplete = e.target.closest('.complete-task')
    if (targetElComplete) {
        const task = targetElComplete.closest('.todo')
        task.classList.toggle('done')
        updateLocalStorage()
        filterByStatus()
    }

    const targetElRemove = e.target.closest('.remove-task')
    if (targetElRemove) {
        const task = targetElRemove.closest('.todo')
        task.remove()
        updateLocalStorage()
        filterByStatus()
    }

    const targetElEdit = e.target.closest('.edit-task')
    if (targetElEdit) {
        const task = targetElEdit.closest('.todo')
        currentTodoTitle = task.querySelector('h3')
        document.querySelector('.input__edit').value = currentTodoTitle.innerText
        toggleForm()
    }
})

cancelBtn.addEventListener('click', () => {
    toggleForm()
})

addEdit.addEventListener('click', updateTodo)
inputSearch.addEventListener('input', filterTasks)
selectFilter.addEventListener('change', filterByStatus)
document.addEventListener('DOMContentLoaded', loadTasks)