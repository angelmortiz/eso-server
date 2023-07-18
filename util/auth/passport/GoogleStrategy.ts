import passport from 'passport';
import config from '../../../config';
import UserAuthHandler from '../../../models/userModels/userAuthModel';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { IUserAuth } from '../../interfaces/userInterfaces';

// Set up Passport to use the Google OAuth strategy
const passportGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        callbackURL: `${config.serverUrl}/api/auth/login/google/callback`,
      },
      (
        //Note: access and refresh tokens not used because the app is not using other Google APIs
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (error: any, user?: any) => void
      ) => {
        const user: IUserAuth = {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          fullName: profile.displayName,
          email: profile.emails[0].value,
          passwordChangedAt: new Date(),
          strategy: 'Google',
          profileId: profile.id,
          role: 'User',
          imageLink: profile.photos[0].value,
        };

        UserAuthHandler.findOrCreateFromProvider(profile.id, user)
          .then((newUser) => {
            done(null, newUser);
          })
          .catch((err) => {
            done(err);
          });
      }
    )
  );
};

export default passportGoogleStrategy;
