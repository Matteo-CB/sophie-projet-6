const gallery = document.querySelector(".gallery");
const ajouter = document.querySelector(".ajouter");
const filters = document.getElementsByName("filtres");
const radio = document.querySelectorAll("label");
const edit = document.querySelector(".edit");
const body = document.querySelector("body");
const editContainer = document.querySelector(".edit-container");
const token = localStorage.getItem("token");
const portofolioTitle = document.querySelector("portofolio-title");
var allId = [];
let selectedFilter;
let imgPath;
let work;
let initialEditContent;

const bon = () => {
  body.classList.remove("overlay");
  const ecran = document.querySelector(".ecran");
  ecran.style.display = "none";
  edit.style.display = "none";
};

const arrowReturn = () => {
  console.log("rr");
  edit.innerHTML = initialEditContent;
};

window.addEventListener("load", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn) {
    const premium = document.getElementById("premium");
    premium.style.display = "block";
  }
});
const deleteWork = (id) => {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "bearer " + token,
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Work with ID ${id} deleted successfully.`);
        // Faire quelque chose après la suppression réussie
      } else {
        console.log(`Failed to delete work with ID ${id}.`);
        // Gérer l'échec de la suppression
      }
    })
    .catch((error) => {
      console.log("An error occurred:", error);
      // Gérer les erreurs de la requête
    });
};
const deleteWorkAll = (ids) => {
  const deletePromises = ids.map((id) => {
    return fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: 'bearer '+token
      }
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Work with ID ${id} deleted successfully.`);
          // Faire quelque chose après la suppression réussie
        } else {
          console.log(`Failed to delete work with ID ${id}.`);
          // Gérer l'échec de la suppression
        }
      })
      .catch((error) => {
        console.log("An error occurred:", error);
        // Gérer les erreurs de la requête
      });
  });

  return Promise.all(deletePromises);
};

function afficherImage(event) {
  const fichier = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const image = document.createElement("img");
    image.src = e.target.result;
    image.classList.add("image-ajoutee");

    const ajoutPhoto = document.querySelector(".ajoutPhoto");

    document.querySelector(".galery-photo").style.display = "none";
    document.querySelector(".btn-photo").style.display = "none";
    document.querySelector(".format").style.display = "none";
    ajoutPhoto.appendChild(image);

    ajoutPhoto.style.maxHeight = "200px";
    image.style.maxHeight = "200px";
    ajoutPhoto.style.display = "flex";
    ajoutPhoto.style.justifyContent = "center";
    ajoutPhoto.style.padding = "0";
    image.style.width = "auto";
    image.style.height = "100%";
    image.style.objectFit = "cover";

    imgPath = e.target.result;
  };

  reader.readAsDataURL(fichier);
}

document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("ajouter")) {
    initialEditContent = edit.innerHTML;

    edit.innerHTML = `
      <img id='arrow' onclick='arrowReturn()' src="./assets/icons/arrow-left-solid.svg">
      <img onclick="bon()" src="./assets/icons/xmark-solid.svg" id="iconClose">
      <h3>Ajout photo</h3>
      <form id="addForm">
        <div class='ajoutPhoto'>
          <span class='galery-photo'>
            <i class="fa-regular fa-image"></i>
          </span>
          <label class='btn-photo' for='btnPhoto'><i class="fa-solid fa-plus"></i> Ajouter photo</label>
          <input id='btnPhoto' name='image' type='file' accept="image/png, image/jpeg" style='display:none;'>
          
          <p class='format'>jpg png : 4mo max</p>
        </div>
        <label for='titre'>Titre</label>
        <input id='titre' name='title' type='text'>
        <label for='categorie'>Catégorie</label>
        <select id="categorie" name='category'>
          <option value=""> </option>
          <option value="1">Objets</option>
          <option value="2">Appartements</option>
          <option value="3">Hotels & restaurants</option>
        </select>
        <input class='submit' type="submit" value="Valider">
      </form>
    `;

    const addForm = document.getElementById("addForm");

    const submitForm = () => {
      return new Promise((resolve, reject) => {
        addForm.addEventListener("submit", (event) => {
          event.preventDefault();

          const titre = document.getElementById("titre").value;
          const categorie = document.getElementById("categorie").value;
          const image = btnPhoto.files[0];
          const formData = new FormData();
          formData.append("image", image);
          formData.append("title", titre);
          formData.append("category", Number(categorie));

          fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers:{
              Authorization:'bearer '+ token
            },
            body: formData,
          })
            .then((response) => {
              if (response.ok) {
                console.log("Data sent successfully!");
                edit.style.display = "none";
                resolve();
              } else {
                console.log("Error sending data.");
                console.log(formData);
                reject("Error sending data.");
              }
            })
            .catch((error) => {
              console.log("An error occurred:", error);
              reject(error);
            });
        });
      });
    };

    const submitBtn = document.querySelector(".submit");

    btnPhoto.addEventListener("change", afficherImage);
    titre.addEventListener("input", verifierFormulaire);
    categorie.addEventListener("change", verifierFormulaire);
    verifierFormulaire();

    try {
      await submitForm();
      const submitBtn = document.querySelector(".submit");
      submitBtn.addEventListener("click", (event) => {
        if (submitBtn.classList.contains("unlock")) {
          event.preventDefault();
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
});

function verifierFormulaire() {
  const titre = document.getElementById("titre");
  const categorie = document.getElementById("categorie");
  const submitBtn = document.querySelector(".submit");

  if (
    document.querySelector(".image-ajoutee") !== null &&
    titre.value !== "" &&
    categorie.value !== ""
  ) {
    submitBtn.classList.remove("unlock");
  } else {
    submitBtn.classList.add("unlock");
  }
}

async function getWork() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    throw new Error("Failed to fetch work data");
  }
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
      .map((e, index) => {
        allId.push(e.id);
        console.log(allId);
        return `
        <div class='card-edit'>
          <img width='80' src=${e.imageUrl} alt=${e.title}>
          <div>
            <img width='80' class='supp-img' id=${e.id} src='./assets/icons/trash-svgrepo-com.svg' alt='supprimer'>
          </div>
          <p>éditer</p>
        </div>
      `;
      })
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

const premium = document.getElementById("premium");
if (premium) {
  premium.addEventListener("click", () => {
    const suppAll = document.querySelector(".supprimer");
    if (suppAll) {
      suppAll.addEventListener("click", () => {
        const confirmed = window.confirm(
          "Êtes-vous sûr de vouloir supprimer tous les éléments ?"
        );
        if (confirmed) {
          deleteWorkAll(allId)
            .then(() => {
              console.log("All works deleted successfully.");
              // Faire autre chose après la suppression de tous les éléments
            })
            .catch((error) => {
              console.log("An error occurred during deletion:", error);
              // Gérer les erreurs de suppression
            });
        }
      });
    }
    body.classList.add("overlay");
    edit.style.display = "block";
    const ecran = document.querySelector(".ecran");
    ecran.style.display = "block";
    const suppWork = document.querySelectorAll(".supp-img");
    suppWork.forEach((element) => {
      element.addEventListener("click", (event) => {
        const id = event.target.id;
        deleteWork(id);
      });
    });
  });
}
