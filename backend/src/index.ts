/**
 * Required External Modules
 */



 import * as dotenv from "dotenv";
 import express from "express";
 import cors from "cors";
 import helmet from "helmet";
 import TezosSet from "./path/TezosSet";
import { writeFile } from "fs";
import transformToUnrealized from "./documentInterfaces/stateModels/generate"
import transformToRealizing from "./documentInterfaces/stateModels/realizing"
import transformToSave from "./documentInterfaces/stateModels/saved"
import populateUmbrella from "./documentInterfaces/umbrella/umbrella.statics"
import {UmbrellaModel} from "./documentInterfaces/umbrella/umbrella.model"
const testObjectRealize = require("./testObjectRealize.js")
const testObjectSave = require("./testObjectSave.js")
const testObjectUpdate = require("./testObjectUpdate.js")
const mongoose = require('mongoose')
const passport = require('passport')
const keys = require('./config/keys')
const authRoutes = require('./routes/auth-routes')
const profileRoutes = require('./routes/profile-routes')
const passportSetup = require('./config/passport-setup')
const cookieSession = require('cookie-session')


import generate from "./documentInterfaces/CycleAndDate";
import umbrella from "./documentInterfaces/umbrella/umbrella.schema";


 
 dotenv.config();



/**
 * App Variables
 */


 if (!process.env.PORT) {
    process.exit(1);
 }
 
 const PORT: number = parseInt(process.env.PORT as string, 10);
 
 const app = express();

/**
 *  App Configuration
 */


 app.use(helmet());
 app.use(cors());
 app.use(express.json());

 mongoose.connect(keys.mongodb.dbURI, ()=>{
  console.log('connected to db')
})

app.use(cookieSession({
  maxAge: 1 * 60 *60 *1000,
  keys: [keys.session.cookieKey]
}))

//setup view engine
app.set('view engine', 'ejs')

//initialize passport
app.use(passport.initialize())
app.use(passport.session())

//setup routes
app.use('/auth', authRoutes);
//realized history
app.use('/profile', profileRoutes);



/**
 * Server Activation
 */

 app.get('/', (req, res) => {
  res.render('home');
});

 app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });


  //import this from document interface
  interface gen {
    address: string,
    fiat: string,
    consensusRole: string
}


  app.get('/Generate/', async (req, res)=>{
    // var body: generateBody = req.query.address;
    // //console.log(req)
    // console.log(body)
    // var address: string = body.address
    // fiat: string, consensusRole: string;

    // {address, fiat, consensusRole} = body
    // console.log(address, fiat, consensusRole)

    let ts: TezosSet = new TezosSet();
    //generate this

    let unrealizedModel: any = {}

    ts.init("USD","tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH", "Delegator").then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), async function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("JSON saved to " + "test.json");
          //res.status(200).send(ts)
          //put ts in db by id
          var setId: any
          //how do i get the same instance ?
          let model =  new UmbrellaModel(ts)
          model.save(function(err,room) {
            setId = room.id
            console.log(room.id);
         });
         
          //control the model up 
          unrealizedModel = transformToUnrealized(model)
          res.status(200).send(unrealizedModel)
                
          
        }
    })});

  
  })

  app.get('/Realize/', (req, res)=>{

    //req.objectId, req.quantity
    let setId = "633324b497ec55ac90e17273"

    //define class framework
    let ts: TezosSet = new TezosSet();

    let obj: any = {}

    //let ts = query object from db by id
    UmbrellaModel.findById(setId, function (err, docs) {
      if (err){
          console.log(err);
      }
      else{
          //console.log("Result : ", docs);
          console.log(docs.walletAddress)
         //import db umbrella into class framework
          let realizingModel: any = {}

          //console.log(obj)
            ts.realizeProcess(20, docs).then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
              if(err) {
                console.log(err);
              } else {
                console.log("JSON saved to " + "test.json");
                realizingModel = transformToRealizing(ts)
              
                // UmbrellaModel.findByIdAndUpdate(setId, ts, function(err, result){
                //         if(err){
                //             //res.send(err)
                //         }
                //         else{
                //             console.log(result)
                //         }
                //     })
              res.status(200).send(realizingModel).render('home')
              console.log(ts)

                //res.status(200).send(ts)
              }
          })});
      }
  });



    

      //control the transformation to the state model 

    //update the db entry with the ts object


  })

  app.get('/Unrealize', (req, res)=>{

  })

  app.get('/Save/', (req, res)=>{

    //req.objectId, req.quantity
    let setId = "633324b497ec55ac90e17273"


    //let ts = query object from db by id
    //let obj = testObjectSave

    //define class framework
    let ts: TezosSet = new TezosSet();


    //import db umbrella into class framework
    let savedModel: any = {}

    UmbrellaModel.findById(setId, function (err: any, docs: any) {
      if (err){
          console.log(err);
      }
      else{
          ts.saveProcess(docs).then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
            if(err) {
              console.log(err);
            } else {
              console.log("JSON saved to " + "test.json");
              savedModel = transformToSave(ts)
              res.status(200).send(savedModel)
              
              UmbrellaModel.findByIdAndUpdate(setId, ts, function(err, result){
                        if(err){
                            //res.send(err)
                        }
                        else{
                            console.log(result)
                        }
                    })

              //res.status(200).send(ts)
            }
        })});
    }
      //control the transformation to the state model 

    //update the db entry with the ts object

  })
})


  app.post('/Update/', async (req, res)=>{

    //req.objectId, req.quantity

    //let ts = query object from db by id
    let obj = testObjectUpdate

    //define class framework
    let ts: TezosSet = new TezosSet();


    //import db umbrella into class framework
    let updatedUmbrella: any = {}

    ts.init(obj.fiat,obj.address, obj.consensusRole).then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + "test.json");
        updatedUmbrella = transformToUnrealized(ts)
        res.status(200).send(ts)

        res.status(200).send(ts)
      }
  })});
    
  //   ts.updateProcess(obj, ts).then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
  //     if(err) {
  //       console.log(err);
  //     } else {
  //       console.log("JSON saved to " + "test.json");
  //       //updatedUmbrella = transformToSave(ts)
  //       res.status(200).send(ts)

  //       //res.status(200).send(ts)
  //     }
  // })});
      //control the transformation to the state model 

    //update the db entry with the ts object


  })
  



  app.post('/Delete/', async (req, res)=>{

  
    
  })

  app.post('/Register/', async (req, res)=>{



  })


  app.post('/SignOut/', async (req, res)=>{

  

  })


  app.post('/SignIn/', async (req, res)=>{



  })

  app.post('/GetSets/', async (req, res)=>{
  

  })

  app.post('/GetSet/', async (req, res)=>{

  })



  app.post('/forgotPw/', async (req, res)=>{

  

  })


  app.post('/changePw/', async (req, res)=>{

  

  })

