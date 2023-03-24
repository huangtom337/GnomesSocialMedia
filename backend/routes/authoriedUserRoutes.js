import express from 'express';
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from '../controllers/userController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/:id', getUser);

router.get('/:id/friends', getUserFriends);

router.patch('/:id/:friendId', addRemoveFriend);

export default router;
