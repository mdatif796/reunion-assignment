const Post = require("../../models/post");

// create post
module.exports.createPost = async (req, res) => {
  try {
    // create post
    let post = await Post.create({
      ...req.body,
      user: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "post created!!",
      post: {
        id: post._id,
        title: post.title,
        description: post.description,
        created_at: post.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete post
module.exports.deletePost = async (req, res) => {
  try {
    // find the post to be deleted
    let post = await Post.findById(req.params.id);
    // if post not exist
    if (!post) {
      return res.status(401).json({
        success: false,
        message: "post not exist",
      });
    }

    // populate the user
    post = await post.populate("user");

    // if the post doesn't created by the logged in user
    if (post.user.email !== req.user.email) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // delete the post
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Post deleted!!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get post
module.exports.getPost = async (req, res) => {
  try {
    // find the post
    let post = await Post.findById(req.params.id);
    // if post not exist
    if (!post) {
      return res.status(401).json({
        success: false,
        message: "post not exist",
      });
    }

    // populate the user, comment and user of comment
    post = post.populate("user", "-password ").populate({
      path: "comments",
      populate: {
        path: "user",
        select: "-password",
      },
    });

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
