import config from '../../config';
import { CookieOptions } from '../types/types';

export const GetAuthCookieOptions = (
  expiresInDays: string = '7'
): CookieOptions => {
  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN || expiresInDays) *
          86_400_000 //milliseconds in 1 day
    ),
    httpOnly: true,
  };

  if (['production', 'beta'].includes(config.env)) cookieOptions.secure = true;

  return cookieOptions;
};

export const GetBetaUserCookieOptions = (
  expiresInMinutes: string = '30'
): CookieOptions => {
  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_BETA_COOKIE_EXPIRES_IN || expiresInMinutes) *
          60_000 //milliseconds in 1 min
    ),
    httpOnly: true,
  };

  if (['production', 'beta'].includes(config.env)) cookieOptions.secure = true;

  return cookieOptions;
};

export const GetJWTFromCookies = (
  cookies: string | undefined,
  tokenName: string
) => {
  //getting authentication token from cookies
  let token: string | undefined;
  const arrCookies = cookies?.split('; ') || [];
  token = arrCookies.find((c) => c.startsWith(tokenName + '='))
  token = token?.split('=')[1];
  return token;
};
