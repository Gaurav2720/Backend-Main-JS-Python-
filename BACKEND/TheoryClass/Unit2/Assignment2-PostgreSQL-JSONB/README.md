# Theory Assignment 2 — PostgreSQL JSONB Deep Dive

**Course:** Backend Web Development  
**Semester:** 5th Semester  
**Student:** Gaurav Bhaskar (`590012457`)  
**Topic:** PostgreSQL JSONB Storage, Query Operators, GIN Indexing, and SQL vs NoSQL Comparison  
**Directory:** `TheoryClass/Theory-Assignments/PostgreSQL-JSONB/`

---

## 1. Objective
To thoroughly research, analyze, and practically demonstrate the capabilities of **PostgreSQL JSONB** (Binary JSON) data type, exploring how relational database management systems combine strict relational integrity with semi-structured document flexibility.

---

## 2. Theory & Core Concepts

### A. The Evolution: JSON vs JSONB in PostgreSQL

PostgreSQL offers two data types for storing JSON documents: `json` and `jsonb`.

```plaintext
Input Text ----> (json)  ----> Stored as exact text string (Whitespace & duplicate keys preserved)
           ----> (jsonb) ----> Parsed & Decomposed into Binary Hierarchy (Whitespace pruned, keys sorted)
```

| Criteria | `JSON` Data Type | `JSONB` Data Type |
| :--- | :--- | :--- |
| **Storage Structure** | Exact text string representation | Decomposed binary format with header metadata |
| **Ingestion (Insert) Speed** | **Faster**: No parsing or tree generation | Slightly slower due to binary encoding overhead |
| **Query & Retrieval Speed** | **Slower**: Must re-parse text on every query | **Orders of magnitude faster**: Direct key traversal |
| **Duplicate Keys** | Preserves duplicate keys as written | Discards duplicate keys (keeps the last entry) |
| **Whitespace & Ordering** | Retains whitespace and key order | Strips whitespace; normalizes key order |
| **Indexing Support** | Only functional/expression B-tree indexes | **Native GIN (Generalized Inverted Index)** support |

---

### B. PostgreSQL JSONB Operators Reference

| Operator | Return Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `->` | `jsonb` | Get JSON object/array element by key or index | `attributes -> 'specs'` |
| `->>` | `text` | Get JSON scalar field as plain text string | `attributes ->> 'brand'` |
| `#>` | `jsonb` | Extract nested object at specified path array | `attributes #> '{specs, cpu}'` |
| `#>>` | `text` | Extract nested scalar as text at path array | `attributes #>> '{specs, cpu}'` |
| `@>` | `boolean` | **Containment:** Left JSONB contains right JSONB | `attributes @> '{"brand": "Apple"}'` |
| `<@` | `boolean` | **Contained in:** Left JSONB is contained in right | `'{"brand": "Apple"}' <@ attributes` |
| `?` | `boolean` | Does the string exist as a top-level key? | `attributes ? 'warranty_years'` |
| `?\|` | `boolean` | Do any of the array strings exist as keys? | `attributes ?\| array['brand', 'model']` |
| `?&` | `boolean` | Do all of the array strings exist as keys? | `attributes ?& array['brand', 'specs']` |

---

### C. GIN (Generalized Inverted Index) Indexing
Standard B-tree indexes are limited when indexing semi-structured JSON documents because they can only index a specific, single extracted value.

The **GIN index** constructs an inverted index where every key and value in the JSONB document becomes an index entry pointing to matching table rows:

```sql
-- Create GIN index on entire attributes document
CREATE INDEX idx_products_attributes_gin ON products USING gin (attributes);

-- This index accelerates containment queries:
SELECT * FROM products WHERE attributes @> '{"tags": ["laptop"]}';
```

---

### D. SQL vs NoSQL / PostgreSQL vs MongoDB Architectural Comparison

| Dimension | PostgreSQL (with JSONB) | MongoDB |
| :--- | :--- | :--- |
| **Primary Data Model** | Relational tables with optional document columns | Native JSON/BSON document collections |
| **Schema Enforcement** | Strict schema for relations, flexible schema for JSONB | Schema-less (optional JSON Schema validation) |
| **Transactions & ACID** | Full, mature multi-table ACID transactions by default | Multi-document ACID supported (higher resource cost) |
| **Joins & Relationships** | Native, highly optimized relational `JOIN` operations | `$lookup` aggregation (slower on complex relations) |
| **Horizontal Scalability** | Traditional vertical scaling (or Citus extension) | Native automatic sharding across clusters |
| **Query Language** | Standard SQL with JSON extensions | MongoDB Query Language (MQL) & Aggregation Pipeline |
| **Ideal Use Case** | Hybrid domains: Core relational data (Orders, Users) + dynamic product attributes | Massive unstructured event logging, content management |

---

## 3. Practical Project Structure

```plaintext
TheoryClass/Theory-Assignments/PostgreSQL-JSONB/
├── .env.example       # Database credentials example
├── package.json       # Express, pg, ejs dependencies
├── schema.sql         # Table definition with GIN index & sample queries
├── server.js          # Express app with live & simulated PG fallback queries
├── views/index.ejs    # Interactive query dashboard and comparison matrix
└── public/style.css   # Dark modern UI styling
```

---

## 4. How to Run the Demonstration

```bash
# 1. Navigate to the directory
cd "c:\Users\GAURAV\OneDrive\Desktop\Sem5Backend\Backend\BACKEND\TheoryClass\Theory-Assignments\PostgreSQL-JSONB"

# 2. Install dependencies
npm install

# 3. (Optional) Run schema on your PostgreSQL instance
# psql -U postgres -d coursework_db -f schema.sql

# 4. Start the server
npm start
```

Visit **`http://localhost:4000`** in your browser. The application includes both live PostgreSQL connection handling and an in-memory simulation mode so examiners can review the system without requiring an active PostgreSQL daemon running during viva.

---

## 5. Learning Outcomes
- Gained deep technical mastery of binary JSON parsing and storage engines.
- Executed containment (`@>`) and path extraction (`#>>`) queries.
- Understood index performance optimizations using GIN.
- Formulated an architectural framework for selecting between PostgreSQL and MongoDB.
