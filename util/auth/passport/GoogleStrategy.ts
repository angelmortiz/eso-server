import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { IUserAuth } from '../../interfaces/userInterfaces';
import UserAuthHandler from '../../../models/userModels/userAuthModel';

const serverAddress =
  process.env.NODE_ENV === 'production'
    ? `https://${process.env.SERVER_ADDRESS}`
    : `http://localhost:${process.env.SERVER_PORT || '8080'}`;

// Set up Passport to use the Google OAuth strategy
const passportGoogleStrategy = () => {
  console.log(`URL: ${serverAddress}/api/auth/login/google/callback`);
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        callbackURL: `${serverAddress}/api/auth/login/google/callback`,
      },
      async (
        //Note: access and refresh tokens not used because the app is not using other Google APIs
        accessToken: string,
        refreshToken: string,
        profile: any,
        //TODO: Implement done function to perform checks after the Strategy has been completed
        //TODO: Implement a logic to handle situations when the user is using an email that already exists in the db
        done: (error: any, user?: any) => void
      ) => {
        const userInfo: IUserAuth = {
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

        let user = await UserAuthHandler.findOrCreateFromProvider(
          profile.id,
          userInfo
        );
        done(null, user);
      }
    )
  );
};

export default passportGoogleStrategy;
