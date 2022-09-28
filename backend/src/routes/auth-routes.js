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
router.get('/google/redirect', passport.authenticate('google'), (req, res)=>{
    //res.send('u r at call back uri' + req.user)
    res.redirect('/profile/')
})
    
module.exports = router