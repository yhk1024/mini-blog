const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db"); // db.js에서 export된 SQLite 연결

const app = express();
const PORT = 3000;

// 정적 파일 서비스 (index.html, write.html 등)
app.use(express.static(path.join(__dirname, "../public")));

// JSON 본문 파싱 허용
app.use(express.json());

// CORS 허용
app.use(cors());

// 서버 시작 시 테이블 자동 생성
db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
    (err) => {
      if (err) {
        console.error("[DB 테이블 생성 오류]", err.message);
      } else {
        console.log("[DB 테이블 확인 완료]");
      }
    }
  );
});

// ✅ API: 글 목록 조회
app.get("/api/posts", (req, res) => {
  db.all("SELECT * FROM posts ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      console.error("[글 목록 조회 오류]", err.message);
      return res.status(500).json({ error: "DB 조회 실패" });
    }
    res.json(rows);
  });
});

// ✅ API: 글 작성
app.post("/api/posts", (req, res) => {
  const { title, date, content, category } = req.body;

  if (!title || !date || !content) {
    return res.status(400).json({ error: "모든 필드를 입력하세요." });
  }

  const sql = `INSERT INTO posts (title, date, content, category) VALUES (?, ?, ?, ?)`;

  db.run(sql, [title, date, content, category], function (err) {
    if (err) {
      console.error("DB 저장 오류:", err.message);
      return res.status(500).json({ error: "DB 저장 실패" });
    }
    res.status(201).json({ message: "저장 성공", postId: this.lastID });
  });
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`[서버 실행 중] http://localhost:${PORT}`);
});
