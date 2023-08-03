const formLogin = document.getElementById("form-login");

const filtre = document.getElementById("filtre");
const gallery = document.getElementById("gallery");
const modal = document.querySelector(".modal");
const body = document.querySelector("body");
const modalScreen = document.querySelector(".modal-screen");
let galleryModal = "";
let contentPic = "";
let contentPicture = "";
let isAdmin = false;
let isInAddPic = false;
let contentModal = "";
const token = localStorage.getItem("token");
let isModal = false;
let reqFormLogin = {};
let submitPhoto = "";
let currentValue = "Tous";
let responseLength;

async function fetchdelete(id) {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((e) => {
    fetchWorks(currentValue);
  });
}
async function post(post) {
  await fetch("http://localhost:5678/api/works", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: post,
    method: "POST",
  })
    .then((e) => {
      fetchWorks(currentValue);
    })
    .then(() => {
      setTimeout(() => {
        fetchdelete(gallery.lastChild.id);
      }, 100);
    });
}
function preview(e) {
  const [picture] = e.files;
  if (
    picture.name.split(".")[1].toLowerCase() !== "jpg" &&
    picture.name.split(".")[1].toLowerCase() !== "png" &&
    picture.name.split(".")[1].toLowerCase() !== "jpeg"
  ) {
  } else {
    const menuPic = document.querySelector(".menu-ajout-photo");
    menuPic.innerHTML = "<img src='' id='image'   alt='preview'>";
    const image = document.getElementById("image");
    image.style.maxHeight = "100px";
    if (picture) {
      contentPicture = URL.createObjectURL(picture);
      image.src = URL.createObjectURL(picture);
      const f = e.files[0];
      if (f) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          const contents = evt.target;
          contentPic = f;
        };
        reader.readAsDataURL(f);
      }
    }
  }
}

function getCategory() {
  const selectElement = document.querySelector("select");
  fetchCategories2(selectElement);
}
function openAddPic() {
  isInAddPic = true;
  if (isModal) {
    const addPic = document.querySelector(".ajouter-btn");

    addPic.addEventListener("click", () => {
      modal.innerHTML = `<img width="20" class="close" src="./assets/icons/multiply-svgrepo-com.svg" alt="fermer le modal"
			onclick="closeModal()"><img width="20" class="back" src="./assets/icons/back-svgrepo-com.svg" alt="revenir"
			onclick="backModal()"><h1>Ajout Photo</h1><form method="post" enctype="multipart/form-data" class='form-modal'><div class='menu-ajout-photo'><img width='80' src='./assets/icons/picture-svgrepo-com.svg' alt='image galerie' class='img-gallery'><label class='label-file'>&#43; Ajouter photo<input class='input-ajout'style='visibility:hidden;position:absolute;' name='image'  accept="image/png, image/jpeg" type='file'></label><p>jpg, png : 4mo max</p></div><div class='content-modal-add'><label>Titre<input type='text' name='title'></label><label>Catégorie<select name='category'>
      <option disabled selected value></option>
      </select></label></div><input type='submit' class='submit-photo lock' disabled value='Valider'></form>`;
    });
    setTimeout(() => {
      submitPhoto = document.querySelector(".submit-photo");
      const inputAjout = document.querySelector(".input-ajout");
      inputAjout.addEventListener("change", (e) => {
        preview(e.target);
      });
    }, 100);
  }

  let formModal = "";
  setTimeout(() => {
    getCategory();
    formModal = document.querySelector(".form-modal");
    formModal.addEventListener("change", (e) => {
      if (contentPic !== "") {
        if (e.target.form[0].value && e.target.form[1].value) {
          submitPhoto.removeAttribute("disabled");
          submitPhoto.classList.remove("lock");
        }
      }
    });
    formModal.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("title", e.target[0].value);
      formData.append("image", contentPic);
      formData.append("category", e.target[1].value);
      post(formData);
      closeModal();
    });
  }, 500);
}

