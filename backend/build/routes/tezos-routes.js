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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TezosSet_1 = __importDefault(require("../path/TezosSet"));
const umbrella_model_1 = require("../documentInterfaces/umbrella/umbrella.model");
const umbrellaHolder_model_1 = require("../documentInterfaces/umbrellaHolder/umbrellaHolder.model");
const generate_1 = __importDefault(require("../documentInterfaces/stateModels/generate"));
const realizing_1 = __importDefault(require("../documentInterfaces/stateModels/realizing"));
const saved_1 = __importDefault(require("../documentInterfaces/stateModels/saved"));
//import populateUmbrella from "../documentInterfaces/umbrella/umbrella.statics"
const fs_1 = require("fs");
const user_model_1 = __importDefault(require("../models/user-model"));
const axios_1 = __importDefault(require("axios"));
// const testObjectRealize = require("../testObjectRealize.js")
// const testObjectSave = require("../testObjectSave.js")
// const testObjectUpdate = require("../testObjectUpdate.js")
const router = require('express').Router();
//creates db object
router.post('/Generate/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("wtf tezos set" + req.body.fiat);
    var domainTezResp;
    try {
        domainTezResp = yield axios_1.default.get(`https://api.tzkt.io/v1/domains/${req.body.address}`);
        req.body.address = domainTezResp.data.address.address;
    }
    catch (error) {
        console.error(error);
    }
    console.log(req.body.address);
    let ts = new TezosSet_1.default();
    let unrealizedModel = {};
    yield ts.init(req.body.fiat, req.body.address, req.body.consensusRole).then(x => {
        (0, fs_1.writeFile)("test.json", JSON.stringify(ts, null, 4), function (err) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("JSON saved to " + "test.json");
                    //put ts in db by id
                    var setId;
                    //UMBRELLA AND UMBRELLA HOLDER        
                    let model = new umbrella_model_1.UmbrellaModel(ts);
                    console.log(model._id);
                    var str = model._id.toString();
                    var array = [{ "id": str }];
                    let holder = new umbrellaHolder_model_1.UmbrellaHolderModel({ umbrellaHolder: array });
                    //new UmrellaHolder(model)
                    //add user id to umbrella AND HOLDER 
                    model.user_id = req.body.user_id;
                    console.log('umrbellaholder model');
                    console.log(holder.umbrellaHolder[0].id);
                    model.umbrellaHolderId = holder._id;
                    console.log(model);
                    //UMBRELLA STATE MANAGEMENT CONSTRUCTION
                    //save the umbrella 
                    console.log(model.umbrellaHolderId);
                    yield model.save();
                    yield holder.save();
                    //pack the umbrella model into the umbrella holder
                    //let holder = new UmbrellaHolder(model)
                    //save the umbrella holder 
                    //END CONSTRUCTION ZONE
                    //console.log(model)
                    setId = model.id;
                    model.objectId = setId;
                    //control the model up 
                    unrealizedModel = (0, generate_1.default)(model, holder._id);
                    res.status(200).send(unrealizedModel);
                    //if signed in, put entities together
                    if (req.body.user_id) {
                        console.log('hi');
                        yield user_model_1.default.find({ _id: req.body.user_id }).then((user) => __awaiter(this, void 0, void 0, function* () {
                            //check if the set id already exists in setIds array
                            console.log('tying to entity');
                            var id = model._id.toString();
                            console.log(id);
                            console.log(user[0].setIds);
                            user[0].setIds.push(id);
                            console.log(user);
                            var user_id = req.body.user_id;
                            yield user_model_1.default.updateOne({ _id: user_id }, { $set: user[0] }).clone();
                            console.log("updated?");
                        }));
                    }
                }
            });
        });
    });
    // var test = require("../../test.js")
    // res.status(200).send(test)
}));
//not configured for grandfather realize
router.post('/Retrieve/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body.setId);
    var date = new Date();
    //let ts = query object from db by id
    let obj = {};
    umbrella_model_1.UmbrellaModel.findById(req.body.setId, function (err, docs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log(err);
            }
            else {
                console.log("what ");
                obj = docs;
                //console.log(docs)
                console.log(docs.walletAddress);
                //add to user if havent already and is signed in 
                if (req.body.user_id) {
                    console.log('hi');
                    //get the user
                    yield user_model_1.default.find({ _id: req.body.user_id }).then((user) => __awaiter(this, void 0, void 0, function* () {
                        console.log(user[0].setIds.includes(req.body.setId));
                        //check if the set id already exists in setIds array
                        if (user[0].setIds.includes(req.body.setId)) {
                            console.log("already tied to entity");
                        }
                        else {
                            console.log('tying to entity');
                            console.log(user[0].setIds);
                            user[0].setIds.push(req.body.setId);
                            console.log(user);
                        }
                        console.log(user);
                        var user_id = req.body.user_id;
                        yield user_model_1.default.updateOne({ _id: user_id }, { $set: user[0] }).clone();
                        console.log("updated?");
                    }));
                    //update umbrella with user id
                    docs.user_id = req.body.user_id;
                    yield umbrella_model_1.UmbrellaModel.findOneAndUpdate({ _id: docs._id }, { $set: docs }).clone();
                }
                //GET UMBRELLA HOLDER WITH docs.umbrellaholderid
                //CHECK IF HOLDER TOO
                //check if last updated within last two days
                if (!(new Date(obj.lastUpdated) < new Date(date.setDate(date.getDate() - 2)))) {
                    //return database version of set
                    console.log('doesnt need update');
                    var setId = req.body.setId;
                    obj.objectId = setId;
                    res.status(200).send(obj);
                }
                else {
                    //update tha bi
                    console.log('updating');
                    //define class framework
                    let ts = new TezosSet_1.default();
                    let ts2 = new TezosSet_1.default();
                    //obj workable, pass in obj to third class 
                    //generate the updated set on first class, generate set with the og params
                    ts.init(obj.fiat, obj.walletAddress, obj.consensusRole).then((updatedObject) => __awaiter(this, void 0, void 0, function* () {
                        //second init method is combineUpdate class combines the classes //method combineUpdate in class, writing after two class passes in 
                        yield ts2.updateProcess(obj, ts);
                        //UmbrellaModel.schema.methods.setLastUpdated(UmbrellaModel)
                        umbrella_model_1.UmbrellaModel.findByIdAndUpdate(req.body.setId, ts2, function (err, result) {
                            if (err) {
                                //res.send(err)
                            }
                            else {
                                //console.log(result)
                            }
                        });
                        //UPDATE UMBRELLA HOLDER 
                        res.status(200).send(ts2);
                    }));
                    // //import db umbrella into new class framework
                    // let updatedUmbrella: any = {}
                    // ts.initUpdate(obj, params).then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
                    //   if(err) {
                    //     console.log(err);
                    //   } else {
                    //     console.log("JSON saved to " + "test.json");
                    //     updatedUmbrella = transformToUnrealized(ts)
                    //     res.status(200).send(ts)
                    //     res.status(200).send(ts)
                    //   }
                    //   })});
                    //requery for the set findById and update it
                }
            }
        });
    });
}));
//reads db object
router.post('/Realize/', (req, res) => {
    console.log(req.body.setId, req.body.quantity);
    //define class framework
    let ts = new TezosSet_1.default();
    let obj = {};
    //let ts = query object from db by id
    umbrella_model_1.UmbrellaModel.findById(req.body.setId, function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log("Result : ", docs);
            console.log(docs.walletAddress);
            var umbrellaHolderId = docs.umbrellaHolderId;
            console.log(umbrellaHolderId);
            //import db umbrella into class framework
            let realizingModel = {};
            //console.log(obj)
            ts.realizeProcess(req.body.quantity, docs).then(x => {
                (0, fs_1.writeFile)("test.json", JSON.stringify(ts, null, 4), function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("JSON saved to " + "test.json");
                        realizingModel = (0, realizing_1.default)(ts, umbrellaHolderId);
                        res.status(200).send(realizingModel);
                        // console.log(ts)
                        //res.status(200).send(ts)
                    }
                });
            });
        }
    });
});
//takes db object and modifies it
//take user obj and add set id
router.post('/Save/', (req, res) => {
    //req.objectId, req.quantity
    console.log(req.body.objectId, req.body.quantity, req.body.userId);
    //define class framework
    let ts = new TezosSet_1.default();
    //import db umbrella into class framework
    let savedModel = {};
    umbrella_model_1.UmbrellaModel.findById(req.body.objectId, function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            //var realizingModel: any = {}
            var umbrellaHolderId = docs.umbrellaHolderId;
            //this is deleting the realizing set from the set 
            ts.realizeProcess(req.body.quantity, docs).then(x => {
                (0, fs_1.writeFile)("test.json", JSON.stringify(ts, null, 4), function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("JSON saved to " + "test.json");
                        //console.log(ts)
                    }
                });
            }).then(() => {
                //something is broken here
                ts.saveProcess(ts).then(x => {
                    (0, fs_1.writeFile)("testy.json", JSON.stringify(ts, null, 4), function (err) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("JSON saved to " + "testy.json");
                                //NEW UMBRELLA AND SAVE 
                                let model = new umbrella_model_1.UmbrellaModel(ts);
                                var str = model._id.toString();
                                model.umbrellaHolderId = umbrellaHolderId;
                                yield model.save();
                                console.log("umbrellaHolderId");
                                console.log(umbrellaHolderId);
                                savedModel = (0, saved_1.default)(model, umbrellaHolderId);
                                res.status(200).send(savedModel);
                                //add the model id to the umbrella holder
                                //update holder with new umbrella id 
                                var umbrellaHolder;
                                umbrellaHolder_model_1.UmbrellaHolderModel.findById(umbrellaHolderId, function (err, result) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        if (err) {
                                            console.log(err);
                                        }
                                        else {
                                            console.log(result);
                                            umbrellaHolder = result.umbrellaHolder;
                                            console.log('umbrellaHolder');
                                            console.log(result.umbrellaHolder);
                                            var arrayItem = { "id": str };
                                            result.umbrellaHolder.unshift(arrayItem);
                                            yield result.save();
                                            console.log('umbrellaHolder');
                                            console.log(result.umbrellaHolder);
                                        }
                                    });
                                });
                                //let holder = new UmbrellaHolderModel({umbrellaHolder: arrayItem})
                                //save the model and the holder 
                                //await umbrellaHolder.save() 
                                //FIND BY ID AND UPDATE UMBRELLA HOLDER UPSURP ARRAY WITH NEW UMBRELLA ID 
                                // UmbrellaHolderModel.findByIdAndUpdate(umbrellaHolderId, ts, function(err: any, result: any){
                                //           if(err){
                                //               //res.send(err)
                                //           }
                                //           else{
                                //               console.log(result)
                                //           }
                                //       })
                            }
                        });
                    });
                });
            });
        }
    });
    //find user by id 
    //insert set id
});
router.post('/UmbrellaHolder', (req, res) => {
    umbrellaHolder_model_1.UmbrellaHolderModel.findById(req.body.umbrellaHolderId, function (err, result) {
        return __awaiter(this, void 0, void 0, function* () {
            try{
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
                var umbrellaHolder = result;
                console.log('umbrellaHolder');
                console.log(result.umbrellaHolder);
                // var arrayItem = {"id": str}
                //result.umbrellaHolder.unshift(arrayItem)
                // await result.save() 
                console.log('umbrellaHolder');
                console.log(result.umbrellaHolder);
                res.status(200).send(umbrellaHolder);
            }
        }
        catch(e){
            console.log(e)
        }
        });
    });
});
module.exports = router;
