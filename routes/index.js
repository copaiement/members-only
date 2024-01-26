const express = require('express');
const router = express.Router();

// Require controller modules
//const message_controller = require('../controllers/messageController');

router.get('/', )

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Members Only' });
});

module.exports = router;