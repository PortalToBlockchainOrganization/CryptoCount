"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: String,
    googleId: String,
    setIds: Array,
    password: String,
    email: String,
    joined: { type: Date, default: Date.now },
});
const User = mongoose.model('user', userSchema);
exports.default = User;
