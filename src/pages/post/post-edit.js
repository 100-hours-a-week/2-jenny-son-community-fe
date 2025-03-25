import { BASE_URL } from "/src/utils/api.js";

const editBtn = document.querySelector(".edit-button");
const titleInput = document.querySelector("#post-title");
const contentInput = document.querySelector("#post-content");
const imageInput = document.querySelector("#post-image");
const helperText = document.querySelector('.helper-text');

editBtn.disabled = true;

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId");

/* -----------------------------
   * 1. 게시글 데이터 불러오기
   * ----------------------------- */
window.addEventListener("DOMContentLoaded", async () => {
  if (!postId) {
    alert("잘못된 접근입니다.");
    window.location.href = "../post/post.html";
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "../login/login.html";
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 401 || response.status === 403) {
      alert("로그인 시간이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("token");
      return;
    }

    const json = await response.json();
    if (!response.ok) {
      alert(json.message || "게시글 정보를 불러올 수 없습니다.");
      return;
    }

    const post = json.data;
    titleInput.value = post.title;
    contentInput.value = post.content;
    inputHandler(); // 버튼 활성화 여부 판단

    // 기존 이미지 보여주고 싶다면 여기에 추가
    // document.querySelector('#existing-img-preview').src = post.imgUrl;

  } catch (err) {
    console.error("게시글 불러오기 실패:", err);
    alert("오류가 발생했습니다.");
  }
});

/* -----------------------------
   * 2. 게시글 수정 기능
   * ----------------------------- */
// 인풋 이벤트에 따라 버튼 활성화
titleInput.addEventListener("blur", inputHandler);
contentInput.addEventListener("blur", inputHandler);

function inputHandler() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (title.length > 0 && content.length > 0) { // 버튼 활성화
        editBtn.disabled = false;
        editBtn.style.backgroundColor = "#7F6AEE";
        helperText.classList.add("hide");
      } else { // 버튼 비활성화
        editBtn.disabled = true;
        editBtn.style.backgroundColor = "#ACA0EB";
        helperText.classList.remove("hide"); 
      }
}

// 게시글 수정 요청 
editBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  const formData = new FormData();
  formData.append("title", titleInput.value.trim());
  formData.append("content", contentInput.value.trim());
  if (imageInput.files.length > 0) {
    formData.append("img", imageInput.files[0]);
  }

  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const json = await response.json();

    if (response.status === 401 || response.status === 403) {
      alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("token");
      return;
    }

    if (!response.ok) {
      alert(json.message || "게시글 수정에 실패했습니다.");
      return;
    }

    alert("게시글이 수정되었습니다.");
    window.location.href = `../post/post-detail.html?postId=${json.data.postId}`;

  } catch (err) {
    console.error("게시글 수정 중 오류:", err);
    alert("게시글 수정 중 오류가 발생했습니다.");
  }
})
