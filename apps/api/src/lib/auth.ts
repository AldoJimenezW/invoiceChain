import { betterAuth } from "better-auth";
import { createPool } from 'mysql2/promise';


export const auth = betterAuth({
  database: createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3307'),
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'blockchain_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }),

  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
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
    },
  },
  trustedOrigins: [`http://${process.env.DB_HOST}:${process.env.PORT_WEB}`, "http://localhost:3000", "http://192.168.1.128:3000", "https://invoicechain.dishei.xyz"],
});