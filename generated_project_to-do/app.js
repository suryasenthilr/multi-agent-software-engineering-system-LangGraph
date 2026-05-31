// Simple Todo App - Core Logic
// ------------------------------------------------------------
// Data Model
class Task {
  constructor(id, text, completed = false) {
    this.id = id;
    this.text = text;
    this.completed = completed;
  }
}

// Persistence Utilities
function loadTasks() {
  const raw = localStorage.getItem('tasks');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    // Ensure we return an array of Task instances
    return parsed.map(t => new Task(t.id, t.text, t.completed));
  } catch (e) {
    console.error('Failed to parse tasks from localStorage', e);
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Helper to escape HTML (prevent XSS)
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Global state
let currentFilter = 'all';

// Rendering Engine
function renderTasks(filter = 'all') {
  const tasks = loadTasks();
  const listEl = document.getElementById('task-list');
  if (!listEl) return;
  // Clear current list
  listEl.innerHTML = '';

  const filtered = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // all
  });

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;
    if (task.completed) li.classList.add('completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'toggle';
    if (task.completed) checkbox.checked = true;

    const span = document.createElement('span');
    span.className = 'task-text';
    span.innerHTML = escapeHtml(task.text);

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = '✎';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    listEl.appendChild(li);
  });
}

// Add Task Handler
function handleAddTask(event) {
  event.preventDefault();
  const input = document.getElementById('new-task');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const tasks = loadTasks();
  const id = Date.now().toString();
  const newTask = new Task(id, text);
  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks(currentFilter);

  input.value = '';
  input.focus();
}

// Edit Task Inline
function startEditTask(taskItem, task) {
  const span = taskItem.querySelector('.task-text');
  if (!span) return;
  const originalText = task.text;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = originalText;
  input.style.minWidth = '200px';

  // Replace span with input
  taskItem.replaceChild(input, span);
  input.focus();

  // Save helper
  const save = () => {
    const newText = input.value.trim();
    if (newText && newText !== originalText) {
      const tasks = loadTasks();
      const idx = tasks.findIndex(t => t.id === task.id);
      if (idx > -1) {
        tasks[idx].text = newText;
        saveTasks(tasks);
        renderTasks(currentFilter);
      }
    } else {
      // No change – just re‑render to restore original span
      renderTasks(currentFilter);
    }
  };

  const cancel = () => {
    renderTasks(currentFilter);
  };

  // Event listeners for commit / cancel
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      save();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  });
  // If focus leaves the input, treat it as save
  input.addEventListener('blur', save);
}

// Delete Task
function deleteTaskById(id) {
  const tasks = loadTasks();
  const filtered = tasks.filter(t => t.id !== id);
  saveTasks(filtered);
  renderTasks(currentFilter);
}

// Toggle Completion
function toggleTaskCompletion(id, completed) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = completed;
    saveTasks(tasks);
    renderTasks(currentFilter);
  }
}

// Filter Controls
function handleFilterClick(event) {
  const btn = event.target.closest('.filter-btn');
  if (!btn) return;
  const filter = btn.dataset.filter;
  if (!filter) return;
  currentFilter = filter;

  // Update active class on buttons
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  renderTasks(currentFilter);
}

// Global Keyboard Shortcuts
function handleGlobalKeydown(e) {
  const activeEl = document.activeElement;
  // Ctrl+Enter -> focus input
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    const input = document.getElementById('new-task');
    if (input) input.focus();
    return;
  }
  // Esc while editing – handled in edit input itself
  // No extra handling needed here.
}

// Delegated event handling for task list
function handleTaskListClick(event) {
  const taskItem = event.target.closest('.task-item');
  if (!taskItem) return;
  const taskId = taskItem.dataset.id;
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  // Delete
  if (event.target.matches('.delete-btn')) {
    deleteTaskById(taskId);
    return;
  }

  // Edit
  if (event.target.matches('.edit-btn')) {
    startEditTask(taskItem, task);
    return;
  }
}

function handleTaskListChange(event) {
  const taskItem = event.target.closest('.task-item');
  if (!taskItem) return;
  if (!event.target.matches('.toggle')) return;
  const taskId = taskItem.dataset.id;
  const completed = event.target.checked;
  toggleTaskCompletion(taskId, completed);
}

// Initialization
function init() {
  // Form submit
  const form = document.getElementById('task-form');
  if (form) form.addEventListener('submit', handleAddTask);

  // Task list delegation
  const list = document.getElementById('task-list');
  if (list) {
    list.addEventListener('click', handleTaskListClick);
    list.addEventListener('change', handleTaskListChange);
  }

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', handleFilterClick);
  });

  // Global shortcuts
  document.addEventListener('keydown', handleGlobalKeydown);

  // Initial render
  renderTasks(currentFilter);

  // Focus input for quick start
  const input = document.getElementById('new-task');
  if (input) input.focus();
}

// Run init on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Expose for potential external use (optional)
window.Task = Task;
window.loadTasks = loadTasks;
window.saveTasks = saveTasks;
window.renderTasks = renderTasks;
