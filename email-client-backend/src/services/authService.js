const passport = require('passport');
const graphClient = require('../core/utils/graphClient');
const userModel = require('../core/business-models/user');

exports.outlookAuth = passport.authenticate('windowslive', { scope: ['https://graph.microsoft.com/.default'] });

exports.outlookCallback = async (req, res, next) => {
  passport.authenticate('windowslive', { failureRedirect: '/login' })(req, res, async () => {

    // Inside this callback, `req.user` will be available if authentication was successful
    const { accessToken, refreshToken, profile, email } = req.user || {};

    if (email || (profile && profile.emails && profile.emails.length > 0)) {
      const userEmail = email || profile.emails[0].value;
      await graphClient.getOutlookEmails(accessToken, userEmail);

      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?userEmail=${userEmail.toLowerCase()}`);
    } else {
      res.status(400).send('User email not found');
    }
  });
};