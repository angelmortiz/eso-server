import { ObjectId } from 'bson';
import jwt from 'jsonwebtoken';

export const IssueJwt = async (id: string | ObjectId) => {
  return jwt.sign(
    { id, iat: Date.now() },
    process.env.JWT_SECRET, // FIXME: Add AWS KMS || (await getVaultSecret('jwt-secret')),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};