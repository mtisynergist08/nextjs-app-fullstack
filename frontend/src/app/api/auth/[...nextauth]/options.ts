import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import { api } from "@/network/axios-instances";
import { User } from "@/models/user-model";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "Email" },
        password: {
          label: "password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials, req) {
        console.log("Authorize functions credentials", credentials);

        const res = await api.post<User>("/login", {
          email: credentials?.email,
          password: credentials?.password,
        });

        const user = res.data;

        if (user) {
          return user;
        } else {
          console.log("No user found");
          return null;
        }
      },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
        token.refreshToken = account.refreshToken;
      }
      return token;
    },
    async session({ session, user, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },
};

export default NextAuth(options);
