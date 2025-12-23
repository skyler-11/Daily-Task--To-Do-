# 🚀 Automation Todo List

A web-based automation task runner that lets you create custom tasks and execute automation processes with a single click. Perfect for automating daily routines, game tasks, or any repetitive processes.

## Features

- **Web-based UI**: Clean, modern interface for managing tasks
- **Task Management**: Create, edit, and delete tasks
- **Multiple Command Types**: Support for PowerShell, Batch, Python scripts, and executables
- **One-Click Execution**: Run any automation task with a single button click
- **Task History**: Track when tasks were last executed and their status
- **Local Storage**: Tasks are saved to persistent storage
- **Real-time Updates**: See task status changes in real-time

## Use Cases

- **Game Automation**: Automate dailies in games (Uma Musume, etc.)
- **System Tasks**: Backup scripts, file organization, system cleanup
- **Work Automation**: Automated reports, data processing, file management
- **Custom Workflows**: Any custom automation process you can create

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup

1. Clone or download this project
2. Navigate to the project directory
3. Install dependencies:
```bash
npm install
```

## Running the Application

Start the server:
```bash
npm start
```

The application will start on `http://localhost:3000`

## Usage

### Creating a Task

1. Open the web interface at `http://localhost:3000`
2. Fill in the task details:
   - **Task Name**: What you want to call this task
   - **Description**: Optional details about what the task does
   - **Command Type**: Select the type of automation
   - **Command/Path**: The command or path to execute

3. Click "Add Task"

### Command Types Explained

- **Application**: Run an executable file (e.g., `C:\Games\UmaMumusume\umamusume.exe`)
- **PowerShell Script**: Run a PowerShell command or script
- **Batch Script**: Run a batch (.bat) file command
- **Python Script**: Run a Python script (file path)

### Executing a Task

1. Find the task in the list
2. Click the "▶ Execute" button
3. Watch for the confirmation message
4. The task runs in the background

### Editing a Task

1. Click the "✏️ Edit" button on any task
2. Modify the details
3. Click "Save Changes"

### Deleting a Task

1. Click the "🗸 Delete" button
2. Confirm the deletion

## Examples

### Example 2: Run a Python Script
- **Name**: Daily Report Generator
- **Command Type**: Python
- **Command**: `C:\Scripts\generate_report.py`

### Example 3: Run a Batch File
- **Name**: Backup System
- **Command Type**: Batch
- **Command**: `C:\Scripts\backup.bat`

### Example 4: PowerShell Command
- **Name**: Clean Temp Files
- **Command Type**: PowerShell
- **Command**: `Remove-Item -Path $env:TEMP\* -Recurse -Force -ErrorAction SilentlyContinue`

## Project Structure

```
.
├── public/
│   ├── index.html       # Main HTML file
│   ├── styles.css       # Styling
│   └── app.js          # Frontend JavaScript
├── data/
│   └── tasks.json      # Stored tasks (created automatically)
├── server.js           # Express server
├── package.json        # Dependencies
└── README.md          # This file
```

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `POST /api/tasks/:id/execute` - Execute a task

## Troubleshooting

### Port already in use
If port 3000 is already in use, you can change it in `server.js`:
```javascript
const PORT = 3001; // Change to a different port
```

### Tasks not executing
- Make sure the command path is correct
- For Python scripts, ensure Python is installed and in your PATH
- Check that batch/PowerShell commands are valid

### Tasks not saving
- Check that the `data` folder exists
- Ensure the application has write permissions to the project directory

## Future Enhancements

- Database integration for larger task collections
- Task scheduling (run at specific times)
- Task dependencies (run task B after task A completes)
- Task logs and history
- User authentication
- Export/import tasks
- Visual script builder

## License

MIT License - Feel free to use and modify!

## Support

For issues or feature requests, please create an issue or contact the developer.
