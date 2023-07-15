const Panier = require('../models/panier');

// Ajouter un panier
const ajouterPanier = async (req, res) => {
  try {
    const {user, produits } = req.body;

    const panier = new Panier({
      user: user,
      produits
    });

    const nouveauPanier = await panier.save();

    res.status(201).json(nouveauPanier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Afficher tous les paniers
const afficherPaniers = async (req, res) => {
  try {
    const paniers = await Panier.find().populate('user', 'nom email');

    res.json(paniers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Afficher un panier 
const afficherOnePanier = async (req, res) => {
  try {
    const panier = await Panier.findById(req.params.id).populate('user', 'nom email');

    if (!panier) {
      return res.status(404).json({ error: 'Panier non trouvé' });
    }

    res.json(panier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modifier un panier 
const modifierPanier = async (req, res) => {
  try {
    const panier = await Panier.findById(req.params.id);

    if (!panier) {
      return res.status(404).json({ error: 'Panier non trouvé' });
    }

    panier.user = req.body.user;
    panier.produits = req.body.produits;

    const panierMisAJour = await panier.save();

    res.json(panierMisAJour);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un panier 
const supprimerPanier = async (req, res) => {
  try {
    const panier = await Panier.findByIdAndRemove(req.params.id);

    if (!panier) {
      return res.status(404).json({ error: 'Panier non trouvé' });
    }

    res.json({ message: 'Panier supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ajouter un produit dans un panier
const ajouterProduitDansPanier = async (req, res) => {
    try {
      const { panierId, produitId } = req.params;
  
      const panier = await Panier.findById(panierId);
  
      if (!panier) {
        return res.status(404).json({ error: 'Panier non trouvé' });
      }
  
      // Vérifier si le produit existe déjà dans le panier
      if (panier.produits.includes(produitId)) {
        return res.status(400).json({ error: 'Le produit existe déjà dans le panier' });
      }
  
      panier.produits.push(produitId);
      await panier.save();
  
      res.json(panier);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

// Supprimer un produit d'un panier
const supprimerProduitDuPanier = async (req, res) => {
    try {
      const { panierId, produitId } = req.params;
  
      const panier = await Panier.findById(panierId);
  
      if (!panier) {
        return res.status(404).json({ error: 'Panier non trouvé' });
      }
  
      // Vérifier si le produit existe dans le panier
      const produitIndex = panier.produits.indexOf(produitId);
      if (produitIndex === -1) {
        return res.status(400).json({ error: 'Le produit n\'existe pas dans le panier' });
      }
  
      panier.produits.splice(produitIndex, 1);
      await panier.save();
  
      res.json(panier);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports = {
  ajouterPanier,
  afficherPaniers,
  afficherOnePanier,
  modifierPanier,
  supprimerPanier,
  ajouterProduitDansPanier,
  supprimerProduitDuPanier
};
