import { BASE_URL } from "/src/utils/api.js";

/* -----------------------------
* 1. 회원정보 조회
* ----------------------------- */
async function fetchUserProfile() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login.html";
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 401) {
        alert("로그인 시간이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token");
        window.location.href = "/login.html";
        return;
      }
  
      const json = await response.json();
  
      if (!response.ok) {
        alert(json.message || "회원정보를 불러오지 못했습니다.");
        return;
      }
  
      const user = json.data.user;
      console.log("회원정보:", user);
  
      // 화면에 데이터 채우기
      const profileUpload = document.querySelector(".profile-upload .circle");
      if (user.profileImg) {
        profileUpload.style.backgroundImage = `url(${user.profileImg})`;
      }
  
      document.querySelector(".email").textContent = user.email;
      document.querySelector("#nickname").value = user.nickname;
  
    } catch (err) {
      console.error("회원정보 조회 실패:", err);
      alert("회원정보 조회 중 오류가 발생했습니다.");
    }
}

/* -----------------------------
* 2-1. 프로필 이미지 변경 기능
* ----------------------------- */
const profileInput = document.getElementById("profile-img-input");

// 파일 선택 시 이벤트 처리
profileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const elProfileUpload = document.querySelector(".profile-upload .circle");

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            elProfileUpload.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    } else {
        elProfileUpload.style.backgroundImage = `url(${defaultProfileImage})`;
    }
})


/* -----------------------------
* 2-2. 닉네임 유효성 검사 함수 (수정하기 버튼 누르면 수행됨)
* ----------------------------- */
// 띄어쓰기 불가, 10글자 이내
function nicknameValidChk(nickname) {
    const elNicknameFailureMessage = document.querySelector(".nickname-failure-message");
    
    if (nickname.length > 0) {
        if (nickname.includes(" ")) {
            showErrorMessage("띄어쓰기를 없애주세요.");
            return false;
        } else if (nickname.length > 10) {
            showErrorMessage("닉네임은 최대 10자까지 작성 가능합니다.");
            return false;
        } else {
            elNicknameFailureMessage.classList.add('hide');
            return true;
        }
    } else {
        showErrorMessage("닉네임을 입력해주세요.");
        return false;
    }
}

// 오류 메시지 내용 변경하고 보여주는 함수
function showErrorMessage(message) {
    const elErrorMessage = document.querySelector(".nickname-failure-message");
    console.log("오류 메시지 업데이트:", message);
    elErrorMessage.textContent = `* ${message}`;
    elErrorMessage.classList.remove("hide");
}

/* -----------------------------
* 3. 수정하기 버튼 기능
* ----------------------------- */
/* 수정하기 요청 & 수정 완료 토스트 메시지 기능 */
const elEditBtn = document.querySelector(".edit-btn");
const elErrorMessage = document.querySelector(".error-container .failure-message");
const toastMessage = document.querySelector(".commit-message");

// 수정하기 버튼 클릭 핸들러 
elEditBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    elEditBtn.disabled = true;

    const nicknameInput = document.querySelector(".nickname-input");
    const newNickname = nicknameInput.value.trim();

    console.log("입력된 닉네임: ", newNickname);

    // 닉네임 유효성 검사
    if (!nicknameValidChk(newNickname)) {
        return;
    }
    elErrorMessage.classList.add("hide");

    // localStorage에서 로그인한 사용자 정보 불러오기
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    if (!loggedInUser.id) {
        alert("로그인 정보가 없습니다.");
        return;
    }
    showToastMessage();
    try {
        // json-server에서 사용자 목록 가져오기
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
            throw new Error("사용자 데이터를 불러오는데 실패했습니다.");
        }
        const users = await response.json();

        // 중복 닉네임인 경우 수정 실패
        const duplicateUser = users.find(user => 
            user.username === newNickname && user.id !== loggedInUser.id
        );
        if (duplicateUser) {
            showErrorMessage("중복된 닉네임입니다.");
            return;
        }

        // 새 사용자 데이터 객체 생성
        const updatedUser = {
            ...loggedInUser,
            username: newNickname,
            profileImage: '/public/assets/goorm.png'
        };

        // json-server의 users 엔드포인트에 PATCH 요청 보내기
        const patchResponse = await fetch(`http://localhost:3000/users/${loggedInUser.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedUser)
        });
        // 위 코드가 새로고침을 유발해 토스트메시지가 보이다가 잘림.

        if (patchResponse.ok) {
            // 업데이트 성공 시 localStorage에 변경된 사용자 정보 저장
            localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
            // 수정 완료 토스트 메시지 표시 
            showToastMessage();
        } else {
            alert("회원정보 수정에 실패하였습니다. 다시 시도해 주세요.");
        }
    } catch (error) {
        console.error("회원정보 수정 오류:", error);
        alert("회원정보 수정 중 오류가 발생했습니다.");
    }
    elEditBtn.disabled = false;
});

// 수정 성공 시 토스트메시지 보여주는 함수
function showToastMessage() {
    toastMessage.classList.add("show");

    setTimeout(()=> {
        toastMessage.classList.remove("show");
    }, 2000); // 2초 후 사라짐
}

/* -----------------------------
* 4. 회원 탈퇴 기능
* ----------------------------- */
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

// 확인 버튼 클릭 시 회원 탈퇴 처리 
modalConfirm.addEventListener("click", async () => {
    // localStorage에서 로그인한 사용자 정보 가져오기
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

    // 로그인 정보가 없으면 탈퇴 진행 불가
    if (!loggedInUser || !loggedInUser.id) {
        alert("로그인 정보가 없습니다.");
        return;
    }

    try {
        // json-server에서 해당 사용자를 삭제
        const response = await fetch(`http://localhost:3000/users/${loggedInUser.id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            // 삭제 성공 시 로컬스토리지에서 사용자 정보 제거
            localStorage.removeItem("loggedInUser");

            alert("회원 탈퇴가 완료되었습니다.");
            modalOverlay.classList.remove("active");

            // 로그인 페이지로 이동
            window.location.href = "../login/login.html";
        } else {
            alert("회원 탈퇴에 실패하였습니다. 다시 시도해 주세요.");
        }
    } catch (error) {
        console.error("회원 탈퇴 오류:", error);
        alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
});

// 페이지 로드 시 회원정보 조회 요청
fetchUserProfile();
