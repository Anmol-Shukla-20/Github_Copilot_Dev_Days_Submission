import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchAssignments } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const localizer = dayjsLocalizer(dayjs);

const CalendarPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAssignments();
        setAssignments(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const events = useMemo(
    () =>
      assignments.map((item) => ({
        title: `${item.title} (${item.subject})`,
        start: new Date(item.dueDate),
        end: new Date(item.dueDate),
        allDay: false
      })),
    [assignments]
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="mb-4 text-2xl font-black text-slate-900">Calendar View</h1>
      {loading ? (
        <LoadingSpinner label="Loading calendar..." />
      ) : (
        <div className="h-[70vh]">
          <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" />
        </div>
      )}
    </section>
  );
};

export default CalendarPage;
