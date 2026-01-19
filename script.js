document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const totalStats = document.getElementById('total-stats');
    const pendingStats = document.getElementById('pending-stats');
    const completedStats = document.getElementById('completed-stats');

    let tasks = loadFromLocalStorage();

    function toggleComplete(id) {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveToLocalStorage();
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveToLocalStorage();
        renderTasks();
    }

    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = total - completed;

        totalStats.textContent = `Total: ${total}`;
        pendingStats.textContent = `Pending: ${pending}`;
        completedStats.textContent = `Completed: ${completed}`;
    }

    function saveToLocalStorage() {
        localStorage.setItem('protask_tasks', JSON.stringify(tasks));
    }

    function loadFromLocalStorage() {
        const stored = localStorage.getItem('protask_tasks');
        return stored ? JSON.parse(stored) : [];
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
        updateStats();
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
        saveToLocalStorage();
        renderTasks();
    }

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTask();
    });

    renderTasks();
});
