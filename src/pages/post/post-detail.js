import { formatCount, formatTime } from "/src/utils/format.js";
import { BASE_URL } from "/src/utils/api.js";

// URL에서 postId 추출
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId");

// DOM 요소들
const titleElement = document.querySelector(".post-title h1");
const profileImage = document.querySelector(".profile-image");
const authorName = document.querySelector(".author-name");
const createdAt = document.querySelector("time");
const contentElement = document.querySelector(".post-content p");
const likesCountElement = document.querySelectorAll(".reaction-item strong")[0];
const viewsCountElement = document.querySelectorAll(".reaction-item strong")[1];
const commentsCountElement = document.querySelectorAll(".reaction-item strong")[2];
const likesItem = document.querySelectorAll(".reaction-item")[0];
const postEditButton = document.querySelector("#post-edit-button");
const postDeleteButton = document.querySelector("#post-delete-button");

let isLiked = false;
let likesCount = 0;

/* -----------------------------
  * 1. 페이지 로드 
  * ----------------------------- */
/* -----------------------------
  * 1-1. 게시글 상세 조회 
  * ----------------------------- */
async function fetchPostDetail() {
  try {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${BASE_URL}/posts/${postId}`, { headers });
    const json = await response.json();

    if (!response.ok) {
      alert(json.message || "게시글을 불러오지 못했습니다.");
      return;
    }

    const post = json.data;
    const writer = post.writer;

    // DOM 업데이트
    titleElement.textContent = post.title;
    profileImage.src = writer.writerImg || "/public/assets/profile.png";
    authorName.textContent = writer.writerName;
    createdAt.textContent = formatTime(post.createdAt);
    createdAt.setAttribute("datetime", post.createdAt);
    contentElement.textContent = post.content;
    likesCountElement.textContent = formatCount(post.likeCnt);
    viewsCountElement.textContent = formatCount(post.viewCnt);
    commentsCountElement.textContent = formatCount(post.commentCnt);

    isLiked = post.liked;
    likesCount = post.likeCnt;
    updateLikeStyle(); // 좋아요 반영

    // 작성자 여부에 따라 수정/삭제 버튼 제어
    if (!post.author) {
      postEditButton.style.display = "none";
      postDeleteButton.style.display = "none";
    }

  } catch (err) {
    console.error("게시글 불러오기 실패:", err);
    alert("오류가 발생했습니다.");
  }
}


/* -----------------------------
  * 1-2. 댓글 목록 조회 
  * ----------------------------- */
async function fetchComments() {
  try {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, { headers });
    const json = await response.json();

    if (!response.ok) {
      alert(json.message || "댓글을 불러오지 못했습니다.");
      return;
    }

    const commentData = json.data;
    const commentListData = commentData.commentList || [];

    console.log(commentData);

    // 댓글 수 표시 업데이트
    commentsCountElement.textContent = formatCount(commentData.commentCnt);

    // 댓글 목록 초기화
    commentList.innerHTML = "";

    commentListData.forEach(comment => {
      const li = document.createElement("li");
      li.className = "comment-item";
      
      const author = comment.author;

      li.innerHTML = `
        <div class="comment-item-head">
          <div class="author-info">
              <div class="profile-image-container">
                  <img class="profile-image" alt="댓글 작성자 프로필 사진" src="${comment.writerImg || "/public/assets/profile.png"}"/>
              </div>
              <span>${comment.writerName}</span>
              <time datetime="${comment.createdAt}">${formatTime(comment.createdAt)}</time>
          </div>
          ${author ? `
            <div class="author-actions">
              <button type="button" class="comment-edit-btn">수정</button>
              <button type="button" class="comment-delete-btn">삭제</button>
            </div>` : ""}
        </div>
        <p class="comment-content">${comment.content}</p>
      `;

      commentList.appendChild(li);
    });

  } catch (err) {
    console.error("댓글 목록 조회 실패:", err);
    alert("댓글을 불러오는 중 오류가 발생했습니다.");
  }
}


function updateLikeStyle() {
  likesItem.style.cursor = "pointer";
  likesItem.style.backgroundColor = isLiked ? "#ACA0EB" : "#D9D9D9";
}


// 불러오기
fetchPostDetail().then(() => {
  fetchComments(); 
});


/* -----------------------------
  * 2. 댓글 작성/수정/삭제 기능
  * ----------------------------- */
/* -----------------------------
  * 2-1. 댓글 작성 & 2-2. 댓글 수정
  * ----------------------------- */
const commentTextarea = document.querySelector(".comment-input-wrapper textarea");
const commentButton = document.querySelector(".comment-input-wrapper button");
const commentList = document.querySelector(".comment-list");
let currentEditingComment = null; // 수정할 댓글 내용

// 댓글 등록 버튼 비활성화 (초기상태)
commentButton.disabled = true; 

// 활성화, 비활성화 변경
commentTextarea.addEventListener("blur", () => {
    const commentText = commentTextarea.value.trim();
    if (commentText.length > 0) { // 버튼 활성화
        commentButton.disabled = false;
        commentButton.style.backgroundColor = "#7F6AEE";
      } else { // 버튼 비활성화
        commentButton.disabled = true;
        commentButton.style.backgroundColor = "#ACA0EB";
      }
})

// 댓글 등록/수정 버튼 클릭 이벤트 핸들링 
commentButton.addEventListener("click", async () => {
    const commentText = commentTextarea.value.trim();
    if (commentText.length === 0) return;

    // 1. 댓글 등록 
    if (!currentEditingComment) {
      console.log("등록할 댓글:", commentText);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }
    
      try {
        const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ content: commentText })
        });
    
        const json = await response.json();
    
        if (!response.ok) {
          alert(json.message || "댓글 등록에 실패했습니다.");
          return;
        }
    
        // 성공
        alert("댓글이 등록되었습니다.");
        commentTextarea.value = "";
        commentButton.disabled = true;
        commentButton.style.backgroundColor = "#ACA0EB";
        fetchComments(); // 댓글 목록 새로고침
      } catch (err) {
        console.error("댓글 등록 중 오류:", err);
        alert("댓글 등록 중 오류가 발생했습니다.");
      }
    }
    // 2. 댓글 수정
    else {
        // 댓글 수정 요청
        // 요청 성공 시 
        currentEditingComment.textContent = commentText;
        commentButton.textContent = "댓글 등록";
        currentEditingComment = null;

    }

    // 입력란 초기화 및 버튼 상태 리셋
    commentTextarea.value = "";
    commentButton.disabled = true;
    commentButton.style.backgroundColor = "#ACA0EB";
})

// 댓글 아이템 수정 버튼 이벤트 등록 
const editButtons = document.querySelectorAll(".comment-edit-btn");
editButtons.forEach(btn => {
btn.addEventListener("click", handleEditClick);
});

// 댓글 아이템 수정 버튼 클릭 이벤트 핸들링
function handleEditClick(event) {
    const li = event.target.closest(".comment-item");
    const commentContent = li.querySelector(".comment-content");
    
    commentTextarea.value = commentContent.textContent;
    
    commentButton.textContent = "댓글 수정";
    
    currentEditingComment = commentContent;
    
    commentButton.disabled = false;
    commentButton.style.backgroundColor = "#7F6AEE";
}

/* -----------------------------
  * 2-3. 댓글 삭제
  * ----------------------------- */
let currentDeletingComment = null;
const commentDeleteModal = document.querySelector('#comment-delete-modal');
const commentDeleteCancelButton = commentDeleteModal.querySelector(".modal-cancel");
const commentDeleteConfirmButton = commentDeleteModal.querySelector(".modal-confirm");

// 댓글 삭제 버튼 클릭 이벤트 등록
const deleteButtons = document.querySelectorAll(".comment-delete-btn");
deleteButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        // 삭제할 댓글 아이템(li 요소) 선택
        const li = event.target.closest(".comment-item");
        currentDeletingComment = li;

        console.log("댓글 삭제 버튼 클릭: ", li)

        // 댓글 삭제 모달 표시
        commentDeleteModal.classList.add("active"); 
    });
});

// 모달 취소 버튼 클릭 시 모달 닫기 
commentDeleteCancelButton.addEventListener("click", () => {
  commentDeleteModal.classList.remove("active");
  currentDeletingComment = null;
});

// 모달 외부 클릭 시 모달 닫기
commentDeleteModal.addEventListener("click", (event) => {
  if (event.target === commentDeleteModal) {
    commentDeleteModal.classList.remove("active");
  }
});

// 모달 확인 버튼 클릭 시 삭제 요청 후 댓글 아이템 삭제, 모달 숨김
commentDeleteConfirmButton.addEventListener("click", () => {
  if (currentDeletingComment) {
    // 댓글 삭제 요청 성공 시
    alert("댓글이 삭제되었습니다.");
    currentDeletingComment.remove();
    currentDeletingComment = null;
  }
  commentDeleteModal.classList.remove("active");
});


/* -----------------------------
  * 3. 게시글 수정/삭제 기능
  * ----------------------------- */
/* -----------------------------
  * 3-1. 게시글 삭제 모달
  * ----------------------------- */
// const postDeleteButton = document.querySelector("#post-delete-button");
const postDeleteModal = document.querySelector('#post-delete-modal');
const postDeleteCancelButton = postDeleteModal.querySelector(".modal-cancel");
const postDeleteConfirmButton = postDeleteModal.querySelector(".modal-confirm");

// 게시글 삭제 버튼 클릭 이벤트 핸들러 
postDeleteButton.addEventListener("click", (event) => {
  postDeleteModal.classList.add("active");
})

// 모달 취소 버튼 클릭 시 모달 닫기 
postDeleteCancelButton.addEventListener("click", () => {
  postDeleteModal.classList.remove("active");
});

// 모달 외부 클릭 시 모달 닫기
postDeleteModal.addEventListener("click", (event) => {
  if (event.target === postDeleteModal) {
    postDeleteModal.classList.remove("active");
  }
});

// 모달 확인 버튼 클릭 시 게시글 삭제하고 목록 페이지로 이동
postDeleteConfirmButton.addEventListener("click", () => {
  // 게시글 삭제 요청 성공 시
  alert("게시글이 삭제되었습니다.");
  postDeleteModal.classList.remove("active");
  // 목록 페이지로 이동 
});



/* -----------------------------
  * 4. 좋아요 추가/삭제 기능
  * ----------------------------- */
/* -----------------------------
  * 4-1. 좋아요 버튼 업데이트 
  * ----------------------------- */


/* -----------------------------
  * 4-3. 좋아요 삭제 
  * ----------------------------- */
likesItem.style.cursor = "pointer"; 

// 좋아요 버튼 클릭 이벤트
likesItem.addEventListener("click", () => {
    if (!isLiked) {
      // 비활성 상태에서 클릭: 활성화, 카운트 +1, 색상 변경
      isLiked = true;
      likesCount++;
      likesItem.style.backgroundColor = "#ACA0EB";
    } else {
      // 활성 상태에서 클릭: 비활성화, 카운트 -1, 색상 변경
      isLiked = false;
      likesCount--;
      likesItem.style.backgroundColor = "#D9D9D9";
    }
    // 요청
    
    // 포맷 함수 적용하여 업데이트된 좋아요 수 표시
    likesCountElement.textContent = formatCount(likesCount);
});
