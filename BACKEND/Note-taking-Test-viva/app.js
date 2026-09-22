const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 3000;

// MongoDB Atlas connection string
const mongoURL = "mongodb+srv://iamgaurav2702_db_user:1Xj2yt4TqOgSze75@cluster0.jvvdmps.mongodb.net/?appName=Cluster0";

const client = new MongoClient(mongoURL);
let notesCollection;

async function connectDB() {
  try {
    await client.connect();
    const database = client.db("notes_lab");
    notesCollection = database.collection("notes");
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Failed to connect to MongoDB Atlas:", err);
    process.exit(1);
  }
}

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ============ ROUTES ============

// GET / — Display all notes
app.get("/", async (req, res) => {
  try {
    const notes = await notesCollection.find().sort({ createdAt: -1 }).toArray();
    res.render("index", { notes });
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).send("Error fetching notes");
  }
});

// GET /notes — Also display all notes
app.get("/notes", async (req, res) => {
  try {
    const notes = await notesCollection.find().sort({ createdAt: -1 }).toArray();
    res.render("index", { notes });
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).send("Error fetching notes");
  }
});

// GET /notes/new — Show add-note form
app.get("/notes/new", (req, res) => {
  res.render("new");
});

// POST /notes — Add a new note
app.post("/notes", async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Validation: title and content must not be empty
    if (!title || !title.trim() || !content || !content.trim()) {
      return res.render("new", {
        error: "Title and Content are required!",
        title: title || "",
        content: content || "",
        category: category || "",
      });
    }

    await notesCollection.insertOne({
      title: title.trim(),
      content: content.trim(),
      category: category ? category.trim() : "General",
      createdAt: new Date(),
    });

    res.redirect("/");
  } catch (err) {
    console.error("Error adding note:", err);
    res.status(500).send("Error adding note");
  }
});

// POST /notes/:id/delete — Delete a note
app.post("/notes/:id/delete", async (req, res) => {
  try {
    await notesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).send("Error deleting note");
  }
});

// Start server after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});