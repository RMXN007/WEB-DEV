const carousel = document.getElementById("carousel");
const leftArrow = document.querySelector(".arrow.left");
const rightArrow = document.querySelector(".arrow.right");

rightArrow.addEventListener("click", () => {
    carousel.scrollBy({ left: 220, behavior: "smooth" });
});

leftArrow.addEventListener("click", () => {
    carousel.scrollBy({ left: -220, behavior: "smooth" });
});



const titles = document.querySelectorAll('.Question .title');
titles.forEach(title => {
  title.addEventListener('click', () => {
    const content = title.nextElementSibling;
    content.style.display =
      content.style.display === 'block' ? 'none' : 'block';
  });
});