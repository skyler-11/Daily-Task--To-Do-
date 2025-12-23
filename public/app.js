const API_URL = 'http://localhost:3000/api';
let currentEditingTaskId = null;

// DOM Elements
const taskForm = document.getElementById('taskForm');
const tasksList = document.getElementById('tasksList');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeModal = document.querySelector('.close');
const cancelEditBtn = document.getElementById('cancelEdit');

// Event Listeners
taskForm.addEventListener('submit', handleCreateTask);
editForm.addEventListener('submit', handleUpdateTask);
closeModal.addEventListener('click', closeEditModal);
cancelEditBtn.addEventListener('click', closeEditModal);

// Load tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Fetch all tasks
async function loadTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error('Error loading tasks:', error);
    showError('Failed to load tasks');
  }
}

// Render tasks to DOM
function renderTasks(tasks) {
  if (tasks.length === 0) {
    tasksList.innerHTML = '<p class="empty-state">No tasks yet. Create one above!</p>';
    return;
  }

  tasksList.innerHTML = tasks.map(task => `
    <div class="task-card ${task.isRunning ? 'running' : ''}">
      <div class="task-header">
        <div>
          <h3 class="task-title">${escapeHtml(task.name)}</h3>
          <span class="task-type">${escapeHtml(task.commandType)}</span>
        </div>
      </div>
      
      ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
      
      <div class="task-command">
        <strong>Command:</strong> ${escapeHtml(task.command)}
      </div>
      
      <div class="task-meta">
        <span class="task-status ${task.lastStatus || ''}">
          ${task.lastStatus ? `Last: ${task.lastStatus.toUpperCase()}` : 'Never executed'}
        </span>
        ${task.lastExecutedAt ? `<span>Executed: ${new Date(task.lastExecutedAt).toLocaleDateString()}</span>` : ''}
      </div>
      
      <div class="task-actions">
        <button class="btn btn-small btn-execute" onclick="executeTask('${task.id}')" ${task.isRunning ? 'disabled' : ''}>
          ${task.isRunning ? '⏳ Running...' : '▶ Execute'}
        </button>
        <button class="btn btn-small btn-edit" onclick="openEditModal('${task.id}')">
          ✏️ Edit
        </button>
        <button class="btn btn-small btn-delete" onclick="deleteTask('${task.id}')">
          🗑️ Delete
        </button>
      </div>
    </div>
  `).join('');
}

// Create new task
async function handleCreateTask(e) {
  e.preventDefault();

  const name = document.getElementById('taskName').value.trim();
  const description = document.getElementById('taskDesc').value.trim();
  const commandType = document.getElementById('commandType').value;
  const command = document.getElementById('command').value.trim();

  if (!name || !commandType || !command) {
    showError('Please fill in all required fields');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        commandType,
        command
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    taskForm.reset();
    showSuccess('Task created successfully!');
    loadTasks();
  } catch (error) {
    console.error('Error creating task:', error);
    showError('Failed to create task');
  }
}

// Execute task
async function executeTask(taskId) {
  try {
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = '⏳ Running...';

    const response = await fetch(`${API_URL}/tasks/${taskId}/execute`, {
      method: 'POST'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to execute task');
    }

    showSuccess('Task executed successfully!');
    loadTasks(); // Refresh tasks
  } catch (error) {
    console.error('Error executing task:', error);
    showError(`Execution failed: ${error.message}`);
    loadTasks(); // Refresh to reset button state
  }
}

// Delete task
async function deleteTask(taskId) {
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    showSuccess('Task deleted successfully!');
    loadTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
    showError('Failed to delete task');
  }
}

// Open edit modal
async function openEditModal(taskId) {
  currentEditingTaskId = taskId;

  try {
    const response = await fetch(`${API_URL}/tasks`);
    const tasks = await response.json();
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
      showError('Task not found');
      return;
    }

    document.getElementById('editTaskName').value = task.name;
    document.getElementById('editTaskDesc').value = task.description;
    document.getElementById('editCommandType').value = task.commandType;
    document.getElementById('editCommand').value = task.command;

    editModal.style.display = 'flex';
  } catch (error) {
    console.error('Error loading task:', error);
    showError('Failed to load task');
  }
}

// Close edit modal
function closeEditModal() {
  editModal.style.display = 'none';
  currentEditingTaskId = null;
  editForm.reset();
}

// Update task
async function handleUpdateTask(e) {
  e.preventDefault();

  if (!currentEditingTaskId) return;

  const name = document.getElementById('editTaskName').value.trim();
  const description = document.getElementById('editTaskDesc').value.trim();
  const commandType = document.getElementById('editCommandType').value;
  const command = document.getElementById('editCommand').value.trim();

  if (!name || !commandType || !command) {
    showError('Please fill in all required fields');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks/${currentEditingTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        commandType,
        command
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    closeEditModal();
    showSuccess('Task updated successfully!');
    loadTasks();
  } catch (error) {
    console.error('Error updating task:', error);
    showError('Failed to update task');
  }
}

// Utility functions
function showSuccess(message) {
  alert('✅ ' + message);
}

function showError(message) {
  alert('❌ ' + message);
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
  if (event.target === editModal) {
    closeEditModal();
  }
});
