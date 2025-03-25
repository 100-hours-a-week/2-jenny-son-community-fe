import { BASE_URL } from "/src/utils/api.js";

/* -----------------------------
 * 1. 비밀번호 & 비밀번호 확인 유효성 검사
 * ----------------------------- */
const passwordInputs = document.querySelectorAll('.password-input');
const passwordInput = passwordInputs[0];  // 첫 번째 입력 필드
const passwordCheckInput = passwordInputs[1];  // 두 번째 입력 필드

const passwordErrorMessage = document.querySelectorAll('.password-failure-message')[0];
const passwordCheckErrorMessage = document.querySelectorAll('.password-failure-message')[1];

const editBtn = document.querySelector('.edit-btn');
const toastMessage = document.querySelector(".commit-btn");

// 비밀번호 입력 검사
// 사용자가 입력할 때마다 유효성 검사 실행
let isPasswordValid = false;
let isPasswordCheckValid = false;

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

/* -----------------------------
 * 2. 비밀번호 수정
 * ----------------------------- */
// 비밀번호 수정 버튼을 누르면, 비밀번호 변경 요청을 보낸다.
editBtn.addEventListener("click", async () => {
    editBtn.disabled = true;
    
    const password = passwordInput.value.trim();
    const token = localStorage.getItem("token");

    if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = "/src/pages/login/login.html";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/user/password`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ password })
        });

        const json = await response.json();

        if (response.status === 401) {
            alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
            localStorage.removeItem("token");
            window.location.href = "/src/pages/login/login.html";
            return;
        }

        if (!response.ok) {
            alert(json.message || "비밀번호 변경에 실패했습니다.");
            editBtn.disabled = false;
            return;
        }

        // 성공 시 토스트 메시지를 표시하고, 입력폼을 비운다. 
        showToastMessage(); 
        passwordInput.value = "";
        passwordCheckInput.value = "";

    } catch (err) {
        console.error("비밀번호 변경 중 오류:", err);
        alert("비밀번호 변경 중 오류가 발생했습니다.");
        editBtn.disabled = false;
    }
});


// 토스트 메시지 보여주기
function showToastMessage() {
    toastMessage.classList.add("show");

    setTimeout(()=> {
        toastMessage.classList.remove("show");
        editBtn.disabled = false;
    }, 2000); // 2초 후 사라짐
}