"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOneOrCreate = void 0;
var UmbrellaHolder = require("./umbrellaHolder.schema");
function findOneOrCreate(setId) {
    return __awaiter(this, void 0, void 0, function* () {
        const record = yield this.findOne({ setId });
        if (record) {
            return record;
        }
        else {
            return this.create({ setId });
        }
    });
}
exports.findOneOrCreate = findOneOrCreate;
// db.createCollection(
//     "Umbrella",
//     {
//     }
// )
function transform(ts) {
    var object = {};
    var id = ts.objectId.toString();
    var obj = { id: id };
    var array = [];
    // var array: new = []
    //class ts to umbrella class
    new UmbrellaHolder({
        user_id: ts.user_id,
        umbrellaHolder: array.push(obj),
        dateOfEntry: ts.dateOfEntry,
        lastUpdated: ts.lastUpdated,
    })
        .save().then((newObj) => {
        console.log('newUmbrellaHolder created' + newObj._id);
        object = newObj;
    });
    return object;
}
exports.default = transform;
