let mongoose = require('mongoose');

let cycleSchema = new mongoose.Schema({
    dateString: {
        type: String,
        required: true,
        unique: true
    },
    cycleNumber: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Cycle', cycleSchema);