const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Data storage (in-memory, can be replaced with database)
let tasks = [];
const dataFile = path.join(__dirname, 'data', 'tasks.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load tasks from file
function loadTasks() {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, 'utf8');
      tasks = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
    tasks = [];
  }
}

// Save tasks to file
function saveTasks() {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}

// API Routes

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Create new task
app.post('/api/tasks', (req, res) => {
  const { name, description, command, commandType } = req.body;

  if (!name || !command || !commandType) {
    return res.status(400).json({ error: 'Missing required fields: name, command, commandType' });
  }

  const newTask = {
    id: uuidv4(),
    name,
    description: description || '',
    command,
    commandType, // 'powershell', 'batch', 'python', 'application'
    createdAt: new Date().toISOString(),
    isRunning: false
  };

  tasks.push(newTask);
  saveTasks();

  res.status(201).json(newTask);
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, command, commandType } = req.body;

  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (name) task.name = name;
  if (description !== undefined) task.description = description;
  if (command) task.command = command;
  if (commandType) task.commandType = commandType;

  saveTasks();
  res.json(task);
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deletedTask = tasks.splice(index, 1);
  saveTasks();
  res.json(deletedTask[0]);
});

// Execute task
app.post('/api/tasks/:id/execute', (req, res) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Update task status
  task.isRunning = true;
  saveTasks();

  // Execute the command based on type
  executeCommand(task)
    .then(result => {
      task.isRunning = false;
      task.lastExecutedAt = new Date().toISOString();
      task.lastStatus = 'success';
      saveTasks();
      res.json({ success: true, message: 'Task executed successfully', result });
    })
    .catch(error => {
      task.isRunning = false;
      task.lastStatus = 'error';
      saveTasks();
      res.status(500).json({ error: error.message });
    });
});

// Execute command based on type
function executeCommand(task) {
  return new Promise((resolve, reject) => {
    let process;

    try {
      switch (task.commandType.toLowerCase()) {
        case 'powershell':
          process = spawn('powershell.exe', ['-Command', task.command], { shell: true });
          break;

        case 'batch':
          process = spawn('cmd.exe', ['/c', task.command], { shell: true });
          break;

        case 'python':
          process = spawn('python', [task.command], { shell: true });
          break;

        case 'application':
          // For launching applications
          process = spawn(task.command, [], { shell: true });
          break;

        default:
          return reject(new Error(`Unknown command type: ${task.commandType}`));
      }

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr, exitCode: code });
        } else {
          reject(new Error(`Process exited with code ${code}: ${stderr}`));
        }
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to execute command: ${error.message}`));
      });

    } catch (error) {
      reject(error);
    }
  });
}

// Start server
loadTasks();
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Automation Todo App is ready!');
});
