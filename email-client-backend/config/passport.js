const passport = require('passport');
const OutlookStrategy = require('passport-outlook').Strategy;
const userModel = require('../src/core/business-models/user');

console.log(process.env.OUTLOOK_CLIENT_ID);
console.log(process.env.OUTLOOK_CLIENT_SECRET);

passport.use(new OutlookStrategy({
    clientID: process.env.OUTLOOK_CLIENT_ID,
    clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
    callbackURL: `${process.env.APP_URL}/auth/outlook/callback`
},
async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    await userModel.updateUserTokens(email, accessToken, refreshToken);
    return done(null, { id: profile.id, email, accessToken, refreshToken, profile });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await userModel.fetchUserById(id);
    done(null, user);
});
