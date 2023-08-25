const express = require("express");

const router = express.Router();
const {
  createTask,
  getAllTasks,
  UpdateStatus,
  deleteTaskById,
  getTaskById,
} = require("../controllers/task.controllers.js");
// const validator = require("../helpers/validators.js");

router.post("/", createTask);
router.put("/:id", UpdateStatus);
router.delete("/:id", deleteTaskById);
router.get("/:id", getTaskById);
router.get("/", getAllTasks);

module.exports = router;
