const passport =require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const { google } = require('../keys')

import keys from '../keys'
import User from '../models/user-model'

passport.serializeUser((user:any, done:any)=>{
    done(null, user.id)
})

passport.deserializeUser((id:any, done:any)=>{
    //find by id
    User.findById(id).then((user:any)=>{
        //console.log("deserial" + user)
        done(null, user)
    })
   
})
console.log('keys')
console.log(keys)

passport.use(
    new GoogleStrategy({
        //options for google strat
        //calls back to the server
        callbackURL: //process.env.DEV_ENV === "LOCAL"
                //"http://localhost:3001/auth/google/redirect", //?
                "https://cryptocount.co/api/auth/google/redirect",
        clientID: keys.google.clientID,           //keys.google.clientID,
        clientSecret:   keys.google.clientSecret //keys.google.clientSecret
    }, (accessToken:any, refreshToken:any, profile:any, done:any)=>{
        //check if user already exists
        User.findOne({googleId: profile.id}).then((currentUser:any)=>{
            if(currentUser){
                //alreadyUser
                console.log("user is"+currentUser)
                done(null, currentUser)
            }
            else{
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    email: profile.email
                   }).save().then((newUser:any)=>{
                        console.log('newuser created' + newUser)
                        done(null, newUser)
                   })
            }
        })

    })
) 
