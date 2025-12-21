import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // For demo - accept any credentials
        if (credentials?.email) {
          return {
            id: "1",
            email: credentials.email,
            name: credentials.email.toString().split('@')[0],
            role: "student"
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
  }
}

// Export for API route
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)

// Export for use in server components
export default NextAuth(authOptions)