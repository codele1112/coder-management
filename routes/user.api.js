const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  createUser,
  getAllUsers,
  searchUser,
  updateUserById,
  deleteUserById,
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
@access public
 * @allowedQueries: name
 */
router.get("/", getAllUsers);

/**
 * @route GET api/users/:targetName
 * @description Get an users by name
 * @access public
 * @allowedQueries: name
 */

router.get("/:targetName", searchUser);

/**
 * @route PUT api/users/:id
 * @description update an users by id
 * @access public
 */
router.put("/:id", updateUserById);

/**
 * @route DELETE api/users/:id
 * @description delete an users by id
 * @access public
 */
router.delete("/:id", deleteUserById);

//export
module.exports = router;
