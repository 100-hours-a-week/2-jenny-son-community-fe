import { emailValidChk, passwordValidChk } from '/src/utils/validation.js';
import { BASE_URL } from "/src/utils/api.js";

/* -----------------------------
   * 1. 회원가입 버튼 활성화/비활성화 기능
   * ----------------------------- */
let isEmailValid = false;
let isPasswordValid = false;
let isPasswordCheckValid = false;
let isNicknameValid = false;
let isImageValid = false;

function updateSignupButton() {
    const elSignupButton = document.querySelector(".signup-btn");
    if (isEmailValid && isPasswordValid && isPasswordCheckValid && isNicknameValid && isImageValid) {
        elSignupButton.style.backgroundColor = "#6a5acd";
        elSignupButton.disabled = false;
    } else {
        elSignupButton.style.backgroundColor = "#ACA0EB";
        elSignupButton.disabled = true;
    }
}


/* -----------------------------
   * 2-1. 이메일 유효성 검사 기능
   * ----------------------------- */
// 입력하다가 포커스 아웃될 때
// 영문, @, . 만 사용 가능 -> 오류 메시지 (1) *올바른 이메일 주소 형식을 입력해주세요.
// 비어 있는 경우 -> 오류 메시지 (2) *이메일을 입력해주세요
const elInputEmail = document.getElementById("email");
const elEmailFailureMessage = document.querySelector(".email-failure-message");

elInputEmail.addEventListener("blur", (event) => {
    const email = elInputEmail.value.trim();
    if (email.length > 0) {
        if (emailValidChk(email)) {
            isEmailValid = true;
            elEmailFailureMessage.classList.add('hide');
        } else {
            isEmailValid = false;
            elEmailFailureMessage.textContent = "* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)"
            elEmailFailureMessage.classList.remove('hide');
        }
    } else {
        isEmailValid = false;
        elEmailFailureMessage.textContent = "* 이메일을 입력해주세요."
        elEmailFailureMessage.classList.remove('hide');
    }
    updateSignupButton();
});


/* -----------------------------
   * 2-2. 프로필 사진 업로드 기능
   * ----------------------------- */
const elImageInput = document.getElementById("profile-img-input");

elImageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const circle = document.querySelector(".circle");
    const plusSign = circle.querySelector(".plus");
    const elImageFailureMessage = document.querySelector(".image-failure-message");

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            circle.style.backgroundImage = `url(${e.target.result})`;
            plusSign.style.display = "none"; // "+" 기호 숨기기
        };
        reader.readAsDataURL(file);
        isImageValid = true;
        elImageFailureMessage.classList.add('hide');
    } else {
        circle.style.backgroundImage = "none";
        plusSign.style.display = "block";
        isImageValid = false;
        elImageFailureMessage.classList.remove('hide');
    }

    updateSignupButton();
});


/* -----------------------------
   * 2-3. 비밀번호 & 비밀번호 확인 유효성 검사 기능
   * ----------------------------- */
const elInputPassword = document.getElementById("password");
const elInputPasswordCheck = document.getElementById("passwordCheck");
const elPasswordFailureMessage = document.querySelector(".password-failure-message");
const elPasswordCheckFailureMessage = document.querySelector(".passwordCheck-failure-message");

// 비밀번호 유효성 검사
elInputPassword.addEventListener("blur", (event) => {
    const password = elInputPassword.value.trim();
    if (password.length > 0) {
        if (passwordValidChk(password)) {
            isPasswordValid = true;
            elPasswordFailureMessage.classList.add('hide');
        } else {
            isPasswordValid = false;
            elPasswordFailureMessage.textContent = "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다."
            elPasswordFailureMessage.classList.remove('hide');
        }
    } else {
        isPasswordValid = false;
        elPasswordFailureMessage.textContent = "* 비밀번호를 입력해주세요."
        elPasswordFailureMessage.classList.remove('hide');
    }
    updateSignupButton();
});

