// Import du package mongoose
const mongoose = require('mongoose');

// Définition du modèle attendu pour les sauces
const saucesSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: [String], default: [], required: true },
    usersDisliked: { type: [String], default: [], required: true },
});

module.exports = mongoose.model('Sauces', saucesSchema);