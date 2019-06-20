import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index.html', {auth: JSON.stringify({})});
});

export default router;
