// Import des packages
const Sauces = require('../models/Sauces');
const fs = require('fs');
const {
    json
} = require('body-parser');

// Fonction de création de sauce
exports.createSauces = (req, res, next) => {
    const saucesObject = JSON.parse(req.body.sauce);
    delete saucesObject._id;
    console.log(req.body.sauce);
    const sauces = new Sauces({
        ...saucesObject,
        likes: 0,
        dislikes: 0,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauces.save()
        .then(() => res.status(201).json({
            message: 'Sauce enregistrée !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

// Fonction de modification de sauce
exports.modifySauces = (req, res, next) => {
    const saucesObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    };
    Sauces.updateOne({
            _id: req.params.id
            //Fonction Suppression Sauce
        }, {
            ...saucesObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Sauce modifiée !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

// Fonction de suppression de sauce
exports.deleteSauces = (req, res, next) => {
    Sauces.findOne({
            _id: req.params.id
        })
        .then(sauces => {
            const filename = sauces.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauces.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: 'Sauce supprimée !'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            });
        })
        .catch(error => res.status(500).json({
            error
        }));
};

// Fonction de récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({
            _id: req.params.id
        })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({
            error
        }));
};

// Fonction de récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({
            error
        }));
};

// Fonction de gestion des likes / dislikes
exports.addLikes = (req, res, next) => {
    Sauces.findOne({
            _id: req.params.id
        })
        .then((sauce) => {
            switch (req.body.like ) {
                // Selon les différents cas de figures
                // L'utilisateur appuie sur le bouton like ou dislike sur lequel il a déjà appuyé
                case 0 :
                    // Si l'utilisateur aime déjà la sauce
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        // On retire l'userId du tableau et on décrémente de 1 "J'aime"
                        Sauces.updateOne({
                                _id: req.params.id
                            }, {
                                $pull: {
                                    usersLiked: req.body.userId
                                },
                                $inc: {
                                    likes: -1
                                },
                                _id: req.params.id
                            })
                            .then(() => res.status(201).json({
                                message: 'Le like de la sauce a été retiré !'
                            }))
                            .catch((error) => res.status(400).json({
                                error
                            }));
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        // Si l'utilisateur a déjà appuyé sur le bouton dislike de la sauce
                        // On retire l'userId du tableau et on décrémente de 1 "Je n'aime pas"
                        Sauces.updateOne({
                                _id: req.params.id
                            }, {
                                $pull: {
                                    usersDisliked: req.body.userId
                                },
                                $inc: {
                                    dislikes: -1
                                },
                                _id: req.params.id
                            })
                            .then(() => res.status(201).json({
                                message: 'Le dislike de la sauce a été retiré !'
                            }))
                            .catch((error) => res.status(400).json({
                                error
                            }));
                    }
                    break;

                case 1 /* L'utilisateur aime la sauce */ :
                    if (!sauce.usersLiked.includes(req.body.userId)) {
                        // Si l'utilisateur n'a pas déjà aimé la sauce
                        // On ajoute le userId au tableau et on incrémente de 1 "J'aime"
                        Sauces.updateOne({
                                _id: req.params.id
                            }, {
                                $push: {
                                    usersLiked: req.body.userId
                                },
                                $inc: {
                                    likes: 1
                                },
                                _id: req.params.id
                            })
                            .then(() => res.status(201).json({
                                message: 'La sauce a été likée !'
                            }))
                            .catch((error) => res.status(400).json({
                                error
                            }));
                    }
                    break;

                case -1 /* L'utilisateur n'aime pas la sauce */ :
                    if (!sauce.usersDisliked.includes(req.body.userId)) {
                        // Si l'utilisateur n'a pas déjà appuyé sur le bouton "dislike" de la sauce
                        // On ajoute le userId au tableau et on incrémente de 1 "Dislike"
                        Sauces.updateOne({
                                _id: req.params.id
                            }, {
                                $push: {
                                    usersDisliked: req.body.userId
                                },
                                $inc: {
                                    dislikes: 1
                                },
                                _id: req.params.id
                            })
                            .then(() => res.status(201).json({
                                message: 'La sauce a été dislikée !'
                            }))
                            .catch((error) => res.status(400).json({
                                error
                            }));
                    }
                    break;

                default:
                    throw {
                        error: 'Un problème est survenu'
                    };
            }
        })
        .catch((error) => res.status(400).json({
            error
        }));
};