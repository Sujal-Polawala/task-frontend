const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const loginLimiter = require('../middleware/loginLimiter');
const auth = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', loginLimiter, authController.login);
router.get('/users', auth, authController.getUsers);

module.exports = router;
