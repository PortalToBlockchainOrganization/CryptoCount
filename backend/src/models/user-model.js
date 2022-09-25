const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    googleId: String,
    setIds: Array,
})

const User = mongoose.model('user', userSchema)

module.exports = User;