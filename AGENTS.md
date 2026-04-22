# AGENTS

This document describes the agents used in this project and their roles.

## GitHub Copilot (GPT-4.1)
- Acts as an AI programming assistant within VS Code.
- Automates coding tasks, answers questions, and helps with debugging and refactoring.

## Usage
- Interact with the agent through the Copilot Chat panel in VS Code.
- Request code generation, explanations, or project navigation help.

## Project Overview

Internal management system for Tôn Thép Duy Bảo, built with React 18 + Vite. Migrated from Vue 3.

## Tech Stack

- UI Framework: React 18
- Build Tool: Vite 5
- UI Components: Ant Design 5
- Styling: Tailwind CSS 3
- State Management: Zustand
- Routing: React Router v6
- HTTP Client: Axios
- Charts: Chart.js + react-chartjs-2
- Icons: @iconify/react + @ant-design/icons
- Rich Text Editor: React Quill

## Architecture

The application follows a modular structure:

- `src/api/`: Axios API call functions per domain (e.g., `authApi.js`, `customerApi.js`)
- `src/stores/`: Zustand state stores per domain (e.g., `auth.js`, `customer.js`)
- `src/components/`: Shared components, including modals, sections, and common UI
- `src/views/`: Page components organized by feature (e.g., `Customer/`, `Invoice/`)
- `src/composables/`: Utility hooks (e.g., `cookie.js`, `message.js`)
- `src/modules/`: Constants, table definitions, menu, and utilities

## Development Workflow

- Install dependencies: `npm install`
- Configure environment: Create `.env` with `VITE_BASE_API_URL=http://localhost:7700/ttdb/api` and `VITE_S3_URL=https://your-s3-bucket-url`
- Run development server: `npm run dev` (available at http://localhost:7900)
- Build for production: `npm run build`
- Preview production build: `npm run preview`

Prerequisites: Node.js >= 18, Backend API at http://localhost:7700

## Coding Conventions

- **State Management**: Use Zustand stores for global state. Import and use stores from `src/stores/`. Example: `import { useAuthStore } from '../stores/auth'`
- **API Calls**: Centralize API logic in `src/api/`. Use the provided functions instead of direct Axios calls. Example: `import { login } from '../api/authApi'`
- **Components**: Use Ant Design components for consistency. Custom components in `src/components/`
- **Styling**: Apply Tailwind CSS classes. Custom styles in `src/assets/main.css`
- **Routing**: Define routes in `src/views/` with React Router v6
- **File Naming**: Use PascalCase for components (e.g., `CustomerTable.jsx`), camelCase for utilities (e.g., `formRule.js`)

---

*Last updated: April 22, 2026*