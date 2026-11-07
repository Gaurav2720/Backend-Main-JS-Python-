// =============================================================================
// server.js — PostgreSQL JSONB Demonstration Web Application
// =============================================================================
// Course: Backend Web Development — Theory Assignment 2
// Topic: PostgreSQL JSONB Querying, GIN Indexing, and Schema Design
// =============================================================================

require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

// PostgreSQL Connection Pool Setup
const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: parseInt(process.env.PGPORT || "5432"),
  database: process.env.PGDATABASE || "coursework_db",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// In-memory fallback if local PostgreSQL is not running
const fallbackProducts = [
  {
    id: 1,
    name: "Dell XPS 15",
    category: "Electronics",
    price: "1499.99",
    attributes: {
      brand: "Dell",
      specs: { cpu: "Intel Core i7", ram_gb: 32, storage_gb: 1024, screen: "15.6 OLED" },
      tags: ["laptop", "ultrabook", "workstation"],
      warranty_years: 2,
      in_stock: true,
    },
  },
  {
    id: 2,
    name: "MacBook Pro 14",
    category: "Electronics",
    price: "1999.00",
    attributes: {
      brand: "Apple",
      specs: { cpu: "M3 Pro", ram_gb: 18, storage_gb: 512, screen: "14.2 Liquid Retina XDR" },
      tags: ["laptop", "apple", "pro"],
      warranty_years: 1,
      in_stock: true,
    },
  },
  {
    id: 3,
    name: "Ergonomic Mesh Chair",
    category: "Furniture",
    price: "349.50",
    attributes: {
      brand: "HermanMiller",
      specs: { material: "Mesh", weight_capacity_kg: 150, lumbar_support: true },
      tags: ["office", "ergonomic", "furniture"],
      warranty_years: 12,
      in_stock: false,
    },
  },
  {
    id: 4,
    name: "Sony WH-1000XM5",
    category: "Audio",
    price: "398.00",
    attributes: {
      brand: "Sony",
      specs: { battery_hours: 30, noise_cancelling: true, bluetooth_version: "5.2" },
      tags: ["audio", "anc", "headphones"],
      warranty_years: 1,
      in_stock: true,
    },
  },
];

// Helper: Query execution with fallback
async function executeQuery(sql, params = []) {
  try {
    const res = await pool.query(sql, params);
    return { data: res.rows, mode: "PostgreSQL Database" };
  } catch (err) {
    // If PostgreSQL service is not actively running locally, serve fallback with diagnostic info
    return { data: fallbackProducts, mode: `Simulated Fallback Mode (${err.code || err.message})` };
  }
}

// =============================================================================
// ROUTES
// =============================================================================

/**
 * GET /
 * Display all products and query interface
 */
app.get("/", async (req, res) => {
  const brandFilter = req.query.brand;
  const tagFilter = req.query.tag;

  let querySql = "SELECT id, name, category, price, attributes FROM products";
  const params = [];

  if (brandFilter) {
    // Using ->> operator to extract JSON text
    querySql += " WHERE attributes ->> 'brand' ILIKE $1";
    params.push(`%${brandFilter}%`);
  } else if (tagFilter) {
    // Using @> containment operator (supported by GIN index)
    querySql += ` WHERE attributes @> $1::jsonb`;
    params.push(JSON.stringify({ tags: [tagFilter] }));
  }

  querySql += " ORDER BY id ASC";

  const { data, mode } = await executeQuery(querySql, params);

  res.render("index", {
    products: data,
    activeQuery: querySql,
    connectionMode: mode,
    brandFilter: brandFilter || "",
    tagFilter: tagFilter || "",
  });
});

/**
 * POST /api/products
 * Insert a new product with flexible JSONB attributes
 */
app.post("/api/products", async (req, res) => {
  const { name, category, price, attributes } = req.body;

  let parsedAttributes = {};
  try {
    parsedAttributes = typeof attributes === "string" ? JSON.parse(attributes) : attributes;
  } catch (err) {
    return res.status(400).send("Invalid JSON attributes format.");
  }

  const insertSql = `
    INSERT INTO products (name, category, price, attributes)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  try {
    await pool.query(insertSql, [name, category, price, JSON.stringify(parsedAttributes)]);
    res.redirect("/");
  } catch (err) {
    console.error("Insert error:", err);
    res.redirect("/");
  }
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🐘 PostgreSQL JSONB Explorer running at http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
