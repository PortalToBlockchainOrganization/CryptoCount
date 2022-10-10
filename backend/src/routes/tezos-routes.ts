import TezosSet from "../path/TezosSet";

import {UmbrellaModel} from "../documentInterfaces/umbrella/umbrella.model"
import transformToUnrealized from "../documentInterfaces/stateModels/generate"
import transformToRealizing from "../documentInterfaces/stateModels/realizing"
import transformToSave from "../documentInterfaces/stateModels/saved"
import populateUmbrella from "../documentInterfaces/umbrella/umbrella.statics"
import { writeFile } from "fs";


const testObjectRealize = require("../testObjectRealize.js")
const testObjectSave = require("../testObjectSave.js")
const testObjectUpdate = require("../testObjectUpdate.js")

const router = require('express').Router()


  //creates db object
  router.post('/Generate/', async (req, res)=>{

    console.log("wtf tezos set" + req.body.fiat)
    
    let ts: TezosSet = new TezosSet();

    let unrealizedModel: any = {}

    // await ts.init(req.body.fiat,req.body.address, req.body.consensusRole).then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), async function(err) {
    //     if(err) {
    //       console.log(err);
    //     } else {
    //       console.log("JSON saved to " + "test.json");
    //       //put ts in db by id
    //       var setId: any
    //       //how do i get the same instance ?
    //       let model =  new UmbrellaModel(ts)
    //       model.save(function(_err,room) {
    //         setId = room.id
    //         console.log(room.id);
    //         model.objectId = setId
    //         //control the model up 
    //         unrealizedModel = transformToUnrealized(model)
    //         res.status(200).send(unrealizedModel)
    //      });
    //     }
    // })});
    var test = require("../../test.js")
    res.status(200).send(test)
  })



  router.post('/Retrieve/', async (req, res)=>{

    console.log(req.body.setId)
    var date = new Date();
 

    //let ts = query object from db by id
    let obj: any = {}
  
    UmbrellaModel.findById(req.body.setId, function (err: any, docs: any) {
      if (err){
          console.log(err);
      }else{
        console.log("what ")
        obj = docs
        console.log(docs.walletAddress)

        //check if last updated within last two days
        if(!(new Date(obj.lastUpdated) < new Date(date.setDate(date.getDate() - 2)))){
          //return database version of set

          console.log('doesnt need update')
          var setId = docs.id
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
                UmbrellaModel.findByIdAndUpdate(req.body.setId, ts2, function(err, result){
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
  router.post('/Realize/', (req, res)=>{

    console.log(req.body.setId, req.body.quantity)

    //define class framework
    let ts: TezosSet = new TezosSet();

    let obj: any = {}

    //let ts = query object from db by id
    UmbrellaModel.findById(req.body.setId, function (err, docs) {
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
              console.log(ts)

                //res.status(200).send(ts)
              }
          })});
      }
  });
  })

  //takes db object and modifies it
  //take user obj and add set id
  router.post('/Save/', (req, res)=>{

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
        ts.realizeProcess(req.body.quantity, docs).then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log("JSON saved to " + "test.json");
  
          console.log(ts)

          }
        })});
          ts.saveProcess(ts).then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
            if(err) {
              console.log(err);
            } else {
              console.log("JSON saved to " + "test.json");
              savedModel = transformToSave(ts)
              res.status(200).send(savedModel)
              
              UmbrellaModel.findByIdAndUpdate(req.body.objectId, ts, function(err, result){
                        if(err){
                            //res.send(err)
                        }
                        else{
                            console.log(result)
                        }
                    })
            }
        })});
    }
  })
  //find user by id 
  //insert set id


})

  module.exports = router