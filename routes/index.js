const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Message = require('../models/message')
// Require controller modules
//const message_controller = require('../controllers/messageController');

/* GET home page. */
// add async mongoose DB pull here
router.get('/', async (req, res, next) => {
  //const messages = await Message.find().exec();
  // TEMP
  const messages = [];
  if (messages.length === 0) {
    res.render('index', { title: 'Members Only', currentUser: req.user});
  } else {
    res.render('index', { title: 'Members Only', currentUser: req.user, messages: messages});
  }
});

// GET new message page
router.get('/new', (req, res, next) => {
  res.render('form', { title: 'New Message' , currentUser: req.user, messages: messages});
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
router.post('/signup', [
  // Validate and sanitize fields
  body('email')
    .trim()
    .isLength({ min: 7})
    .escape()
    .withMessage('Email must be specified.')
    .isEmail()
    .escape()
    .withMessage('Email address is not valid')
    .bail()
    .custom(async email => {
      const existingEmail = await User.findOne({ email: email }).exec();
      if (existingEmail) {
        throw new Error('E-mail already in use');
      }
    }),
  body('username')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Username must be specified')
    .isAlphanumeric()
    .escape()
    .withMessage('Username has non-alphanumeric characters.')
    .bail()
    .custom(async username => {
      const existingUsername = await User.findOne({ username: username }).exec();
      if (existingUsername) {
        throw new Error('Username already in use');
      }
    }),

  body('password')
    .trim()
    .isLength({ min: 8 })
    .escape()
    .withMessage('Password must be at least 8 characters')
    .isAlphanumeric()
    .escape()
    .withMessage('Password must contain only alphanumeric characters')
    .bail(),

  // add custom validation to check for existing email address
  body('confirm-password')
    .trim()
    .isLength({ min: 8 })
    .escape()
    .withMessage('Please confirm password')
    .bail() 
    .custom(async(confirmPassword, { req }) => {
      const password = req.body.password;
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
      }
    }),

  asyncHandler(async (req, res, next) => {
    //check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('signup', {
        title: 'Signup Page',
        email: req.body.email,
        username: req.body.username,
        errors: errors.array(),
      });
    } else {
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
    }
  })
]);

// GET login page
router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Login Page'});
});

// // POST login page
// router.post('/login', [
//   // Validate and sanitize fields
//   body('username')
//     .trim()
//     .isLength({ min: 3 })
//     .escape()
//     .withMessage('Username must be specified')
//     .bail()
//     .custom(async username => {
//       const existingUsername = await User.findOne({ username: username }).exec();
//       if (!existingUsername) {
//         throw new Error('Username does not exist');
//       }
//     }),

//   body('password')
//     .trim()
//     .isLength({ min: 3 })
//     .escape()
//     .withMessage('Password must be specified')
//     .bail()
//     .custom(async(password, { req }) => {
//       const user = await User.findOne({ username: req.body.username }).exec();
//       if (user.password !== password) {
//         throw new Error('Incorrect password');
//       }
//     }),

//   asyncHandler(async (req, res, next) => {
//     //check for errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       res.render('login', {
//         title: 'Login',
//         username: req.body.username,
//         errors: errors.array(),
//       });
//     } else {
//       console.log('login success');
//       res.redirect('/');
//     }
//   })
// ]);

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }),
);


module.exports = router;