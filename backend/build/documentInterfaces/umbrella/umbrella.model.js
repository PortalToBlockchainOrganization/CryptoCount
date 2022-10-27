"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UmbrellaModel = void 0;
const mongoose_1 = require("mongoose");
const umbrella_schema_1 = __importDefault(require("./umbrella.schema"));
exports.UmbrellaModel = (0, mongoose_1.model)("umbrella", umbrella_schema_1.default);
