const parseJWT = (token: string) => {
  if (!token) throw new Error('token missing');

  const base64url = token.split('.')[1];
  const base64 = base64url.replace('-', '+').replace('_', '/');

  return JSON.parse(window.atob(base64));
};

export default parseJWT;