function backModal(change) {
  if (change) {
  } else {
    isInAddPic = false;
  }
  if (contentModal === "") {
    fetchWorks(currentValue).then((e) => {
      contentModal = modal.innerHTML;
    });
  }
  modal.innerHTML = contentModal;
}
function changeOverflow() {
  if (isModal) {
    body.style.overflow = "hidden";
  } else {
    body.style.overflow = "auto";
  }
}
function openModal() {
  isModal = true;

  galleryModal = document.querySelector(".gallery-modal");

  fetchWorks(currentValue).then((e) => {
    contentModal = modal.innerHTML;
  });

  changeOverflow();
  modal.style.visibility = "visible";
  modalScreen.style.visibility = "visible";
  modal.style.zIndex = "100";
  modalScreen.style.zIndex = "50";
  setTimeout(() => {
    const trash = document.querySelectorAll(".trash");
    trash.forEach((element) => {
      element.addEventListener("click", (e) => {
        setTimeout(() => {
          fetchdelete(e.srcElement.attributes[0].value);
          closeModal();
        }, 100);
      });
    });
  }, 200);
}
function closeModal() {
  backModal(true);
  isModal = false;
  if (galleryModal) {
    galleryModal.innerHTML = "";
    galleryModal = "";
  }
  changeOverflow();
  modal.style.visibility = "hidden";
  modalScreen.style.visibility = "hidden";
  modal.style.zIndex = "-100";
  modalScreen.style.zIndex = "-50";

  selectElement.innerHTML = "";
}
const getAdmin = localStorage.getItem("isLoggedIn");

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
}

async function fetchWorks(value) {
  let galleryHTML = "";
  await fetch("http://localhost:5678/api/works")
    .then((e) => e.json())
    .then((e) => {
      if (isModal && galleryModal !== null) {
        galleryModal.innerHTML = "";
        e.map((res) => {
          galleryModal.innerHTML += `
          <div class='gallery-modal-card'>
          <img id=${res.id} src='./assets/icons/delete-2-svgrepo-com.svg' width='10' class='trash' alt='supprimer'>
        <img src=${res.imageUrl} width='100'>
        <p>éditer</p>
        </div>
          `;
        });
      } else if (isModal && galleryModal) {
        e.map((res) => {
          galleryModal.innerHTML += `
          <div class='gallery-modal-card'>
          <img src='./assets/icons/delete-2-svgrepo-com.svg' id=${res.id} width='10' class='trash' alt='supprimer'>
        <img src=${res.imageUrl} width='100'>
        <p>éditer</p>
        </div>
          `;
        });
      }
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
          (galleryHTML += `<figure id=${res.id} class=${res.category.id}><img src=${res.imageUrl} alt=${res.title}><figcaption>${res.title}</figcaption></figure>`)
      );
    })
    .then((e) => (gallery ? (gallery.innerHTML = galleryHTML) : ""));
}

async function fetchCategories2(elemnt) {
  await fetch("http://localhost:5678/api/categories")
    .then((e) => e.json())
    .then((e) => {
      if (elemnt.length <= e.length) {
        e.map((resp) => {
          elemnt.innerHTML += `<option value=${resp.id}>${resp.name}</option>`;
        });
      }
    });
}
async function fetchCategories() {
  let filtreHTML =
    "<input type='radio' name='filtre' id='Tous0' class='filtreRadio' value='Tous' checked><label class='labelFiltre' for='Tous0'>Tous</label>";
  await fetch("http://localhost:5678/api/categories")
    .then((e) => e.json())
    .then((e) => {
      e.map((res) => {
        filtreHTML += `<input type='radio' name='filtre' id=${
          res.name + res.id
        } class='filtreRadio' value=${res.id}><label class='labelFiltre' for=${
          res.name + res.id
        }>${res.name}</label>`;
      });
    })
    .then((e) => (filtre ? (filtre.innerHTML = filtreHTML) : ""));
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
  })
    .then((e) => e.json())
    .then((e) => {
      localStorage.setItem("token", e.token);
      localStorage.setItem("userId", e.userId);
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
        localStorage.setItem("isLoggedIn", "true");
        window.location = "./index.html";
      })
      .catch((e) => console.log(e));
  });
}
