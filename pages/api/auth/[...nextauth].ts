// pages/api/auth/[...nextauth].ts

import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { getServerSession } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import prisma from '../../../lib/prisma';

const authHandler: NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, nextAuthOptions);
export default authHandler;

export const nextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (user.isGlobalAdmin || user.isUserEnabled) {
        return true
      }
      const { canUsersRegister } = await prisma.workspaceConfig.findUnique({
        where: {
          id: 0
        }
      })
      if (user.isUserEnabled === undefined && canUsersRegister) {
        // if isUserEnabled is undefined, it means a new user is joining
        return true;
      } else {

        console.log("did not allow user to join", user, account, profile, canUsersRegister)
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    }
  }
};