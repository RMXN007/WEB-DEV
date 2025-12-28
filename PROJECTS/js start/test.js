const details = document.getElementById("myDetails");
const closeBtn = details.querySelector(".close-btn");

/* Close on button click */
closeBtn.addEventListener("click", () => {
  details.removeAttribute("open");
});

/* Close when clicking outside */
document.addEventListener("click", (e) => {
  if (!details.contains(e.target)) {
    details.removeAttribute("open");
  }
});

/* Prevent immediate close when opening */
details.addEventListener("click", (e) => {
  e.stopPropagation();
});
