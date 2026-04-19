import dayjs from "dayjs";

export const getPriority = (dueDate) => {
  if (!dueDate) return "LOW";

  const now = dayjs();
  const due = dayjs(dueDate);
  const hoursDiff = due.diff(now, "hour", true);

  if (hoursDiff < 24) return "HIGH";
  if (hoursDiff <= 72) return "MEDIUM";
  return "LOW";
};

export const getStatus = (assignment) => {
  if (assignment.status === "COMPLETED") return "Submitted";
  if (dayjs(assignment.dueDate).isBefore(dayjs()) && assignment.status !== "COMPLETED") {
    return "Late";
  }
  return "Pending";
};
