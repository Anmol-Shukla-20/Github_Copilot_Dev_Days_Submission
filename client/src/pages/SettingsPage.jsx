import { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { syncClassroomAssignments, updateProfile } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("sat_dark") === "true");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("sat_dark", String(darkMode));
  }, [darkMode]);

  const login = useGoogleLogin({
    scope:
      "https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.student-submissions.me.readonly",  // added for tracking assignment status
    onSuccess: async (tokenResponse) => {
      try {
        setSyncing(true);
        const result = await syncClassroomAssignments(tokenResponse.access_token);
        setMessage(`${result.count} assignments synced successfully.`);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to sync assignments");
      } finally {
        setSyncing(false);
      }
    },
    onError: () => setMessage("Google authorization failed")
  });

  const savePhone = async () => {
    try {
      await updateProfile({ phoneNumber });
      setMessage("Phone number saved for reminders.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to save phone number");
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-600">Manage sync and visual preferences.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Google Classroom Sync</h2>
        <p className="mt-1 text-sm text-slate-600">Authorize and import courses and assignments.</p>
        <button
          type="button"
          onClick={() => login()}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Sync Classroom Assignments
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Theme</h2>
        <label className="mt-3 flex items-center gap-3 text-sm text-slate-700">
          <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
          Enable dark mode
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Reminder Contact</h2>
        <p className="mt-1 text-sm text-slate-600">Save WhatsApp number in Twilio format (for example, whatsapp:+1234567890).</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            placeholder="whatsapp:+1234567890"
            className="min-w-[260px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={savePhone}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Save Contact
          </button>
        </div>
      </div>

      {syncing ? <LoadingSpinner label="Syncing assignments..." /> : null}
      {message ? <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{message}</p> : null}
    </section>
  );
};

export default SettingsPage;
