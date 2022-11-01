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
const router = require('express').Router();
//const RealizeHistObj = require("../models/realizeObject")
const umbrella_model_1 = require("../documentInterfaces/umbrella/umbrella.model");
//const User = require('../models/user-model')
// router.get('/', (req,res)=>{
//     console.log(req.user)
//     res.render('profile', {user: req.user});
// });
router.post("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //var user_id = "60df960c5562110dc0753d3d"
        // var user_id = req.body.userId
        //get the user id out of the session cookie
        //req.session.prsId;
        console.log('userid' + req.body.user_id);
        console.log("getting all ser sets");
        console.log(req.body.user_id);
        var user_id = req.body.user_id;
        console.log(umbrella_model_1.UmbrellaModel);
        //we want to get every user_id
        yield umbrella_model_1.UmbrellaModel.find({ user_id: user_id }, function (err, docs) {
            console.log("result");
            console.log(docs.length);
            if (err) {
                console.log(err);
            }
            else {
                if (docs == null) {
                    //grandfather objects
                    console.log('here');
                    // RealizeHistObj.find({ userid: user_id }, function (err: any, doc: any) {
                    //             if (err) {
                    //                 console.log(err)
                    //             }else{
                    //                 res.status(200).json(doc)
                    //             }
                    //         })
                }
                else {
                    res.status(200).json(docs);
                }
            }
        }).clone();
        // try{
        //     RealizeHistObj.find({ userid: user_id }, function (err, doc) {
        //         if (err) {
        //             console.log(err)
        //         }else{
        //             res.status(200).json(doc)
        //         }
        //     })
        // }catch(e){console.log(e)}
        //asdf
        //  try{
        //     getSetsGrandfather()
        //  }catch(e){
        //     console.log(e)
        //  }
        //  try{
        //     getSetsUmbrella()
        //  }catch(e){
        //     console.log(e)
        //  }
        // function (err) {
        // 	if (err) console.log(err);
        // }
    });
});
router.post("/delete/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.body.setId);
        console.log('in delete');
        var setId = req.body.setId;
        //var user_id = req.body.user_id
        //get umbrella object
        //remove set id from user object
        //delete id from models
        yield umbrella_model_1.UmbrellaModel.deleteOne({ _id: setId });
        console.log('deleted');
        res.status(200).json();
    });
});
module.exports = router;
