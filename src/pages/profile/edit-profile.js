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
        profileUpload.style.backgroundImage = `url(${BASE_URL}${user.profileImg})`;
      }
  
      document.querySelector(".email").textContent = user.email;
      document.querySelector("#nickname").value = user.nickname;
  
    } catch (err) {
      console.error("회원정보 조회 실패:", err);
      alert("회원정보 조회 중 오류가 발생했습니다.");
    }
}


/* -----------------------------
* 2. 입력폼 유효성 및 이미지 미리보기
* ----------------------------- */
/* -----------------------------
* 2-1. 프로필 이미지 변경 기능
* ----------------------------- */
const profileInput = document.getElementById("profile-img-input");
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
* 3. 회원정보 수정
* ----------------------------- */
const editBtn = document.querySelector(".edit-btn");
const toast = document.querySelector(".commit-message");

editBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  editBtn.disabled = true;

  const nickname = document.querySelector("#nickname").value.trim();
  const imageFile = profileInput.files[0];

  if (!nicknameValidChk(nickname)) {
    editBtn.disabled = false;
    return;
  }

  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("nickname", nickname);
  if (imageFile) formData.append("profileImg", imageFile);

  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    const json = await response.json();

    if (response.status === 401) {
      alert("다시 로그인해주세요.");
      localStorage.removeItem("token");
      window.location.href = "/login.html";
      return;
    }

    if (!response.ok) {
      alert(json.message || "회원정보 수정 실패");
      editBtn.disabled = false;
      return;
    }

    showToastMessage();
    fetchUserProfile(); // 수정 후 UI 갱신

  } catch (err) {
    console.error("회원정보 수정 중 오류:", err);
    alert("회원정보 수정 중 오류가 발생했습니다.");
  }

  editBtn.disabled = false;
});

// 수정 성공 시 토스트메시지 보여주는 함수
function showToastMessage() {
    toast.classList.add("show");

    setTimeout(()=> {
        toast.classList.remove("show");
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
