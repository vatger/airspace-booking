import * as dotenv from "dotenv";

interface Config {
  mongoUri: string;
  port: number;
}

dotenv.config();

export default function config(): Config {
  return {
    mongoUri: process.env.MONGO_URI || "",
    port: Number(process.env.PORT) || 3000,
  };
}
