import express from 'express';
import passport from 'passport/lib';
import AuthController from '../controllers/auth';
import secure from '../middlewares/authorization';
import validate from '../middlewares/validation';
import {createSchema} from './schemas/user';
import {loginSchema} from './schemas/auth';

const router = express.Router();

router.post('/signup', validate(createSchema), AuthController.user_signUp_post);

router.post('/login', validate(loginSchema), passport.authenticate('local'), AuthController.user_login_post);

router.post('/logout', secure.isAuthenticated, AuthController.user_logout_post);

export default router;
