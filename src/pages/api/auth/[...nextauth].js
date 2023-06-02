import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import db from "../../../lib/db";

export default NextAuth({
 
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
       authorize: async (credentials) => {
  try {
    console.log(credentials, "credentials");
    const user = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }).then((res) => res.json());
    console.log(user, "user returned");
    
    if (
      credentials.email === user.email &&
      user.authorized === true
    ) {
      return user; // Credenciais válidas e usuário autorizado
    }
    
    return false; // Credenciais inválidas ou usuário não autorizado
  } catch (error) {
    console.error("Erro ao logar com as credentials", error);
    return false; // Ocorreu um erro ao verificar as credenciais
  }
}
}),

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
adapter: PrismaAdapter(db),
  callbacks: {

    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    session: ({ session, token, user }) => {
      if (token && token.id) {
        session.id = token.id;
      }

      return {
        ...session,
        user: {
          ...session.user,
          phone: user?.phone ?? "Número não cadastrado",
        },
      };
    },
    signIn: async (user, account, profile) => {
        console.log(user, "user"),
          console.log(account, "account"),
          console.log(profile, "profile");
      
        return Promise.resolve(true);
      }
  },

  

  pages: {
    signIn: "/Login",
  },
});
