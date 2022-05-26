"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let mongoose = require("mongoose");
let cycleSchema = new mongoose.Schema({
    dateString: {
        type: String,
        required: true,
        unique: true,
    },
    cycleNumber: {
        type: Number,
        required: true,
    },
});
exports.default = mongoose.model('TezosCycles', cycleSchema);
