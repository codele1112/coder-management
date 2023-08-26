const express = require("express");
const { body, validationResult } = require("express-validator");

const router = express.Router();
const {
  createTask,
  getAllTasks,
  deleteTaskById,
  getTaskById,
  updateStatus,
} = require("../controllers/task.controllers.js");

/**
 * @route POST api/task
 * @description Create a new task
 * @access public
 * @requiredBody: name
 */
router.post(
  "/",
  [
    body("name")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 2 })
      .withMessage("Name should not be empty with a minimum length of 2"),
    body("description")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Description should not be empty"),
    body("status")
      .isIn(["pending", "working", "review", "done", "archive"])
      .withMessage("Status should not be empty"),
    body("assignee").isMongoId(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Bad Request",
          errors: errors.array(),
        });
      }
      next();
    },
  ],
  createTask
);

/** 
 * @route PUT api/task
 * @description update a task
@access public
 */
router.put("/:id", updateStatus);

/** 
 * @route DELETE api/task
 * @description delete a task by ID
@access public
 */
router.delete("/:id", deleteTaskById);

/** 
 * @route GET api/task
 * @description get a task by ID
@access public
 */
router.get("/:id", getTaskById);

/** 
 * @route GET api/task
 * @description Get a list of tasks
@access public

 */
router.get("/", getAllTasks);

module.exports = router;
