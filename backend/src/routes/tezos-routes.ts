import TezosSet from "../path/TezosSet";

import {UmbrellaModel} from "../documentInterfaces/umbrella/umbrella.model"
import transformToUnrealized from "../documentInterfaces/stateModels/generate"
import transformToRealizing from "../documentInterfaces/stateModels/realizing"
import transformToSave from "../documentInterfaces/stateModels/saved"
import populateUmbrella from "../documentInterfaces/umbrella/umbrella.statics"
import { writeFile } from "fs";
import User from '../models/user-model'



// const testObjectRealize = require("../testObjectRealize.js")
// const testObjectSave = require("../testObjectSave.js")
// const testObjectUpdate = require("../testObjectUpdate.js")

const router = require('express').Router()


  //creates db object
  router.post('/Generate/', async (req: any, res: any)=>{

    console.log("wtf tezos set" + req.body.fiat)
    
    let ts: TezosSet = new TezosSet();

    let unrealizedModel: any = {}

    await ts.init(req.body.fiat,req.body.address, req.body.consensusRole).then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), async function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("JSON saved to " + "test.json");
          //put ts in db by id
          var setId: any
          //how do i get the same instance ?          
          let model =  new UmbrellaModel(ts)
          //add user id to umbrella
          model.user_id = req.body.user_id
          console.log('umrbella model')
          console.log(model.user_id)

          await model.save() 
          
          //console.log(model)
          setId = model.id
          model.objectId = setId
          
          //if signed in, put entities together
          if (req.body.user_id){
            console.log('hi')
            await User.find({ _id: req.body.user_id }).then(async (user: { setIds: any[]; }[])=>{
              
            //check if the set id already exists in setIds array
            
            console.log('tying to entity')
            var id = model._id.toString()
            console.log(id)
            console.log(user[0].setIds)
            user[0].setIds.push(id)
            console.log(user)
  
            var user_id= req.body.user_id

  
            await User.updateOne({ _id: user_id }, { $set: user[0] }).clone()
            console.log("updated?")
            })

          }

          //control the model up 
          unrealizedModel = transformToUnrealized(model)
          res.status(200).send(unrealizedModel)
         
        }
    })});
    // var test = require("../../test.js")
    // res.status(200).send(test)
  })


  //not configured for grandfather realize
  router.post('/Retrieve/', async (req: any, res: any)=>{
    

    console.log(req.body.setId)
    var date = new Date();
 

    //let ts = query object from db by id
    let obj: any = {}
  
    UmbrellaModel.findById(req.body.setId, async function (err: any, docs: any) {
      if (err){
          console.log(err);
      }else{
        console.log("what ")
        obj = docs
        //console.log(docs)
        console.log(docs.walletAddress)

        //add to user if havent already and is signed in 
        if (req.body.user_id){
          console.log('hi')
          //get the user
        await User.find({ _id: req.body.user_id }).then(async (user: { setIds: any[]; }[])=>{
            console.log(user[0].setIds.includes(req.body.setId))
          //check if the set id already exists in setIds array
          if(user[0].setIds.includes(req.body.setId)){
            console.log("already tied to entity")
          }else{
            console.log('tying to entity')
            console.log(user[0].setIds)
            user[0].setIds.push(req.body.setId)
            console.log(user)

          }
          console.log(user)
          var user_id= req.body.user_id

          await User.updateOne({ _id: user_id }, { $set: user[0] }).clone()
          console.log("updated?")
          })

          //update umbrella with user id
          docs.user_id = req.body.user_id
          await UmbrellaModel.findOneAndUpdate({_id: docs._id}, {$set: docs}).clone()


        }
       

        //check if last updated within last two days
        if(!(new Date(obj.lastUpdated) < new Date(date.setDate(date.getDate() - 2)))){
          //return database version of set

          console.log('doesnt need update')
          var setId = req.body.setId
          obj.objectId = setId

          res.status(200).send(obj)
        }
        else{
            //update tha bi
            console.log('updating')
  
          //define class framework
          let ts: TezosSet = new TezosSet();
          let ts2: TezosSet = new TezosSet();

          //obj workable, pass in obj to third class 

          //generate the updated set on first class, generate set with the og params
          ts.init(obj.fiat, obj.walletAddress, obj.consensusRole).then(async updatedObject => {
                //second init method is combineUpdate class combines the classes //method combineUpdate in class, writing after two class passes in 
                await ts2.updateProcess(obj, ts)
                //UmbrellaModel.schema.methods.setLastUpdated(UmbrellaModel)
                UmbrellaModel.findByIdAndUpdate(req.body.setId, ts2, function(err: any, result: any){
                  if(err){
                      //res.send(err)
                  }
                  else{
                     //console.log(result)
                  }
              })
              res.status(200).send(ts2)

         
          })

      
        

          
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
    })

  })

  //reads db object
  router.post('/Realize/', (req: any, res: any)=>{

    console.log(req.body.setId, req.body.quantity)

    //define class framework
    let ts: TezosSet = new TezosSet();

    let obj: any = {}

    //let ts = query object from db by id
    UmbrellaModel.findById(req.body.setId, function (err: any, docs: any) {
      if (err){
          console.log(err);
      }
      else{
          //console.log("Result : ", docs);
          console.log(docs.walletAddress)
         //import db umbrella into class framework
          let realizingModel: any = {}
          //console.log(obj)
            ts.realizeProcess(req.body.quantity, docs).then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
              if(err) {
                console.log(err);
              } else {
                console.log("JSON saved to " + "test.json");
                realizingModel = transformToRealizing(ts)
            
              res.status(200).send(realizingModel)
             // console.log(ts)

                //res.status(200).send(ts)
              }
          })});
      }
  });
  })

  //takes db object and modifies it
  //take user obj and add set id
  router.post('/Save/', (req: any, res: any)=>{

    //req.objectId, req.quantity
    console.log(req.body.objectId, req.body.quantity, req.body.userId)

    //define class framework
    let ts: TezosSet = new TezosSet();

    //import db umbrella into class framework
    let savedModel: any = {}


    UmbrellaModel.findById(req.body.objectId, function (err: any, docs: any) {
      if (err){
          console.log(err);
      }
      else{
        //var realizingModel: any = {}
        //this is deleting the realizing set from the set 
        ts.realizeProcess(req.body.quantity, docs).then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log("JSON saved to " + "test.json");
  
          //console.log(ts)

          }
        })}).then(()=>{
          //something is broken here
          ts.saveProcess(ts).then(x => {writeFile("testy.json", JSON.stringify(ts, null, 4), function(err) {
            if(err) {
              console.log(err);
            } else {
              console.log("JSON saved to " + "testy.json");
              savedModel = transformToSave(ts)
              res.status(200).send(savedModel)
              
              UmbrellaModel.findByIdAndUpdate(req.body.objectId, ts, function(err: any, result: any){
                        if(err){
                            //res.send(err)
                        }
                        else{
                            console.log(result)
                        }
                    })
            }
        })});
        })
       
    }
  })
  //find user by id 
  //insert set id


})

  module.exports = router