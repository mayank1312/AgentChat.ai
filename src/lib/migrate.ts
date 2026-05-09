/**
 * Database Migration: Add model field to agents table
 * Run this once to update existing database
 */

import { sql } from "drizzle-orm";
import { db } from "@/db";

export async function migrateAgentsTable() {
  try {
    console.log("🔄 Migrating agents table...");

    // Add model column if it doesn't exist
    await db.execute(
      sql`
        ALTER TABLE agents 
        ADD COLUMN IF NOT EXISTS model TEXT NOT NULL DEFAULT 'mistral';
      `
    );

    console.log("✅ Migration completed successfully");
    console.log("✅ Added 'model' column to agents table");
    console.log("✅ Default model: mistral");

    return true;
  } catch (err) {
    console.error("❌ Migration failed:", err);
    return false;
  }
}

// Run migration
if (require.main === module) {
  migrateAgentsTable().then((success) => {
    process.exit(success ? 0 : 1);
  });
}
