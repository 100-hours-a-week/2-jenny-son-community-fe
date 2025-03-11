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
        // json-server를 통해 사용자 목록 가져와서 사용자 확인
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
            throw new Error(`서버 통신 실패: ${response.status}`);
        }

        const users = await response.json();
        const user = users.find((user) => user.email === email && user.password === password);

        if (user) {
            // 로그인 성공 시 로컬 스토리지에 사용자 정보 저장, post 페이지로 이동
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            window.location.href = "../post/post.html";
        } else {
            elLoginFailureMessage.classList.remove("hide");
        }
    } catch (error) {
        console.error("로그인 오류:", error);
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