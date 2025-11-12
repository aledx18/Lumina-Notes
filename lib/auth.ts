import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { createAuthMiddleware } from 'better-auth/api'
import { exampleContent } from '@/exampleContent'
import prisma from './db'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql'
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    } // todo: check if the user is new or not with github provider
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith('/sign-up')) {
        const newSession = ctx.context.newSession

        if (!newSession) {
          return
        }

        try {
          await prisma.document.create({
            data: {
              name: 'Getting Started',
              userId: newSession.user.id,
              icon: '👋🏽',
              content: JSON.stringify(exampleContent),
              coverImage:
                'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470'
            }
          })
        } catch (err) {
          console.error(err)
        }
      }
    })
  }
  //   plugins: [
  //     polar({
  //       client: polarClient,
  //       createCustomerOnSignUp: true,
  //       use: [
  //         checkout({
  //           products: [
  //             {
  //               productId: 'f66fadfc-2edb-428c-9f7f-9b07a7128300',
  //               slug: 'NodebasePro'
  //             }
  //           ],
  //           successUrl: process.env.POLAR_SUCCESS_URL,
  //           authenticatedUsersOnly: true
  //         }),
  //         portal()
  //       ]
  //     })
  //   ]
})
