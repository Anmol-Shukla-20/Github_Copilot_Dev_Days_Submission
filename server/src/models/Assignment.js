import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    subject: { type: String, required: true },
    dueDate: { type: Date, required: true },
    source: { type: String, enum: ["CLASSROOM", "MANUAL"], default: "MANUAL" },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
      default: "PENDING"
    },
    priority: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "LOW"
    },
    classroomCourseId: { type: String, default: "" },
    classroomCourseWorkId: { type: String, default: "" },
    reminderOneDaySent: { type: Boolean, default: false },
    reminderTwoHoursSent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

assignmentSchema.index({ user: 1, classroomCourseId: 1, classroomCourseWorkId: 1 }, { unique: true, sparse: true });

export const Assignment = mongoose.model("Assignment", assignmentSchema);
