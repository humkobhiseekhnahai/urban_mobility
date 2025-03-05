import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/api/agencies", async(req, res)=>{
    try{
        const agencies = await prisma.agency.findMany();
        res.json(agencies);
    } catch (error) {
        res.status(500).json({error : "Failed to Fetch agencies"});
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
      const stops = await prisma.stops.findMany();
      res.json(stops);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stops" });
    }
  });

  app.get("/api/trips", async (req, res) => {
    try {
      const trips = await prisma.trips.findMany();
      res.json(trips);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trips" });
    }
  });
  
  app.get("/api/routes", async (req, res) => {
    try {
      const routes = await prisma.routes.findMany();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch routes" });
    }
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`);
  });