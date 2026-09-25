const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

// connecting to mongodb atlas
const mongoURL = "mongodb+srv://iamgaurav2702_db_user:1Xj2yt4TqOgSze75@cluster0.jvvdmps.mongodb.net/?appName=Cluster0";
const client = new MongoClient(mongoURL);
let notesCollection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("notes_lab");
    notesCollection = db.collection("notes");
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("MongoDB Connection Failed! Please check your IP Whitelist on Atlas (0.0.0.0/0) or Internet connection.");
    console.error(err.message);
    process.exit(1);
  }
}

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// home page - show all notes
app.get("/", async (req, res) => {
  const notes = await notesCollection.find().sort({ createdAt: -1 }).toArray();
  res.render("index", { notes });
});

// show the add note form
app.get("/notes/new", (req, res) => {
  res.render("new");
});

// handle adding a note
app.post("/notes", async (req, res) => {
  const { title, content, category } = req.body;

  // validation
  if (!title || !title.trim()) {
    return res.render("new", { error: "Title is required!", title, content, category });
  }
  if (/\d/.test(title)) {
    return res.render("new", { error: "Title cannot contain numbers.", title, content, category });
  }
  if (title.trim().length < 3) {
    return res.render("new", { error: "Title must be at least 3 characters.", title, content, category });
  }
  if (title.trim().length > 100) {
    return res.render("new", { error: "Title cannot exceed 100 characters.", title, content, category });
clearImmediate  }
  if (!content || !content.trim()) {
    return res.render("new", { error: "Content is required!", title, content, category });
  }
  if (content.trim().length < 5) {
    return res.render("new", { error: "Content must be at least 5 characters.", title, content, category });
  }
  if (category && !/^[a-zA-Z\s]+$/.test(category.trim())) {
    return res.render("new", { error: "Category should only contain letters.", title, content, category });
  }

  await notesCollection.insertOne({
    title: title.trim(),
    content: content.trim(),
    category: category ? category.trim() : "General",
    createdAt: new Date(),
  });

  res.redirect("/");
});

// delete a note
app.post("/notes/:id/delete", async (req, res) => {
  await notesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
  res.redirect("/");
});

// start server after connecting to db
connectDB().then(() => {
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});