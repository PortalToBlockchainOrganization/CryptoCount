import * as mongoDB from "mongodb";
import { ObjectId } from "mongodb";
import CycleAndDate from "./CycleAndDate";
import keys from '../keys'


const MONGOURI: any = keys.mongodb.dbURI
const server = "127.0.0.1:27017";
const database = "AnalysisDep";
const cyclesCollectionString = "cycles2";
const pricesAndMarketCapCollectionString = "blockchains2"
const tezosSupplyString = "statistics2"

export const collections: { cycleAndDate?: mongoDB.Collection, priceAndMarketCap?: mongoDB.Collection, tezosSupply?: mongoDB.Collection} = {}

export async function connectToDatabase () { 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(MONGOURI);
            
    await client.connect();
            
    const db: mongoDB.Db = client.db(database);
   
    const cyclesCollection: mongoDB.Collection = db.collection(cyclesCollectionString);
    const pricesAndMarketCapCollection: mongoDB.Collection = db.collection(pricesAndMarketCapCollectionString);
    const tezosSupplyCollection: mongoDB.Collection = db.collection(tezosSupplyString);

 
  collections.cycleAndDate = cyclesCollection;
  collections.priceAndMarketCap = pricesAndMarketCapCollection;
  collections.tezosSupply = tezosSupplyCollection;
       
         console.log(`Successfully connected to database: ${db.databaseName}`);
 }