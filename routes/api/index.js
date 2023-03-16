const express = require("express");
const router = express.Router();

// middleware
const setAuthenticationMiddleware = require("../../config/setAuthenticationMiddleware");

// controllers
const userController = require("../../controllers/api/userController");
const postController = require("../../controllers/api/postController");
const likeController = require("../../controllers/api/likeController");
const commentController = require("../../controllers/api/commentController");

router.get("/home", userController.home);

// create user
router.post("/create-user", userController.createUser);
// authenticate user
router.post("/authenticate", userController.authenticateUser);
// follow user
router.post(
  "/follow/:id",
  setAuthenticationMiddleware.checkAuthentication,
  userController.followUser
);
// unfollow user
router.post(
  "/unfollow/:id",
  setAuthenticationMiddleware.checkAuthentication,
  userController.unfollowUser
);
// get authenticated user
router.get(
  "/user",
  setAuthenticationMiddleware.checkAuthentication,
  userController.getAuthenticatedUser
);

// create post by authenticated user
router.post(
  "/posts",
  setAuthenticationMiddleware.checkAuthentication,
  postController.createPost
);
// delete post
router.delete(
  "/posts/:id",
  setAuthenticationMiddleware.checkAuthentication,
  postController.deletePost
);
// get post
router.get(
  "/posts/:id",
  setAuthenticationMiddleware.checkAuthentication,
  postController.getPost
);
// get all post
router.get(
  "/all_posts",
  setAuthenticationMiddleware.checkAuthentication,
  postController.getAllPost
);

// like post
router.post(
  "/like/:id",
  setAuthenticationMiddleware.checkAuthentication,
  likeController.likePost
);
// unlike post
router.post(
  "/unlike/:id",
  setAuthenticationMiddleware.checkAuthentication,
  likeController.unLikePost
);

// comment post
router.post(
  "/comment/:id",
  setAuthenticationMiddleware.checkAuthentication,
  commentController.addComment
);

module.exports = router;
