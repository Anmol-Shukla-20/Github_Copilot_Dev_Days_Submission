# Smart Assignment Tracker

**Google ClassRoom Assignment Tracker** application designed to help students stay organized and ahead of their deadlines. By seamlessly syncing with Google Classroom, it provides a centralized dashboard for tracking assignments, managing progress, and receiving timely reminders.

---

## ✨ Key Features

- **🔄 Google Classroom Sync:** Effortlessly import your courses and assignments directly from Google Classroom.
- **📅 Visual Dashboard:** View your tasks in a clean list or an interactive calendar view.
- **⚖️ Smart Priority Logic:** Assignments are automatically categorized by urgency:
  - 🔴 **High Priority:** Due within 24 hours.
  - 🟡 **Medium Priority:** Due within 3 days.
  - 🟢 **Low Priority:** Due in more than 3 days.
- **🔔 Smart Notifications:** Stay on top of your work with automated WhatsApp reminders (via Twilio) sent 1 day and 2 hours before deadlines.
- **📊 Progress Tracking:** Track your submission status (Pending, In Progress, Completed) and monitor missed deadlines.
- **🌙 Modern UI:** A responsive, sleek interface built with Tailwind CSS, featuring an optional Dark Mode.

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite, Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Auth:** Google OAuth 2.0
- **Integrations:** Google Classroom API, Twilio WhatsApp API
- **Scheduling:** node-cron

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies for both the client and server:

```bash
# Install root dependencies
npm install

# Install server & client dependencies
npm run install-all
```

### 2. Environment Setup
Create a `.env` file in both the `/server` and `/client` directories based on the provided `.env.example` files.

**Key Variables Needed:**
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- `MONGODB_URI`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`

### 3. Running the App
Start the development environment (both frontend and backend) with a single command:

```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend:** [http://localhost:5000](http://localhost:5000)

---

## 📁 Project Structure

```text
├── client/          # React frontend (Vite)
├── server/          # Node.js backend (Express)
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # Database schemas
│   │   ├── services/      # External API integrations (Google, Twilio)
│   │   └── routes/        # API endpoints
└── README.md
```

---

## 📝 Usage Notes
- **Google Consent:** Ensure you grant the necessary permissions for Google Classroom API during sign-in.
- **WhatsApp Reminders:** Ensure your phone number is saved in the Settings page in the correct format (e.g., `whatsapp:+1234567890`).
- **Automation:** The reminder engine runs every 15 minutes to check for upcoming deadlines.

