import clsx from "clsx";
import dayjs from "dayjs";
import { Clock3, Trash2 } from "lucide-react";

const priorityClasses = {
  HIGH: "bg-red-50 border-red-200",
  MEDIUM: "bg-amber-50 border-amber-200",
  LOW: "bg-emerald-50 border-emerald-200"
};

const AssignmentCard = ({ assignment, onStatusChange, onDelete }) => {
  return (
    <article
      className={clsx(
        "rounded-xl border p-4 shadow-sm transition hover:shadow-md",
        priorityClasses[assignment.priority] || "bg-white border-slate-200"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{assignment.title}</h3>
          <p className="text-sm text-slate-600">{assignment.subject}</p>
        </div>
        <span
          className={clsx(
            "rounded-full px-2 py-1 text-xs font-semibold",
            assignment.priority === "HIGH" && "bg-red-100 text-red-700",
            assignment.priority === "MEDIUM" && "bg-amber-100 text-amber-700",
            assignment.priority === "LOW" && "bg-emerald-100 text-emerald-700"
          )}
        >
          {assignment.priority}
        </span>
      </div>

      {assignment.description ? (
        <p className="mt-3 line-clamp-3 text-sm text-slate-700">{assignment.description}</p>
      ) : null}

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <Clock3 size={14} />
        <span>{dayjs(assignment.dueDate).format("DD MMM YYYY, hh:mm A")}</span>
      </div>

      <div className="mt-3">
        <span
          className={clsx(
            "rounded-full px-2 py-1 text-xs font-semibold",
            assignment.timelineStatus === "Late" && "bg-red-100 text-red-700",
            assignment.timelineStatus === "Submitted" && "bg-emerald-100 text-emerald-700",
            assignment.timelineStatus === "Pending" && "bg-slate-200 text-slate-700"
          )}
        >
          {assignment.timelineStatus}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <select
          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
          value={assignment.status}
          onChange={(event) => onStatusChange(assignment.id, event.target.value)}
        >
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <button
          type="button"
          onClick={() => onDelete(assignment.id)}
          className="rounded-lg border border-red-200 px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <Trash2 size={14} className="inline" /> Delete
        </button>
      </div>
    </article>
  );
};

export default AssignmentCard;
