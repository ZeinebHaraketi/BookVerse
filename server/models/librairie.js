const mongoose = require('mongoose');

const librairieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    },
    livres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Livre' }],
});

const Librairie = mongoose.model('Librairie', librairieSchema);

module.exports = Librairie;

