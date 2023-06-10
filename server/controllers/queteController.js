const Quete = require("../models/quete");


const ajouterQuete = async (req, res) => {
    try {
      const nouvelleQuete = await Quete.create(req.body);
      res.status(201).json(nouvelleQuete);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

const afficherQuetes =  async (req, res) => {
    try {
      const quetes = await Quete.find().populate('livresRequis');
      res.json(quetes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

const afficherOneQuete = async (req, res, next) => {
    try {
        const quete = await Quete.findById(req.params.id).populate('livresRequis');
        if (quete == null) {
          return res.status(404).json({ message: 'Quête introuvable' });
        }
        res.quete = quete;
        next();
      } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const modifierQuete = async (req, res) => {
    try {
      const quete = await Quete.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!quete) {
        return res.status(404).json({ error: 'Quete not found' });
      }
      res.json(quete);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const supprimerQuete = async (req, res) => {
    try {
      const quete = await Quete.findByIdAndRemove(req.params.id);
      if (!quete) {
        return res.status(404).json({ error: 'Quete not found' });
      }
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


//----------------------------------- Trier ------------------------------------------------//
const sortQuetes = async (req, res) => {
  try {
    const { sortBy } = req.query;
    const quetes = await Quete.find().sort(sortBy);
    res.json(quetes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//------------------------------- Filtrage -------------------------------------------------//
const filterQuetes = async (req, res) => {
  try {
    const { filterBy } = req.query;
    const quetes = await Quete.find(filterBy);
    res.json(quetes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//---------------------------- Recherche --------------------------------------------------//
const searchQuetes = async (req, res) => {
  try {
    const { keyword } = req.query;
    const quetes = await Quete.find({
      $or: [
        { titre: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { theme: { $regex: keyword, $options: 'i' } },
      ],
    });
    res.json(quetes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    ajouterQuete,
    afficherQuetes,
    afficherOneQuete,
    modifierQuete,
    supprimerQuete,
    sortQuetes,
    filterQuetes, 
    searchQuetes
}