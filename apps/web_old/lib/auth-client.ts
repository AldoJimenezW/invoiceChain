import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_SERVER,
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
