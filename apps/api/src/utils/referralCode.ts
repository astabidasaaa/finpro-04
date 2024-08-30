// func for generating of the referral code for each registered user, then return the code
export const generateReferralCode = () => {
  const length = 8;
  const charset = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }
  return code;
};
