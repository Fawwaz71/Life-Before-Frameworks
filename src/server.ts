import http from "node:http";
import url from "node:url";
import Database from "better-sqlite3";
import path from "node:path";

// Database setup
const dbPath = path.join(process.cwd(), "users.db");
let db: Database.Database;

// Initialize database
const initDatabase = () => {
  db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      isAdmin BOOLEAN NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

};

type User = {
  id: number;
  name: string;
  age: number;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};

export const createMyServer = (): http.Server => {
  // Initialize database when server is created
  initDatabase();
let items: User[] = [];
let nextId = 1;
  const server = http.createServer((req, res) => {
    // TODO: Implement the service.
    const parsedUrl = url.parse(req.url!, true);
    const path = parsedUrl.pathname;
    const method = req.method;
    if (method === "GET" && path === "/items") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(items));
      return;
    }
    if (method === "GET" && path?.startsWith("/items/")) {
      const id = parseInt(path.split("/")[2]);
      if (isNaN(id)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid item ID" }));
      return;
      }
      const item = items.find((item) => item.id === id);
      if (item) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(item));
      } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Item not found" }));
      }
    }
    if (method === "POST" && path === "/items") {
      let body = "";
      req.on("data", (chunk) => {
      body += chunk.toString();
      });
      req.on("end", () => {
      try {
      const data = body ? JSON.parse(body) : undefined;
      // validate ...
      const newItem = { id: nextId++, ...data };
      items.push(newItem);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newItem));
      } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
      });
      return;
    }
    // ... PUT, DELETE
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });

  return server;
};

export const resetMyServerData = () => {
  try {
    if (db) {
      db.prepare("DELETE FROM users").run();
      db.prepare("DELETE FROM sqlite_sequence WHERE name = 'users'").run();
      console.log("Database reset completed");
    }
  } catch (error) {
    console.error("Error resetting database:", error);
  }
};

// Clean up database connection on process exit
process.on("exit", () => {
  if (db) {
    db.close();
  }
});

process.on("SIGINT", () => {
  if (db) {
    db.close();
  }
  process.exit(0);
});

process.on("SIGTERM", () => {
  if (db) {
    db.close();
  }
  process.exit(0);
});
