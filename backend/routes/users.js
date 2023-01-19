const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/users');

// Middleware
const signupMiddleware = require('../middleware/user/signup');

//Routes POST(create)

//Sign in
router.post("/signup", signupMiddleware, userCtrl.signup);

//Log in
router.post("/login", userCtrl.userLogin);

module.exports = router;