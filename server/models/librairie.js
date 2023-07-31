const mongoose = require('mongoose');

const librairieSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    livres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Livre' }],
});

const Librairie = mongoose.model('Librairie', librairieSchema);

module.exports = Librairie;

