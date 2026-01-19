import { defineConfig } from "prisma/config";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://postgres:250605@localhost:5432/aiba_db";
}

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
