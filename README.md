
# React Frontend - Hierarchical Department Management

## Overview

This React application provides an intuitive interface for managing hierarchical departments. Features include searching, adding, editing, and deleting nodes within a structured, visual layout. Built with [React Flow](https://reactflow.dev/) for hierarchical visualization and [React Toastify](https://fkhadra.github.io/react-toastify/) for notifications.

## Key Features

- **Hierarchical Visualization**: Automatic layout of department nodes.
- **CRUD Operations**: Create, read, update, and delete nodes.
- **Search**: Search departments by name.
- **Real-time Feedback**: Success/error notifications.

## Tech Stack

- **React** - Core framework
- **React Flow** - Visualization of node hierarchy
- **Axios** - Backend communication
- **Dagre** - Automated node layout
- **React Toastify** - User notifications

## Project Structure

```
├── public
├── src
│   ├── components            # Custom components (Toolbar, CustomNode, Modals)
│   ├── utils                 # Graph layout utilities
│   ├── App.js                # Main component
│   └── index.js              # Entry point
├── .env                      # Environment variables (e.g., API token)
├── README.md                 # Documentation
└── package.json              # Dependencies and scripts
```

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file with your backend token:

```env
REACT_APP_BACKEND_SECRET=your_token_here
```

### 4. Start the Application

```bash
npm start
```

Access the app at `http://localhost:3000`.

## Usage

- **Add Node**: Click “Add Node” in the toolbar for a new root node.
- **Search**: Enter a node name in the search bar to find specific departments.
- **Edit/Delete Nodes**: Use icons within nodes to modify or delete them.
- **Add Child Node**: Add child departments using the “Add Child” button on each node.

## Backend Requirements

The following backend endpoints are expected:

- `GET /api/departments/hierarchy` - Fetches department hierarchy.
- `POST /api/departments/create` - Creates a new department.
- `PUT /api/departments/:id/update` - Updates an existing department.
- `DELETE /api/departments/:id/delete` - Deletes a department.

## License

This project is licensed under the MIT License.
