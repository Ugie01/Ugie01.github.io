const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

document
    .querySelectorAll(".nav-links a")
    .forEach((link) => {

        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });

    });