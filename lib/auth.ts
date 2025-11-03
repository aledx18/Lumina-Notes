import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from './db'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql'
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
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
