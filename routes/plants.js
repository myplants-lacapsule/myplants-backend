var express = require('express');
var router = express.Router();

const uniqid = require('uniqid')
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const uid2 = require("uid2");

const { checkBody } = require("../modules/checkBody");

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
        if (!checkBody(req.body, ["name", "description", "wateringFrequency", "cuisine", "toxicity", "seasonality", "sunExposure", "photo"])) {
            res.json({ result: false, error: "Missing or empty fields" });
            return;
        }

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
            isWatered: false,
            cuisine: req.body.cuisine,
            toxicity: req.body.toxicity,
            seasonality: req.body.seasonality,
            sunExposure: req.body.sunExposure,
            photo: req.body.photo,
            lastWatering: Date.now(),
            token: uid2(32),
            user: user._id,
        });

        const savedPlant = await newPlant.save();

        res.json({ result: true, data: savedPlant });

    } catch (error) {
        console.error('Error creating new plant:', error);
        res.status(500).json({ result: false, error: 'Internal Server Error' });
    }
});

// Route get pour récupérer toutes les plantes d'un user
router.get('/:userToken', async (req, res) => {
    try {

        const userToken = req.params.userToken

        if (!userToken) {
            return res.status(400).json({ result: false, error: "User token is required" });
        }

        const user = await User.findOne({ token: userToken })
        if (!user) {
            return res.status(404).json({ result: false, error: 'User not found' });
        }

        const plants = await Plant.find({ user: user._id }).select('-user -_id')

        if (plants.length === 0) {
            return res.json({ result: false, error: 'No plant found' });
        } else {

            const dDay = new Date(Date.now()); // initialisation de la date du jour

            let numberPlantNeedsWater = 0; // par défaut, pas de plante à arroser

            const plantsWithWaterStatus = plants.map((plant) => {
                const lastWatering = new Date(plant.lastWatering);  // conversion en date de lastWatering
                const wateringFrequency = plant.wateringFrequency;
                const daysSinceLastWatering = Math.floor((dDay - lastWatering) / 86400000); // Obtenir le nombre de jours depuis le dernier arrosage
                const isPlantNeedsWater = daysSinceLastWatering >= wateringFrequency; // Si temps d'arrosage dépassé

                isPlantNeedsWater && (numberPlantNeedsWater += 1) // Alors +1 au compteur nombre de plantes qui ont besoin d'arrosage

                // Ajouter le champ isWatered à chaque plante pour le renvoyer au front
                return {
                    ...plant.toObject(),
                    isWatered: !isPlantNeedsWater, // true si la plante a besoin d'arrosage
                };
            });

            // Renvoi des données et du nombre de plantes qui ont besoin d'être arrosées
            res.json({ result: true, data: plantsWithWaterStatus, numberPlantNeedsWater: numberPlantNeedsWater });
        }
    } catch (error) {
        console.error('Error creating new plant:', error);
        res.status(500).json({ result: false, error: 'Internal Server Error' });
    }
})

// Route pour delete une plante de l'inventaire
router.delete('/deletePlant/:plantToken', async (req, res) => {
    try {

        const plantToken = req.params.plantToken

        if (!plantToken) {
            return res.status(400).json({ result: false, error: "Plant token is required" });
        }

        const plantDeleted = await Plant.deleteOne({ token: plantToken })

        if (plantDeleted.deletedCount === 1) {
            res.json({ result: true, info: "plant deleted" })
        } else {
            res.json({ result: false, error: "plant not deleted" })
        }

    } catch (error) {
        console.error('Error deleting a plant:', error);
        res.status(500).json({ result: false, error: 'Internal Server Error' });
    }
})

// route pour update la date du dernier arrosage
router.put('/updateLastWatering/:plantToken', async (req, res) => {
    try {

        const plantToken = req.params.plantToken

        if (!plantToken) {
            return res.status(400).json({ result: false, error: "Plant token is required" });
        }

        const updateLastWatering = await Plant.updateOne({ token: plantToken }, { lastWatering: new Date() })

        if (updateLastWatering.modifiedCount === 1) {
            res.json({ result: true, lastWatering: new Date() })
        } else {
            res.json({ result: false, error: "Error updating the plant's last watering date" })
        }

    } catch (error) {
        console.error('Error updating a plant:', error);
        res.status(500).json({ result: false, error: 'Internal Server Error' });
    }
})

module.exports = router;