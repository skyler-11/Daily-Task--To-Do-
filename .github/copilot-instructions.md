# Automation Todo List - Development Guidelines

This is a web-based automation task runner application. It consists of:
- **Backend**: Express.js server running on port 3000
- **Frontend**: HTML/CSS/JavaScript web interface
- **Storage**: JSON file-based task storage

## Key Features
- Create, edit, delete tasks
- Execute tasks with custom commands (PowerShell, Batch, Python, Applications)
- Real-time task status updates
- Persistent task storage

## Technology Stack
- Node.js & Express.js
- Vanilla JavaScript frontend
- CSS for styling

## When Making Changes
1. Backend changes go in `server.js`
2. Frontend changes go in `public/app.js` or `public/styles.css`
3. UI changes go in `public/index.html`
4. Keep the API structure stable
5. Test execution of different command types

## Common Tasks
- Adding new command types: Modify the `executeCommand()` function in server.js
- Updating UI: Modify `renderTasks()` in app.js or update HTML/CSS
- Adding API endpoints: Add routes to server.js before the `app.listen()` call
