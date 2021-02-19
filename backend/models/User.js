// Import des packages
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Création du schéma de données nécéssaire pour chaque utilisateur
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

// Vérification que l'email est unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);