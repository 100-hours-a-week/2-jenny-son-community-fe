const routes = {
    "/": "pages/login/login.html",
    "/login": "pages/login/login.html",
    "/signin": "/src/pages/signin/signin.html",
}

// 페이지 변경 함수
const navigateTo = (url) => {
    history.pushState(null, null, url);
    loadPage(url);
};

// 페이지 로딩 함수
const loadPage = async (url) => {
    const page = routes[url] || routs["/"];
    const response = await fetch(page);
    const html = await response.text();
    document.getElementById("app").innerHTML = html; 
}

// 뒤로가기, 앞으로가기 이벤트 감지
window.addEventListener("popstate", () => loadPage(window.location.pathname));

// 페이지 처음 로드될 때 실행
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (event) => {
        if (event.target.matches("[data-link]")) {
            event.preventDefault();
            navigateTo(event.target.href);
        }
    });
    loadPage(window.location.pathname);
});