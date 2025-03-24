import { BASE_URL } from "/src/utils/api.js";

/* -----------------------------
* 1. 인피니트 스크롤 기능
* ----------------------------- */
const postListContent = document.querySelector(".postList-content");

let isLoading = false; // 중복 요청 방지 플래그

let currentPage = 0;
let isLastPage = false;

// 초기 게시글 10개 로드
postListContent.innerHTML = ""; // 기존 내용이 있다면 초기화
loadMorePosts();

// 스크롤 이벤트 
window.addEventListener("scroll", handleScroll);

function handleScroll() {
    if ( // 화면의 하단 근처에 도달 && 아직 로딩 중이 아닐 때
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10 && 
        !isLoading &&
        !isLastPage

    ) {
        isLoading = true;
        loadMorePosts();
    }
}


/* -----------------------------
* 2. 게시글 로드 (게시글 데이터 받아와서 화면 채우기)
* ----------------------------- */

// 게시글 로딩 함수 
async function loadMorePosts() {
    try {
        const response = await fetch(`${BASE_URL}/posts?page=${currentPage}`);
        const json = await response.json();
    
        if (!response.ok) {
          alert(json.message || "게시글을 불러오지 못했습니다.");
          return;
        }
    
        const posts = json.data.posts;
        const pageInfo = json.data;
    
        posts.forEach(post => {
          const postItem = document.createElement("div");
          postItem.className = "postList-item";
          postItem.innerHTML = `
            <div class="post-title">${truncateTitle(post.title, 26)}</div>
            <div class="post-info">
                <div class="numbers">
                    <div>좋아요 ${formatCount(post.likeCnt)}</div>
                    <div>댓글 ${formatCount(post.commentCnt)}</div>
                    <div>조회수 ${formatCount(post.viewCnt)}</div>
                </div>
                <div class="time">${formatTime(post.createdAt)}</div>
            </div>
            <div class="post-innerline"></div>
            <div class="post-author">
                <img src="${post.writerImg}" class="author-img" alt="profile"/>
                <div class="author-name">${post.writerName}</div>
            </div>
          `;
    
          // 상세 페이지로 이동
          postItem.addEventListener("click", () => {
            window.location.href = `/src/pages/post/post-detail.html?postId=${post.postId}`;
          });
    
          postListContent.appendChild(postItem);
        });
    
        currentPage += 1;
        isLastPage = pageInfo.last;
        isLoading = false;
    
      } catch (error) {
        console.error("게시글 로딩 실패:", error);
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
      }
}


/* -----------------------------
* 3. 유틸 함수
* ----------------------------- */
// 제목 26자까지만 자르는 함수 
function truncateTitle (title, maxLen) {
    return title.length > maxLen ? title.substring(0, maxLen) + "..." : title;
}

// 좋아요수, 댓글수, 조회수를 변환하는 함수 
function formatCount (number) {
    return number < 1000 ? number.toString() : Math.floor(number / 1000) + "k"
}

// 시간 포맷 변환 함수
function formatTime(isoTime) {
    const date = new Date(isoTime);

    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
}


/* -----------------------------
* 4. 게시글 작성 버튼 기능
* ----------------------------- */
// 클릭하면 게시글 작성 페이지로 이동
const elWriteButton = document.getElementById("post-write-btn");
elWriteButton.addEventListener("click", () => {
    window.location.href = "../post/post-write.html";
})
