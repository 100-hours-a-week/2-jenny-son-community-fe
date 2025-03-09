const passwordInputs = document.querySelectorAll('.password-input');
const passwordInput = passwordInputs[0];  // 첫 번째 입력 필드
const passwordCheckInput = passwordInputs[1];  // 두 번째 입력 필드

const passwordErrorMessage = document.querySelectorAll('.password-failure-message')[0];
const passwordCheckErrorMessage = document.querySelectorAll('.password-failure-message')[1];

const editBtn = document.querySelector('.edit-btn');
const toastMessage = document.querySelector(".commit-btn");

/* 비밀번호 입력 검사 */
let isPasswordValid = false;
let isPasswordCheckValid = false;

// 사용자가 입력할 때마다 유효성 검사 실행
passwordInput.addEventListener("blur", validatePassword); // blur: 사용자가 입력을 마치면 검사한다. 
passwordCheckInput.addEventListener("blur", validatePassword);

function validatePassword() {
    const password = passwordInput.value.trim();
    const passwordCheck = passwordCheckInput.value.trim();

    passwordErrorMessage.textContent = "";
    passwordErrorMessage.classList.add("hide");
    passwordCheckErrorMessage.textContent = "";
    passwordCheckErrorMessage.classList.add("hide");


    let isPasswordValid = true;
    let isPasswordCheckValid = true;

    // 1. 비밀번호 검사 
    if (password === "") { // 1-1. 비어있는지
        passwordErrorMessage.textContent = "* 비밀번호를 입력해주세요.";
        passwordErrorMessage.classList.remove("hide");
        isPasswordValid = false;
    }
    else { // 1-2.유효성 검사
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/;
        if (!regex.test(password)) {
            passwordErrorMessage.textContent = "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
            passwordErrorMessage.classList.remove("hide");
            isPasswordValid = false;
        }
    }
    
    // 2. 비밀번호 확인 검사
    if (passwordCheck === "") { // 비어있는지 검사
        passwordCheckErrorMessage.textContent = "* 비밀번호를 한 번 더 입력해주세요.";
        passwordCheckErrorMessage.classList.remove("hide");
        isPasswordCheckValid = false;
    }

    // 3. 비밀번호와 비밀번호 확인이 일치하는지 검사 
    if (password !== passwordCheck) {
        if (isPasswordValid) { // 유효성 검사 문구가 우선순위가 더 높도록 함. 
            passwordErrorMessage.textContent = "* 비밀번호 확인과 다릅니다.";
            passwordErrorMessage.classList.remove("hide"); 
        }
        passwordCheckErrorMessage.textContent = "* 비밀번호와 다릅니다.";
        passwordCheckErrorMessage.classList.remove("hide");
        isPasswordCheckValid = false;
        isPasswordValid = false;
    }

    // 4. 전부 통과하면 버튼 활성화
    if (isPasswordValid && isPasswordCheckValid) {
        passwordErrorMessage.classList.add("hide");
        passwordCheckErrorMessage.classList.add("hide");
        editBtn.style.backgroundColor = "#7e6aee";
        editBtn.disabled = false;
    } else {
        editBtn.style.backgroundColor = "#aca0eb";
        editBtn.disabled = true;
    }
}


/* 비밀번호 수정 요청 기능 */
editBtn.addEventListener("click", () => {
    editBtn.disabled = true;
    // 가상 요청
    setTimeout(() => {
        showToastMessage();
    }, 500);
});


// 토스트메시지 보여주기
function showToastMessage() {
    toastMessage.classList.add("show");

    setTimeout(()=> {
        toastMessage.classList.remove("show");
        editBtn.disabled = false;
    }, 2000); // 2초 후 사라짐
}


/* 프로필 드롭다운 기능 */
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