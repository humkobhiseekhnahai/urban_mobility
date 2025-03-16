const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new route
router.post("/create-custom-route", async (req, res) => {
    try {
        const { start, stop, intermediate, departure_time } = req.body;

        // Validate input data
        if (!start || !stop || !intermediate || !departure_time) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Fetch all existing routes with the same start point
        const existingRoutes = await prisma.customRoute.findMany({
            where: { origin: start }
        });

        // Manually check if any route has the same intermediate stops
        const matchedRoute = existingRoutes.find(route => {
            const existingStops = JSON.parse(route.mapJsonContent).stops;
            return JSON.stringify(existingStops) === JSON.stringify(intermediate);
        });

        if (matchedRoute) {
            return res.json({ message: "Route already exists", route_no: matchedRoute.routeNumber });
        }

        // Generate a new route number safely
        const safeStart = start ? start.slice(0, 3).toUpperCase() : "UNK";
        const safeStop = stop ? stop.slice(0, 3).toUpperCase() : "UNK";
        const routeNumber = `USR-${safeStart}-${safeStop}-${intermediate.length}`;

        // Save to database
        const newRoute = await prisma.customRoute.create({
            data: {
                routeNumber: routeNumber,
                routeName: `Custom Route ${routeNumber}`,
                origin: start,
                departureTimes: JSON.stringify(departure_time),
                mapJsonContent: JSON.stringify({
                    origin: start,
                    stops: intermediate,
                    destination: stop
                })
            }
        });

        res.json({ message: "Route created successfully", route_no: routeNumber });
    } catch (error) {
        console.error("Error creating route:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
