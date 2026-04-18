# Employee Directory

Full-stack Employee Directory web application built with React and Express. Users can browse, search, filter, paginate, add, edit, and delete employee records backed by a JSON file datastore for zero-configuration local development.

**Suggested GitHub "About" description** (paste under repository **Settings → General → Description** if you want it on the repo home page):

`Full-stack employee directory: React + Tailwind UI, Express REST API, JSON-backed CRUD, debounced search, department filter, and pagination.`

## Prerequisites

- Node.js 18 or newer (includes `npm`)
- Two terminal sessions (one for the API, one for the client)

## Project structure

- `server/` — Express REST API with controllers, routes, models, and error middleware
- `client/` — React single-page application with Tailwind-powered styling

## Setup

### 1. Install API dependencies

```bash
cd server
npm install
```

### 2. Install client dependencies

```bash
cd client
npm install
```

## Environment variables

### Server (`server/.env`)

| Variable        | Description                          | Example                  |
| --------------- | ------------------------------------ | ------------------------ |
| `PORT`          | Port the API listens on              | `5000`                   |
| `CLIENT_ORIGIN` | Allowed browser origin for CORS      | `http://localhost:3000`  |

If `server/.env` is not present (for example after cloning), copy `server/.env.example` to `server/.env` and adjust values if needed.

### Client (`client/.env`)

| Variable                     | Description                     | Example                 |
| ---------------------------- | ------------------------------- | ----------------------- |
| `REACT_APP_API_BASE_URL`     | Base URL for API requests       | `http://localhost:5000` |

If `client/.env` is not present, copy `client/.env.example` to `client/.env` so the React app can read `REACT_APP_API_BASE_URL`.

## Running locally

Start the API first, then launch the client.

```bash
cd server
npm start
```

```bash
cd client
npm start
```

The React development server opens at `http://localhost:3000` by default, and the API listens on `http://localhost:5000` unless `PORT` is changed. Keep both processes running while you work.

## API overview

| Method | Path                 | Description              |
| ------ | -------------------- | ------------------------ |
| `GET`  | `/api/employees`     | List all employees       |
| `GET`  | `/api/employees/:id` | Fetch a single employee  |
| `POST` | `/api/employees`     | Create a new employee    |
| `PUT`  | `/api/employees/:id` | Update an employee       |
| `DELETE` | `/api/employees/:id` | Remove an employee     |
| `GET`  | `/api/health`        | Lightweight health probe |

Employee records are persisted in `server/data/employees.json`.

## Scripts

- `server`: `npm start` — run the Express API with Node
- `client`: `npm start` — run the React development server
- `client`: `npm run build` — create an optimized production build

## Notes

- Email addresses must be unique; duplicates return a `400` response from the API.
- The UI debounces search input by 300 milliseconds and matches on employee name or department in a case-insensitive manner.
- Toast notifications surface success and error feedback for mutations and network issues.
