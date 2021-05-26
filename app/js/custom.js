const todoForm = document.querySelector('.todo');
const todoList = document.querySelector('.todo__list');
const todoInput = document.querySelector('.todo__field input')
const todoMessage = document.querySelector('.todo__message');

const todos = JSON.parse(localStorage.getItem("todos"));

if (todos) {

    todos.forEach((todo) => {
        addTodo(todo);
    });
}

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTodo();
    getProgress();
});

getProgress();

function addTodo(todo) {
    let todoItem = document.createElement('li');
    let todoText = todoInput.value;

    if (todo) {
        todoText = todo.text;
    }

    if (todo && todo.completed) {
        todoItem.classList.add("_completed");
    }

    if (!todoText.trim() == '') {
        todoItem.innerHTML = `${todoText} <span class="todo__close"></span>`;
        todoItem.classList.add('todo__item');

        todoList.append(todoItem);
        todoInput.value = '';

        removeItem(todoItem);
    }

    updateLS();
    completedItem(todoItem);
}

function updateLS() {
    let todosEl = document.querySelectorAll(".todo__item");
    const todoArr = [];

    todosEl.forEach((todoEl) => {
        todoArr.push({
            text: todoEl.innerText,
            completed: todoEl.classList.contains("_completed"),
        });
    });

    localStorage.setItem("todos", JSON.stringify(todoArr));
}

function completedItem(todoItem) {
    todoItem.addEventListener('click', function () {
        this.classList.toggle('_completed');
        updateLS();
        getProgress()
    })
}

function removeItem(todoItem) {
    todoItem.querySelector('.todo__close').addEventListener('click', function (e) {
        e.preventDefault();
        this.parentNode.remove()
        updateLS();
    })
}

function getProgress() {
    let todosEl = document.querySelectorAll(".todo__item");
    let todosElCompleted = document.querySelectorAll(".todo__item._completed");
    let progressLine = document.querySelector('.todo__progress-line');
    let progressValue = document.querySelector('.todo__progress-value');
    let progressWidth = todosElCompleted.length * 100 / todosEl.length;

    if (todosEl.length === 0) {
        todoMessage.classList.remove('_hidden');
        progressValue.innerHTML = '0% / 100%';
        progressLine.style.width = 0 + '%';
    }

    if (todosEl.length) {
        progressLine.style.width = progressWidth + '%';
        todoMessage.classList.add('_hidden');
        progressValue.innerHTML = + Math.round(progressWidth) + '%' + ' / 100%';
    }

    if (todosElCompleted.length > 0 && progressWidth === 100) {
        setTimeout(function () {
            showModal()
        }, 500)
    }
}

todoMessage.addEventListener('click', function () {
    todoInput.focus();
})

// MODAL

const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
const allModals = document.querySelectorAll('[data-modal]');

function showModal() {
    const modal = document.querySelector('.modal');

    modal.classList.add('_is-active');
    modal.querySelector('.modal__content').addEventListener('click', function (e) {
        e.stopPropagation()
    })
}

modalCloseButtons.forEach(function (item) {
    item.addEventListener('click', function () {
        const modal = document.querySelector('[data-modal]')
        modal.classList.remove('_is-active')
    })
})

allModals.forEach(function (item) {
    item.addEventListener('click', function () {
        this.classList.remove('_is-active');
    })
})
