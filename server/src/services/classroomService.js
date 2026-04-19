import { google } from "googleapis";

const buildDueDate = (dueDate, dueTime) => {
  if (!dueDate) return null;

  const hours = dueTime?.hours ?? 23;
  const minutes = dueTime?.minutes ?? 59;

  return new Date(
    Date.UTC(dueDate.year, dueDate.month - 1, dueDate.day, hours, minutes, 0)
  );
};

export const fetchClassroomData = async (accessToken) => {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const classroom = google.classroom({ version: "v1", auth });

  const coursesRes = await classroom.courses.list({ courseStates: ["ACTIVE"] });
  const courses = coursesRes.data.courses ?? [];

  const assignments = [];

  await Promise.all(
    courses.map(async (course) => {
      const workRes = await classroom.courses.courseWork.list({ courseId: course.id });
      const courseWorks = workRes.data.courseWork ?? [];

      for (const work of courseWorks) {
        const dueDate = buildDueDate(work.dueDate, work.dueTime);
        if (!dueDate) continue;

        assignments.push({
          title: work.title,
          description: work.description ?? "",
          subject: course.name,
          dueDate,
          classroomCourseId: course.id,
          classroomCourseWorkId: work.id
        });
      }
    })
  );

  return assignments;
};
