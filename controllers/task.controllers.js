const { sendResponse, AppError } = require("../helpers/utils.js");
const { ObjectId } = require("mongodb");
const Task = require("../models/Task.js");
const User = require("../models/User.js");

const taskController = {};

//[POST] Create a task
taskController.createTask = async (req, res, next) => {
  const task = req.body;
  try {
    if (!task) throw new AppError(402, "Bad Request", "Create task Error");
    let userFound;
    userFound = await User.findById(new ObjectId(task.assignee));
    userFound = await userFound.save();

    const created = await Task.create(task);
    if (userFound) {
      userFound.tasks.push(new ObjectId(created.id));
      userFound.save();
    }

    sendResponse(
      res,
      200,
      true,
      { data: created },
      null,
      "Create task Success"
    );
  } catch (err) {
    next(err);
  }
};

//[PUT] Update the status of a task.

taskController.updateStatus = async (req, res, next) => {
  const taskId = req.params.id;
  const updateData = req.body;

  try {
    const currentData = await Task.findOne({ _id: taskId });

    if (currentData.status === "done" && updateData.status !== "archive") {
      throw new AppError(402, "Bad Request", "This task can't be changed");
    } else if (currentData.status === "archive") {
      throw new AppError(
        402,
        "Bad Request",
        "This task is already archived and cannot be changed"
      );
    } else {
      const newUpdate = await Task.findByIdAndUpdate(taskId, updateData, {
        new: true,
      });
      sendResponse(res, 200, true, { newUpdate }, null, `Update Task Success`);
    }
  } catch (error) {
    next(error);
  }
};

//[GET] get all tasks
taskController.getAllTasks = async (req, res, next) => {
  const filter = {};
  try {
    const listOfFound = await Task.find(filter).populate("assignee");
    sendResponse(
      res,
      200,
      true,
      { data: listOfFound },
      null,
      "Found list of tasks success"
    );
  } catch (err) {
    next(err);
  }
};

//7. [GET] a single task by ID
taskController.getTaskById = async (req, res, next) => {
  const taskId = req.params.id;
  try {
    const found = await Task.findOne({ _id: taskId });
    if (!found || found.isDeleted) throw new AppError(404, "Task not Found");
    sendResponse(
      res,
      200,
      true,
      { data: found },
      null,
      "Found single task by id success"
    );
  } catch (err) {
    next(err);
  }
};

//[DELETE] a task by ID (soft delete)
taskController.deleteTaskById = async (req, res, next) => {
  const taskId = req.params.id;
  const options = { new: true };
  try {
    const updated = await Task.findByIdAndUpdate(
      taskId,
      { isDeleted: true },
      options
    );

    sendResponse(res, 200, true, { updated }, null, "Delete task success");
  } catch (err) {
    next(err);
  }
};

//export
module.exports = taskController;
