const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const express = require('express');// le mot require permet d'inclure un module node

const app = express();

const path = require('path');

const cors = require('cors');

const userRoutes = require('./routes/users')

const saucesRoutes = require('./routes/sauces');

mongoose.connect('mongodb+srv://Julersky:MongoDB1993@cluster0.0wy37de.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));






//Middleware

app.use(express.json());  // Middleware qui permet de recuperer toute les requetes en json

app.use(cors());



app.use((req, res, next) => {// CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});




//Routes

app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app; // On va exporter notre variable app pour qu'elle soit utilisable sur tout les autres fichiers

