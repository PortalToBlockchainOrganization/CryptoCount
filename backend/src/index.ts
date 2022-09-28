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
const options: cors.CorsOptions = {origin: "http://localhost:3000",credentials: true,methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",};
app.use(cors(options));;
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



// //setup routes
app.use('/auth', authRoutes);
//realized history
app.use('/profile', profileRoutes);

app.get('/cors', (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.send({ "msg": "This has CORS enabled 🎈" })
  })

/**
 * Server Activation
 */


 app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});


//calls user object and gets set ids 
 app.get('/', (req, res) => {
  res.render('home');
});

// //calls set object
// app.get(`/${setId}`, (req, res) => {
//   res.render('home');
// });


  //creates db object
  app.post('/Generate/', async (req, res)=>{

    console.log("wtf" + req.body.fiat)
    
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
          model.save(function(_err,room) {
            setId = room.id
            console.log(room.id);
            model.objectId = setId
            //control the model up 
            unrealizedModel = transformToUnrealized(model)
            res.status(200).send(unrealizedModel)
         });
        }
    })});
  })

  //reads db object
  app.post('/Realize/', (req, res)=>{

    console.log(req.body, req.body.objectId, req.body.quantity)

    //define class framework
    let ts: TezosSet = new TezosSet();

    let obj: any = {}

    //let ts = query object from db by id
    UmbrellaModel.findById(req.body.objectId, function (err, docs) {
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
  app.post('/Save/', (req, res)=>{

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

  //takes db object and modifies it
  app.post('/Update/', async (req, res)=>{

    //let ts = query object from db by id
    let obj: any = {}
    UmbrellaModel.findById(req.body.objectId, function (err: any, docs: any) {
      if (err){
          console.log(err);
          obj = docs
      }})

    let params: any = {
      "fiat": obj.fiat,
      "address": obj.walletAddress,
      "consensusRole": obj.consensusRole
    }

    //define class framework
    let ts: TezosSet = new TezosSet();


    //import db umbrella into class framework
    let updatedUmbrella: any = {}

    ts.initUpdate(obj, params).then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + "test.json");
        updatedUmbrella = transformToUnrealized(ts)
        res.status(200).send(ts)

        res.status(200).send(ts)
      }
  })});


  })
  


  app.get('/Unrealize', (req, res)=>{

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

