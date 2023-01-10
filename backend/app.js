const mongoose = require('mongoose');
mongoose.set('strictQuery', true);


const express = require('express');// le mot require permet d'inclure un module node (ici http )

const app = express();

const cors = require('cors');

const user = require('./models/users');

mongoose.connect('mongodb+srv://Julersky:MongoDB1993@cluster0.0wy37de.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

module.exports = app; // On va exporter notre variable app pour qu'elle soit utilisable sur tout les autres fichiers




//Middleware

app.use(express.json());  // Middleware qui permet de recuperer toute les requetes en json

app.use(cors());

app.use((req, res, next) => {// CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});





//Routes POST

app.post("/api/auth/signup",(req, res, next) => {//Recuperer les informations du client
  const newUser = new user({
    ...req.body// Les ... sont l'operateur spread qui permet de copier le corps de la requete 
  });
  newUser.save()//enregistre l'objet dans la base et retourne un promise
    .then(() => res.status(201).json({message : 'User enregistré'}))
    .catch(() => res.status(400).json({error}))
}); 

app.post("/api/auth/login")
app.post("/api/sauces")
app.post("/api/sauces/:id/like")

//Routes GET
app.get("/api/sauces")
app.get("/api/sauces/:id")


  

