const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get( '/users/singin', (req, res) => {
    res.render('users/singin');

})

router.post('/users/singin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/singin',
    failureFlash: true
}));

router.get( '/users/singup', (req, res) => {
    res.render('users/singup');

})

router.post('/users/singup', async (req,res) => {
    const { name,email, password, confirm_password } = req.body;
    const errors = [];
    if (password != confirm_password){
        errors.push({text: 'Password do not match'});
    }
    if (password.length < 4){
        errors.push({text: 'Password must be at least 4 characters'});
    }
    if(password == ''){
        errors.push({text: 'Please write a password'});
    }
    if(errors.length > 0){
        res.render('users/singup', {errors,name,email,password,confirm_password});
    }
    const emailUser = await User.findOne({email: email});
    if(emailUser){
        req.flash('error_msg','the email is allready in use');
        res.redirect('/users/singup');
    } 
    else {
       
       const newUser = new User({name, email, password});
       newUser.password = await newUser.encryptPassword(password);
       await newUser.save();
       req.flash('success_msg', 'you are registered');
       res.redirect('/users/singin');
    }
    

})

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
