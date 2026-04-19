import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import AssignmentCard from "../components/AssignmentCard";
import AddAssignmentModal from "../components/AddAssignmentModal";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  addAssignment,
  deleteAssignment,
  fetchAssignments,
  updateAssignment
} from "../services/api";

const DashboardPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [filters, setFilters] = useState({ subject: "", priority: "", status: "", sort: "dueDate" });

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await fetchAssignments(filters);
      setAssignments(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [filters.subject, filters.priority, filters.status, filters.sort]);

  const handleStatusChange = async (id, status) => {
    await updateAssignment(id, { status });
    loadAssignments();
  };

  const handleDelete = async (id) => {
    await deleteAssignment(id);
    loadAssignments();
  };

  const handleAdd = async (form) => {
    try {
      setSaving(true);
      await addAssignment({
        title: form.title,
        subject: form.subject,
        dueDate: new Date(form.dueDate).toISOString(),
        description: form.description
      });
      setShowModal(false);
      loadAssignments();
    } finally {
      setSaving(false);
    }
  };

  const subjects = useMemo(
    () => [...new Set(assignments.map((item) => item.subject))].sort((a, b) => a.localeCompare(b)),
    [assignments]
  );

  const completed = assignments.filter((item) => item.status === "COMPLETED").length;
  const progress = assignments.length ? Math.round((completed / assignments.length) * 100) : 0;

  const missedDeadlines = assignments.filter(
    (item) => dayjs(item.dueDate).isBefore(dayjs()) && item.status !== "COMPLETED"
  );

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Assignments Dashboard</h1>
            <p className="text-sm text-slate-600">Track, prioritize, and finish work on time.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            + Add Task
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <select
            value={filters.subject}
            onChange={(event) => setFilters((prev) => ({ ...prev, subject: event.target.value }))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(event) => setFilters((prev) => ({ ...prev, priority: event.target.value }))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={filters.sort}
            onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value }))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Progress Tracker</h2>
          <span className="text-sm font-semibold text-slate-700">{progress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Missed Deadlines</h2>
        {missedDeadlines.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No missed deadlines. Great work.</p>
        ) : (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
            {missedDeadlines.map((item) => (
              <li key={item.id}>
                {item.title} ({item.subject})
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading ? (
        <LoadingSpinner label="Loading assignments..." />
      ) : error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal ? (
        <AddAssignmentModal loading={saving} onClose={() => setShowModal(false)} onSubmit={handleAdd} />
      ) : null}
    </section>
  );
};

export default DashboardPage;
