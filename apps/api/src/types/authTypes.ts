export type CreateUserQueryProps = {
  email: string;
  password: string;
  referralCode: string;
  referredById: number | null;
};
