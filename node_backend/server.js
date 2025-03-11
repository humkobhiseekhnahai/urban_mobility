const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/api/agencies", async (req, res) => {
  try {
    const agencies = await prisma.agency.findMany();
    res.json(agencies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch agencies" });
  }
});

app.get("/api/calendar", async (req, res) => {
  try {
    const calendar = await prisma.calendar.findMany();
    res.json(calendar);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch calendar data" });
  }
});

app.get("/api/stops", async (req, res) => {
  try {
    const stops = await prisma.stop.findMany();
    res.json(stops);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stops" });
  }
});

app.get("/api/trips", async (req, res) => {
  try {
    const trips = await prisma.trip.findMany();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

app.get("/api/routes", async (req, res) => {
  try {
    const routes = await prisma.route.findMany();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch routes" });
  }
});

app.get("/api/suggested-routes", async (req, res) => {
  try {
    const suggestedRoutes = await prisma.suggestedRoute.findMany();
    res.json(suggestedRoutes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch suggested routes" });
  }
});

// Add a new suggested route
app.post("/api/suggested-routes", async (req, res) => {
  try {
    const { source, destination, coordinates } = req.body;
    if (!source || !destination || !coordinates) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRoute = await prisma.suggestedRoute.create({
      data: {
        source,
        destination,
        coordinates: JSON.stringify(coordinates), // Store as JSON string
      },
    });

    res.status(201).json(newRoute);
  } catch (error) {
    res.status(500).json({ error: "Failed to add suggested route" });
  }
});

// Delete a suggested route by ID
app.delete("/api/suggested-routes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.suggestedRoute.delete({
      where: { id },
    });

    res.json({ message: "Suggested route deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete suggested route" });
  }
});

// Get all bus routes
app.get("/api/bus-routes", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    
    if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    const busRoutes = await prisma.busRoute.findMany({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalRoutes = await prisma.busRoute.count();

    res.json({
      data: busRoutes,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalRoutes / pageSize),
      totalRoutes,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bus routes" });
  }
});


// Get a specific bus route by routeNumber (supports alphanumeric IDs like "1", "1E", etc.)
app.get("/api/bus-routes/:routeNumber", async (req, res) => {
  try {
    const { routeNumber } = req.params;
    const busRoute = await prisma.busRoute.findUnique({
      where: { routeNumber: routeNumber },
    });

    if (!busRoute) {
      return res.status(404).json({ error: "Bus route not found" });
    }

    res.json(busRoute);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bus route" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
