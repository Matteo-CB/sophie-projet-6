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
      const data = await response.json();
      const token = data.token;

      // Stocker le token dans le localStorage
      localStorage.setItem("token", token);

      console.log("Authentification réussie !");
      localStorage.setItem("isLoggedIn", true); // Stocker la valeur dans le sessionStorage
      window.location.href = "./index.html#work"; // Redirection vers index.html dans la même fenêtre
    } else {
      // Erreur d'authentification
      document.querySelector("#login p").textContent =
        "Erreur dans l'identifiant ou le mot de passe";
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

