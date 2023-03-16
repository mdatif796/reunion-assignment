const Post = require("../../models/post");
const Like = require("../../models/like");

// like post
module.exports.likePost = async (req, res) => {
  try {
    // find the post
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(401).json({
        success: false,
        message: "post not exist",
      });
    }

    // populate the user, comment of post
    post = await Post.findById(req.params.id)
      .populate("user", "-password ")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "-password",
        },
      })
      .populate({
        path: "likes",
        populate: {
          path: "user",
          select: "-password",
        },
      });
    // get all the like of post
    let postLikedUser = post.likes;
    // check if like already exist
    for (let user of postLikedUser) {
      // check like made by authenticated user
      if (user.user.email === req.user.email) {
        return res.status(200).json({
          success: false,
          message: "Post liked already!!",
        });
      }
    }

    // else like the post
    let like = await Like.create({
      user: req.user._id,
    });

    post.likes.push(like._id);
    await post.save();
    return res.status(200).json({
      success: true,
      message: "Post liked!!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
