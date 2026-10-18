#!/usr/bin/env node
/**
 * Create or reset an admin user in MongoDB.
 *
 * Usage (Docker):
 *   docker compose exec -e ADMIN_EMAIL=kelaltech24@gmail.com \
 *     -e ADMIN_PASSWORD=Admin@123 \
 *     -e ADMIN_NAME=Admin \
 *     api node scripts/createAdmin.js
 *
 * Or with defaults below:
 *   docker compose exec api node scripts/createAdmin.js
 */

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();

const email = (process.env.ADMIN_EMAIL || "kelaltech24@gmail.com").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "Admin@123";
const name = process.env.ADMIN_NAME || "Admin";

async function main() {
  if (!password || password.length < 7) {
    throw new Error("ADMIN_PASSWORD must be at least 7 characters");
  }

  const uri =
    process.env.DB_CONNECTION || "mongodb://mongo:27017/ndmc-mobile";

  await mongoose.connect(uri);
  const users = mongoose.connection.collection("users");
  const hash = await bcrypt.hash(password, 10);

  const result = await users.updateOne(
    { email },
    {
      $set: {
        name,
        email,
        password: hash,
        role: "admin",
        active: true,
      },
      $setOnInsert: {
        googleId: null,
      },
    },
    { upsert: true }
  );

  console.log("Admin user ready:");
  console.log(`  email:    ${email}`);
  console.log(`  password: ${password}`);
  console.log(`  matched:  ${result.matchedCount}, modified: ${result.modifiedCount}, upserted: ${result.upsertedCount}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
