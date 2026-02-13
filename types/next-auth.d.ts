import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      memberId?: string;
      emailVerified?: boolean;
    };
  }

  interface User {
    id: string;
    role: string;
    memberId?: string;
    emailVerified?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    memberId?: string;
    emailVerified?: boolean;
  }
}