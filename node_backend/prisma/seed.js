const {PrismaClient} =require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

// Read JSON safely
const readJson = (filePath) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log(`✅ Loaded ${data.length} records from ${filePath}`);
    return data;
  } catch (err) {
    console.error(`❌ Error reading ${filePath}:`, err.message);
    return [];
  }
};

// Transform Calendar Data
const transformCalendarData = (data) =>
  data.map((entry) => ({
    ...entry,
    monday: !!entry.monday,
    tuesday: !!entry.tuesday,
    wednesday: !!entry.wednesday,
    thursday: !!entry.thursday,
    friday: !!entry.friday,
    saturday: !!entry.saturday,
    sunday: !!entry.sunday,
  }));

// Validate and Fix Route Data
const validateRoutes = (data) =>
  data
    .filter((route) => route.route_id) // Remove null IDs
    .map((route) => ({
      ...route,
      text_color: route.textColor || null, // Fix key mismatch
    }));

async function main() {
  try {
    console.log("🚀 Starting Database Seeding...");

    // Load Data
    const agencyData = readJson("prisma/data/agency.json");
    const calendarData = readJson("prisma/data/calendar.json");
    const stopsData = readJson("prisma/data/stops.json");
    const tripsData = readJson("prisma/data/trips.json");
    const routesData = validateRoutes(readJson("prisma/data/routes.json")); // Fixed

    console.log("🗑️ Deleting existing records...");

    await prisma.$transaction([
      prisma.trip.deleteMany(),
      prisma.route.deleteMany(),
      prisma.stop.deleteMany(),
      prisma.calendar.deleteMany(),
      prisma.agency.deleteMany(),
    ]);

    console.log("✅ Existing records deleted.");

    // Insert Function
    const insertData = async (model, data, name) => {
      if (data.length) {
        try {
          await prisma[model].createMany({ data });
          console.log(`✅ Inserted ${data.length} records into ${name}`);
        } catch (err) {
          console.error(`❌ Error inserting into ${name}:`, err.message);
        }
      } else {
        console.warn(`⚠️ No data for ${name}, skipping.`);
      }
    };

    await insertData("agency", agencyData, "Agency");
    await insertData("calendar", transformCalendarData(calendarData), "Calendar");
    await insertData("stop", stopsData, "Stops");
    await insertData("route", routesData, "Routes");
    await insertData("trip", tripsData, "Trips"); // Now Trips will have valid route_ids

    console.log("🎉 Database seeding completed!");
  } catch (error) {
    console.error("❌ Error Seeding Database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed script
main();
