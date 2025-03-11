export function emailValidChk(email) {
    // example@example.com 형식
    const emailPattern = /^[A-Za-z0-9_.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+$/;
    return emailPattern.test(email);
}

export function passwordValidChk(password) {
    // 8자 이상, 20자 이하, 대문자/소문자/숫자/특수문자 최소 1개 포함
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+~\-={}\[\]:;"'<>,.?/]).{8,20}$/;
    return passwordPattern.test(password);
}
