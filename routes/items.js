var express = require("express");
var router = express.Router();

require("../models/connection");
const Item = require("../models/items");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Route pour créer un item avec image uploadée sur Cloudinary
router.post('/newItem/:userToken', upload.single('photo'), (req, res) => {
 if (!checkBody(req.body, ["isGiven", "isPlant", "title", "description", "price", "height", "condition"])) {
    return res.json({ result: false, error: "Missing or empty fields" });
  }

// Vérifie que le fichier a bien été envoyé
  if (!req.file) {
    return res.json({ result: false, error: "No file uploaded" });
  }
// Vérifie le user à partir du token dans l'url
    User.findOne({ token: req.params.userToken })
        .then(data => {
            if (!data) {
                return res.json({ result: false, error: 'User not found' });
            }

             // Uploader le fichier sur Cloudinary
            cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
            return res.json({ result: false, error: error.message });
        }
            // Récupérer l'URL sécurisée de l'image uploadée
            const photoUrl = result.secure_url;

             const newItem = new Item({
                    isGiven: req.body.isGiven,
                    isPlant: req.body.isPlant,
                    title: req.body.title,
                    description: req.body.description,
                    photo: photoUrl,
                    price: req.body.price,
                    height: req.body.height,
                    condition: req.body.condition,
                    token: uid2(32),
                    createdBy: data._id,
                    createdAt: Date.now(), 
             });
            newItem.save()
            res.json({ result: true });
            }      
            )
            .end(req.file.buffer); // envoie le buffer du fichier à Cloudinary 

});
})

module.exports = router;
