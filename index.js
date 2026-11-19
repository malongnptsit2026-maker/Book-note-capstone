
const express = require("express");
const { Pool } = require("pg");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL database connection
const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "ejs");

// Home page: display books and sorting
app.get("/", async (req, res) => {
  try {
    const sort = req.query.sort || "newest";

    const sortOptions = {
      newest: "read_date DESC NULLS LAST",
      oldest: "read_date ASC NULLS LAST",
      rating: "rating DESC",
      title: "title ASC",
    };

    const orderBy = sortOptions[sort] || sortOptions.newest;

    const result = await db.query(
      `SELECT * FROM books ORDER BY ${orderBy}`
    );

    res.render("index", {
      books: result.rows,
      searchResults: [],
      sort,
      error: null,
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send("Unable to load books. Check your database.");
  }
});

// Search books using Open Library API
app.get("/search", async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm || !searchTerm.trim()) {
      return res.redirect("/");
    }

    const response = await axios.get(
      "https://openlibrary.org/search.json",
      {
        params: {
          q: searchTerm,
          limit: 8,
        },
        timeout: 10000,
      }
    );

    const searchResults = response.data.docs.map((book) => ({
      title: book.title,
      author: book.author_name?.[0] || "Unknown Author",
      year: book.first_publish_year || "",
      cover: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : null,
      isbn: book.isbn?.[0] || null,
    }));

    const result = await db.query(
      "SELECT * FROM books ORDER BY read_date DESC NULLS LAST"
    );

    res.render("index", {
      books: result.rows,
      searchResults,
      sort: "newest",
      error: null,
    });
  } catch (error) {
    console.error("Open Library API error:", error.message);
    res.status(500).send("Book search failed. Please try again.");
  }
});

// Add a new book
app.post("/books", async (req, res) => {
  try {
    const {
      title,
      author,
      rating,
      notes,
      read_date,
      cover,
    } = req.body;

    if (!title || !author) {
      return res.status(400).send("Book title and author are required.");
    }

    await db.query(
      `INSERT INTO books
      (title, author, rating, notes, read_date, cover)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        title,
        author,
        rating || 0,
        notes || "",
        read_date || null,
        cover || null,
      ]
    );

    res.redirect("/");
  } catch (error) {
    console.error("Add book error:", error);
    res.status(500).send("Unable to add book.");
  }
});

// Update a book
app.post("/books/:id/update", async (req, res) => {
  try {
    const {
      title,
      author,
      rating,
      notes,
      read_date,
      cover,
    } = req.body;

    await db.query(
      `UPDATE books
       SET title = $1,
           author = $2,
           rating = $3,
           notes = $4,
           read_date = $5,
           cover = $6
       WHERE id = $7`,
      [
        title,
        author,
        rating,
        notes,
        read_date || null,
        cover || null,
        req.params.id,
      ]
    );

    res.redirect("/");
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send("Unable to update book.");
  }
});

// Delete a book
app.post("/books/:id/delete", async (req, res) => {
  try {
    await db.query(
      "DELETE FROM books WHERE id = $1",
      [req.params.id]
    );

    res.redirect("/");
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).send("Unable to delete book.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Book Notes app running at http://localhost:${PORT}`);
});
