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


import generate from "./documentInterfaces/CycleAndDate";


 
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



/**
 * Server Activation
 */


 app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });


  app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
  });

  //import this from document interface
  interface gen {
    address: string,
    fiat: string,
    consensusRole: string
}


  app.post('/Generate/', (req, res)=>{
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

    ts.init("USD","tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH", "Delegator").then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("JSON saved to " + "test.json");
          unrealizedModel = transformToUnrealized(ts)
          res.status(200).send(unrealizedModel)

          //res.status(200).send(ts)
        }
    })});


    //put ts in db by id

    //control model to get generate
  
    //return gen model w og model id
  

  })

  app.post('/Realize/', (req, res)=>{
    //call ts object with object id

  })

  // app.post('/Realize/', (req, res)=>{
  //   //quantity and model id
   

  //   //get same ts model from db 
  //   let ts: TezosSet = new TezosSet();
   
  //   //control the model to return to fe 

  //   ts.realizeProcess("USD","tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH", "Delegator").then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
  //       if(err) {
  //         console.log(err);
  //       } else {
  //         console.log("JSON saved to " + "test.json");
  //         res.status(200).send(ts)
  //       }
  //   })});

  //   //ts realize model

  // })

  // interface LabeledValue {
  //   label: string;
  // }
   
  // function printLabel(labeledObj: LabeledValue) {
  //   console.log(labeledObj.label);
  // }
   
  // let myObj = { size: 10, label: "Size 10 Object" };

  // printLabel(myObj);

  //function extract values per state route 
  //gets the ts object passed into it


  