import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import db from "../../../lib/db";

export default NextAuth({
  adapter: PrismaAdapter(db),

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      authorize: async (credentials) => {
        const { email } = credentials;

        // Verificar as credenciais no banco de dados
        const user = await db.user.findFirst({
          where: {
            email: email,
          },
        });

        if (bcrypt.compareSync(credentials.password, user.password) === true) {
          // Se as credenciais estiverem corretas, retorne o usuário
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            // Outras informações do usuário
          };
        }

        return null;
      },
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
  },

  secret: process.env.SECRET,

  jwt: {
    secret: process.env.SECRET,
    encryption: true,
  },

  pages: {
    signIn: "/Login",
  },
});
