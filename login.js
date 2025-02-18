const emailPattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+~\-={}\[\]:;"'<>,.?/]).{8,20}$/;

function emailValidChk(email) {
    // example@example.com 형식
    return emailPattern.test(email);
}

function passwordValidChk(password) {
    // 8자 이상, 20자 이하, 대문자/소문자/숫자/특수문자 최소 1개 포함
    return passwordPattern.test(password);
}

let elInputEmail = document.querySelector('#email'); // input#email
let elEmailFailureMessage = document.querySelector('.email-failure-message'); 
let elInputPassword = document.querySelector('#password');
let elPasswordFailureMessage = document.querySelector('.password-failure-message');
let elLoginFailureMessage = document.querySelector('.login-failure-message');
let elButtonLogin = document.querySelector('.login-btn');

elInputEmail.onkeyup = function () {
    // 값을 입력한 경우
    if (elInputEmail.value.length !== 0){
        if (!emailValidChk(elInputEmail.value)){ // 유효하지 않은 경우
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
    updateLoginButton(isEmailValid=true);
}

elInputPassword.onkeyup = function () {
    // 값을 입력한 경우
    if (elInputPassword.value.length !== 0){
        if (!passwordValidChk(elInputPassword.value)){ // 유효하지 않은 경우
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
    updateLoginButton(isPasswordValid=true);
}

function updateLoginButton(isEmailValid=false, isPasswordValid=false) {
    isEmailValid = isEmailValid || emailPattern.test(elInputEmail);
    isPasswordValid = isPasswordValid || passwordPattern.test(elInputPassword);
    // 이메일과 비밀번호 모두 유효성 검사를 통과하면
    // 버튼 색상 변경
    if (isEmailValid && isPasswordValid) { 
        elButtonLogin.style.backgroundColor = "#6a5acd";
        elButtonLogin.disabled = false;
    } else {
        elButtonLogin.style.backgroundColor = "#ACA0EB";
        elButtonLogin.disabled = true;
    }
}