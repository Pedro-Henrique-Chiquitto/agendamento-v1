import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("teacher"),
});

export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  start: timestamp("start").notNull(),
  end: timestamp("end").notNull(),
  userId: integer("user_id").notNull(),
  schoolId: integer("school_id").notNull(),
  googleEventId: text("google_event_id"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
});

export const insertSchoolSchema = createInsertSchema(schools);

// Modificando o schema de inserção de eventos para aceitar strings ISO
export const insertEventSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().nullable(),
  start: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data de início inválida",
  }),
  end: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data de fim inválida",
  }),
  schoolId: z.number(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type School = typeof schools.$inferSelect;
export type Event = typeof events.$inferSelect;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;