import { sign } from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {
  ACCESS_TOKEN_SECRET,
  BACKEND_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from './config';
import socialLoginAction from './actions/socialLoginAction';

// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Google OAuth configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
      passReqToCallback: true,
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      try {
        // const user = await socialLoginAction.loginGoogle({
        //   email: profile.email,
        //   googleId: profile.id,
        // });

        // const accessToken = sign(user, String(ACCESS_TOKEN_SECRET), {
        //   expiresIn: '24hr',
        // });

        // done(null, { user, token: accessToken });

        console.log('coba ya');
      } catch (error) {
        console.log('weeeeeeeeeeeeeeew');
        done(error, false);
      }
    },
  ),
);

// // Serialize user for session (not necessary if not using sessions)
// passport.serializeUser((user: false | any | null | undefined, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user: false | any | null | undefined, done) => {
//   done(null, user);
// });
