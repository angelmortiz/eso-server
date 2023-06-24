import { CookieOptions } from '../types/types';

export const GetCookieOptions = (expiresInDays: string = '7'): CookieOptions => {
  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN || expiresInDays) *
          86_400_000 //milliseconds in 1 day
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  return cookieOptions;
};
