// 서버에서 글 목록을 가져와 저장할 전역 변수
let allPosts = [];

// 페이지가 로드된 후 실행할 내용
document.addEventListener("DOMContentLoaded", () => {
  // 서버에서 글 목록 불러오기
  fetch("/api/posts")
    .then((response) => response.json())
    .then((data) => {
      allPosts = data;
      console.log("글 목록 로드 완료:", allPosts);
      setupCategoryClick();
    })
    .catch((error) => {
      console.error("글 목록 불러오기 실패:", error);
    });
});

// 카테고리 클릭 이벤트 설정
function setupCategoryClick() {
  const categories = document.querySelectorAll("#category-list li");
  categories.forEach((category) => {
    category.addEventListener("click", () => {
      const selectedCategory = category.getAttribute("data-category");
      console.log("선택한 카테고리:", selectedCategory);
      showPostsByCategory(selectedCategory);
    });
  });
}

// 카테고리에 맞는 글 목록 보여주기
function showPostsByCategory(category) {
  const main = document.getElementById("main-content");
  main.innerHTML = `<h2>${category} 글 목록</h2>`;

  const filteredPosts = allPosts.filter((post) => post.category === category);

  if (filteredPosts.length === 0) {
    main.innerHTML += `<p>해당 카테고리에 글이 없습니다.</p>`;
    return;
  }

  const ul = document.createElement("ul");

  filteredPosts.forEach((post) => {
    const li = document.createElement("li");

    const title = document.createElement("h3");
    title.textContent = post.title;
    title.style.cursor = "pointer";
    title.addEventListener("click", () => {
      showPostDetail(post);
    });

    const preview = document.createElement("p");
    preview.textContent =
      post.content.length > 100
        ? post.content.substring(0, 100) + "..."
        : post.content;

    li.appendChild(title);
    li.appendChild(preview);
    ul.appendChild(li);
  });

  main.appendChild(ul);
}

// 글 상세 보기
function showPostDetail(post) {
  const main = document.getElementById("main-content");
  main.innerHTML = `
    <h2>${post.title}</h2>
    <p>${post.content}</p>
    <button id="back-button">목록으로 돌아가기</button>
  `;

  document.getElementById("back-button").addEventListener("click", () => {
    showPostsByCategory(post.category);
  });
}
