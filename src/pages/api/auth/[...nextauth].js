import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import db from "../../../lib/db";
import axios from "axios";

export default NextAuth({
  adapter: PrismaAdapter(db),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const user = await axios
          .post(`http://localhost:3000/api/user/login`, { credentials })
          .then((response) => {
            return {
              id: response.data.id.toString(),
              image: "https://source.unsplash.com/random/200x200/?profile",
              name: response.data.name,
              email: response.data.email,
            };
          });
        return {
          id: user.id.toString(),
          image: "https://source.unsplash.com/random/200x200/?profile",
          name: user.name,
          email: user.email,
        };
      },
    }),

    // CredentialsProvider({
    //   name: "Credentials",

    //   credentials: {
    //     username: { label: "Username", type: "text", placeholder: "jsmith" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials, req) {
    //     const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

    //     if (user) {
    //       return user;
    //     } else {
    //       return null;
    //     }
    //   },
    // }),

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

  callbacks: {
    signIn: async (user, account, profile) => {
      console.log(user, "user"),
        console.log(account, "account"),
        console.log(profile, "profile");

      return Promise.resolve(true);
    },
  },

  //   callbacks: {

  //     jwt: ({ token, user }) => {
  //       // first time jwt callback is run, user object is available
  //       if (user) {
  //         token.id = user.id;
  //       }

  //       return token;
  //     },
  //     session: ({ session, user}) => ({

  //       ...session,
  //       user: {
  //         ...session.user,
  //         id: user.id,
  //         email: user.email,
  //       },
  //     }),
  //   },
  // secret: "test",
  //   jwt: {
  //     secret: "test",
  //     encryption: true,
  //   },
  //   pages: {
  //     signIn: "auth/sigin",
  //   },
});
