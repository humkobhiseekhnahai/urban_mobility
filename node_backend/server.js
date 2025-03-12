const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Generic route handler for fetching data
const fetchData = async (model, res) => {
  try {
    const data = await prisma[model].findMany();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch ${model}` });
  }
};

// CRUD for suggested routes
app.route("/api/suggested-routes")
  .get((req, res) => fetchData("suggestedRoute", res))
  .post(async (req, res) => {
    try {
      const { source, destination, coordinates } = req.body;
      if (!source || !destination || !coordinates) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const newRoute = await prisma.suggestedRoute.create({
        data: { source, destination, coordinates: JSON.stringify(coordinates) },
      });
      res.status(201).json(newRoute);
    } catch (error) {
      res.status(500).json({ error: "Failed to add suggested route" });
    }
  });

app.delete("/api/suggested-routes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.suggestedRoute.delete({ where: { id: parseInt(id, 10) } });
    res.json({ message: "Suggested route deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete suggested route" });
  }
});

// ✅ Get all bus routes (Non-Paginated)
app.get("/api/bus-routes/all", async (req, res) => {
  try {
    const busRoutes = await prisma.busRoute.findMany();
    res.json(busRoutes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all bus routes" });
  }
});

// ✅ Get bus routes with Pagination and Filtering
app.get("/api/bus-routes", async (req, res) => {
  try {
    const { routeNumber, routeName, origin, timeFrameStart, timeFrameEnd, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    const filters = {};
    if (routeNumber) filters.routeNumber = routeNumber;
    if (routeName) filters.routeName = { contains: routeName, mode: "insensitive" };
    if (origin) filters.origin = { contains: origin, mode: "insensitive" };
    
    // ✅ Proper time filtering (Ensure departureTimes is an array)
    if (timeFrameStart && timeFrameEnd) {
      filters.departureTimes = { some: { gte: timeFrameStart, lte: timeFrameEnd } };
    }

    const busRoutes = await prisma.busRoute.findMany({
      where: filters,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalRoutes = await prisma.busRoute.count({ where: filters });

    res.json({ 
      data: busRoutes, 
      currentPage: pageNumber, 
      totalPages: Math.ceil(totalRoutes / pageSize), 
      totalRoutes 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bus routes" });
  }
});

app.get("/api/:model", async (req, res) => {
  const { model } = req.params;
  const validModels = ["agency", "calendar", "stop", "trip", "route", "suggestedRoute", "busRoute"];

  if (!validModels.includes(model)) {
    return res.status(400).json({ error: "Invalid model requested" });
  }
  await fetchData(model, res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
