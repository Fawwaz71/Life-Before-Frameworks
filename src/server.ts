import http from "node:http";
import url from "node:url";
import Database from "better-sqlite3";
import path from "node:path";

// Database setup
const dbPath = path.join(process.cwd(), "users.db");
let db: Database.Database;

// Initialize database
const initDatabase = () => {
  if (!db) {
    db = new Database(dbPath);

<<<<<<< HEAD
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

=======
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        isAdmin INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);// make the table using sql

    db.exec(`CREATE INDEX IF NOT EXISTS idx_users_name ON users (name)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_users_isAdmin ON users (isAdmin)`);// make index
  }
>>>>>>> 0c1cbd1 (final)
};

type User = {
  id: number;
  name: string;
  age: number;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};

// helper
const sendJson = (res: http.ServerResponse, status: number, data: unknown) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}; // send json respone with status

const rowToUser = (row: any): User => { // 
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    isAdmin: row.isAdmin === 1,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }; // since sql lite save boolean as 1/0 not true or false it convert it into 1/0 and anything else have to writen again to follow the table
};

const parseId = (text: string): number | null => {
  const id = Number(text);
  if (text === "" || !Number.isInteger(id)) {
    return null;
  }
  return id;
};//basicaly change string to number so it can be process and remove string or float 

const validateUser = (data: any): string | null => {
  if (!data || typeof data !== "object" || Array.isArray(data) || Object.keys(data).length === 0) {
    return "Request body is required";
  } // make sure it is not empty
  if (typeof data.name !== "string" || data.name.trim() === "") {
    return "Name is required and must be a non-empty string";
  }// make sure name is string and not empty
  if (data.name.trim().length > 100) {
    return "Name must be 100 characters or less";
  } // make sure the lenght is less than 100 character 
  if (data.age === undefined) {
    return "Age is required";
  }// make sure its not null
  if (typeof data.age !== "number" || !Number.isInteger(data.age) || data.age < 0 || data.age > 150) {
    return "Age must be a valid integer between 0 and 150";
  }//if not number or not integer and not beyond 150 and not even born yet to be inputed basicaly filter so it doesnt have weird number of age
  if (data.isAdmin !== undefined && typeof data.isAdmin !== "boolean") {
    return "isAdmin must be a boolean value";
  } // make sure the value is boolean for validation
  return null;
};

//this read the request and convert it to json 
const readBody = (
  req: http.IncomingMessage,
  callback: (data: any, hasJsonError: boolean) => void
) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    if (body === "") {
      callback(undefined, false);
      return;
    }
    let data: any;
    try {
      data = JSON.parse(body);
    } catch (error) {
      callback(undefined, true);
      return;
    }
    callback(data, false);
  });
};

export const createMyServer = (): http.Server => {
  // Initialize database when server is created
  initDatabase();
<<<<<<< HEAD
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
    const itemIndex = items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Item not found" }));
      return;
      }
      // ... read body, validate ...
    items[itemIndex] = { id, name: data.name.trim(), description: data.description.trim() };
    // DELETE /items/:id
    const deletedItem = items.splice(itemIndex, 1)[0];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Item deleted", item: deletedItem }));
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
=======
  // CORS headers so browser not block request of get post put delete
  const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    // Preflight request
    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    const parsedUrl = url.parse(req.url!, true);
    const pathName = parsedUrl.pathname;
    const method = req.method;
    //GET /users
    if (method === "GET" && pathName === "/users") {
      const rows = db.prepare("SELECT * FROM users ORDER BY id ASC").all();
      const users = rows.map(rowToUser);
      sendJson(res, 200, users);
      return;
    }
    // extract the number id if it has id after /user/(id)
    if (method === "GET" && pathName?.startsWith("/users/")) {
      const id = parseId(pathName.split("/")[2]);
      if (id === null) {
        sendJson(res, 400, { error: "Invalid user ID" });
        return;
      }
      // after getting the id it check database of those id if not found then error
      const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
      if (!row) {
        sendJson(res, 404, { error: "User not found" });
        return;
      }
      // if all done the sned data
      sendJson(res, 200, rowToUser(row));
      return;
    }

    // it going to post the data 
    if (method === "POST" && pathName === "/users") {
      readBody(req, (data, hasJsonError) => {
        if (hasJsonError) {
          sendJson(res, 400, { error: "Invalid JSON" });
          return;
        }
        // give the error
        const errorMessage = validateUser(data);
        if (errorMessage) {
          sendJson(res, 400, { error: "Validation failed", details: errorMessage });
          return;
        }
        // this verify the data so it follow the variable
        const name = data.name.trim();
        const age = data.age;
        const isAdmin = data.isAdmin === true ? 1 : 0;
        const now = new Date().toISOString();
        //this put the data to database
        const result = db
          .prepare("INSERT INTO users (name, age, isAdmin, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)")
          .run(name, age, isAdmin, now, now);
        //check the data by select
        const newRow = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
        sendJson(res, 201, rowToUser(newRow));
      });
      return;
    }

    // PUT /users/id or  update a user
    if (method === "PUT" && pathName?.startsWith("/users/")) { // this get the id
      const id = parseId(pathName.split("/")[2]);
      if (id === null) {
        sendJson(res, 400, { error: "Invalid user ID" });
        return;
      }

      readBody(req, (data, hasJsonError) => { // read the data if not throw error
        if (hasJsonError) {
          sendJson(res, 400, { error: "Invalid JSON" });
          return;
        }

        const errorMessage = validateUser(data);  // give error meesage
        if (errorMessage) {
          sendJson(res, 400, { error: "Validation failed", details: errorMessage });
          return;
        }
        // check if its exist
        const existingRow = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
        if (!existingRow) {
          sendJson(res, 404, { error: "User not found" });
          return;
        }
        // this verify the data so it follow the variable
        const name = data.name.trim();
        const age = data.age;
        const isAdmin = data.isAdmin === true ? 1 : 0;
        const now = new Date().toISOString();
        // update the table row 
        db.prepare("UPDATE users SET name = ?, age = ?, isAdmin = ?, updatedAt = ? WHERE id = ?")
          .run(name, age, isAdmin, now, id);
        // seelct the id to show update and send it
        const updatedRow = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
        sendJson(res, 200, rowToUser(updatedRow));
      });
      return;
    }
    // delete, check the id again
    if (method === "DELETE" && pathName?.startsWith("/users/")) {
      const id = parseId(pathName.split("/")[2]);
      if (id === null) {
        sendJson(res, 400, { error: "Invalid user ID" });
        return;
      }
      // check if row exist if not throw error
      const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
      if (!row) {
        sendJson(res, 404, { error: "User not found" });
        return;
      }
      // delete the user based on id
      db.prepare("DELETE FROM users WHERE id = ?").run(id);
      sendJson(res, 200, { message: "User deleted", user: rowToUser(row) });
      return;
    }

    sendJson(res, 404, { error: "Not found" });
>>>>>>> 0c1cbd1 (final)
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
