const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const {
  createUser,
  getAllUsers,
  searchUser,
  updateUserById,
  deleteUserById,
  getUserById,
} = require("../controllers/user.controllers.js");

/**
 * @route POST api/users
 * @description Create a new user
 * @access private, manager
 * @requiredBody: name
 */
router.post(
  "/",
  [
    body("name")
      .trim()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Name should not be empty with a minimum length of 2")
      .custom(async (value) => {
        const found = await User.findOne({ name: value });
        if (found) {
          throw new Error("User name already exists");
        }
      }),
  ],
  createUser
);

/**
 * @route GET api/users
 * @description Get a list of users
 * @access private
 * @allowedQueries: name
 */
router.get("/", getAllUsers);

// Search for an user by name & get all task of an user by name
router.get("/:targetName", searchUser);

//Update an user by ID
router.put("/:id", updateUserById);

//Delete an user by ID
router.delete("/:id", deleteUserById);

/**
 * @route GET api/users/:id
 * @description Get user by id
 * @access public
 */
// router.get("/:id", getUserById);

//export
module.exports = router;
