const Sauces = require("../models/sauces");
const fs = require("fs");

/**
 * Fonction qui affiche toutes les sauces.
 *
 * @param {*} req La requete.
 * @param {*} res La réponse
 * @param {*} next Le middleware next.
 */
exports.displayAllSauces = (req, res, next) => {
  Sauces.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Fonction pour afficher une sauce par l'id
exports.displayOneSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// Fonction de mise a jour d'une sauce. Si l'image est changée elle sera supprimée dans le dossier image
exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  delete sauceObject._userId;
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ error: "Non-autorisé " });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauces.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ error: "Sauce modifiée!" }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Fonction pour creer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const newSauce = new Sauces({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  newSauce
    .save()
    .then(() => {
      res.status(201).json({ error: "Sauce enregistrée" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Fonction pour supprimer une sauce (supprime aussi l'image dans le dossier image)
exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ error: "Non-autorisé " });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ error: "Sauce supprimée!" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//Fonction pour liker ou disliker une sauce
exports.likeSauce = (req, res, next) => {
  const objectLikes = req.body.like;
  const objectUser = req.body.userId;
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (objectLikes === -1) {
        if (!sauce.usersDisliked.includes(objectUser)) {
          Sauces.updateOne(
            { _id: req.params.id },
            {
              $push: { usersDisliked: req.body.userId },
              $inc: { dislikes: 1 },
            }
          )
            .then(() => {
              res.status(200).json({ error: "Dislike ajouté avec succès." });
            })
            .catch((error) => {
              res
                .status(400)
                .json({
                  error:
                    "Une erreur inattendue s'est produite lors de l'ajout du dislike sur la sauce. Veuillez réessayer.",
                });
            });
        } else {
          res
            .status(404)
            .json({
              error: "Désolé vous avez déjà mis un dislike sur cette sauce.",
            });
        }
      }
      if (objectLikes === 1) {
        if (!sauce.usersLiked.includes(objectUser)) {
          Sauces.updateOne(
            { _id: req.params.id },
            {
              $push: { usersLiked: req.body.userId },
              $inc: { likes: 1 },
            }
          )
            .then(() => {
              res.status(200).json({ error: "Like ajouté avec succès." });
            })
            .catch((error) => {
              res
                .status(400)
                .json({
                  error:
                    "Une erreur inattendue s'est produite lors de l'ajout du like sur la sauce. Veuillez réessayer.",
                });
            });
        } else {
          res
            .status(404)
            .json({
              error: "Désolé vous avez déjà mis un like sur cette sauce.",
            });
        }
      }

      if (objectLikes === 0) {
        if (sauce.usersLiked.includes(objectUser)) {
          Sauces.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersLiked: { $in: [req.body.userId] } },
              $inc: { likes: -1 },
            }
          )
            .then(() => {
              res.status(200).json({ error: "Like supprimé avec succès." });
            })
            .catch((error) => {
              res
                .status(400)
                .json({
                  error:
                    "Une erreur inattendue s'est produite lors de la suppression du like sur la sauce. Veuillez réessayer.",
                });
            });
        } else if (sauce.usersDisliked.includes(objectUser)) {
          Sauces.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: { $in: [req.body.userId] } },
              $inc: { dislikes: -1 },
            }
          )
            .then(() => {
              res.status(200).json({ error: "Dislike supprimé avec succès." });
            })
            .catch((error) => {
              res
                .status(400)
                .json({
                  error:
                    "Une erreur inattendue s'est produite lors de la suppression du dislike sur la sauce. Veuillez réessayer.",
                });
            });
        }
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Sauce non trouvée" });
    });
};
