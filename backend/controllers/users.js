const bcrypt = require('bcrypt');

const User = require('../models/user');


exports.signup =  (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
      .then(() => res.status(201).json({message: 'Utilisateur enregistré!'}))
      .catch(error => res.status(400).json({error}));
  })
  .catch(error => res.status(500).json({ error }));
}; 

exports.userLogin = (req, res, next) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if(user === null){
        return res.status(401).json({message: 'Identifiant ou mot de passe incorrect'})
      }else{
        bcrypt.compare(req.body.password, user.password)//fontion compare qui permet de comparer le hash fourni par l'utilisateur et les hash de la BDD
          .then(valid => {
            if(!valid){
                return res.status(401).json({message:'Identifiant ou mot de passe incorrect'})
            }else{
              res.status(200).json({
                  userId: user._id,
                  token: 'TOKEN'
              })
            }
          })
          .catch(error => {
            res.status(500).json({error});
          })
      }
    })
    .catch(error => {
      res.status(500).json({error})
    })
}