const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const usersSchema = mongoose.Schema({
  //Le unique permet d'avoir un seul utilisateur. On va installer le package mongose unique validator
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//methode plugin pour lui raccrocher un plugin
usersSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", usersSchema);
