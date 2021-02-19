// Import des packages nécéssaire
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require("helmet");
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

// Ajout des routes d'identification et d'authentification
const userRoutes = require('./routes/user');

//Ajout des routes Sauces
const saucesRoutes = require('./routes/sauces');


// Enregistrement des routeurs, activation d'helmet et de bodyparser
app.use(helmet());
app.use(bodyParser.json());
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


// Exporte l'application
module.exports = app;