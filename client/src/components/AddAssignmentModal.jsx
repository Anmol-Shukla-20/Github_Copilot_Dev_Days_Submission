import { useState } from "react";

const AddAssignmentModal = ({ onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({ title: "", subject: "", dueDate: "", description: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-900">Add Manual Assignment</h2>

        <div className="mt-4 grid gap-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
          <input
            name="dueDate"
            type="datetime-local"
            value={form.dueDate}
            onChange={handleChange}
            required
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAssignmentModal;
