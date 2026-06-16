const API_URL = window.location.origin + '/todos';let currentFilter = 'all';
// fetch and display all todos
async function loadTodos() {
    const res = await fetch(API_URL);
    const todos = await res.json();
    const list = document.getElementById('todoList');

    // counter always uses all todos
    const pending = todos.filter(todo => !todo.completed).length;
    document.getElementById('pendingCount').textContent = pending;

    // filter based on current selection
    const filtered = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">✓</div>
                <p>All caught up!</p>
                <span>Add a todo above to get started</span>
            </div>
        `;
        return;
    }

    list.innerHTML = filtered.map(todo => `
        <div class="todo-card ${todo.completed ? 'completed' : ''}" id="todo-${todo.id}">
            <input 
                type="checkbox" 
                class="checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleComplete(${todo.id}, '${todo.title}', '${todo.description || ''}', this.checked)"
            />
            <div class="todo-content">
                <div class="todo-title" 
                    onclick="startEdit(${todo.id}, '${todo.title}', '${todo.description || ''}', ${todo.completed})"
                    title="Click to edit">
                    ${todo.title}
                </div>
                ${todo.description ? `<div class="todo-desc">${todo.description}</div>` : ''}
                <div class="todo-date">${new Date(todo.created_at).toLocaleDateString()}</div>
            </div>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">✕</button>
        </div>
    `).join('');
}
function setFilter(filter) {
    currentFilter = filter;
    
    // update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadTodos();
}

// add a new todo
async function addTodo() {
    const title = document.getElementById('titleInput').value;
    const description = document.getElementById('descInput').value;

    if (!title.trim()) {
        alert('Please enter a title!');
        return;
    }

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
    });

    document.getElementById('titleInput').value = '';
    document.getElementById('descInput').value = '';
    loadTodos();
}

// toggle completed status
async function toggleComplete(id, title, description, completed) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, completed })
    });
    loadTodos();
}

// delete a todo
async function deleteTodo(id) {
    const card = document.getElementById(`todo-${id}`);
    card.classList.add('removing');
    setTimeout(async () => {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadTodos();
    }, 300);
}

// turn todo into editable inputs
function startEdit(id, title, description, completed) {
    const card = document.getElementById(`todo-${id}`);
    card.innerHTML = `
        <div class="edit-form">
            <input type="text" class="edit-title" value="${title}" />
            <textarea class="edit-desc">${description}</textarea>
            <div class="edit-buttons">
                <button class="save-btn" onclick="saveEdit(${id}, ${completed})">Save</button>
                <button class="cancel-btn" onclick="loadTodos()">Cancel</button>
            </div>
        </div>
    `;
}

// save the edited todo
async function saveEdit(id, completed) {
    const title = document.querySelector('.edit-title').value;
    const description = document.querySelector('.edit-desc').value;

    if (!title.trim()) {
        alert('Title cannot be empty!');
        return;
    }

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, completed })
    });

    loadTodos();
}

// add todo on button click
document.getElementById('addBtn').addEventListener('click', addTodo);

// add todo on Enter key
document.getElementById('titleInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

// load todos on page start
loadTodos();