const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

// NAS 상 SQLite DB 경로 (적절히 바꿔야 할 수 있음)
const dbPath = "/volume1/sqlite/blog.db";
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("DB 연결 실패:", err.message);
  } else {
    console.log("DB 연결 성공:", dbPath);
  }
});

// 테이블이 없으면 자동 생성
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// API: 글 목록 가져오기
app.get("/api/posts", (req, res) => {
  db.all("SELECT * FROM posts ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      console.error("글 목록 조회 오류:", err.message);
      return res.status(500).json({ error: "DB 조회 오류" });
    }
    res.json(rows);
  });
});

// API: 글 작성
app.post("/api/posts", (req, res) => {
  const { title, category, content } = req.body;

  if (!title || !category || !content) {
    return res
      .status(400)
      .json({ error: "제목, 카테고리, 내용은 필수입니다." });
  }

  db.run(
    "INSERT INTO posts (title, category, content) VALUES (?, ?, ?)",
    [title, category, content],
    function (err) {
      if (err) {
        console.error("글 작성 오류:", err.message);
        return res.status(500).json({ error: "DB 저장 실패" });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
