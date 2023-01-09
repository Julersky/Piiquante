const express = require('express');
const app = express();
const mongoose = require('mongoose');
module.exports = app;
module.exports = mongoose;


mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://Julersky:MongoDB1993@cluster0.0wy37de.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));