require("dotenv").config();

const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const express = require("express");

const app = express();

const path = require("path");

const cors = require("cors");

const userRoutes = require("./routes/users");

const saucesRoutes = require("./routes/sauces");

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//Middleware

// Middleware qui permet de recuperer toute les requetes en json
app.use(express.json());

// CORS
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

// On va exporter notre variable app pour qu'elle soit utilisable sur tout les autres fichiers
module.exports = app;
