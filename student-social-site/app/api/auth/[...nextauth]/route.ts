import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: { signIn: "/login" },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Sign In",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        var student = {
          avatar: {
            public_id: null,
            url: null,
          },
          banner: {
            public_id: null,
            url: null,
          },
          _id: null,
          name: null,
          email: null,
          password: null,
          batch: null,
          course: null,
          privacy: null,
          contact_number: null,
          role: null,
          friend: [],
          isDeleted: null,
          createdAt: null,
          __v: 0,
        };
        const config = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        };

        await fetch("http://localhost:5000/api/v1/student/login", config)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Error during login");
            }
          })
          .then((data) => {
            student = data.student;
          })
          .catch((error) => {
            console.error(error);
            return null;
          });
        if (student._id === null) {
          return null;
        }
        return {
          id: student._id + "",
          name: student.name,
          email: student.email,
          image: student.avatar.url,
          student: student,
        };
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      const st = token.student as unknown as any;
      return { ...session, _id: st._id, student: st };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return { ...token, student: u.student };
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
