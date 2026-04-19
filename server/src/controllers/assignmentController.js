import { Assignment } from "../models/Assignment.js";
import { getPriority } from "../utils/priority.js";
import { getStatus } from "../utils/priority.js";
import { fetchClassroomData } from "../services/classroomService.js";

const toDTO = (assignment) => ({
  id: assignment._id,
  title: assignment.title,
  description: assignment.description,
  subject: assignment.subject,
  dueDate: assignment.dueDate,
  status: assignment.status,
  timelineStatus: getStatus(assignment),
  priority: assignment.priority,
  source: assignment.source,
  createdAt: assignment.createdAt
});

const priorityRank = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2
};

export const getAssignments = async (req, res) => {
  try {
    const { subject, priority, status, sort = "dueDate" } = req.query;

    const filter = { user: req.user.userId };
    if (subject) filter.subject = subject;
    if (priority) filter.priority = priority;
    if (status) filter.status = status;

    const assignments = await Assignment.find(filter).sort({ dueDate: 1 });

    if (sort === "priority") {
      assignments.sort((a, b) => {
        const byPriority = (priorityRank[a.priority] ?? 99) - (priorityRank[b.priority] ?? 99);
        if (byPriority !== 0) return byPriority;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }

    return res.status(200).json(assignments.map(toDTO));
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch assignments", error: error.message });
  }
};

export const fetchAssignmentsFromClassroom = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: "Google accessToken is required" });
    }

    const fetched = await fetchClassroomData(accessToken);

    const upserts = fetched.map(async (item) => {
      const priority = getPriority(item.dueDate);

      await Assignment.findOneAndUpdate(
        {
          user: req.user.userId,
          classroomCourseId: item.classroomCourseId,
          classroomCourseWorkId: item.classroomCourseWorkId
        },
        {
          $set: {
            user: req.user.userId,
            title: item.title,
            description: item.description,
            subject: item.subject,
            dueDate: item.dueDate,
            source: "CLASSROOM",
            priority
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    });

    await Promise.all(upserts);

    return res.status(200).json({ message: "Assignments synced", count: fetched.length });
  } catch (error) {
    return res.status(500).json({ message: "Failed to sync Classroom assignments", error: error.message });
  }
};

export const addAssignment = async (req, res) => {
  try {
    const { title, description = "", subject, dueDate } = req.body;

    if (!title || !subject || !dueDate) {
      return res.status(400).json({ message: "title, subject and dueDate are required" });
    }

    const assignment = await Assignment.create({
      user: req.user.userId,
      title,
      description,
      subject,
      dueDate,
      source: "MANUAL",
      priority: getPriority(dueDate)
    });

    return res.status(201).json(toDTO(assignment));
  } catch (error) {
    return res.status(500).json({ message: "Failed to add assignment", error: error.message });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const assignment = await Assignment.findOne({ _id: id, user: req.user.userId });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (updates.title !== undefined) assignment.title = updates.title;
    if (updates.description !== undefined) assignment.description = updates.description;
    if (updates.subject !== undefined) assignment.subject = updates.subject;
    if (updates.dueDate !== undefined) assignment.dueDate = updates.dueDate;
    if (updates.status !== undefined) assignment.status = updates.status;

    assignment.priority = getPriority(assignment.dueDate);

    await assignment.save();

    return res.status(200).json(toDTO(assignment));
  } catch (error) {
    return res.status(500).json({ message: "Failed to update assignment", error: error.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Assignment.findOneAndDelete({ _id: id, user: req.user.userId });

    if (!deleted) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    return res.status(200).json({ message: "Assignment deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete assignment", error: error.message });
  }
};