// 비밀번호 확인 유효성 검사, 비밀번호와 같은지 확인
elInputPasswordCheck.addEventListener("blur", (event) => {
    const password = elInputPassword.value.trim();
    const passwordCheck = elInputPasswordCheck.value.trim();
    if (passwordCheck.length > 0) {
        if (passwordValidChk(passwordCheck)) {
            if (password === passwordCheck) {
                isPasswordCheckValid = true;
                elPasswordCheckFailureMessage.classList.add('hide');
            } else {
                isPasswordCheckValid = false;
                elPasswordCheckFailureMessage.textContent = "* 비밀번호가 다릅니다."
                elPasswordCheckFailureMessage.classList.remove('hide');
            }
        } else {
            isPasswordCheckValid = false;
            elPasswordCheckFailureMessage.textContent = "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다."
            elPasswordCheckFailureMessage.classList.remove('hide');
        }
    } else {
        isPasswordCheckValid = false;
        elPasswordCheckFailureMessage.textContent = "* 비밀번호를 한 번 더 입력해주세요."
        elPasswordCheckFailureMessage.classList.remove('hide');
    }
    updateSignupButton();
});


/* -----------------------------
   * 2-4. 닉네임 유효성 검사 기능
   * ----------------------------- */
// 띄어쓰기 불가, 10글자 이내
const elInputNickname = document.getElementById("nickname");
const elNicknameFailureMessage = document.querySelector(".nickname-failure-message");

elInputNickname.addEventListener("blur", (event) => {
    const nickname = elInputNickname.value.trim();

    if (nickname.length > 0) {
        if (nickname.includes(" ")) {
            isNicknameValid = false;
            elNicknameFailureMessage.textContent = "* 띄어쓰기를 없애주세요.";
            elNicknameFailureMessage.classList.remove('hide');
        } else if (nickname.length > 10) {
            isNicknameValid = false;
            elNicknameFailureMessage.textContent = "* 닉네임은 최대 10자까지 작성 가능합니다.";
            elNicknameFailureMessage.classList.remove('hide');
        } else {
            isNicknameValid = true;
            elNicknameFailureMessage.classList.add('hide');
        }
    } else {
        isNicknameValid = false;
        elNicknameFailureMessage.textContent = "* 닉네임을 입력해주세요.";
        elNicknameFailureMessage.classList.remove('hide');
    }
    updateSignupButton();
});


/* -----------------------------
   * 3. 회원가입 버튼 기능
   * ----------------------------- */
// 실패: 중복된 이메일인 경우 -> 오류 메시지 (이메일) * 중복된 이메일입니다. 
// 실패: 중복된 닉네임인 경우 -> 오류 메시지 (닉네임) * 중복된 닉네임입니다. 
const elSignupButton = document.querySelector(".signup-btn");

elSignupButton.addEventListener("click", async (event) => {
    event.preventDefault();
    console.log("회원가입 버튼 클릭");
    
    const email = elInputEmail.value.trim();
    const password = elInputPassword.value.trim();
    const nickname = elInputNickname.value.trim();
    const profileImageFile = elImageInput.files[0];

    const elEmailFailureMessage = document.querySelector(".email-failure-message");
    const elNicknameFailureMessage = document.querySelector(".nickname-failure-message");

    // formData 생성
    const formData = new FormData();
    formData.append("profileImg", profileImageFile);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("nickname", nickname);
    
    console.log("file: ", profileImageFile);

    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (response.status === 201) {
            // 성공
            if (confirm("회원가입에 성공했습니다!")) {
                window.location.href = "../login/login.html";
            }
        } else if (response.status === 409) {
            // 중복된 이메일 or 닉네임
            if (result.message.includes("이메일")) {
                isEmailValid = false;
                elEmailFailureMessage.textContent = "* " + result.message;
                elEmailFailureMessage.classList.remove("hide");
            } else if (result.message.includes("닉네임")) {
                isNicknameValid = false;
                elNicknameFailureMessage.textContent = "* " + result.message;
                elNicknameFailureMessage.classList.remove("hide");
            }
            updateSignupButton();
        } else {
            // 그 외 오류
            alert(result.message || "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    } catch (error) {
        console.error("회원가입 요청 실패:", error);
        alert("회원가입 요청에 실패했습니다. 서버를 확인해주세요.");
    }
});


/* -----------------------------
   * 4. 로그인하러가기 버튼 기능 
   * ----------------------------- */
const elLoginButton = document.querySelector(".login-btn");

elLoginButton.addEventListener("click", (event) => {
    window.location.href = "../login/login.html";
})
