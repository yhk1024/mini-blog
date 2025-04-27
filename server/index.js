const express = require("express");
const app = express();
const PORT = 3000;
// 임시 데이터 (DB 연결 전이라 하드코딩)
const posts = [
  { id: 1, title: "JS 기초", content: "JS 글입니다.", category: "JavaScript" },
  {
    id: 2,
    title: "Node.js 서버",
    content: "Node.js 글입니다.",
    category: "Node.js",
  },
  { id: 3, title: "HTML 구조", content: "HTML 글입니다.", category: "HTML" },
];

// public 폴더를 정적 파일 제공
app.use(express.static("public"));

// 요청 body 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// (나중에) API 만들 자리
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
