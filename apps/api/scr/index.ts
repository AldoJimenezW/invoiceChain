import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { Transaction } from "./entity/Transaction";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await createConnection({
      type: "mariadb",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "3306"),
      username: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "blockchain_db",
      entities: [User, Transaction],
      synchronize: true,
    });

    console.log("Connected to MariaDB");

    app.get("/", (req, res) => {
      res.send("Blockchain API is running");
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
