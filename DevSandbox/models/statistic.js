let mongoose = require('mongoose');

let statisticSchema = new mongoose.Schema({
    dateString: {  // the number of dyas since timestamp origin
        type: String,
        required: true,
        unique: true
    },
    totalSupply: {
        type: Number,
    }
});

module.exports = mongoose.model('Statistic', statisticSchema);