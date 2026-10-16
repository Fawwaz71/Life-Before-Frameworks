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
    // TODO: Provide the columns
      user_id Integer Primary key,
      user_name text not null,
      user_age integer not null
      is_admin boolean not null
      createdat text not null
      updateat text not null
    )
  `);
        /*User_Id Int primary key;
        User_name varchar(255);
        User_age Int;
        isAdmin boolean;
        createdAt Varchar(255);
        updatedAt Varchar(255);*/  //turns out the sqlite ddl is diffrent.. and idk if its case sensitive tho

  // TODO: Create indexes for better performance
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

  const server = http.createServer((req, res) => {
    // TODO: Implement the service.
    const parsedUrl = url.parse(req.url!, true);
    const path = parsedUrl.pathname;
    const method = req.method;
    if (method === "GET" && path === "/items") {
    // list
    }
    if (method === "GET" && path?.startsWith("/items/")) {
    // get one
    }
    if (method === "POST" && path === "/items") {
    // create
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
