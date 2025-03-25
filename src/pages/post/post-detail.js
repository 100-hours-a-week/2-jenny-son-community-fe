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
      window.location.href = "../post/post.html";
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
      li.dataset.commentId = comment.commentId;
      
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
        <p class="comment-content">${comment.content}</p>`;

      commentList.appendChild(li);
    });

    // 버튼 이벤트 등록
    attachCommentEventListeners();

  } catch (err) {
    console.error("댓글 목록 조회 실패:", err);
    alert("댓글을 불러오는 중 오류가 발생했습니다.");
  }
}


function attachCommentEventListeners() {
  document.querySelectorAll(".comment-edit-btn").forEach(btn => {
    btn.addEventListener("click", handleEditClick);
  });
  document.querySelectorAll(".comment-delete-btn").forEach(btn => {
    btn.addEventListener("click", handleDeleteClick);
  });
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
        fetchComments(); // 댓글 목록 새로고침
      } catch (err) {
        console.error("댓글 등록 중 오류:", err);
        alert("댓글 등록 중 오류가 발생했습니다.");
      }
    }
    // 2. 댓글 수정
    else {
      const commentId = currentEditingComment.closest(".comment-item").dataset.commentId;
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }
    
      try {
        const response = await fetch(`${BASE_URL}/posts/${postId}/comments/${commentId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ content: commentText })
        });
    
        const json = await response.json();
    
        if (!response.ok) {
          alert(json.message || "댓글 수정에 실패했습니다.");
          return;
        }
    
        alert("댓글이 수정되었습니다.");
        currentEditingComment = null;
    
        fetchComments(); // 최신 댓글 목록 불러오기
    
      } catch (err) {
        console.error("댓글 수정 중 오류:", err);
        alert("댓글 수정 중 오류가 발생했습니다.");
      }
    }

    // 입력란 초기화 및 버튼 상태 리셋
    resetCommentInput();
})

function resetCommentInput() {
  commentTextarea.value = "";
  commentButton.disabled = true;
  commentButton.style.backgroundColor = "#ACA0EB";
  commentButton.textContent = "댓글 등록";
}

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
 // 삭제할 댓글 요소 저장
let currentDeletingComment = null;

// 모달 관련 DOM
const commentDeleteModal = document.querySelector('#comment-delete-modal');
const commentDeleteCancelButton = commentDeleteModal.querySelector(".modal-cancel");
const commentDeleteConfirmButton = commentDeleteModal.querySelector(".modal-confirm");

// 삭제 버튼 누를 시, 삭제 모달을 열기
function handleDeleteClick(event) {
  const li = event.target.closest(".comment-item");
  currentDeletingComment = li;
  commentDeleteModal.classList.add("active");
}


// 모달의 취소 버튼 클릭 시, 모달 닫기 
commentDeleteCancelButton.addEventListener("click", () => {
  commentDeleteModal.classList.remove("active");
  currentDeletingComment = null;
});

// 모달의 외부 클릭 시, 모달 닫기
commentDeleteModal.addEventListener("click", (event) => {
  if (event.target === commentDeleteModal) {
    commentDeleteModal.classList.remove("active");
    currentDeletingComment = null;
  }
});

// 모달의 확인 버튼 클릭 시, DELETE 요청 보냄
commentDeleteConfirmButton.addEventListener("click", async () => {
  if (currentDeletingComment) {
    const commentId = currentDeletingComment.dataset.commentId;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message || "댓글 삭제에 실패했습니다.");
        return;
      }

      alert("댓글이 삭제되었습니다.");
      commentDeleteModal.classList.remove("active");
      currentDeletingComment = null;
      fetchComments(); // 최신 댓글 목록 다시 불러오기
    } catch (err) {
      console.error("댓글 삭제 중 오류:", err);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  }
});


/* -----------------------------
  * 3. 게시글 수정/삭제 기능
  * ----------------------------- */
/* -----------------------------
  * 3-1. 게시글 수정
  * ----------------------------- */
// 게시글 수정 페이지로 이동
postEditButton.addEventListener("click", (event) => {
    window.location.href = "../post/post-edit.html";
})

/* -----------------------------
  * 3-2. 게시글 삭제 모달
  * ----------------------------- */
const postDeleteModal = document.querySelector('#post-delete-modal');
const postDeleteCancelButton = postDeleteModal.querySelector(".modal-cancel");
const postDeleteConfirmButton = postDeleteModal.querySelector(".modal-confirm");

// 게시글 삭제 버튼 클릭 이벤트 핸들러 
postDeleteButton.addEventListener("click", (event) => {
  postDeleteModal.classList.add("active");
})

// 모달 취소 버튼 클릭 시, 모달 닫기 
postDeleteCancelButton.addEventListener("click", () => {
  postDeleteModal.classList.remove("active");
});

// 모달 외부 클릭 시, 모달 닫기
postDeleteModal.addEventListener("click", (event) => {
  if (event.target === postDeleteModal) {
    postDeleteModal.classList.remove("active");
  }
});

// 모달 확인 버튼 클릭 시, DELETE 요청
postDeleteConfirmButton.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const json = await response.json();

    if (!response.ok) {
      alert(json.message || "게시글 삭제에 실패했습니다.");
      return;
    }

    alert("게시글이 삭제되었습니다.");
    postDeleteModal.classList.remove("active");

    // 삭제 후 목록 페이지로 이동
    window.location.href = "../post/post.html";

  } catch (err) {
    console.error("게시글 삭제 중 오류:", err);
    alert("게시글 삭제 중 오류가 발생했습니다.");
  }
});


/* -----------------------------
  * 4. 좋아요 추가/삭제 기능
  * ----------------------------- */
likesItem.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    let response;

    if (!isLiked) {
      // 좋아요 추가 요청
      response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    } else {
      // 좋아요 삭제 요청
      response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    }

    const json = await response.json();

    if (!response.ok) {
      alert(json.message || "좋아요 요청에 실패했습니다.");
      return;
    }

    // 성공 처리
    isLiked = !isLiked;
    likesCount = isLiked ? likesCount + 1 : Math.max(likesCount - 1, 0);

    updateLikeStyle(); // 색상 변경
    likesCountElement.textContent = formatCount(likesCount); // 숫자 반영

  } catch (err) {
    console.error("좋아요 요청 중 오류:", err);
    alert("좋아요 요청 중 오류가 발생했습니다.");
  }
});


// 좋아요 버튼 스타일 변경
function updateLikeStyle() {
  likesItem.style.cursor = "pointer";
  likesItem.style.backgroundColor = isLiked ? "#ACA0EB" : "#D9D9D9";
}