import { ObjectId } from 'bson';
import jwt from 'jsonwebtoken';

export const IssueAuthJWT = (
  id: string | ObjectId,
  expiresInDays: string = '7'
) => {
  return jwt.sign(
    { id, iat: Date.now() },
    process.env.JWT_SECRET, // FIXME: Add AWS KMS || (await getVaultSecret('jwt-secret')),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || `${expiresInDays}d`,
    }
  );
};

export const IssueBetaUserJWT = (
  id: string | ObjectId,
  expiresInMinutes: string = '30'
) => {
  return jwt.sign(
    { id, iat: Date.now() },
    process.env.JWT_BETA_SECRET, // FIXME: Add AWS KMS || (await getVaultSecret('jwt-secret')),
    {
      expiresIn: process.env.JWT_BETA_EXPIRES_IN || `${expiresInMinutes}m`,
    }
  );
};
