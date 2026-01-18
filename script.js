document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');

    let tasks = [];

    function toggleComplete(id) {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;

            const checkbox = document.createElement('button');
            checkbox.className = `task-checkbox ${task.completed ? 'checked' : ''}`;
            checkbox.type = 'button';
            checkbox.addEventListener('click', () => toggleComplete(task.id));

            const text = document.createElement('span');
            text.className = 'task-text';
            text.textContent = task.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.type = 'button';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            li.appendChild(checkbox);
            li.appendChild(text);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });

        emptyState.classList.toggle('hidden', tasks.length > 0);
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (!text) return;

        tasks.unshift({
            id: Date.now(),
            text,
            completed: false
        });

        taskInput.value = '';
        renderTasks();
    }

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTask();
    });

    renderTasks();
});
