import { ObjectId } from "mongodb";
import mongoose, {Document, Schema, Model, Types, model} from 'mongoose';
//const mongoose = require('mongoose')
//import umbrellaInterface from './umbrella.types'

//import { Schema } from "mongoose";
import { findOneOrCreate } from "./umbrellaHolder.statics";
import { setLastUpdated } from "./umbrellaHolder.methods";
const UmbrellaSchema = new Schema({
    user_id: String,
    objectId: String,
    umbrellaHolder: Array<umbrellaHolder>,
    dateOfEntry: {type: Date,default: new Date()},
    lastUpdated: {type: Date,default: new Date()}
});
UmbrellaSchema.statics.findOneOrCreate = findOneOrCreate;
UmbrellaSchema.methods.setLastUpdated = setLastUpdated;
export default UmbrellaSchema;


interface umbrellaHolder{
    id: string,
}

