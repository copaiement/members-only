const express = require('express');
const router = express.Router();

// Require controller modules
//const message_controller = require('../controllers/messageController');

router.get('/', )

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Members Only'});
});

// GET new message page
router.get('/new', (req, res, next) => {
  res.render('form', { title: 'New Message' , messages: messages});
});

// POST new message
router.post('/new', async (req, res, next) => {
  const newMsg = { text: req.body.msg, user: req.body.usr, added: new Date() };
  // update DB with new message
  await update(newMsg);
  // redirect to home
  res.redirect('/');
});

// GET signup page
router.get('/signup', (req, res, next) => {
  res.render('signup', { title: 'Signup Page'});
});

// POST signup
router.post('/signup', async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) return next (err);

    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });

    await user.save();
    res.redirect('/');
  })
})

module.exports = router;