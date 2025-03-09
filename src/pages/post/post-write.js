/* -----------------------------
   * 0. 프로필 드롭다운 기능
   * ----------------------------- */
const profileBtn = document.querySelector(".header-profile");
const dropdown = document.querySelector(".header-dropdown");

// 프로필사진 클릭 시 열기
profileBtn.addEventListener("click", (event) => {
    console.log("프로필버튼클릭");
    event.stopPropagation(); // 클릭 이벤트가 부모 요소로 전파되는 것을 방지
    dropdown.classList.toggle("active");     
    console.log("현재 드롭다운 클래스 목록:", dropdown.classList);
    console.log("드롭다운 opacity:", window.getComputedStyle(dropdown).opacity);
    console.log("드롭다운 visibility:", window.getComputedStyle(dropdown).visibility);
})

// 드롭다운 외부 클릭 시 닫기
document.addEventListener("click", (event) => {
    if (!profileBtn.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove("active");
    }
})


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