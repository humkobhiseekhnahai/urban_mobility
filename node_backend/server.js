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

        data: {
          source,
          destination,
          coordinates: JSON.stringify(coordinates),
          status: "pending",
        },
      });
      res.status(201).json(newRoute);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to add suggested route" });
    }
  });

app.patch("/api/suggested-routes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status field is required" });
    }

    const updatedRoute = await prisma.suggestedRoute.update({
      where: { id: id },
      data: { status },
    });
    res.json(updatedRoute);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update suggested route" });
  }
});

app.delete("/api/suggested-routes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.suggestedRoute.delete({ where: { id: id } });
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

app.get("/api/bus-routes/stops", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const busRoutes = await prisma.busRoute.findMany({
      select: { mapJsonContent: true },
    });

    // Use a Map to store unique stops with their coordinates
    const stopsMap = new Map();

    busRoutes.forEach(route => {
      let mapContent = route.mapJsonContent;

      // Ensure it's parsed JSON
      if (typeof mapContent === "string") {
        try {
          mapContent = JSON.parse(mapContent);
        } catch (error) {
          console.error("Invalid JSON format in mapJsonContent:", error);
          return;
        }
      }

      if (Array.isArray(mapContent)) {
        mapContent.forEach(stop => {
          // Check if stop has the required properties
          if (stop.busstop) {
            let lat = "";
            let lon = "";
            // Extract lat and lon from the 'latlons' array if available
            if (stop.latlons && Array.isArray(stop.latlons) && stop.latlons.length >= 2) {
              lat = stop.latlons[0];
              lon = stop.latlons[1];
            }
            stopsMap.set(stop.busstop, {
              name: stop.busstop,
              lat,
              lon
            });
          }
        });
      }
    });

    // Convert Map to Array
    let stops = Array.from(stopsMap.values());

    // Apply regex filter if `search` is provided
    if (search) {
      const regex = new RegExp(search, "i");
      stops = stops.filter(stop => regex.test(stop.name));
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedStops = stops.slice(startIndex, startIndex + parseInt(limit));

    res.json(paginatedStops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bus stop data" });
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

});

