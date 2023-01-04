"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//const mongoose = require('mongoose')
//import umbrellaInterface from './umbrella.types'
//import { Schema } from "mongoose";
const umbrellaHolder_statics_1 = require("./umbrellaHolder.statics");
const umbrellaHolder_methods_1 = require("./umbrellaHolder.methods");
const UmbrellaSchema = new mongoose_1.Schema({
    user_id: String,
    objectId: String,
    umbrellaHolder: (Array),
    dateOfEntry: { type: Date, default: new Date() },
    lastUpdated: { type: Date, default: new Date() }
});
UmbrellaSchema.statics.findOneOrCreate = umbrellaHolder_statics_1.findOneOrCreate;
UmbrellaSchema.methods.setLastUpdated = umbrellaHolder_methods_1.setLastUpdated;
exports.default = UmbrellaSchema;
