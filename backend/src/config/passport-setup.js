const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const { google } = require('../keys')

const keys = require('../keys')
const User = require('../models/user-model')

passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser((id, done)=>{
    //find by id
    User.findById(id).then((user)=>{
        //console.log("deserial" + user)
        done(null, user)
    })
   
})
console.log('keys')
console.log(keys)

passport.use(
    new GoogleStrategy({
        //options for google strat
        callbackURL: 'http://localhost:3001/auth/google/redirect',
        clientID: keys.google.clientID,           //keys.google.clientID,
        clientSecret:   keys.google.clientSecret //keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done)=>{
        //check if user already exists
        User.findOne({googleId: profile.id}).then((currentUser)=>{
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
                   }).save().then((newUser)=>{
                        console.log('newuser created' + newUser)
                        done(null, newUser)
                   })
            }
        })

    })
) 
