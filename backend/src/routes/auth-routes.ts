const router = require('express').Router();
const passport = require('passport');
//require('../config/passport-setup')
import User from '../models/user-model'
var async = require('async');
//var Tags = require('./validator.js').Tags;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//var {Session} = require('./session.js');
const { body, validationResult } = require('express-validator');





//auth login
// router.get('/login', (req, res)=>{
//     res.render('login')
// })

//auth logout
router.get('/logout', (req:any, res:any)=>{
    //handle with passport
    res.send("loggedout")
})


//auth with google 
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}))

//callback route for google to rediect to
//passport attaches user information to req body
router.get('/google/redirect', passport.authenticate('google'), (req:any, res:any)=>{
    //res.send('u r at call back uri' + req.user)
    console.log("wow")
    console.log(req.user)
    console.log(req.user.username)
    console.log(req.user.googleId)
    console.log(req.user.setIds)
    console.log(req.user.email)
    console.log(req.user._id)
    console.log(req.user.joined)
    console.log(req.path)
    var object = {
        username: req.user.username,
        googleId: req.user.googleId,
        setIds: req.user.setIds,
        email: req.user.email,
        _id: req.user._id
    }
    console.log(object)
    const paramsString = new URLSearchParams(object).toString();
    //can we post to the front end?
    //add req user in the query thingy of the localhost:300
    res.redirect(301, //process.env.DEV_ENV === "LOCAL"
    `https://cryptocount.co?${paramsString}` 
    //  `http://localhost:3000?${paramsString}`
    //:  `https://cryptocount.co?${paramsString}` 
    )
})

router.post("/login", async (req:any, res:any) => {
    console.log("woaj")

    try {
        console.log("woaj")
        console.log(req.body.email)
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const cmp = await bcrypt.compare(req.body.password, user.password);
        if (cmp) {
          //   ..... further code to maintain authentication like jwt or sessions
          //console.log(user)
          //var ssn = new Session(user, res);
        //   if(Object.keys(req.body.set) !== 0){
        //   ssn.realizing = req.body.set.data

        // user.push({"ssnAuth": ssn.authToken})
        // user.push({"ssnPrsId": ssn.prsId})

       console.log(user)
        //   res.send("Auth Successful");
        res.send(user)

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


router.post('/register', async (req:any, res:any)=>{
    console.log('in register')
    console.log(req.body.email)
    //var vld = req.validator; // Shorthands
    var body = req.body;
    //var admin = req.session && req.session.isAdmin();

    // if (admin && !body.password) body.password = "*"; // Blocking password
    body.whenRegistered = new Date();


    //check for dup email 

    const user = await User.findOne({ email: body.email })

    console.log(" "+ user)
    console.log(body.password)

    if (!user) {
        console.log('making nee uwser')
        const salt = await bcrypt.genSalt(10); 
        const hashedPW = await bcrypt.hash(body.password, salt);
        const {
            firstName,
            lastName,
            email,
            password,
            termsAccepted,
            role,
        } = body;

        var user1 = new User({
            firstName,
            lastName,
            email,
            password,
            role,
        });
    
        user1.password = hashedPW;

        user1.save()

        res.send(user1)

    }
})





//     //then
//      bcrypt.genSalt(10, cb); 
//      //then //salt
//      bcrypt.hash(body.password, salt, cb);
//      //then //hasehd password
//      const {
//         firstName,
//         lastName,
//         email,
//         password,
//         termsAccepted,
//         role,
//     } = body;

//     user = new User({
//         firstName,
//         lastName,
//         email,
//         password,
//         role,
//     });

//     user.password = hashedpass;

//     user.save(function (err, doc) {
//         if (err) cb(err);
//         cb(null, doc);
//     });


//     async.waterfall(
//         [
//             function (cb) {
//                 // Check properties and search for Email duplicates
//                 if (
//                     vld.hasFields(
//                         body,
//                         ["email", "password", "lastName", "role"],
//                         cb
//                     ) &&
//                     vld.valueCheck(body, cb) &&
//                     vld
//                         .chain(body.termsAccepted || admin, Tags.noTerms, null)
//                         .chain(
//                             body.role === 0 || admin,
//                             Tags.forbiddenRole,
//                             null
//                         )
//                 ) {
//                     User.find({ email: body.email }, function (err, docs) {
//                         console.log(cb);
//                         if (err) cb(err);
//                         cb(null, docs);
//                     });
//                 }
//             },
//             function (existingPrss, cb) {
//                 // If no duplicates, encrypt password
//                 // then add user
//                 console.log(cb);
//                 if (vld.check(!existingPrss.length, Tags.dupEmail, null, cb)) {
//                     body.termsAccepted = body.termsAccepted && new Date();
//                     body.termsAccepted = body.termsAccepted || null;
//                     bcrypt.genSalt(10, cb); // generate salt for our hash
//                 }
//             },
//             function (salt, cb) {
//                 bcrypt.hash(body.password, salt, cb); // hash our password (encrypt)
//             },
//             function (hashedpass, cb) {
//                 const {
//                     firstName,
//                     lastName,
//                     email,
//                     password,
//                     termsAccepted,
//                     role,
//                 } = body;

//                 user = new User({
//                     firstName,
//                     lastName,
//                     email,
//                     password,
//                     role,
//                 });

//                 user.password = hashedpass;

//                 user.save(function (err, doc) {
//                     if (err) cb(err);
//                     cb(null, doc);
//                 });
//             },
//             function (result, cb) {
//                 // Return location of inserted Person
//                 console.log(result);
//                 res.location(router.baseURL + "/" + result._id).end();
//             },
//         ],
//         function (err) {
//             if (err) console.log(err);
//         }
//     );

// })


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