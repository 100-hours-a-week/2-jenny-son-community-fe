import { navigateTo, loadPage } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
    loadPage(window.location.pathname);
});