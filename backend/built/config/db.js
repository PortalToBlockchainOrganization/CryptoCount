var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mongoose = require("mongoose");
require("dotenv").config();
const server = "127.0.0.1:27017";
const database = "cryptocount";
const MONGOURI = `mongodb+srv://admin:${process.env.creds}@postax.a1vpe.mongodb.net/AnalysisDep?retryWrites=true&w=majority`;
console.log(MONGOURI);
console.log(MONGOURI);
const InitiateMongoServer = () => __awaiter(this, void 0, void 0, function* () {
    try {
        yield mongoose.connect(MONGOURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            userFindAndModify: false,
        });
        console.log("Database connection successful");
    }
    catch (e) {
        console.log(`Database connection error ${e}`);
        throw e;
    }
});
module.exports = InitiateMongoServer;
