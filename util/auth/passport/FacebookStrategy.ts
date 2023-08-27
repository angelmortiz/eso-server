import passport from 'passport';
import config from '../../../config';
import UserAuthHandler from '../../../models/userModels/userAuthModel';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { IUserAuth } from '../../interfaces/userInterfaces';

// Set up Passport to use the Facebook OAuth strategy
const passportFacebookStrategy = () => {
  console.log(`Facebook callbackURL: ${config.serverUrl}/api/auth/login/facebook/callback`)
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_AUTH_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_AUTH_CLIENT_SECRET,
        callbackURL: `${config.serverUrl}/api/auth/login/facebook/callback`,
        profileFields: ['id', 'name', 'email', 'photos'],
      },

      (
        //Note: access and refresh tokens not used because the app is not using other Facebook APIs
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (error: any, user?: any) => void
      ) => {
        const user: IUserAuth = {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          fullName: `${profile.name.givenName} ${profile.name.familyName}`,
          email: profile.emails && profile.emails[0].value,
          passwordChangedAt: new Date(),
          strategy: 'Facebook',
          profileId: profile.id,
          role: 'User',
          imageLink: profile.photos[0].value
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

export default passportFacebookStrategy;
