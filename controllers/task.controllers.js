const { sendResponse, AppError } = require("../helpers/utils.js");
const { ObjectId } = require("mongodb");
const Task = require("../models/Task.js");
const User = require("../models/User.js");

const taskController = {};

//5. [POST] Create a task
taskController.createTask = async (req, res, next) => {
  const data = req.body;
  try {
    if (!data) throw new AppError(402, "Bad Request", "Create User Error");

    let userFound;

    if (data.assignee) {
      userFound = await User.findById(new ObjectId(data.assignee));

      userFound = await userFound.save();

      console.log("data task", data);

      let status = "pending";
      if (userFound.role === "employee") {
        status = "working";
      } else if (userFound.role === "manager") {
        status = "review";
      }
      data.status = status;
    }
    const created = await Task.create(data);
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

//9. [PUT] update status of task

taskController.UpdateStatus = async (req, res, next) => {
  const taskId = req.params.id;
  const { updateStatus } = req.body;

  try {
    let taskFound = await Task.findById({ _id: ObjectId(taskId) });

    let userFound = await User.findById(ObjectId(updateStatus));
    userFound.tasks.push(ObjectId(taskId));
    userFound = await userFound.save();

    taskFound.assignee = ObjectId(updateStatus);
    if (taskFound.status === "done" && updateStatus !== "archive")
      throw new AppError(402, "Bad Request", "This task can't be changed");
    else if (taskFound.status === "archive") {
      throw new AppError(
        402,
        "Bad Request",
        "This task is already archived and cannot be changed"
      );
    } else {
      const newUpdate = await Task.findByIdAndUpdate(taskId, updateStatus, {
        new: true,
      });
      sendResponse(res, 200, true, { newUpdate }, null, `Update Task Success`);
    }
  } catch (err) {
    next(err);
  }
};

//[GET] all tasks
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
    const found = await Task.findById(taskId);
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

//10. [DELETE] a task by ID (soft delete)
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
