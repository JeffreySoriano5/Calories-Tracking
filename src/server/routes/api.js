import express from 'express';
import authRouter from './auth';
import usersRouter from './users';
import mealsRouter from './meals';
import createError from 'http-errors';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/meals', mealsRouter);

router.use(function (req, res, next) {
  next(createError(404));
});

export default router;
