import express from 'express';
import {asyncMiddleware} from '../utils';

const router = express.Router();

/* GET home page. */
router.get('/*', asyncMiddleware(async function (req, res) {
  let user = (req.user) ? req.user : null;

  if (user) user = await req.user.toPlainObject();

  res.render('index.html', {user: JSON.stringify(user)});
}));

export default router;
