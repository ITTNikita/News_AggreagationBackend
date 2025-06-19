import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();
const controller = new UserController();

router.post('/signup', controller.signup);
router.post('/login', controller.login);

export default router