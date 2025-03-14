import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertSchoolSchema, insertEventSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Users
  app.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const users = await storage.listUsers();
    res.json(users);
  });

  // Schools
  app.get("/api/schools", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const schools = await storage.listSchools();
    res.json(schools);
  });

  app.post("/api/schools", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const data = insertSchoolSchema.parse(req.body);
      const school = await storage.createSchool(data);
      res.status(201).json(school);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json(err.errors);
      } else {
        throw err;
      }
    }
  });

  // Events
  app.get("/api/events", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const events = await storage.listEvents(req.user.id);
    res.json(events);
  });

  app.post("/api/events", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const data = insertEventSchema.parse(req.body);
      const event = await storage.createEvent({
        ...data,
        userId: req.user.id,
      });
      res.status(201).json(event);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json(err.errors);
      } else {
        throw err;
      }
    }
  });

  app.patch("/api/events/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const event = await storage.getEvent(Number(req.params.id));
    if (!event) return res.sendStatus(404);
    if (event.userId !== req.user.id) return res.sendStatus(403);

    const updated = await storage.updateEvent(event.id, req.body);
    res.json(updated);
  });

  app.delete("/api/events/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const event = await storage.getEvent(Number(req.params.id));
    if (!event) return res.sendStatus(404);
    if (event.userId !== req.user.id) return res.sendStatus(403);

    await storage.deleteEvent(event.id);
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}