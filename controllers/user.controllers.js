const { sendResponse, AppError } = require("../helpers/utils.js");

const User = require("../models/User.js");

const userController = {};

//[POST] create an user - done
userController.createUser = async (req, res, next) => {
  const user = req.body;
  try {
    if (!user) throw new AppError(402, "Bad Request", "Create user Error");

    const created = await User.create(user);

    sendResponse(
      res,
      200,
      true,
      { data: created },
      null,
      "Create user Success"
    );
  } catch (err) {
    next(err);
  }
};

//[GET] all users - done
userController.getAllUsers = async (req, res, next) => {
  const filter = {};
  try {
    const listOfFound = await User.find(filter).populate("tasks");

    sendResponse(
      res,
      200,
      true,
      { data: listOfFound },
      null,
      "Found list of users success"
    );
  } catch (err) {
    next(err);
  }
};

//[GET] Search for an user by name - done
userController.searchUser = async (req, res, next) => {
  const targetName = req.params.targetName;
  // console.log("targetName", targetName);
  try {
    let found = await User.find({ name: targetName }).populate("tasks");
    if (!found || found.isDeleted)
      throw new AppError(404, "User not found", "Search error");

    sendResponse(res, 200, true, { data: found }, null, "User found success");
  } catch (err) {
    next(err);
  }
};

//[PUT] Update an user by ID
userController.updateUserById = async (req, res, next) => {
  const userId = req.params.id;
  const updateInfo = req.body;

  const options = { new: true };
  try {
    const updated = await User.findByIdAndUpdate(userId, updateInfo, options);

    sendResponse(
      res,
      200,
      true,
      { data: updated },
      null,
      "Update user success"
    );
  } catch (err) {
    next(err);
  }
};

//[DELETE] Delete an user by ID (soft delete)
userController.deleteUserById = async (req, res, next) => {
  const targetId = req.params.id;
  const options = { new: true };
  try {
    const updated = await User.findByIdAndUpdate(
      targetId,
      { isDeleted: true },
      options
    );

    sendResponse(
      res,
      200,
      true,
      { data: updated },
      null,
      "Delete user success"
    );
  } catch (err) {
    next(err);
  }
};

//export
module.exports = userController;
