import dotenv from "dotenv";
dotenv.config();

export default function getConfig() {
  const { PORT } = process.env;

  const port = Number(PORT);

  return {
    port: Number.isNaN(port) ? 3000 : port,
    mongoUri: process.env.MONGO_URI || "",
  };
}
