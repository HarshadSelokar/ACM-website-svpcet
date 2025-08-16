const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".hero-card");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let currentIndex = 0;
const totalSlides = slides.length;
let autoSlideInterval;

function updateSlider() {
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function goToNextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlider();
}

function goToPrevSlide() {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateSlider();
}

// Manual controls
prevBtn.addEventListener("click", () => {
  goToPrevSlide();
  resetAutoSlide();
});

nextBtn.addEventListener("click", () => {
  goToNextSlide();
  resetAutoSlide();
});

// Auto slide
function startAutoSlide() {
  autoSlideInterval = setInterval(goToNextSlide, 2000); // 5 seconds
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

// Initialize
updateSlider();
startAutoSlide();
