document.addEventListener("DOMContentLoaded", () => {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "image-overlay";
  overlay.innerHTML = `
    <span class="close">&times;</span>
    <span class="prev">&#10094;</span>
    <div class="slider-wrapper">
      <div class="slider-track"></div>
      <div class="overlay-title"></div>
    </div>
    <span class="next">&#10095;</span>
  `;
  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector(".close");
  const prevBtn = overlay.querySelector(".prev");
  const nextBtn = overlay.querySelector(".next");
  const track = overlay.querySelector(".slider-track");

  const images = Array.from(document.querySelectorAll(".side-image img"));

  // Hide arrows if only one image
  if (images.length <= 1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  }

  let currentIndex = 0;

  // Open overlay
  function openOverlay(index) {
    if (index < 0 || index >= images.length) return;
    currentIndex = index;

    track.innerHTML = ""; // clear previous
    images.forEach(img => {
      const clone = img.cloneNode();
      track.appendChild(clone);
    });

    overlay.style.display = "flex";
    updateSlider();
  }

  // Close overlay
  function closeOverlay() {
    overlay.style.display = "none";
  }

  // Move slider to currentIndex
  function updateSlider() {
    const imgWidth = track.querySelector("img").clientWidth;
    track.style.transform = `translateX(-${currentIndex * imgWidth}px)`;

    // Update title
    const titleDiv = overlay.querySelector(".overlay-title");
    const currentImg = images[currentIndex];
    titleDiv.textContent = currentImg.alt || ""; // fallback if no alt
  }

  // Next / Prev
  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateSlider();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateSlider();
  }

  // Click thumbnails to open overlay
  images.forEach((img, index) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => openOverlay(index));
  });

  // Close overlay
  closeBtn.addEventListener("click", closeOverlay);
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeOverlay();
  });

  // Arrow buttons
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);

  // Keyboard
  document.addEventListener("keydown", e => {
    if (overlay.style.display !== "flex") return;
    if (e.key === "Escape") closeOverlay();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });

  // Swipe gestures
  let touchStartX = 0;
  let touchEndX = 0;

  overlay.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  overlay.addEventListener("touchend", e => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) showNext();
    if (touchEndX > touchStartX + swipeThreshold) showPrev();
  });
});
