/* -----------------------------
   * 4. 게시글 등록 기능
   * ----------------------------- */
const editBtn = document.querySelector(".edit-button");

editBtn.addEventListener("click", (event) => {
    console.log("등록 버튼 클릭");
    // 내용 가져오기
    // 등록 요청

    // 등록 성공 시
    alert("게시글이 작성되었습니다.");
    // 게시글 상세 페이지로 이동 
})

const titleInput = document.querySelector("#post-title");
const contentInput = document.querySelector("#post-content");
const helperText = document.querySelector('.helper-text');

titleInput.addEventListener("blur", inputHandler);
contentInput.addEventListener("blur", inputHandler);

editBtn.disabled = true;

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