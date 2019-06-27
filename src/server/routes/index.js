import express from 'express';
import {getRbac} from '../startup/authorization';
import {asyncMiddleware} from '../utils';

const router = express.Router();

/* GET home page. */
router.get('/*', asyncMiddleware(async function (req, res) {
  const user = (req.user) ? req.user.toObject() : null;

  if (user) user.permissions = await req.user.getScope(getRbac());

  res.render('index.html', {user: JSON.stringify(user)});
}));

export default router;
