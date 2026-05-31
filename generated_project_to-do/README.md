# SimpleTodoApp

## Description
SimpleTodoApp is a lightweight, browser‑based to‑do list application. It lets users quickly add, edit, complete, and delete tasks, with all data persisted in the browser's **LocalStorage**. The app is built with plain HTML, CSS, and JavaScript—no external dependencies—making it easy to run and extend.

---

## Tech Stack
- **HTML** – Structure of the application.
- **CSS** – Styling and responsive layout.
- **JavaScript** – Core functionality, event handling, and LocalStorage persistence.

---

## Features
1. **Add tasks** – Type a task and press **Enter**.
2. **Edit tasks** – Click the edit icon, modify the text, and press **Enter** to save.
3. **Mark as complete** – Click the checkbox to toggle completion status.
4. **Delete tasks** – Click the trash icon to remove a task.
5. **Filter view** – Show All, Active, or Completed tasks.
6. **Clear completed** – Remove all completed tasks with a single click.

- **Responsive design** – Works well on mobile, tablet, and desktop screens.
- **Keyboard shortcuts** –
  - **Enter** – Add a new task (when the input is focused) or save an edited task.
  - **Ctrl + Enter** – Focus the task input field.
  - **Esc** – Cancel editing of a task.

---

## Installation / Usage
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/simple-todo-app.git
   cd simple-todo-app
   ```
2. **Open the app**
   - Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari, etc.).
3. **No build step required** – The app runs directly from the static files.

---

## File Overview
| File | Purpose |
|------|---------|
| `index.html` | The main HTML page. It defines the structure, includes the stylesheet and JavaScript, and provides the UI elements (input, task list, filters). |
| `styles.css` | All styling for the app, including layout, colors, and responsive breakpoints. |
| `app.js` | Implements the core logic: handling user input, managing the task list, persisting data to LocalStorage, and updating the DOM. |

---

## Keyboard Shortcuts
- **Enter** – When the input field is focused, pressing **Enter** adds a new task. While editing a task, **Enter** saves the changes.
- **Ctrl + Enter** – Quickly focuses the task input field from anywhere on the page.
- **Esc** – Cancels the current edit operation and restores the original task text.

---

## LocalStorage Persistence
Tasks are stored in the browser's **LocalStorage** under the key `tasks`. This means:
- All added, edited, completed, and deleted tasks are saved automatically.
- The task list persists across page reloads and browser restarts.
- Clearing the browser's site data will remove the saved tasks.

---

## Contribution Guidelines *(optional)*
1. **Fork** the repository and create a new branch for your feature or bug fix.
2. **Run linting** (if you add lint configuration later) with `npm run lint` or your preferred tool.
3. Ensure the app still works by opening `index.html` after your changes.
4. Submit a **Pull Request** with a clear description of what was changed and why.

---

## License
[MIT License](LICENSE) – *Replace with the appropriate license file when added.*
