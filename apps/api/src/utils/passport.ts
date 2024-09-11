import { sign } from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {
  ACCESS_TOKEN_SECRET,
  BACKEND_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from '../config';
import socialLoginAction from '../actions/socialLoginAction';

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
      passReqToCallback: true,
    },
    async (
      req,
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any,
    ) => {
      try {
        const user = await socialLoginAction.initiateLoginGoogle({
          email: profile.emails[0].value,
          googleId: profile.id,
        });

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);
