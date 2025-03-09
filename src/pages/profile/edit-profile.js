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


/* 프로필 이미지 변경 기능 */
const profileUpload = document.querySelector(".profile-upload .circle");
const profileInput = document.getElementById("profile-img-input");

// 기존 프로필 이미지 설정
let defaultProfileImage = "/public/assets/profile.png";
profileUpload.style.backgroundImage = `url(${defaultProfileImage})`;

// 파일 선택 시 이벤트 처리
profileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profileUpload.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    } else {
        profileUpload.style.backgroundImage = `url(${defaultProfileImage})`;
    }
})


/* 수정하기 요청 & 수정 완료 토스트 메시지 기능 */
const editBtn = document.querySelector(".edit-btn");
const nicknameInput = document.querySelector(".nickname-input");
const errorMessage = document.querySelector(".error-container .failure-message");
const toastMessage = document.querySelector(".commit-btn");

// 수정하기 버튼 클릭 핸들러 
editBtn.addEventListener("click", () => {
    // 닉네임 유효성 검사
    console.log(nicknameInput.value);
    const nickname = nicknameInput.value.trim();
    if (nickname === "") {
        showErrorMessage("닉네임을 입력해주세요.");
        return;
    }
    if (nickname.length > 10) {
        showErrorMessage("닉네임은 최대 10자까지 작성 가능합니다.");
        return;
    }

    editBtn.disabled = true;
    errorMessage.classList.add("hide");
    // 가상 요청
    setTimeout(()=>{
        if (nickname === "user123") {
            showErrorMessage("중복된 닉네임입니다.");
            editBtn.disabled = false;
            return;
        }

        showToastMessage();
    }, 500);
});

// 오류 메시지 보여주기
function showErrorMessage(message) {
    console.log("오류 메시지 업데이트:", message);
    errorMessage.textContent = `* ${message}`;
    errorMessage.classList.remove("hide");
}

// 토스트메시지 보여주기
function showToastMessage() {
    toastMessage.classList.add("show");

    setTimeout(()=> {
        toastMessage.classList.remove("show");
        editBtn.disabled = false;
    }, 2000); // 2초 후 사라짐
}


/** 회원탈퇴 기능 */
const withdrawBtn = document.querySelector(".withdraw-btn");
const modalOverlay = document.querySelector(".modal-overlay");
const modalCancel = document.querySelector(".modal-cancel");
const modalConfirm = document.querySelector(".modal-confirm"); 

// 회원 탈퇴 버튼 클릭 시 모달 열기
withdrawBtn.addEventListener("click", () => {
    modalOverlay.classList.add("active");
});

// 취소 버튼 클릭 시 모달 닫기
modalCancel.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
});

// 모달 외부 클릭 시 닫기
modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
        modalOverlay.classList.remove("active");
    }
});

// 확인 버튼 클릭 시 탈퇴 처리 (예제)
modalConfirm.addEventListener("click", () => {
    alert("회원 탈퇴가 완료되었습니다."); // 실제 탈퇴 API 연결 필요
    modalOverlay.classList.remove("active");
    // login 페이지로 이동 
});