import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import db from "../../../lib/db";

export default NextAuth({
 
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
       authorize: async (credentials) => {
        try {
          const user = await fetch("http://localhost:3000/api/user/login", {
            method: "POST",
            body: JSON.stringify(credentials),
          }).then((res) => res.json());
          
        if (
          credentials.email === user.email &&
          credentials.authorized === true
        ) {
          return {
            id: user.id,
            image: "https://source.unsplash.com/random/200x200/?face",
            name: user.name,
            email: user.email,
            phone: user.phone,
          };
        }
        
        return null;
      } catch (error) {
          console.error("Erro ao logar com as credentials", error);
        }
        
      }}),

    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  secret: process.env.SECRET,

  jwt: {
    secret: process.env.SECRET,
    encryption: true,
  },

  callbacks: {

    signIn: async (user, account, profile,session) => {
      console.log(user, "user"),
        console.log(account, "account"),
        console.log(profile, "profile");
      return Promise.resolve(true);
    },
    
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
      }

      return session;
    },
  },

  

  pages: {
    signIn: "/Login",
  },
});
