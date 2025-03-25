import { getImageUrl } from "/src/utils/image.js";
import { BASE_URL } from "/src/utils/api.js";

// IIFE(즉시 실행 함수) 패턴을 사용하면 전역 스코프 오염을 줄인다.
(async function() {
    /* -----------------------------
     * 1. 프로필 드롭다운 기능
     * ----------------------------- */
    const profileBtn = document.querySelector(".header-profile");
    const dropdown = document.querySelector(".header-dropdown");

    if (!profileBtn || !dropdown) {
        // header 요소들이 아직 DOM에 없으면 종료 (예: fetch로 header.html을 삽입 후 실행해야 함)
        return;
    }    

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

    /* -----------------------------
     * 2. 드롭다운 내 기능 
     * ----------------------------- */

    /* -----------------------------
     * 2-1. 회원정보수정 페이지 이동
     * ----------------------------- */
    const elEditProfileButton = document.getElementById("edit-profile-btn");
    if (elEditProfileButton) {
        elEditProfileButton.addEventListener("click", () => {
            window.location.href = "/src/pages/profile/edit-profile.html";
        })
    }


    /* -----------------------------
     * 2-2. 비밀번호수정 페이지 이동
     * ----------------------------- */
    const elEditPasswordButton = document.getElementById("edit-password-btn");
    if (elEditPasswordButton) {
        elEditPasswordButton.addEventListener("click", () => {
            window.location.href = "/src/pages/profile/edit-password.html";
        })
    }


    /* -----------------------------
     * 2-3. 로그아웃
     * ----------------------------- */
    // 로컬스토리지에서 로그인 정보 삭제 후 로그인 페이지로 이동
    const elLogoutButton = document.getElementById("logout-btn");
    if (elLogoutButton) {
        elLogoutButton.addEventListener("click", () => {
            localStorage.removeItem("token");         
            localStorage.removeItem("loggedInUser");   

            alert("로그아웃 되었습니다.");

            window.location.href = "/src/pages/login/login.html";
        });
    }


    /* -----------------------------
     * 3. 헤더 내 프로필 사진 설정
     * ----------------------------- */
    // 로그아웃 상태이면 요소를 숨긴다. 
    // 로그인 상태이면 회원정보 조회를 통해 유저 정보의 이미지를 삽입한다.
    // 로그인 안 된 상태이면 로그인 버튼을 삽입한다. 
    async function renderHeaderProfile() {
        const token = localStorage.getItem("token");
        const elHeaderProfile = document.querySelector(".header-profile");
        const elProfileImage = document.querySelector(".header-profile-image");
        const elLoginButton = document.querySelector(".header-login-button");

        if (!token || !elHeaderProfile || !elProfileImage) {
            // 로그인 안 된 상태이면 로그인 버튼 보이기 
            elHeaderProfile.style.display = "none";
            if (elLoginButton) elLoginButton.style.display = "block";
            return;
        }
    
        try {
            const response = await fetch(`${BASE_URL}/user`, {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            });
    
            if (!response.ok) {
                elHeaderProfile.style.display = "none";
                return;
            }

            const { data } = await response.json();

            elHeaderProfile.style.display = "flex";
            elProfileImage.src = getImageUrl(data.user.profileImg);
            elProfileImage.onerror = () => {
                elProfileImage.style.display = "none";
                elHeaderProfile.style.backgroundColor = "#ccc";
            };
        } catch (err) {
            console.error("헤더 프로필 불러오기 실패:", err);
            elHeaderProfile.style.display = "none";
        }
    }


    /* -----------------------------
     * 4. (추가) 타이틀 클릭 시 게시글 목록 페이지로 이동 
     * ----------------------------- */
    document.querySelector(".header-title")?.addEventListener("click", () => {
        window.location.href = "/src/pages/post/post.html";
    });


    /* -----------------------------
     * 5. (추가) 로그인 버튼 클릭 시 로그인 페이지로 이동
     * ----------------------------- */
    document.getElementById("login-btn")?.addEventListener("click", () => {
        window.location.href = "/src/pages/login/login.html";
    });


    await renderHeaderProfile();
})();