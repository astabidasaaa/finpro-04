import { logout } from '@/_middlewares/auth.middleware';
import { verify } from 'jsonwebtoken';
import { useAppDispatch } from './hooks';

const parseJWT = (token: string) => {
  if (!token) throw new Error('token missing');

  // const isVerified = verify(token, String(process.env.ACCESS_TOKEN_SECRET));

  // console.log(isVerified);

  // if (isVerified) {
  const base64url = token.split('.')[1];
  const base64 = base64url.replace('-', '+').replace('_', '/');

  return JSON.parse(window.atob(base64));
  // }
};

export default parseJWT;
