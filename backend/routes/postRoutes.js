import express from 'express';
import {
  getFeedPosts,
  getUserPosts,
  likePost,
} from '../controllers/postController.js';
import { requireAuth } from '../middleware/requireAuth.js';
const router = express.Router();

router.use(requireAuth);

router.get('/', getFeedPosts);

router.get('/:userId/posts', getUserPosts);

router.patch('/:id/like', likePost);

export default router;
