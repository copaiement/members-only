const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator');

// Require controller modules
//const message_controller = require('../controllers/messageController');

router.get('/', )

/* GET home page. */
// add async mongoose DB pull here
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
  // Validate and sanitize fields
  body('email')
    .trim()
    .isLength({ min: 7})
    .escape()
    .withMessage('Email must be specified.')
    .isAlphanumeric('en-US', { ignore: ' ', '@', '.' })
    .withMessage('Email can only have numbers, letters, "@", and "."')
  
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) return next (err);

    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      userType: 'basic',
    });

    await user.save();
    res.redirect('/');
  })
});

// GET login page
router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Login Page'});
});

module.exports = router;