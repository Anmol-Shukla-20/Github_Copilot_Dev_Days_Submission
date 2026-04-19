import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  addAssignment,
  deleteAssignment,
  fetchAssignmentsFromClassroom,
  getAssignments,
  updateAssignment
} from "../controllers/assignmentController.js";

const router = Router();

router.use(authMiddleware);
router.get("/", getAssignments);
router.post("/fetch", fetchAssignmentsFromClassroom);
router.post("/add", addAssignment);
router.put("/update/:id", updateAssignment);
router.delete("/delete/:id", deleteAssignment);

export default router;
