# TaskFlow

TaskFlow is a responsive MERN task manager. Users can create an account, manage their own tasks, search and filter tasks, and review a dashboard of task totals and recent activity.

## Features

- Account registration and login with bcrypt password hashing and JWT authentication.
- User-scoped task creation, viewing, editing, and deletion.
- Task title, description, status, priority, and optional due date.
- Title search, status and priority filters, and newest/due-date sorting.
- Dashboard task counts and up to five recent tasks.
- Responsive React interface with loading, empty, validation, and API error states.

## Requirements

- Node.js 20.19+ or 22.12+.
- npm.
- A MongoDB instance, local or hosted.

## Run locally

1. Install backend dependencies:

   ```powershell
   cd backend
   npm install
   Copy-Item .env.example .env
   ```

2. Set `MONGO_URI` to your MongoDB connection string and replace `JWT_SECRET` with a long, random secret in `backend/.env`.

3. Start the API in the `backend` directory:

   ```powershell
   npm run dev
   ```

   The API listens on port `5000` by default. `GET http://localhost:5000/` is a health check.

4. In a second terminal, install and configure the frontend:

   ```powershell
   cd frontend
   npm install
   Copy-Item .env.example .env
   ```

   Set `VITE_API_URL` in `frontend/.env` if the API is not at `http://localhost:5000/api`.

5. Start the frontend:

   ```powershell
   npm run dev
   ```

   Open the local URL printed by Vite.

Do not commit `.env` files or use production secrets in local configuration. Example files contain placeholders only.

## Environment variables

| Variable | Location | Purpose |
|---|---|---|
| `PORT` | `backend/.env` | API port; defaults to `5000`. |
| `MONGO_URI` | `backend/.env` | MongoDB connection URI. |
| `JWT_SECRET` | `backend/.env` | Secret used to sign and verify JWTs. Set a unique, high-entropy value. |
| `VITE_API_URL` | `frontend/.env` | API base URL, including `/api`; defaults to `http://localhost:5000/api`. |

## API

All request and response bodies use JSON. Protected endpoints require `Authorization: Bearer <token>`. User identity is taken from the verified token; clients cannot select a task owner.

| Method | Path | Auth | Purpose |
|---|---|---:|---|
| `GET` | `/` | No | API health check. |
| `POST` | `/api/auth/register` | No | Register with `{ "name", "email", "password" }`; returns a token and user. |
| `POST` | `/api/auth/login` | No | Authenticate with `{ "email", "password" }`; returns a token and user. |
| `GET` | `/api/tasks` | Yes | List the caller's tasks. Optional query parameters: `search`, `status` (`todo`, `in-progress`, `completed`), `priority` (`low`, `medium`, `high`), `sort` (`newest`, `dueDate`). |
| `POST` | `/api/tasks` | Yes | Create a task with `title` and optional `description`, `status`, `priority`, and `dueDate`. |
| `GET` | `/api/tasks/:id` | Yes | Get one of the caller's tasks. |
| `PATCH` | `/api/tasks/:id` | Yes | Update one or more editable task fields. |
| `DELETE` | `/api/tasks/:id` | Yes | Delete one of the caller's tasks. |
| `GET` | `/api/tasks/dashboard` | Yes | Return the caller's task counts and recent tasks. |

Task status values are `todo`, `in-progress`, and `completed`; priority values are `low`, `medium`, and `high`. Invalid request data returns a `400`, missing/invalid authentication returns a `401`, and attempts to access a task that is not owned by the caller return `404`.

## Checks

Run backend model validation tests:

```powershell
cd backend
npm test
```

Run frontend lint and production build:

```powershell
cd frontend
npm run lint
npm run build
```

See [docs/testing.md](./docs/testing.md) for test cases, manual integration test steps, known limitations, and the demo-evidence checklist.

## Project layout

```text
backend/    Express API, Mongoose models, auth middleware, controllers, and routes
frontend/   React and Tailwind application
docs/       Testing notes and submission evidence checklist
```

## Demo and screenshots

The repository does not include a recorded walkthrough or screenshots. Before submission, run the app with a working MongoDB connection, capture 3–5 genuine screenshots (sign-up/login, dashboard, filtered task list, and create/edit form), and record a 3–5 minute walkthrough or provide a live demo. Do not use mock screenshots as proof of working flows.
