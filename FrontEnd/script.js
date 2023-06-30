const gallery = document.querySelector(".gallery");

const filters = document.getElementsByName("filtres");
const radio = document.querySelectorAll("label");
const editContainer = document.querySelector(".edit-container");
const body = document.querySelector("body");

let selectedFilter;
let isLoggedIn = false;
let work; // Déclaration de la variable work

premium.addEventListener("click", () => {
  editContainer.style.display = "block";
  body.classList.add("overlay");
});

async function getWork() {
  const response = await fetch("http://localhost:5678/api/works");
  const jsonData = await response.json();
  return jsonData;
}

getWork()
  .then((data) => {
    work = data; // Assignation de la valeur de data à la variable work

    console.log(work);
    const galleryHTML = work
      .map(
        (e, index) => `
        <figure>
          <img src=${e.imageUrl} alt=${e.title}>
          <figcaption>${e.title}</figcaption>
        </figure>
      `
      )
      .join("");

    gallery.innerHTML = galleryHTML;
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].checked) {
        selectedFilter = filters[i].value;
        break;
      }
    }

    console.log(selectedFilter);
  })
  .catch((error) => {
    console.log(error);
  });

radio.forEach((label) => {
  label.addEventListener("click", () => {
    selectedFilter = label.textContent.trim();

    console.log(selectedFilter);

    const filteredWork =
      selectedFilter === "Tous"
        ? work
        : work.filter((e) => e.category.name === selectedFilter);

    const galleryHTML = filteredWork
      .map(
        (e) => `
          <figure>
            <img src=${e.imageUrl} alt=${e.title}>
            <figcaption>${e.title}</figcaption>
          </figure>
        `
      )
      .join("");

    gallery.innerHTML = galleryHTML;
  });
});

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Empêche l'envoi du formulaire par défaut

  const email = document.getElementById("email").value;
  const password = document.getElementById("mdp").value;

  // Effectuer une requête au backend pour l'authentification
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // Authentification réussie
      console.log("Authentification réussie !");
      isLoggedIn = true;
      window.open("./index.html");
    } else {
      // Erreur d'authentification
      document.querySelector("#login p").textContent =
        "Erreur dans l’identifiant ou le mot de passe";
    }
    setTimeout(() => {
      document.querySelector("#login p").textContent = "";
    }, 3000);
  } catch (error) {
    console.log(
      "Une erreur s'est produite lors de l'authentification :",
      error
    );
  }
});
