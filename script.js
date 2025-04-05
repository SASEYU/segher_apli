document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
  
    const usuario = document.getElementById("username").value;
    const clave = document.getElementById("password").value;
  
    // Aquí puedes validar con tus datos reales o simular
    if (usuario === "admin" && clave === "1234") {
      alert("Login exitoso 🎉");
      // Redirigir, guardar token, etc.
    } else {
      alert("Usuario o contraseña incorrectos ❌");
    }
  });
  