"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UmbrellaHolderModel = void 0;
const mongoose_1 = require("mongoose");
const umbrellaHolder_schema_1 = __importDefault(require("./umbrellaHolder.schema"));
exports.UmbrellaHolderModel = (0, mongoose_1.model)("umbrellaHolder", umbrellaHolder_schema_1.default);
