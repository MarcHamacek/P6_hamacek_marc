// Import du package mongoose
const mongoose = require('mongoose');

// Définition du modèle attendu pour les sauces
const saucesSchema = mongoose.Schema({
    userId: { type: String, require: true },
    name: { type: String, require: true },
    manufacturer: { type: String, require: true },
    description: { type: String, require: true },
    mainPepper: { type: String, require: true },
    imageUrl: { type: String, require: true },
    heat: { type: Number, require: true },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: [String], default: [], required: true },
    usersDisliked: { type: [String], default: [], required: true },
});

module.exports = mongoose.model('Sauces', saucesSchema);