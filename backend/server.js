import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { userRegister } from './controllers/userController.js';
import { createPost } from './controllers/postController.js';
import { requireAuth } from './middleware/requireAuth.js';

import User from './models/User.js';
import Post from './models/Post.js';
import { users, posts } from './data/constants.js';

// Register middle wares
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// File storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post('/register', upload.single('picture'), userRegister);
app.post('/posts', requireAuth, upload.single('picture'), createPost);

// Routes
app.use('/', userRoutes);
app.use('/posts', postRoutes);

// Mongoose
const PORT = process.env.port || 6000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

    // add this data one time
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((err) => {
    console.error(`Could not connect ${err}`);
  });
