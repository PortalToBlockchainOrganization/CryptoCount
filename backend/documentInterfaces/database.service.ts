import * as mongoDB from "mongodb";
import { ObjectId } from "mongodb";
import CycleAndDate from "./CycleAndDate";

const MONGOURI = `mongodb+srv://admin:*@postax.a1vpe.mongodb.net/AnalysisDep?retryWrites=true&w=majority`;
const server = "127.0.0.1:27017";
const database = "AnalysisDep";
const cyclesCollectionString = "cycles2";
const pricesAndMarketCapCollectionString = "blockchains"

export const collections: { cycleAndDate?: mongoDB.Collection, priceAndMarketCap?: mongoDB.Collection } = {}

export async function connectToDatabase () { 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(MONGOURI);
            
    await client.connect();
            
    const db: mongoDB.Db = client.db(database);
   
    const cyclesCollection: mongoDB.Collection = db.collection(cyclesCollectionString);
    const pricesAndMarketCapCollection: mongoDB.Collection = db.collection(pricesAndMarketCapCollectionString);
 
  collections.cycleAndDate = cyclesCollection;
  collections.priceAndMarketCap = pricesAndMarketCapCollection;
       
         console.log(`Successfully connected to database: ${db.databaseName} and collection: ${cyclesCollection.collectionName}`);
 }