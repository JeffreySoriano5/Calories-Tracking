import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/*', function (req, res) {
  const user = (req.user) ? req.user.toObject() : null;

  res.render('index.html', {auth: JSON.stringify(user)});
});

export default router;
