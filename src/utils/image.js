import { BASE_URL } from "./api.js";

/* -----------------------------
 * 프로필 이미지 URL 처리
 * ----------------------------- */
// 서버에서 받은 이미지 경로를 최종 URL로 변환한다.
// - 값이 없으면 기본 이미지(/public/assets/profile.png)를 반환
// - http(s)로 시작하면 외부 이미지 URL로 간주해 그대로 반환
// - 상대경로일 경우 BASE_URL을 붙여서 절대경로로 만든다.
export function getImageUrl(path) {
  if (!path) return "/public/assets/profile.png";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}