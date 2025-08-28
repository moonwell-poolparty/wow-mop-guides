document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.createElement("div");
  overlay.className = "image-overlay";
  overlay.innerHTML = `
    <span class="close">&times;</span>
    <span class="prev">&#10094;</span>
    <img>
    <span class="next">&#10095;</span>
  `;
  document.body.appendChild(overlay);

  const overlayImg = overlay.querySelector("img");
  const closeBtn = overlay.querySelector(".close");
  const prevBtn = overlay.querySelector(".prev");
  const nextBtn = overlay.querySelector(".next");

  const images = Array.from(document.querySelectorAll(".side-image img"));

   // Hide arrows if only one image
   if (images.length <= 1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  }
  
  let currentIndex = -1;
  let isAnimating = false;

  function openOverlay(index) {
    if (index < 0 || index >= images.length) return;
    currentIndex = index;
    overlayImg.src = images[currentIndex].src;
    overlay.style.display = "flex";
  }

  function closeOverlay() {
    overlay.style.display = "none";
    currentIndex = -1;
  }

  function changeImage(newIndex, direction) {
    if (isAnimating || newIndex < 0 || newIndex >= images.length) return;
    isAnimating = true;

    const newImg = document.createElement("img");
    newImg.src = images[newIndex].src;
    newImg.classList.add("slide-in", direction);

    overlay.appendChild(newImg);

    requestAnimationFrame(() => {
      newImg.classList.add("active");
      overlayImg.classList.add("slide-out", direction);
    });

    newImg.addEventListener("transitionend", () => {
      overlayImg.remove();
      overlayImg = newImg;
      isAnimating = false;
    }, { once: true });

    currentIndex = newIndex;
  }

  function showNext() {
    if (currentIndex >= 0) {
      changeImage((currentIndex + 1) % images.length, "right");
    }
  }

  function showPrev() {
    if (currentIndex >= 0) {
      changeImage((currentIndex - 1 + images.length) % images.length, "left");
    }
  }

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

  // Keyboard controls
  document.addEventListener("keydown", e => {
    if (overlay.style.display !== "flex") return;
    if (e.key === "Escape") closeOverlay();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });

  // --- Swipe gestures (mobile/touch) ---
  let touchStartX = 0;
  let touchEndX = 0;

  overlay.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  overlay.addEventListener("touchend", e => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  });

  function handleGesture() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      showNext();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      showPrev();
    }
  }
});