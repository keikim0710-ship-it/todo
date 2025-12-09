const form = document.getElementById('todoForm');
const input = document.getElementById('todoInput');
const list = document.getElementById('todoList');
const statusLabel = document.getElementById('statusLabel');
const countLabel = document.getElementById('todoCount');

const STORAGE_KEY = 'my_todos_v1';

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) {
        input.focus();
        return;
    }

    const todos = loadTodos();
    todos.unshift({
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        text,
        done: false,
        createdAt: Date.now(),
    });
    saveTodos(todos);
    render(todos);
    form.reset();
    input.focus();
});

function loadTodos() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function toggleTodo(id) {
    const todos = loadTodos();
    const next = todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
    );
    saveTodos(next);
    render(next);
}

function removeTodo(id) {
    const todos = loadTodos();
    const next = todos.filter((todo) => todo.id !== id);
    saveTodos(next);
    render(next);
}

function createTodoElement(todo) {
    const item = document.createElement('div');
    item.className = `todo ${todo.done ? 'todo--done' : ''}`;

    const left = document.createElement('div');
    left.className = 'todo__left';

    const checkbox = document.createElement('button');
    checkbox.type = 'button';
    checkbox.className = `check ${todo.done ? 'check--active' : ''}`;
    checkbox.setAttribute('aria-label', todo.done ? '완료 취소' : '완료 처리');
    checkbox.addEventListener('click', () => toggleTodo(todo.id));

    const text = document.createElement('div');
    text.className = 'todo__text';
    text.textContent = todo.text;

    left.append(checkbox, text);

    const actions = document.createElement('div');
    actions.className = 'todo__actions';

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'ghost-btn';
    deleteBtn.textContent = '삭제';
    deleteBtn.addEventListener('click', () => removeTodo(todo.id));

    actions.append(deleteBtn);
    item.append(left, actions);
    return item;
}

function render(todos) {
    list.innerHTML = '';

    if (!todos.length) {
        statusLabel.textContent = '아직 할일이 없습니다.';
        countLabel.textContent = '0';
        list.innerHTML = `<div class="empty">오늘 해야 할 일을 추가해 보세요.</div>`;
        return;
    }

    const doneCount = todos.filter((todo) => todo.done).length;
    const remaining = todos.length - doneCount;

    countLabel.textContent = todos.length;
    statusLabel.textContent = `${remaining}개 남음 · ${doneCount}개 완료`;

    todos.forEach((todo) => {
        const element = createTodoElement(todo);
        list.appendChild(element);
    });
}

render(loadTodos());