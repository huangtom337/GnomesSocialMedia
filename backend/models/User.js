import mongoose from 'mongoose';
import bcyrpt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 2,
    },
    picturePath: {
      type: String,
      default: '',
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true }
);

userSchema.statics.register = async function (userData) {
  const {
    firstName,
    lastName,
    email,
    password,
    picturePath,
    friends,
    location,
    occupation,
  } = userData;

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error('Email already in use');
  }

  const salt = await bcyrpt.genSalt();
  const hash = await bcyrpt.hash(password, salt);

  const user = await this.create({
    firstName,
    lastName,
    email,
    password: hash,
    picturePath,
    friends,
    location,
    occupation,
    viewedProfile: Math.floor(Math.random() * 1000),
    impressions: Math.floor(Math.random() * 1000),
  });

  return user;
};

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }).exec();

  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  if (!user) {
    throw Error('user does not exist');
  }

  const matches = await bcyrpt.compare(password, user.password);

  if (!matches) {
    throw Error('incorrect password');
  }

  return user;
};
const User = mongoose.model('SocialMediaUsers', userSchema);

export default User;
