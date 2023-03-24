import Post from '../models/Post.js';
import User from '../models/User.js';

export const createPost = async (req, res) => {
  const { userId, description, picturePath } = req.body;
  //clg req.body later to see if can avoid line 7
  const user = await User.findById(userId);
  Post.create({
    userId,
    firstName: user.firstName,
    lastName: user.lastName,
    location: user.location,
    description,
    userPicturePath: user.picturePath,
    picturePath,
    likes: {},
    comments: [],
  })
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId });
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const posts = await Post.findById(id);
    const isLiked = posts.likes.get(userId);

    if (isLiked) {
      posts.likes.delete(userId);
    } else {
      posts.likes.set(userId, true); // {userId: boolean}
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: posts.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
};
