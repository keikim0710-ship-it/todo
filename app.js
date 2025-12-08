const input = document.getElementById('todoInput');
const list = document.getElementById('todoList');

const STORAGE_KEY = 'notebook_todos_simple';

// 기존 저장된 데이터 로드
toggleSavedToList();

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim() !== '') {
        addTodo(input.value.trim(), true);
        input.value = '';
    }
});

function addTodo(text, save) {
    const li = document.createElement('li');
    li.className = 'todo-item';

    const span = document.createElement('span');
    span.textContent = text;

    const removeBtn = document.createElement('span');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = '✖';
    removeBtn.title = '삭제';

    removeBtn.addEventListener('click', () => {
        li.remove();
        saveTodos();
    });

    li.appendChild(span);
    li.appendChild(removeBtn);
    list.appendChild(li);

    if (save) saveTodos();
}

function saveTodos() {
    const todos = [...document.querySelectorAll('.todo-item span:first-child')]
        .map((s) => s.textContent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function toggleSavedToList() {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    saved.forEach((t) => addTodo(t, false));
}
