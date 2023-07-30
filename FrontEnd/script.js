const formLogin = document.getElementById("form-login");
const filtre = document.getElementById("filtre");
const gallery = document.getElementById("gallery");
const modal = document.querySelector(".modal");
const body = document.querySelector("body");
const modalScreen = document.querySelector(".modal-screen");
let isAdmin = false;
let isModal = false;
let reqFormLogin = {};
let currentValue = "Tous";
function changeOverflow() {
  if (isModal) {
    body.style.overflow = "hidden";
  } else {
    body.style.overflow = "auto";
  }
}
function openModal() {
  isModal = true;
  changeOverflow();
  modal.style.visibility = "visible";
  modalScreen.style.visibility = "visible";
  modal.style.zIndex = "100";
  modalScreen.style.zIndex = "50";
}
function closeModal() {
  isModal = false;
  changeOverflow();
  modal.style.visibility = "hidden";
  modalScreen.style.visibility = "hidden";
  modal.style.zIndex = "-100";
  modalScreen.style.zIndex = "-50";
}
const getAdmin = localStorage.getItem("isAdmin");
console.log(getAdmin);
if (getAdmin === "true") {
  isAdmin = true;
}
if (isAdmin) {
  document.querySelector("body").classList.add("admin");
  const modifier = document.querySelector(".if_admin");
  modifier.addEventListener("click", (e) => {
    openModal();
    modalScreen.addEventListener("click", (e) => {
      closeModal();
    });
  });
} else {
  console.log("non");
}

async function fetchWorks(value) {
  let galleryHTML = "";
  await fetch("http://localhost:5678/api/works")
    .then((e) => e.json())
    .then((e) => {
      e.filter((fil) => {
        if (value === "Tous") {
          return true;
        } else if (value == "1") {
          return fil.categoryId == value;
        } else if (value == "2") {
          return fil.categoryId == value;
        } else if (value == "3") {
          return fil.categoryId == value;
        }
      }).map(
        (res) =>
          (galleryHTML += `<figure class=${res.category.id}><img src=${res.imageUrl} alt=${res.title}><figcaption>${res.title}</figcaption></figure>`)
      );
    })
    .then((e) =>
      gallery ? (gallery.innerHTML = galleryHTML) : console.log("non")
    );
}

async function fetchCategories() {
  let filtreHTML =
    "<input type='radio' name='filtre' id='Tous0' class='filtreRadio' value='Tous' checked><label class='labelFiltre' for='Tous0'>Tous</label>";
  await fetch("http://localhost:5678/api/categories")
    .then((e) => e.json())
    .then((e) =>
      e.map((res) => {
        filtreHTML += `<input type='radio' name='filtre' id=${
          res.name + res.id
        } class='filtreRadio' value=${res.id}><label class='labelFiltre' for=${
          res.name + res.id
        }>${res.name}</label>`;
      })
    )
    .then((e) =>
      filtre ? (filtre.innerHTML = filtreHTML) : console.log("non")
    );
}

fetchCategories();
setTimeout(() => {
  const filtreRadio = document.querySelectorAll(".filtreRadio");
  filtreRadio.forEach((e) => {
    e.addEventListener("click", (e) => {
      currentValue = e.target.value;
      fetchWorks(currentValue);
    });
  });
}, 1000);

fetchWorks(currentValue);

async function fetchLogin() {
  await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqFormLogin),
  });
}

if (formLogin) {
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    reqFormLogin = {
      email: e.target[0].value,
      password: e.target[1].value,
    };
    fetchLogin()
      .then((e) => {
        localStorage.setItem("isAdmin", "true");
        window.location = "./index.html";
      })
      .catch((e) => console.log(e));
  });
}
