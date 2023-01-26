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
  const objectLikes = req.body.like;
  const objectUser = req.body.userId
  console.log("like de la requete",objectLikes,typeof(req.body.like));
  console.log(req.params.id)
  Sauces.findOne({ _id: req.params.id })
  .then((sauce) => {
    console.log(sauce)
    if (objectLikes === -1) {
      if (!sauce.usersDisliked.includes(objectUser)) {

        Sauces.updateOne({ _id: req.params.id},
            {
                $push: {usersDisliked: req.body.userId},
                $inc: {dislikes: 1},
            }).then(() => {
    
            res.status(200).json({message: "Dislike ajouté avec succès."});
    
        }).catch((error) => {
    
            res.status(400).json({message: "Une erreur inattendue s'est produite lors de l'ajout du dislike sur la sauce. Veuillez réessayé."});
    
        });
    
      } else {
    
        res.status(404).json({"message": "Désolé vous avez déjà mit un dislike sur cette sauce."});
    
      }
    }
    if (objectLikes === 1){
      if (!sauce.usersLiked.includes(objectUser)) {

        Sauces.updateOne({ _id: req.params.id},
            {
                $push: {usersLiked: req.body.userId},
                $inc: {likes: 1},
            }).then(() => {
    
            res.status(200).json({message: "Like ajouté avec succès."});
    
        }).catch((error) => {
    
            res.status(400).json({message: "Une erreur inattendue s'est produite lors de l'ajout du like sur la sauce. Veuillez réessayé."});
    
        });
    
    } else {
    
        res.status(404).json({"message": "Désolé vous avez déjà mit un like sur cette sauce."});
    
    }

    }

    if (objectLikes === 0){
      if (sauce.usersLiked.includes(objectUser)){
        Sauces.updateOne({ _id: req.params.id},
          {
              $pull: {usersLiked: {$in : [req.body.userId]}},
              $inc: {likes: -1},
          }).then(() => {
  
          res.status(200).json({message: "Like supprimé avec succès."});
  
      }).catch((error) => {
  
          res.status(400).json({message: "Une erreur inattendue s'est produite lors de la suppression du like sur la sauce. Veuillez réessayé."});
  
      });
      }else if (sauce.usersDisliked.includes(objectUser)){
        Sauces.updateOne({ _id: req.params.id},
          {
              $pull: {usersDisliked: {$in : [req.body.userId]}},
              $inc: {dislikes: -1},
          }).then(() => {
  
          res.status(200).json({message: "Dislike supprimé avec succès."});
  
      }).catch((error) => {
  
          res.status(400).json({message: "Une erreur inattendue s'est produite lors de la suppression du dislike sur la sauce. Veuillez réessayé."});
  
      });
      }
    }

  })
  .catch((error) => { res.status(500).json({ error:"Sauce non trouvée" }) })

}