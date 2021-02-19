// Import des packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MaskData = require('maskdata');

// Création de signup (enregistrement de compte utilisateur)
exports.signup = (req, res, next) => {
  const maskedMail = MaskData.maskEmail2(req.body.email);
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: maskedMail,
        password: hash,
      });
      user.save()
        .then(() => res.status(201).json({
          message: 'Utilisateur créé !'
        }))
        .catch((error) => res.status(400).json({
          error
        }));
    })
    .catch(error => res.status(500).json({
      error
    }));
};

// Création de login (connexion du compte utilisateur)
exports.login = (req, res, next) => {
  const maskedMail = MaskData.maskEmail2(req.body.email);
  User.findOne({
      email: maskedMail
    })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          error: 'Utilisateur non trouvé !'
        });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({
              error: 'Mot de passe incorrect !'
            })
          }
          res.status(200).json({
            userID: user._id,
            token: jwt.sign({
                userId: user._id
              },
              'RANDOM_TOKEN_SECRET', {
                expiresIn: '24h'
              }
            )
          });
        })
        .catch(error => res.status(500).json({
          error
        }));
    })
    .catch(error => res.status(500).json({
      error
    }));
};