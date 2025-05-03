const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

// 로컬 개발용과 NAS용 DB 경로 구분
const localPath = path.join(__dirname, "../local/blog-dev.db");
const nasPath = "Z:/blog.db"; // NAS에 마운트된 드라이브 경로

// 현재 환경 확인 (기본은 개발용)
const isDev = process.env.NODE_ENV !== "production";
const dbPath = isDev ? localPath : nasPath;

// local 폴더가 없으면 자동 생성
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

console.log("[DEBUG] 연결 시도 중인 경로:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("[SQLite 연결 실패]", err.message);
  } else {
    console.log("[SQLite 연결 성공]", dbPath);
  }
});

module.exports = db;
