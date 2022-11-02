"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const { google } = require('../keys');
const keys_1 = __importDefault(require("../keys"));
const user_model_1 = __importDefault(require("../models/user-model"));
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    //find by id
    user_model_1.default.findById(id).then((user) => {
        //console.log("deserial" + user)
        done(null, user);
    });
});
console.log('keys');
console.log(keys_1.default);
passport.use(new GoogleStrategy({
    //options for google strat
    //calls back to the server
    callbackURL: //process.env.DEV_ENV === "LOCAL"
    //"http://localhost:3001/auth/google/redirect", //?
    "https://cryptocount.co/api/auth/google/redirect",
    clientID: keys_1.default.google.clientID,
    clientSecret: keys_1.default.google.clientSecret //keys.google.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    //check if user already exists
    user_model_1.default.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
            //alreadyUser
            console.log("user is" + currentUser);
            done(null, currentUser);
        }
        else {
            new user_model_1.default({
                username: profile.displayName,
                googleId: profile.id,
                email: profile.email
            }).save().then((newUser) => {
                console.log('newuser created' + newUser);
                done(null, newUser);
            });
        }
    });
}));
