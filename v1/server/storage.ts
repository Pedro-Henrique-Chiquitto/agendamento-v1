import { User, School, Event, InsertUser, InsertSchool, InsertEvent } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  listUsers(): Promise<User[]>;

  getSchool(id: number): Promise<School | undefined>;
  createSchool(school: InsertSchool): Promise<School>;
  listSchools(): Promise<School[]>;

  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  listEvents(userId: number): Promise<Event[]>;
  updateEvent(id: number, event: Partial<Event>): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private schools: Map<number, School>;
  private events: Map<number, Event>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.schools = new Map();
    this.events = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async listUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, role: "teacher" };
    this.users.set(id, user);
    return user;
  }

  async getSchool(id: number): Promise<School | undefined> {
    return this.schools.get(id);
  }

  async createSchool(school: InsertSchool): Promise<School> {
    const id = this.currentId++;
    const newSchool: School = { ...school, id };
    this.schools.set(id, newSchool);
    return newSchool;
  }

  async listSchools(): Promise<School[]> {
    return Array.from(this.schools.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.currentId++;
    const newEvent: Event = {
      ...event,
      id,
      start: new Date(event.start),
      end: new Date(event.end),
      description: event.description || null,
      googleEventId: null,
    };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async listEvents(userId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.userId === userId,
    );
  }

  async updateEvent(id: number, event: Partial<Event>): Promise<Event> {
    const existing = await this.getEvent(id);
    if (!existing) throw new Error("Event not found");

    const updated = { ...existing, ...event };
    this.events.set(id, updated);
    return updated;
  }

  async deleteEvent(id: number): Promise<void> {
    this.events.delete(id);
  }
}

export const storage = new MemStorage();