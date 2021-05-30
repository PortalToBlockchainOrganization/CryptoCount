//accout model schema
let mongoose = require('mongoose');

let accountSchema = new mongoose.Schema({
    //make account schema 
    firstname: String,
    lastname: String,
    email: String,
    accounts: [
        {
        internalID: String,
        password: String,
        }
    ],
    set1: [
        {
            alias: String,
            address: String,
            basis: Date,
            basisPrice: Number,
            fiat: String,
            //react situtation is a large situation
            noDepUnrealizedSet: Array,
            noDepRealizedSet: Array,
            mvdUnrealizedSet: Array,
            mvdRealizedSet: Array,
            depUnrealizedSet: Array,
            depRealizedSet: Array,
        }
    ],
    sessions: [
        {
            dates: Array,
            minutes: Array,
            IpAddress: Array,
        }
    ]
});

module.exports = mongoose.model('Account', accountSchema);