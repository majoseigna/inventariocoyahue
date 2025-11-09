document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();

    if (!usuario || !contrasena) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    if (usuario === "admin" && contrasena === "1234") {
      alert("Inicio de sesión exitoso. Bienvenido al Sistema de Inventario Coyahue.");
      window.location.href = "../../index.html";
    } else {
      alert("Usuario o contraseña incorrectos. Intente nuevamente.");
    }
  });
});
