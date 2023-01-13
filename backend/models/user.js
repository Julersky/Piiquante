const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');


const usersSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },//Le unique permet d'avoir un seul utilisateur. On va installer le package mongose unique validator
    password: { type: String, required: true },
  });

usersSchema.plugin(uniqueValidator);//methode plugin pour lui raccrocher un plugin

module.exports = mongoose.model('User', usersSchema);