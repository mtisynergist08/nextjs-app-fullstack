import { User as NextAuthUser, Session } from "next-auth";

export interface User extends NextAuthUser {
  email: string;
  name: string;
  role: string;
  refreshToken: string;
  accessToken: string;
}

declare module "next-auth" {
  export interface Session {
    accessToken?: string; // Add the accessToken property with its type
    refreshToken?: string;
  }
}
