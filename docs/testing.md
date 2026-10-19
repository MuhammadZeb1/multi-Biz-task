# TaskFlow testing notes

## Automated tests

Run the backend Mongoose schema validation tests:

```powershell
cd backend
npm test
```

These tests validate model constraints without requiring a running MongoDB server. They do not replace API integration tests.

Run frontend checks:

```powershell
cd frontend
npm run lint
npm run build
```

## Manual integration test cases

Run these checks with the backend connected to MongoDB and the frontend running. Record the actual result and environment when executing them; the expected results below are a test plan, not a claim that each browser/API flow has already been run.

| # | Test | Steps | Expected result |
|---|---|---|---|
| 1 | Registration and duplicate email | Register a valid user, then attempt registration again with the same email (case-insensitive). | First request returns `201` with a token; duplicate returns `409`; stored password is hashed. |
| 2 | Login and protected route | Log in with the registered credentials, then request `GET /api/tasks` with and without the returned bearer token. | Valid login returns `200` and a token; authenticated request succeeds; missing token returns `401`. |
| 3 | Task validation and CRUD | Create a valid task, read it, patch its status/priority, then delete it. Also submit a blank title and an invalid status. | Valid operations succeed; invalid create/update data returns `400`; deleted task can no longer be read. |
| 4 | Task ownership | Register a second user and use their token to read, patch, and delete the first user's task ID. | The second user cannot view or modify the first user's task; task endpoints return `404`. |
| 5 | Search, filter, and sort | Create tasks with distinct titles, statuses, priorities, and due dates. Request tasks with `search`, `status`, `priority`, and each supported `sort` value. | Results contain only the signed-in user's matching tasks, with the requested ordering; invalid filter/sort values return `400`. |
| 6 | Dashboard totals and recent tasks | Create tasks across all statuses, then request `GET /api/tasks/dashboard`. | Counts match the current user's tasks and recent tasks are newest-first (up to five). |
| 7 | Responsive and error states | Use the app at phone and desktop widths. Stop the API while viewing task and dashboard pages, then restore it and retry. | Layout remains usable at both widths; loading and error feedback appear; retry recovers when the API is available. |

## Current automated coverage

- Mongoose task schema validation: required title and owner, valid status and priority values, maximum title length, and maximum description length.
- Frontend ESLint and Vite production build.

## Known limitations

- The manual API/UI cases above need to be run and their actual outcomes recorded before submission.
- No automated end-to-end or database-backed API integration tests are currently included.
- JWT logout clears the browser's stored token; the stateless token remains usable until expiration (one day) if copied elsewhere.
- Demo video/live-demo link and 3–5 real application screenshots still need to be added for final submission.
