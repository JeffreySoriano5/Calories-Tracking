import express from 'express';
import passport from 'passport/lib';
import AuthController from '../controllers/auth';
import secure from '../controllers/express';

const router = express.Router();

router.post('/signup', AuthController.user_signUp_post);

router.post('/login', passport.authenticate('local'), AuthController.user_login_post);

router.post('/logout', secure.isAuthenticated, AuthController.user_logout_post);

export default router;
