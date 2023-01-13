exports.displayAllSauces = (req, res, next) => {
    Thing.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
  };
// exports.displayOneSauce = 
// exports.updateSauce = 
// exports.deleteSauce = 
// exports.likeSauce = 