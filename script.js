// Smooth scrolling for sections
document.addEventListener("scroll", () => {
    document.querySelectorAll(".slide").forEach((slide, index) => {
        let position = slide.getBoundingClientRect().top;
        if (position < window.innerHeight * 0.75) {
            slide.style.opacity = "1";
            slide.style.transform = "translateY(0)";
        }
    });
});
