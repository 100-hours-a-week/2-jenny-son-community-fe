import { BASE_URL } from "/src/utils/api.js";

/* -----------------------------
   * 1-1. 이메일 & 비밀번호 유효성 검사 함수
   * ----------------------------- */
import { emailValidChk, passwordValidChk } from '/src/utils/validation.js';

/* -----------------------------
   * 1-2. 이메일 & 비밀번호 입력 및 유효성 검사 기능
   * ----------------------------- */
let elInputEmail = document.querySelector('#email'); // input#email
let elEmailFailureMessage = document.querySelector('.email-failure-message'); 
let elInputPassword = document.querySelector('#password');
let elPasswordFailureMessage = document.querySelector('.password-failure-message');
let elLoginFailureMessage = document.querySelector('.login-failure-message');
let elButtonLogin = document.querySelector('.login-btn');

// 이메일 입력 이벤트 핸들러
elInputEmail.addEventListener("input", (event) => {
    const isEmailValid = emailValidChk(elInputEmail.value);
    // 값을 입력한 경우
    if (elInputEmail.value.length !== 0){
        if (!isEmailValid){ // 유효하지 않은 경우
            elEmailFailureMessage.classList.remove('hide');
        }
        else {
            elEmailFailureMessage.classList.add('hide');
        }
    }
    // 값을 입력하지 않은 경우 (지웠을 때)
    // 모든 메세지를 가린다.
    else {
        elEmailFailureMessage.classList.add('hide');
    }
    updateLoginButton(isEmailValid, passwordValidChk(elInputPassword.value));
});

// 비밀번호 입력 이벤트 핸들러
elInputPassword.addEventListener("input", (event) => {
    const isPasswordValid = passwordValidChk(elInputPassword.value);
    // 값을 입력한 경우
    if (elInputPassword.value.length !== 0){
        if (!isPasswordValid){ // 유효하지 않은 경우
            elPasswordFailureMessage.classList.remove('hide');
        }
        else { // 유효성 검사 통과
            elPasswordFailureMessage.classList.add('hide');
        }
    }
    // 값을 입력하지 않은 경우 (지웠을 때)
    // 모든 메세지를 가린다.
    else {
        elPasswordFailureMessage.classList.add('hide');
    }
    updateLoginButton(emailValidChk(elInputEmail.value), isPasswordValid);
});

// 이메일 & 비밀번호 모두 유효성 검사 통과 시 로그인 버튼 활성화 
function updateLoginButton(isEmailValid, isPasswordValid) {
    console.log("UpdateLoginButton 호출");
    console.log("Email Valid:", isEmailValid);
    console.log("Password Valid:", isPasswordValid);
    // 이메일과 비밀번호 모두 유효성 검사를 통과하면
    // 버튼 색상 변경
    if (isEmailValid && isPasswordValid) { 
        elButtonLogin.style.backgroundColor = "#6a5acd";
        elButtonLogin.disabled = false;
        console.log("1")
    } else {
        elButtonLogin.style.backgroundColor = "#ACA0EB";
        elButtonLogin.disabled = true;
        console.log("2")
    }
}


/* -----------------------------
   * 2. 로그인 버튼 기능 
   * ----------------------------- */
// 로그인을 수행하고, 로그인 성공 시 post 페이지로 이동한다.
// 요청 보내서 인증. 성공하면 로컬스토리지에 저장. 
elButtonLogin.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = elInputEmail.value.trim();
    const password = elInputPassword.value.trim();

    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const result = await response.json();

        if (response.ok) {
            // 로그인 성공
            const { user, token } = result.data;

            // 로컬스토리지에 저장
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);

            // 다음 페이지로 이동
            alert("로그인에 성공했습니다!");
            window.location.href = "/src/pages/post/post.html"; // 이동 경로는 원하는 곳으로 바꿔도 됨
        } else {
            // 로그인 실패 처리
            if (response.status === 401) {
                elLoginFailureMessage.textContent = "* 비밀번호가 올바르지 않습니다.";
            } else if (response.status === 404) {
                elLoginFailureMessage.textContent = "* 등록되지 않은 이메일입니다.";
            } else {
                alert(result.message || "로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
            }
            elLoginFailureMessage.classList.remove("hide");
        }
    } catch (error) {
        console.error("로그인 요청 실패:", error);
        alert("회원가입 요청에 실패했습니다. 서버를 확인해주세요.");
        elLoginFailureMessage.classList.remove("hide");
    }
});


/* -----------------------------
   * 3. 회원가입 버튼 기능 
   * ----------------------------- */
// 회원가입 페이지로 이동한다. 
const signupButton = document.querySelector(".signup-btn");

signupButton.addEventListener("click", (event) => {
    window.location.href = "../signup/signup.html";
});