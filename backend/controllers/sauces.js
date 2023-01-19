const Sauces = require('../models/sauces');
const fs = require('fs');

exports.displayAllSauces = (req, res, next) => {
  Sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.displayOneSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  delete sauceObject._userId;
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non-autorisé ' })
      } else {
        Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
          .catch(error => res.status(401).json({ error }))
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    })
}

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const newSauce = new Sauces({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  newSauce.save()
    .then(() => { res.status(201).json({ message: 'Sauce enregistrée' }) })
    .catch((error) => { res.status(400).json({ error }) })
}

exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non-autorisé ' })
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Sauce supprimée!' })
            })
            .catch(error => res.status(401).json({ error }))
        })
      }
    })
    .catch(error => {
      res.status(500).json({ error })
    })

}

exports.likeSauce = (req, res, next) => {
  console.log(req.body)
  const sauceObject = req.body;
  const objectLikes = sauceObject.like;
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      console.log(sauce)
      const userLiked = sauce.usersLiked;
      const userdisliked = sauce.usersDisliked;
      let oolike = sauce.likes;
      const dislike = sauce.dislikes;
      if (objectLikes === 1) {
        console.log('trouvé')
        sauce.usersLiked.push(sauceObject.userId);
        console.log("nouveau user liked", userLiked)
        sauce.likes++
        oolike++//Faut-il verifier que l'id est dans l'array??
        console.log("nouveau like", oolike)
        console.log("sauce like", sauce.likes)
        console.log(sauce)
        Sauces.updateOne({ _id: req.params.id }, { sauce, _id: req.params.id })
          .then(() => {
            console.log("nouvelle sauce mise a jour", sauce)
            res.status(200).json({ message: 'Sauce modifiée!' })

          })
          .catch((error) => {
            console.log(error);
            res.status(400).json({ error });
          })

      }
      if (objectLikes === -1) {

      }
      if (objectLikes === 0) {

      }
    })
    .catch((error) => { res.status(500).json({ error }) })

};
