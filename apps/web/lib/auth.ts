import { createAuthClient } from 'better-auth/react' // make sure to import from better-auth/react
import {
  inferAdditionalFields,
  magicLinkClient,
} from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        lastName: {
          type: "string",
          required: true,
        },
        age: {
          type: "number",
          required: false,
        },
        profession: {
          type: "string",
          required: false,
        },
        biography: { // Added biography
          type: "string",
          required: false,
        },
        facebook: { // Added facebook
          type: "string",
          required: false,
        },
        twitter: { // Added twitter
          type: "string",
          required: false,
        },
        instagram: { // Added instagram
          type: "string",
          required: false,
        },
        phone: {
          type: "string",
          required: false,
        },
        walletAddress: {
          type: "string",
          required: false,
        },
        role: { // Added role
          type: "string",
          required: false,
        },
        isAdmin: {
          type: "boolean",
          required: false,
        },
        location: { // Added location
          type: "string",
          required: false,
        },
      }
    })
  ]
})

export const { signIn, signUp, useSession } = authClient
