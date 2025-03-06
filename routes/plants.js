var express = require('express');
var router = express.Router();

const uniqid = require('uniqid')
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const User = require("../models/users");
const Plant = require("../models/plants")

// upload photo sur cloundinary
router.post('/upload', async (req, res) => {

    const photoPath = `./tmp/${uniqid()}.jpg`;
    const resultMove = await req.files.photoFromFront.mv(photoPath);

    if (!resultMove) {
        const resultCloudinary = await cloudinary.uploader.upload(photoPath);
        fs.unlinkSync(photoPath);
        res.json({ result: true, url: resultCloudinary.secure_url });
    } else {
        res.json({ result: false, error: resultCopy });
    }
});

// route post pour enregister une plante
router.post('/newPlant/:userToken', async (req, res) => {
    try {
        // Vérification des champs requis
        // if (!req.body.name || !req.body.description || !req.body.wateringFrequency || !req.body.cuisine || !req.body.toxicity || !req.body.seasonality || !req.body.sunExposure || !req.body.photo) {
        //     return res.json({ result: false, error: "champs manquants" })
        // }

        // Recherche de l'utilisateur par token
        const user = await User.findOne({ token: req.params.userToken });
        if (!user) {
            return res.json({ result: false, error: 'User not found' });
        }

        // Création et sauvegarde de la nouvelle plante
        const newPlant = new Plant({
            name: req.body.name,
            description: req.body.description,
            wateringFrequency: req.body.wateringFrequency,
            cuisine: req.body.cuisine,
            toxicity: req.body.toxicity,
            seasonality: req.body.seasonality,
            sunExposure: req.body.sunExposure,
            photo: req.body.photo,
            user: user._id,
        });

        const savedPlant = await newPlant.save();

        res.json({ result: true, data: savedPlant });

    } catch (error) {
        console.error('Error creating new plant:', error);
        res.status(500).json({ result: false, error: 'Internal Server Error' });
    }
});


// route get pour récupérer toutes les plantes d'un user
router.get('/:userToken', async (req, res) => {
    try {
        const user = await User.findOne({ token: req.params.userToken })
        if (!user) {
            return res.status(404).json({ result: false, error: 'User not found' });
        }

        const plants = await Plant.find({ user: user._id }).select('-user')
        
        if (plants.length === 0) {
            return res.json({ result: false, error: 'No plant found' });
        }

        res.json({ result: true, data: plants })

    } catch (error) {
        console.error('Error creating new plant:', error);
        res.status(500).json({ result: false, error: 'Internal Server Error' });
    }
})

module.exports = router;