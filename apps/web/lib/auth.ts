import { createAuthClient } from 'better-auth/react' // make sure to import from better-auth/react
import {
  inferAdditionalFields,
  magicLinkClient,
} from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: 'http://192.168.1.128:4000/api/auth', // The base URL of the API
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
        phone: {
          type: "string",
          required: false,
        },
        walletAddress: {
          type: "string",
          required: false,
        },
        isAdmin: {
          type: "boolean",
          required: false,
        },
      }
    })
  ]
})

export const { signIn, signUp, useSession } = authClient
