document.getElementById("profile-img-input").addEventListener("change", function(event) {
    const file = event.target.files[0];
    const circle = document.querySelector(".circle");
    const plusSign = circle.querySelector(".plus");

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            circle.style.backgroundImage = `url(${e.target.result})`;
            plusSign.style.display = "none"; // "+" 기호 숨기기
        };
        reader.readAsDataURL(file);
    } else {
        circle.style.backgroundImage = "none";
        plusSign.style.display = "block";
    }
});
