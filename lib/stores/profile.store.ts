import { create } from "zustand";

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
  bvn?: string;
}

export interface Accounts {
  accouts: Array<Omit<BankAccount, "bvn">>;
  bvn: string;
}
export interface NextOfKin {
  name: string;
  relationship: string;
  phone: string;
  address: string;
  email?: string;
}

export interface Identification {
  type: string;
  key: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  altPhone?: string;
  gender?: string;
  dateOfBirth?: Date | string;
  nationality?: string;
  address?: string;
  avatar?: string | File;
  //   status: UserStatus;
  identification?: Identification;
  marketerCode: string;
  shopperCode: string;
  memberOf: string;
  bankAccount?: BankAccount;
  nextOfKin?: NextOfKin;
  createdAt: string;
  totalEarnings: number;
  totalRecruits: number;
  status: string;
  level?: number;
}

interface ProfileState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));
