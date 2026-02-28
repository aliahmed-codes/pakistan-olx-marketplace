import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { loginSchema } from './validations';

export const authOptions: NextAuthOptions = {
  adapter: undefined, // Using JWT strategy, no adapter needed
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          const validatedCredentials = loginSchema.parse(credentials);

          // Find user
          const user = await prisma.user.findUnique({
            where: { email: validatedCredentials.email },
          });

          if (!user) {
            throw new Error('Invalid email or password');
          }

          // Check if user is banned
          if (user.isBanned) {
            throw new Error('Your account has been banned. Please contact support.');
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            validatedCredentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error('Invalid email or password');
          }

          // Return user without password
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.profileImage,
            role: user.role,
            phone: user.phone,
            isBanned: user.isBanned,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
        token.isBanned = user.isBanned;
      }

      // Handle session update
      if (trigger === 'update' && session) {
        token.name = session.name;
        token.image = session.image;
        token.phone = session.phone;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'USER' | 'ADMIN';
        session.user.phone = token.phone as string | undefined;
        session.user.isBanned = token.isBanned as boolean;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`);
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token.email}`);
    },
  },
};

// Extend next-auth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: 'USER' | 'ADMIN';
      phone?: string;
      isBanned: boolean;
    };
  }

  interface User {
    role: 'USER' | 'ADMIN';
    phone?: string;
    isBanned: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: 'USER' | 'ADMIN';
    phone?: string;
    isBanned?: boolean;
  }
}
