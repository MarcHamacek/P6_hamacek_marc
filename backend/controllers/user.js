// Import des packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MaskData = require('maskdata');
const PasswordValidator = require('password-validator');

const passwordSchema = new PasswordValidator();
passwordSchema
    .is().min(8)
    .is().max(30)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .has().not().spaces();


// Création de signup (enregistrement de compte utilisateur)
exports.signup = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    return res.status(400).json({message: 'Le mot de passe doit contenir une majuscule, une minuscule, un symbole et un chiffre. Sa longueur doit être entre 8 et 30 caractères'});
  }
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