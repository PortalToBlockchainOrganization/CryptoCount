const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user-model')
var async = require('async');
var Tags = require('./validator.js').Tags;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var {Session} = require('./session.js');
const { body, validationResult } = require('express-validator');





//auth login
// router.get('/login', (req, res)=>{
//     res.render('login')
// })

//auth logout
router.get('/logout', (req, res)=>{
    //handle with passport
    res.send("loggedout")
})


//auth with google 
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}))

//callback route for google to rediect to
//passport attaches user information to req body
router.get('/google/redirect', passport.authenticate('google'), (req, res)=>{
    //res.send('u r at call back uri' + req.user)
    console.log("wow")
    console.log(req.user)
    console.log(req.path)
    //can we post to the front end?
    //add req user in the query thingy of the localhost:300
    res.redirect(301, `http://localhost:3000?${req.user}` )
})

router.post("/login", async (req, res) => {
    console.log("woaj")

    try {
        console.log("woaj")
        console.log(req.body.email)
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const cmp = await bcrypt.compare(req.body.password, user.password);
        if (cmp) {
          //   ..... further code to maintain authentication like jwt or sessions
          console.log(user)
          var ssn = new Session(user, res);
        //   if(Object.keys(req.body.set) !== 0){
        //   ssn.realizing = req.body.set.data

        console.log(ssn)
        //   res.send("Auth Successful");
        res.send(ssn)

        } else {
          res.send("Wrong username or password.");
        }
      } else {
        res.send("Wrong username or password.");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server error Occured");
    }
  });



// router.post('/', function(req, res) {

//     console.log('made it to sign in route')
//     var ssn;
//     //var vld = req.validator;

//     //validator stuff 
//     body('email').isEmail(),
//     body('password').isLength({ min: 7 }),

//    //change to then functions
   
//     queryForUser.then((result) =>{
//    comparePasswords.then((result)=>{
    
//         }).then((next)=>{
            
//                 ssn = new Session(result[0], res);
//                 try{
//                     if(Object.keys(req.body.set) !== 0){
//                         //case for when users signup after going through the no auth path
//                         console.log(req.body.set.data)
//                         ssn.realizing = req.body.set.data
//                         User.findOneAndUpdate({email: req.body.email}, {setIds: [ssn.realizing._id]})
//                     }
//                 }
//                 catch(e){console.log(e)}
                
//                 res.location('/' + ssn.id).end();
//         }) 
    


//     //auth methods

//     //query for user 
//     const queryForUser = async ()=>{
//         User.find({email: req.body.email}, function(err, docs) {
//             if(err) cb(err);
//             cb(null, docs)
//          })
//     }

//     const comparePasswords = async (result)=>{
//         bcrypt.compare(req.body.password, result[0].password)
//         Tags.badLogin, null, cb 
//         return true
//     }

//     //compare passwords

//     //generate session and attach to req and update db with its existece







    
module.exports = router