const gallery = document.querySelector(".gallery");
const ajouter = document.querySelector(".ajouter");
const filters = document.getElementsByName("filtres");
const radio = document.querySelectorAll("label");
const edit = document.querySelector(".edit");
const body = document.querySelector("body");
const editContainer = document.querySelector(".edit-container");
let selectedFilter;

let work;
let initialEditContent; // Variable pour stocker le contenu initial de edit
window.addEventListener("load", () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  if (isLoggedIn) {
    const premium = document.getElementById("premium");
    premium.style.display = "block";
  }
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("ajouter")) {
    initialEditContent = edit.innerHTML; // Sauvegarder le contenu initial de edit

    edit.innerHTML = `
    <img id='arrow' onclick='arrowReturn()' src="./assets/icons/arrow-left-solid.svg">
    <img onclick="bon()" src="./assets/icons/xmark-solid.svg" id="iconClose">
    <h3>Ajout photo</h3>
    <form>
    <div class='ajoutPhoto'>
    <span class='galery-photo'>
    <i class="fa-regular fa-image"></i>
    </span>
    <label class='btn-photo' for='btn-photo'><i class="fa-solid fa-plus"></i> Ajouter photo</label>
    <input id='btn-photo' type='file' accept="image/png, image/jpeg" style='display:none;'>
    <p class='format'>jpg png : 4mo max</p>
    </div>
    <label for='titre'>Titre</label>
    <input id='titre' type='text'>
    <label for='categorie'>Catégorie</label>
    <select id="categorie">
    <option value=""> </option>
    <option value="Objets">Objets</option>
    <option value="Appartements">Appartements</option>
    <option value="Hotels & restaurants">Hotels & restaurants</option>
</select>
<input class='submit' type="submit" value="Valider">
</form>
    `;
  }
});

async function getWork() {
  const response = await fetch("http://localhost:5678/api/works");
  const jsonData = await response.json();
  return jsonData;
}

getWork()
  .then((data) => {
    work = data;

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

    var editContainerHTML = work
      .map(
        (e, index) => `
        <div class='card-edit'>
        <img width='80' src=${e.imageUrl} alt=${e.title}>
        <p>éditer</p>
      </div>
        `
      )
      .join("");

    editContainer.innerHTML = editContainerHTML;

    for (let i = 0; i < filters.length; i++) {
      if (filters[i].checked) {
        selectedFilter = filters[i].value;
        break;
      }
    }
  })
  .then(() => {
    edit.innerHTML +=
      "<p class='ajouter'>Ajouter une photo</p><p class='supprimer'>Supprimer la galerie</p>";
  })
  .catch((error) => {
    console.log(error);
  });

const editHTML = edit;
radio.forEach((label) => {
  label.addEventListener("click", () => {
    selectedFilter = label.textContent.trim();

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

premium.addEventListener("click", () => {
  body.classList.add("overlay");
  edit.style.display = "block";
});

const bon = () => {
  body.classList.remove("overlay");
  edit.innerHTML = initialEditContent; // Restaurer le contenu initial de edit
  edit.style.display = "none";
};
const arrowReturn = () => {
  console.log("rr");
  edit.innerHTML = initialEditContent;
};

// const data = {
//   // Les données que vous souhaitez ajouter
// };

// try {
//   const response = await fetch("http://localhost:5678/api/works", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   if (response.ok) {
//     // La requête a réussi et les données ont été ajoutées à la base de données
//     console.log("Données ajoutées avec succès !");
//   } else {
//     // La requête a échoué
//     console.log("Erreur lors de l'ajout des données à la base de données");
//   }
// } catch (error) {
//   console.log("Une erreur s'est produite lors de la requête :", error);
// }
