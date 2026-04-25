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
  // this is used to see the duration of events fetched from the classroom.. 
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  await Promise.all(
    courses.map(async (course) => {
      const workRes = await classroom.courses.courseWork.list({ courseId: course.id });
      const courseWorks = workRes.data.courseWork ?? [];

      const submissionRes = await classroom.courses.courseWork.studentSubmissions.list({
        courseId: course.id,
        courseWorkId: "-",
        userId: "me"
      });
      const submissions = submissionRes.data.studentSubmissions ?? [];
      
      const submissionMap = submissions.reduce((acc, sub) => {
        acc[sub.courseWorkId] = sub.state;
        return acc;
      }, {});

      for (const work of courseWorks) {
        const dueDate = buildDueDate(work.dueDate, work.dueTime);
        if (!dueDate) continue;
         //this neeeds to be changed for time settings for UI....
        // Skip if older than 3 months
        if (dueDate < threeMonthsAgo) continue;

        assignments.push({
          title: work.title,
          description: work.description ?? "",
          subject: course.name,
          dueDate,
          classroomCourseId: course.id,
          classroomCourseWorkId: work.id,
          submissionState: submissionMap[work.id] || "NEW"
        });
      }
    })
  );

  return assignments;
};
