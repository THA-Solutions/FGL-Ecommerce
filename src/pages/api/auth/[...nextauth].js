import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      authorize: (credentials) => {
        if (
          credentials.email === "admin@admin.com" &&
          credentials.password === "admin"
        ) {
          return {
            id: 1,
            name: "Admin",
            email: "adm@teste.com",
            image: "https://source.unsplash.com/random/100x100/?face",
          };
        }

        return null;
      },
    }),
  ],

  callbacks: {
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

  secret: process.env.SECRET,

  jwt: {
    secret: process.env.SECRET,
    encryption: true,
  },

  pages: {
    signIn: "/Login",
  },
});
