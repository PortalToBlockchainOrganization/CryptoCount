/**
 * Required External Modules
 */



 import * as dotenv from "dotenv";
 import express from "express";
 import cors from "cors";
 import helmet from "helmet";
 import TezosSet from "./path/TezosSet";
import { writeFile } from "fs";

 
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


  app.post('/Generate/', (req, res)=>{
    var body = req.query;
    //console.log(req)
    console.log(body)
    const {address, fiat, consensusRole} = body
    console.log(address, fiat, consensusRole)


    let ts: TezosSet = new TezosSet();

    ts.init("USD","tz1TzS7MEQoCT6rdc8EQMXiCGVeWb4SLjnsH", "Delegator").then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("JSON saved to " + "test.json");
          res.status(200).send(ts)
        }
    })});

  })