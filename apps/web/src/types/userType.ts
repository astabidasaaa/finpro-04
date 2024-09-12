export type User = {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
  phone: string;
  referralCode: string;
};

export type Status = {
  isLogin: boolean;
};

export type Auth = {
  user: User;
  status: Status;
};

export type SearchedUser = {
  role: {
    id: number;
    name: string;
  };
  id: number;
  email: string;
  profile: {
    name: string | null;
    dob: Date | null;
  } | null;
  store: {
    id: number;
    name: string;
  } | null;
};
