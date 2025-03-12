/* -----------------------------
* 1. 인피니트 스크롤 기능
* ----------------------------- */
const postListContent = document.querySelector(".postList-content");

let currentCount = 0;  // 현재까지 불러온 게시글 수
const limit = 10;      // 한 번에 불러올 게시글 개수
let isLoading = false; // 중복 요청 방지 플래그

// 초기 게시글 10개 로드
postListContent.innerHTML = ""; // 기존 내용이 있다면 초기화
loadMorePosts();

// 스크롤 이벤트 
window.addEventListener("scroll", handleScroll);

function handleScroll() {
    if ( // 화면의 하단 근처에 도달 && 아직 로딩 중이 아닐 때
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10
      && !isLoading
    ) {
        isLoading = true;
        loadMorePosts();
    }
}


/* -----------------------------
* 2. 게시글 로드 (게시글 데이터 받아와서 화면 채우기)
* ----------------------------- */

// 게시글 로딩 함수 
function loadMorePosts() {
    // 나중에 실제 서버에서 데이터 받아옴.
    // 지금은 더미 데이터로 삽입 
    // 더미 데이터 10개 
    const newPosts = Array.from({ length: limit }, (_, index) => ({
        id: index + 1,
        title: `동해물과백두산이마르고닳도록하나님이보우하사우리나라만세`,
        likes: 200000,
        comments: 1050,
        views: 999,
        time: "2021-01-01 00:00:00",
        author: `더미 작성자 ${index + 1}`,
        profileImg: "/public/assets/profile.png"
    }));

    // 게시글 아이템 삽입 
    newPosts.forEach(post => {
        const postItem = document.createElement("div");
        postItem.className = "postList-item";
        postItem.innerHTML = `
        <div class="post-title">${truncateTitle(post.title, 26)}</div>
        <div class="post-info">
            <div class="numbers">
                <div>좋아요 ${formatCount(post.likes)}</div>
                <div>댓글 ${formatCount(post.comments)}</div>
                <div>조회수 ${formatCount(post.views)}</div>
            </div>
            <div class="time">${post.time}</div>
        </div>
        <div class="post-innerline"></div>
        <div class="post-author">
            <img src="${post.profileImg}" class="author-img" alt="profile"/>
            <div class="author-name">${post.author}</div>
        </div>
        `;
        postListContent.appendChild(postItem);
    });

    currentCount += limit;
    isLoading = false; // 로딩 완료
}


/* -----------------------------
* 3. 게시글 내용 표기 기능 
* ----------------------------- */
// 제목 26자까지만 자르는 함수 
function truncateTitle (title, maxLen) {
    if (title.length > maxLen) {
        return title.substring(0, maxLen) + "...";
    }
    return title;
}

// 좋아요수, 댓글수, 조회수를 변환하는 함수 
function formatCount (number) {
    if (number < 1000) {
        return number.toString();
    } else {
        return Math.floor(number/1000) + "k";
    }
}


/* -----------------------------
* 4. 게시글 작성 버튼 기능
* ----------------------------- */
// 클릭하면 게시글 작성 페이지로 이동
const elWriteButton = document.getElementById("post-write-btn");
elWriteButton.addEventListener("click", ()=>{
    window.location.href = "../post/post-write.html";
})


/* -----------------------------
* 5. 카드 클릭 시 게시글 상세조회 이동 
* ----------------------------- */
// 클릭하면 상세 페이지로 이동
