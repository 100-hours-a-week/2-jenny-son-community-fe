import { BASE_URL } from "/src/utils/api.js";

const editBtn = document.querySelector(".edit-button");
const titleInput = document.querySelector("#post-title");
const contentInput = document.querySelector("#post-content");
const imageInput = document.querySelector("#post-image");
const helperText = document.querySelector('.helper-text');

editBtn.disabled = true;

/* -----------------------------
   * 1. 게시글 등록 기능
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

// 작성 버튼 이벤트 핸들러 - POST 요청
editBtn.addEventListener("click", async (event) => {
    console.log("등록 버튼 클릭");
    event.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const token = localStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  if (imageInput.files.length > 0) {
    formData.append("img", imageInput.files[0]);
  }

  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const json = await response.json();

    if (response.status === 401) {
      alert("로그인 시간이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("token");
      return;
    }

    if (!response.ok) {
      alert(json.message || "게시글 작성에 실패했습니다.");
      return;
    }

    alert("게시글이 작성되었습니다.");
    window.location.href = `../post/post-detail.html?postId=${json.data.postId}`;

  } catch (err) {
    console.error("게시글 작성 중 오류:", err);
    alert("게시글 작성 중 오류가 발생했습니다.");
  }
})
