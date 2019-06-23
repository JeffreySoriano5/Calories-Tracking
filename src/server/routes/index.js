import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/*', function (req, res) {
  // Redirect Unauthenticated users.
  if (!req.isAuthenticated()) {
    res.redirect("/login");
    return null;
  }

  res.render('index.html', {auth: JSON.stringify({})});
});

export default router;
