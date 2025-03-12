const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();
const BATCH_SIZE = 100; // Smaller batch size to isolate problematic records

// Safely read JSON data
const readJson = (filePath) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log(`✅ Loaded ${data.length} records from ${filePath}`);
    return data;
  } catch (err) {
    console.error(`❌ Error reading ${filePath}: ${err.message}`);
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

// Validate and Fix BusRoute Data
const validateBusRoutes = (data) =>
  data.map((route) => ({
    routeNumber: String(route.route_no) || "Unknown", // Convert to string
    routeName: route.origin || "Unnamed Route",
    origin: route.origin || "Unknown",
    departureTimes: route.departure_from_origin || "",
    mapJsonContent: JSON.stringify(route.map_json_content || []),
  }));

// Insert Data Function with Detailed Error Handling
const insertData = async (model, data, name) => {
  if (!data.length) {
    console.warn(`⚠️ No data for ${name}, skipping.`);
    return;
  }

  console.log(`📤 Inserting ${data.length} records into ${name}...`);

  // Insert in smaller batches
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    try {
      await prisma[model].createMany({ data: batch });
      console.log(`✅ Inserted batch ${i / BATCH_SIZE + 1} of ${Math.ceil(data.length / BATCH_SIZE)} into ${name}`);
    } catch (err) {
      console.error(`❌ Error inserting batch ${i / BATCH_SIZE + 1} into ${name}: ${err.message}`);
      
      // Attempt to insert records individually to find problematic data
      for (const record of batch) {
        try {
          await prisma[model].create({ data: record });
        } catch (innerErr) {
          console.error(`❌ Failed record: ${JSON.stringify(record)}`);
          console.error(`⚠️ Inner error: ${innerErr.message}`);
        }
      }
    }
  }
};

async function main() {
  console.log("🚀 Starting Database Seeding...");

  // Load and transform data
  const agencyData = readJson("prisma/data/agency.json");
  const calendarData = transformCalendarData(readJson("prisma/data/calendar.json"));
  const stopsData = readJson("prisma/data/stops.json");
  const tripsData = readJson("prisma/data/trips.json");
  const routesData = validateRoutes(readJson("prisma/data/routes.json"));
  const busRoutesData = validateBusRoutes(readJson("prisma/data/busRoutes.json"));

  console.log("🗑️ Deleting existing records...");

  // Delete existing data
  await prisma.$transaction([
    prisma.trip.deleteMany(),
    prisma.route.deleteMany(),
    prisma.stop.deleteMany(),
    prisma.calendar.deleteMany(),
    prisma.agency.deleteMany(),
    prisma.busRoute.deleteMany(),
  ]);

  console.log("✅ Existing records deleted.");

  // Insert new data
  await insertData("agency", agencyData, "Agency");
  await insertData("calendar", calendarData, "Calendar");
  await insertData("stop", stopsData, "Stops");
  await insertData("route", routesData, "Routes");
  await insertData("trip", tripsData, "Trips");
  await insertData("busRoute", busRoutesData, "BusRoute");

  console.log("🎉 Database seeding completed!");
}

// Execute main function
main()
  .catch((error) => {
    console.error("❌ Error during seeding:", error.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
