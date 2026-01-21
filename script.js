document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date-input');
    const prioritySelect = document.getElementById('priority-select');
    const searchInput = document.getElementById('search-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const totalStats = document.getElementById('total-stats');
    const pendingStats = document.getElementById('pending-stats');
    const completedStats = document.getElementById('completed-stats');
    const themeToggle = document.getElementById('theme-toggle');
    const suggestionsBox = document.getElementById('suggestions-box');
    const suggestionsList = document.getElementById('suggestions-list');

    let tasks = loadFromLocalStorage();
    let currentFilter = 'all';
    let searchQuery = '';

    const SUGGESTED_TASKS = [
        "Drink Water", "Exercise", "Read 10 pages", "Meditate", 
        "Check Email", "Plan Tomorrow", "Meeting", "Project Review"
    ];

    // Theme Management
    const initTheme = () => {
        const savedTheme = localStorage.getItem('protask_theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.querySelector('.icon').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    };

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('protask_theme', newTheme);
        themeToggle.querySelector('.icon').textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });

    initTheme();

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

        const filteredTasks = tasks.filter(task => {
            const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = currentFilter === 'all' ||
                (currentFilter === 'pending' && !task.completed) ||
                (currentFilter === 'completed' && task.completed);
            return matchesSearch && matchesFilter;
        });

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;

            const checkbox = document.createElement('button');
            checkbox.className = `task-checkbox ${task.completed ? 'checked' : ''}`;
            checkbox.type = 'button';
            checkbox.addEventListener('click', () => toggleComplete(task.id));

            const text = document.createElement('span');
            text.className = 'task-text';
            text.textContent = task.text;

            const meta = document.createElement('div');
            meta.className = 'task-meta';

            if (task.dueDate) {
                const due = document.createElement('span');
                due.className = 'task-due';
                due.textContent = `Due ${task.dueDate}`;
                meta.appendChild(due);
            }

            const badge = document.createElement('span');
            badge.className = `priority-badge priority-${task.priority}`;
            badge.textContent = task.priority;
            meta.appendChild(badge);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.type = 'button';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            li.appendChild(checkbox);
            li.appendChild(text);
            const content = document.createElement('div');
            content.className = 'task-content';
            content.appendChild(text);
            content.appendChild(meta);

            li.appendChild(content);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });

        emptyState.classList.toggle('hidden', filteredTasks.length > 0);
        updateStats();
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (!text) return;

        tasks.unshift({
            id: Date.now(),
            text,
            completed: false,
            dueDate: dueDateInput.value || '',
            priority: prioritySelect.value
        });

        taskInput.value = '';
        dueDateInput.value = '';
        saveToLocalStorage();
        renderTasks();
    }

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTask();
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderTasks();

        if (searchQuery.length > 0) {
            const matches = SUGGESTED_TASKS.filter(t => 
                t.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            if (matches.length > 0) {
                suggestionsList.innerHTML = '';
                matches.forEach(match => {
                    const chip = document.createElement('div');
                    chip.className = 'suggestion-chip';
                    chip.textContent = match;
                    chip.onclick = () => {
                        taskInput.value = match;
                        searchInput.value = '';
                        searchQuery = '';
                        suggestionsBox.classList.add('hidden');
                        renderTasks();
                        taskInput.focus();
                    };
                    suggestionsList.appendChild(chip);
                });
                suggestionsBox.classList.remove('hidden');
            } else {
                suggestionsBox.classList.add('hidden');
            }
        } else {
            suggestionsBox.classList.add('hidden');
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!suggestionsBox.contains(e.target) && e.target !== searchInput) {
            suggestionsBox.classList.add('hidden');
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        saveToLocalStorage();
        renderTasks();
    });

    renderTasks();
});
