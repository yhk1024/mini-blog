const express = require("express");
const db = require("./db");
const router = express.Router();

router.get("/posts", (req, res) => {
  db.all("SELECT * FROM posts ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post("/posts", (req, res) => {
  const { title, category, content } = req.body;
  if (!title || !category || !content) {
    return res.status(400).json({ error: "모든 필드를 입력해야 합니다." });
  }

  db.run(
    "INSERT INTO posts (title, category, content) VALUES (?, ?, ?)",
    [title, category, content],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

module.exports = router;
