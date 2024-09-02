export const generateRandomToken = (durationInHour: number) => {
  //   create random token to be used as temporary reset token
  const token = require('crypto').randomBytes(64).toString('hex');

  //   set token expiry to 1 hour expiry
  const NOW = new Date();
  const tokenExpiry = NOW.setHours(NOW.getHours() + durationInHour);

  return { token, tokenExpiry };
};
