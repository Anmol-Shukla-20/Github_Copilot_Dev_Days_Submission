import cron from "node-cron";
import dayjs from "dayjs";
import { Assignment } from "../models/Assignment.js";
import { User } from "../models/User.js";

const sendViaTwilio = async ({ to, body }) => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!sid || !token || !from || !to) {
    console.log("Twilio is not configured. Skipping reminder.");
    return;
  }

  const { default: twilio } = await import("twilio");
  const client = twilio(sid, token);

  await client.messages.create({
    body,
    from,
    to
  });
};

const sendReminder = async (assignment, windowLabel) => {
  const user = await User.findById(assignment.user);
  if (!user) return;

  const message = `Reminder (${windowLabel}): ${assignment.title} in ${assignment.subject} is due at ${dayjs(
    assignment.dueDate
  ).format("DD MMM YYYY, hh:mm A")}.`;

  await sendViaTwilio({ to: user.phoneNumber, body: message });
};

export const scheduleReminderJobs = () => {
  cron.schedule("*/15 * * * *", async () => {
    const now = dayjs();

    const oneDayStart = now.add(23, "hour").toDate();
    const oneDayEnd = now.add(25, "hour").toDate();

    const twoHoursStart = now.add(110, "minute").toDate();
    const twoHoursEnd = now.add(130, "minute").toDate();

    const oneDayDue = await Assignment.find({
      dueDate: { $gte: oneDayStart, $lte: oneDayEnd },
      status: { $ne: "COMPLETED" },
      reminderOneDaySent: false
    });

    for (const assignment of oneDayDue) {
      try {
        await sendReminder(assignment, "1 day left");
        assignment.reminderOneDaySent = true;
        await assignment.save();
      } catch (error) {
        console.error("Failed one-day reminder:", error.message);
      }
    }

    const twoHoursDue = await Assignment.find({
      dueDate: { $gte: twoHoursStart, $lte: twoHoursEnd },
      status: { $ne: "COMPLETED" },
      reminderTwoHoursSent: false
    });

    for (const assignment of twoHoursDue) {
      try {
        await sendReminder(assignment, "2 hours left");
        assignment.reminderTwoHoursSent = true;
        await assignment.save();
      } catch (error) {
        console.error("Failed two-hour reminder:", error.message);
      }
    }
  });
};
