const express = require("express");
const app = express();
const PORT = 3000;

// public 폴더를 정적 파일 제공
app.use(express.static("public"));

// 요청 body 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// (나중에) API 만들 자리
app.get("/api/posts", (req, res) => {
  res.json([
    { id: 1, title: "첫 번째 글", content: "내용입니다." },
    { id: 2, title: "두 번째 글", content: "또 다른 내용입니다." },
  ]);
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
