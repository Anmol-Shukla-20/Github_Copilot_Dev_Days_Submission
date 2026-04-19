# Smart Assignment Tracker

A full-stack web app that helps students sync Google Classroom assignments, prioritize tasks by deadlines, track progress, and receive smart reminders.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: Google OAuth 2.0
- Integrations: Google Classroom API
- Notifications: Twilio WhatsApp API (configured in this build)
- Scheduling: node-cron

## Features

- Google Sign-In with profile persistence in MongoDB
- Google Classroom sync for courses and assignments
- Assignment dashboard with:
  - List view
  - Calendar view
  - Status updates (Pending/In Progress/Completed)
  - Timeline status display (Pending/Submitted/Late)
- Smart priority logic:
  - `< 1 day` => HIGH
  - `1-3 days` => MEDIUM
  - `> 3 days` => LOW
- Manual assignment creation
- Filters and sorting:
  - Filter by subject, priority, status
  - Sort by due date or priority
- Reminder jobs:
  - 1 day before deadline
  - 2 hours before deadline
- Sidebar navigation: Dashboard, Calendar, Settings
- Responsive modern UI with optional dark mode
- Progress tracker and missed deadline section

## Project Structure

```
client/
server/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
```

## Setup

### 1. Clone and install

From the project root:

```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 2. Configure environment variables

Create these files from examples:

- `server/.env` from `server/.env.example`
- `client/.env` from `client/.env.example`

### 3. Configure Google OAuth and Classroom

- Create Google OAuth credentials in Google Cloud Console.
- Enable APIs:
  - Google Classroom API
- Add authorized JavaScript origins:
  - `http://localhost:5173`
- Use the same Client ID in both:
  - `server/.env` -> `GOOGLE_CLIENT_ID`
  - `client/.env` -> `VITE_GOOGLE_CLIENT_ID`

### 4. Configure Twilio (WhatsApp reminders)

In `server/.env`:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`

In Settings page, save user phone as WhatsApp address (for example `whatsapp:+1234567890`).

### 5. Run locally

From root:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## REST API

- `POST /auth/google`
- `PUT /auth/profile`
- `GET /assignments`
- `POST /assignments/fetch`
- `POST /assignments/add`
- `PUT /assignments/update/:id`
- `DELETE /assignments/delete/:id`

## Error Handling and Loading States

- Backend returns status-specific JSON errors.
- Frontend shows loading spinners and error messages for auth, sync, and data fetch actions.

## Notes

- Google Classroom sync requires user consent for classroom scopes.
- Reminder cron runs every 15 minutes and dispatches notification windows for 1-day and 2-hour thresholds.
- Twilio reminder sending is skipped automatically when Twilio env variables are missing.
