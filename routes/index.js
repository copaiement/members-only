const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Message = require('../models/message');
const Upgrade = require('../models/upgrade');

// Require controller modules
//const message_controller = require('../controllers/messageController');

/* GET home page. */
// add async mongoose DB pull here
router.get('/', async (req, res, next) => {
  const messages = await Message.find().exec();

  if (messages.length === 0) {
    res.render('index', { title: 'Members Only', currentUser: req.user });
  } else {
    res.render('index', { title: 'Members Only', currentUser: req.user, messages: messages});
  }
});

// GET new message page
router.get('/new', (req, res, next) => {
  res.render('form', { title: 'New Message' , currentUser: req.user });
});

// POST new message
router.post('/new', [
  // Validate and sanitize fields.
  body('message')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Message must have text.')
    .matches(/^[A-Za-z0-9 .,'!&?"$]+$/)
    .withMessage('Message has non-alphanumeric characters.'),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const message = new Message({
      text: req.body.message,
      username: req.user.username,
      addedDate: new Date(),
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('form', {
        message: message.text,
        errors: errors.array(),
        title: 'New Message' , 
        currentUser: req.user
      });
    } else {
      // Data from form is valid.

      // Save area.
      await message.save();
      // Redirect to homepage
      res.redirect('/');
    }
  }),
]);

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
        
        // login and redirect on account creation
        req.login(user, function(err) {
          if (err) { return next(err); }
          return res.redirect('/');
        });
      })
    }
  })
]);

// GET login page
router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Login Page' });
});

// // POST login page
// router.post('/login',
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureMessage: true,
//   }),
// );

// POST login page
router.post('/login', [
  // Validate and sanitize fields.
  body('username')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Please enter a username'),
  
  body('password')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Please enter a password'),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      console.log(errors.array());
      res.render('login', {
        title: 'Login Page',
        errors: errors.array(), 
      });
      return;
    }

    // Data from form is valid. Check credentials.
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      if (!user) {
        res.render('login', {         
          title: 'Login Page',
          errors: [{msg : info.message}], 
        });
        return;
      }
      req.login(user, (err) => {
        if (err) { return next(err) }
        res.redirect('/');
      })
    })(req, res, next);
  }),
]);

// POST logout page (use post instead of get for maximum security)
router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// GET upgrade page
router.get('/upgrade', async (req, res, next) => {
  const passwords = await Upgrade.findOne().exec();
  res.render('upgrade', { title: 'Login Page', currentUser: req.user, memberPass: passwords.memberPass });
});

// POST member upgrade
router.post('/upgrade', [
  // Validate and sanitize fields.
  body('memberCode')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Please enter a code')
    .matches(/^[A-Za-z0-9 .,'!&?"$]+$/)
    .escape()
    .withMessage('Code has non-alphanumeric characters.')
    .bail()
    .custom(async (memberCode, { req }) => {
      const passwords = await Upgrade.findOne().exec();
      const currentMemberType = req.user.userType;
      // password does not match DB stored upgrade pass
      if (memberCode !== passwords.memberPass && memberCode !== passwords.adminPass) {
        throw new Error('Upgrade code is not valid');
      // member password entered, user already member
      } else if (currentMemberType === 'member' && memberCode === passwords.memberPass) {
        throw new Error('Already a member!');
      }
    }),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Get current passwords
    const passwords = await Upgrade.findOne().exec();
    // Create updated User
    const updatedUser = new User({
      email: req.user.email,
      username: req.user.username,
      password: req.user.password,
      userType: 'basic',
      _id: req.user.id,
    });
    // Upgrade user accordingly
    if (req.body.memberCode === passwords.adminPass) {
      updatedUser.userType = 'admin';
    } else {
      updatedUser.userType = 'member';
    }

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('upgrade', {
        errors: errors.array(),
        title: 'Upgrade Page' , 
        currentUser: req.user,
        memberPass: passwords.memberPass,
      });
    } else {
      // Data from form is valid.
      // Save user
      console.log(updatedUser);
      await User.findByIdAndUpdate(req.user.id, updatedUser, {});
      // Redirect to homepage
      res.redirect('/');
    }
  }),
]);

module.exports = router;