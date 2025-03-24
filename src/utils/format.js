// 제목 26자까지만 자르는 함수 
export function truncateTitle (title, maxLen) {
    return title.length > maxLen ? title.substring(0, maxLen) + "..." : title;
}

// 좋아요수, 댓글수, 조회수를 변환하는 함수 
export function formatCount (number) {
    return number < 1000 ? number.toString() : Math.floor(number / 1000) + "k"
}

// 시간 포맷 변환 함수
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
