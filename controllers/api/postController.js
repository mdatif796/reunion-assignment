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
