// Import des packages nécéssaire
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
require('dotenv').config();


// Configure et autorise les accès extérieurs
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Connexion à la base de données MongoDB
mongoose.connect(process.env.DB_URL,
  { useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

//Ajout de la limite de tentative de connexion

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50 // Limite de 50 connexions par addresse IP
});

// Ajout des routes d'identification et d'authentification
const userRoutes = require('./routes/user');

//Ajout des routes Sauces
const saucesRoutes = require('./routes/sauces');


// Enregistrement des routeurs, activation d'helmet et de bodyparser
app.use(helmet());
app.use(bodyParser.json());
app.use(limiter);
app.use(xss());
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(8080);

// Exporte l'application
module.exports = app;