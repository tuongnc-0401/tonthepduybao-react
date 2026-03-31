# Tôn Thép Duy Bảo — Admin Panel

Internal management system for **Tôn Thép Duy Bảo**, built with React 18 + Vite. Migrated from Vue 3.

## Tech Stack

| Layer | Library |
|---|---|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| UI Components | Ant Design 5 |
| Styling | Tailwind CSS 3 |
| State Management | Zustand |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Charts | Chart.js + react-chartjs-2 |
| Icons | @iconify/react + @ant-design/icons |
| Rich Text Editor | React Quill |

## Features

- **Authentication** — Login with branch selection, JWT token via cookie
- **Dashboard** — Revenue & profit analytics charts by month/branch
- **Debt Management** — Create, edit, view debt records (full bar / screw type)
- **Invoice Management** — Create/edit invoices, shipping address management, print invoices
- **Products** — Product list, categories, detail view
- **Properties** — Property groups management
- **Customers** — Customer list and profiles
- **Branches & Users** — Branch and user account management
- **Site Management** — Contact list, partners, product categories, site content settings (banners, about us, etc.)

## Prerequisites

- Node.js >= 18
- Backend API running at `http://localhost:7700`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
VITE_BASE_API_URL=http://localhost:7700/ttdb/api
VITE_S3_URL=https://your-s3-bucket-url
```

### 3. Run development server

```bash
npm run dev
```

App will be available at **http://localhost:7900**

### 4. Build for production

```bash
npm run build
```

Output will be in the `dist/` folder.

### 5. Preview production build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/              # Axios API call functions per domain
├── assets/           # Global CSS
├── components/       # Shared components (modals, sections, common UI)
├── composables/      # Utility hooks (cookie, message, moment)
├── config/           # Axios instance & interceptors
├── layouts/          # AuthLayout (route guard wrapper)
├── modules/          # Constants, table column definitions, menu, utils
├── stores/           # Zustand state stores per domain
└── views/            # Page components
    ├── Branch/
    ├── Customer/
    ├── Debt/
    ├── Home/
    ├── Invoice/
    ├── Login.jsx
    ├── Product/
    ├── Profile/
    ├── Property/
    ├── SiteManagement/
    └── User/
public/
└── img/              # Static images (logo, fallback, icons)
```

## API

Backend base URL is configured via `VITE_BASE_API_URL`. See `.env` setup above.

CORS must allow `http://localhost:7900` for local development.
