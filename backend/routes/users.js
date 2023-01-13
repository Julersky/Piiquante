const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/users');




//Routes POST(create)

  //Sign in

  router.post("/signup", userCtrl.signup);
  
    //Log in
  
  router.post("/login", userCtrl.userLogin);

  module.exports = router;