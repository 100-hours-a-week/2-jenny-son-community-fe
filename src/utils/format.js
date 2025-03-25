/* -----------------------------
 * UI에 표시할 데이터를 보기 좋게 가공하는 포맷 관련 유틸 함수 모음
 * ----------------------------- */

/* -----------------------------
 * 1. 게시글 제목 자르기
 * ----------------------------- */
// 주어진 제목이 maxLen보다 길면 잘라서 ...을 붙인다.
export function truncateTitle (title, maxLen) {
    return title.length > maxLen ? title.substring(0, maxLen) + "..." : title;
}


/* -----------------------------
 * 2. 숫자 단위 포맷 변환
 * ----------------------------- */
// 좋아요, 댓글, 조회수 등을 1000 단위로 k로 축약한다.
export function formatCount (number) {
    return number < 1000 ? number.toString() : Math.floor(number / 1000) + "k"
}


/* -----------------------------
 * 3. ISO 시간 포맷 변환
 * ----------------------------- */
// ISO 형식의 시간을 'YYYY-MM-DD HH:mm:ss' 형태로 반환한다.
export function formatTime(isoTime) {
    const date = new Date(isoTime);

    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
}
