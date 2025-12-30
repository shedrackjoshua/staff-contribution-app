const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    day: {
        type: Date,
        default: Date.now,
        required: true
    }
}, { timestamps: true, collection: 'contributions' });
// Ensure the model uses the correct schema variable and writes to the
// default 'contributions' collection (model name lowercased & pluralized).
module.exports = mongoose.model('Contribution', contributionSchema)