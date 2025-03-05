import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

// Function to read JSON safely
const readJson = (filePath) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log(`✅ Loaded ${data.length} records from ${filePath}`);
    return data;
  } catch (err) {
    console.error(`❌ Error reading ${filePath}:`, err.message);
    return []; // Return empty array to avoid breaking createMany()
  }
};

async function main() {
  try {
    console.log("🚀 Starting Database Seeding...");

    // Load data
    const agencyData = readJson("prisma/data/agency.json");
    const calendarData = readJson("prisma/data/calendar.json"); // Fixed typo
    const stopsData = readJson("prisma/data/stops.json");
    const tripsData = readJson("prisma/data/trips.json");
    const routesData = readJson("prisma/data/routes.json");

    console.log("🗑️  Deleting existing records...");

    // Delete existing records in order (to avoid FK constraint issues)
    await prisma.$transaction([
      prisma.trips.deleteMany(),
      prisma.routes.deleteMany(),
      prisma.stops.deleteMany(),
      prisma.calendar.deleteMany(),
      prisma.agency.deleteMany(),
    ]);

    console.log("✅ Existing records deleted.");

    // Insert new data (only if data is available)
    const insertData = async (model, data, name) => {
      if (data.length) {
        try {
          await prisma[model].createMany({ data });
          console.log(`✅ Inserted ${data.length} records into ${name}`);
        } catch (err) {
          console.error(`❌ Error inserting data into ${name}:`, err.message);
        }
      } else {
        console.warn(`⚠️ No data found for ${name}, skipping insertion.`);
      }
    };

    await insertData("agency", agencyData, "Agency");
    await insertData("calendar", calendarData, "Calendar");
    await insertData("stops", stopsData, "Stops");
    await insertData("trips", tripsData, "Trips");
    await insertData("routes", routesData, "Routes");

    console.log("🎉 Database seeding completed!");
  } catch (error) {
    console.error("❌ Error Seeding Database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed script
main();
