import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

export const userRegister = async (req, res) => {
  const userData = req.body;

  User.register(userData)
    .then((user) => {
      const token = createToken(user._id);

      res.status(200).json({ user, token });
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  User.login(email, password)
    .then((user) => {
      const token = createToken(user._id);
      res.status(200).json({ user, token });
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such user' });
  }

  const user = await User.findById(id);

  if (!user) {
    res.status(400).json({ error: e.message });
  } else {
    res.status(200).json(user);
  }
};

export const getUserFriends = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    res.status(400).json({ error: e.message });
  }
  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );

  const filteredFriends = friends.map(
    ({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    }
  );

  res.status(200).json(filteredFriends);
};

export const addRemoveFriend = async (req, res) => {
  const { id, friendId } = req.params;

  const user = await User.findById(id);
  const friend = await User.findById(friendId);

  if (!user || !friend) {
    res.status(400).json({ error: 'no such user or friend' });
  }
  // uses updateOne for atomicty instead of save() and modifying it locally.

  if (user.friends.includes(friendId)) {
    await User.updateOne(
      { _id: id },
      { $pull: { friends: { $in: friendId } } }
    );
    await User.updateOne(
      { _id: friendId },
      { $pull: { friends: { $in: id } } }
    );
  } else {
    await User.updateOne({ _id: id }, { $push: { friends: friendId } });
    await User.updateOne({ _id: friendId }, { $push: { friends: id } });
  }

  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );

  const filteredFriends = friends.map(
    ({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    }
  );
  res.status(200).json(filteredFriends);
};
