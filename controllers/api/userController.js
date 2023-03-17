require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

// create user
module.exports.createUser = async (req, res) => {
  try {
    // first check whether user exist or not
    let user = await User.findOne({ email: req.body.email }).select(
      "-password"
    );
    // if user exist then return user in the response
    if (user) {
      return res.status(201).json({
        success: false,
        message: "User already exist",
        user,
      });
    }
    // create user
    user = await User.create(req.body);
    return res.status(201).json({
      success: true,
      message: "User created!!",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// authenticate user
module.exports.authenticateUser = async (req, res) => {
  try {
    // if email and password is not undefined
    if (req.body.email && req.body.password) {
      // check whether it exist or not
      let user = await User.findOne({ email: req.body.email });
      // user exist and user password matches with the login credentials
      if (user && user.password === req.body.password) {
        return res.status(201).json({
          success: true,
          message: "successfully authenticated the user",
          jwt_token: {
            token: jwt.sign(user.toJSON(), process.env.JWTSECRETKEY),
          },
        });
      }
      // if not matched
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// follow user
module.exports.followUser = async (req, res) => {
  try {
    // check if both user id same
    if (req.user._id === req.params.id) {
      return res.status(401).json({
        success: false,
        message: "user cannot follow himself",
      });
    }

    // find user to follow
    let userToBeFollow = await User.findById(req.params.id);
    // if user not found
    if (!userToBeFollow) {
      return res.status(401).json({
        success: false,
        message: "user not exist",
      });
    }

    // get the logged in user
    let authenticatedUser = await User.findById(req.user._id);
    let followingUser = authenticatedUser.following;
    // check if the user to follow already exist the following list
    for (let userId of followingUser) {
      if (userId === req.params.id) {
        return res.status(401).json({
          success: false,
          message: "user already followed",
        });
      }
    }

    authenticatedUser.following.push(req.params.id);
    await authenticatedUser.save();

    userToBeFollow.followers.push(req.user._id);
    await userToBeFollow.save();

    return res.status(201).json({
      success: true,
      message: "user followed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// unfollow user
module.exports.unfollowUser = async (req, res) => {
  try {
    // check if both the user id same
    if (req.user._id === req.params.id) {
      return res.status(401).json({
        success: false,
        message: "user cannot Unfollow himself",
      });
    }

    // find the user to unfollow
    let userToBeUnfollow = await User.findById(req.params.id);
    // if the user to unfollow doesn't exist
    if (!userToBeUnfollow) {
      return res.status(401).json({
        success: false,
        message: "user to unfollow does not exist!",
      });
    }

    // get the logged in user
    let authenticatedUser = await User.findById(req.user._id);
    // get the following list of logged in user
    let followingUser = authenticatedUser.following;
    // remove the user from the list
    followingUser = followingUser.filter((userId) => {
      return userId !== req.params.id;
    });
    authenticatedUser.following = followingUser;
    await authenticatedUser.save();

    // get the follower list of the user to unfollow
    let userToBeFollow_followingUser = userToBeUnfollow.followers;
    // remove the logged in user from his follower's list
    userToBeFollow_followingUser = userToBeFollow_followingUser.filter(
      (user) => {
        return user !== req.user._id;
      }
    );
    userToBeUnfollow.followers = userToBeFollow_followingUser;
    await userToBeUnfollow.save();

    return res.status(201).json({
      success: true,
      message: "user Unfollowed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get authenticated user
module.exports.getAuthenticatedUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        name: req.user.name,
        followers: req.user.followers.length,
        following: req.user.following.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
