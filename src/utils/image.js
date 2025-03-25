import { BASE_URL } from "./api.js";

/**
 * 서버에서 받은 이미지 경로를 최종적으로 사용할 URL로 변환
 * - null 또는 undefined: 기본 이미지 반환 
 * - http(s)로 시작하는 외부 이미지: 그대로 반환
 * - 상대경로인 경우: BASE_URL 붙여 반환
 */
export function getImageUrl(path) {
  if (!path) return "/public/assets/profile.png";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}