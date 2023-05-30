// import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import db from "../lib/db";
// import axios from "axios";

// export default NextAuth({
//   adapter: PrismaAdapter(db),

//   providers: [
//     CredentialsProvider({
//       //name: "Credentials",
//       type: "credentials",
//       credentials: {},
//       // async authorize(credentials, req) {
//       //   const res = await fetch("http://localhost:3000/api/user/login", {
//       //     method: "POST",
//       //     body: JSON.stringify(credentials),
//       //     headers: { "Content-Type": "application/json" },
//       //   });
//       // },

//       authorize(credentials, req) {
//         const { email, password } = credentials;

//         if (
//           email !== "guilopesfeitosa@gmail.com" ||
//           password !== "guilopesfeitosa@gmail.com"
//         ) {
//           return null;
//         }

//         return {
//           id: "123",
//           name: "Guilherme Lopes",
//           email: "guilopesfeitosa@gmail.com",
//
//         };
//       },
//     }),

//     // CredentialsProvider({
//     //   name: "Credentials",

//     //   credentials: {
//     //     username: { label: "Username", type: "text", placeholder: "jsmith" },
//     //     password: { label: "Password", type: "password" },
//     //   },
//     //   async authorize(credentials, req) {
//     //     const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

//     //     if (user) {
//     //       return user;
//     //     } else {
//     //       return null;
//     //     }
//     //   },
//     // }),

//     GithubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),

//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//     }),
//   ],

//   secret: process.env.SECRET,

//   // callbacks: {
//   //   signIn: async (user, account, profile) => {
//   //     console.log(user, "user"),
//   //       console.log(account, "account"),
//   //       console.log(profile, "profile");

//   //     return Promise.resolve(true);
//   //   },
//   // },

//   //   callbacks: {

//   //     jwt: ({ token, user }) => {
//   //       // first time jwt callback is run, user object is available
//   //       if (user) {
//   //         token.id = user.id;
//   //       }

//   //       return token;
//   //     },

//   session: ({ session, user }) => ({
//     // ...session,
//     // user: {
//     //   ...session.user,
//     //   id: user.id,
//     //   email: user.email,
//     // },

//     strategy: "jwt",
//   }),

//   // secret: "test",
//   //   jwt: {
//   //     secret: "test",
//   //     encryption: true,
//   //   },

//   pages: {
//     signIn: "/Login",
//     //signOut: "/pages/Login",
//     //error: "/pages/Error/login",
//   },
// });
