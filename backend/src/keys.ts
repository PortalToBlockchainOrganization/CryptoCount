//require('dotenv').config({ path: __dirname+'../../.env' });
//var env = require('dotenv').config({ path: __dirname+'/.env' });
import * as dotenv from "dotenv";

dotenv.config();

//console.log(process.env)
export = {
    
    google: {
        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET
    },
    session: {
        cookieKey: "adsfasdfasdfasdf"
    },
    mongodb:{
        dbURI: process.env.dbURI
    }

}