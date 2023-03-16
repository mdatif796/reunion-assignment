const Post = require("../../models/post");
const Comment = require("../../models/comment");

module.exports.addComment = async (req, res) => {
  try {
    // get post to be commented
    let post = await Post.findById(req.params.id);
    // if post not exist
    if (!post) {
      return res.status(401).json({
        success: false,
        message: "post not exist",
      });
    }

    // add comment to post
    let comment = await Comment.create({
      input: req.body.input,
      user: req.user._id,
      post: post._id,
    });

    // saving the id of comment to Post's comment array
    post.comments.push(comment._id);
    post.save();
    comment = await comment.populate("user", "name email");

    return res.status(200).json({
      success: true,
      message: "comment added!!",
      comment_id: comment._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
