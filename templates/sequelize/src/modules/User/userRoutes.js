import { Router } from 'express';
import UserController from './UserController';
import verify from '../../middleware/verify';

const router = Router();
router.post('/', UserController.createUser);
router.post('/login', UserController.loginUser);
router.get('/', verify, UserController.getUsers);

export default router;
