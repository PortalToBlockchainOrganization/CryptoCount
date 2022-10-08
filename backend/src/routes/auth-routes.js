const router = require('express').Router();
const passport = require('passport');

//auth login
router.get('/login', (req, res)=>{
    res.render('login')
})

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
    
module.exports = router