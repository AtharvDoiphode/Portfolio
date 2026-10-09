import mongoose from "mongoose";
import { createApp } from "./app.js";
import { env } from "./env.js";

async function main() {
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log("MongoDB connected");
  const app = createApp();
  app.listen(env.PORT, () => console.log(`API listening on http://localhost:${env.PORT}`));
}

main().catch((err) => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});
