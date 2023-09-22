const User = require('../models/users');
const Event = require('../models/event');


const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


//------------------------ Cloudinary Infos -----------------------------------------------//
cloudinary.config({
    cloud_name: 'djjimxala',
    api_key: '835443316573354',
    api_secret: '-kCoGza7xNvaAIHDDjGUvr3GRDA'
});
// Configurez le stockage Cloudinary pour Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'BookV', // Spécifiez le dossier dans lequel les images seront stockées sur Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png'] // Définissez les formats de fichier autorisés
    }
});

//------------------------- Ajouter Event ---------------------------------------------//
const ajoutEvent = async (req, res) => {
    try {
      const { titre, description, date,imageE,time,localisation } = req.body;
  
  
      // Télécharger l'image sur Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
  
      const event = new Event({
        titre,
        description,
        date,
        imageE: result.secure_url, // Stockez l'URL sécurisée de l'image de Cloudinary dans le champ 'image' du livre
        time,
        localisation
    });
  
      await event.save();
  
      res.status(201).json('Event créé avec succès');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};


//------------------------- Afficher tout les Events ---------------------------------------------//
const getEvents = async(req, res)=>{
    try {

        const events = await Event.find();
        res.status(200).json(events);
 
    } catch (error) {
         res.status(404).json({ message: error.message });
    }
}


//------------------------- Afficher un seul Event ---------------------------------------------//
 const getEvent = async (req, res) => {
    const { id } = req.params; 
  
    try {
      const event = await Event.findById(id); 
      if (!event) {
        return res.status(404).json({ message: 'Event non trouvé' });
      }
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};


module.exports = {
    ajoutEvent,
    getEvents,
    getEvent
}