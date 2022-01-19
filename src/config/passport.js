const { use } = require('passport');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/User');



passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    const user = await User.findOne({email: email});
    console.log(user);
    if(!user) {
        return done(null, false, {message: 'Not User Found.'});
    } 
    else {
        const match = await user.matchPassword(password);
        console.log(match);
        if(match) {
            console.log('ok');
            return done(null, user);
        }
        else {
            return done(null, false, {message: 'Incorrect Password'});
        }
    }
}))

passport.serializeUser((user, done) => {
    done(null,user.id);
}); 

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err,user);
    });
});