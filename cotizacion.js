


  document.addEventListener("DOMContentLoaded", function () {
    const articulos = {
      cocina: ["Cocina", "Horno microondas", "Horno eléctrico", "Refrigerador", "Alacena", "Platos", "Cubiertos", "Vasos", "Ollas"],
      sala: ["Sofá 1 cuerpo", "Sofá 2 cuerpos", "Sofá 3 cuerpos", "Mesa centro", "Mesa comedor", "Silla comedor", "Vitrina", "Puff"],
      dormitorio: ["Cama", "Colchón", "Ropero", "Frazadas", "Cubrecamas", "Cómoda", "Alfombra", "Espejo", "Mesa de noche"],
      lavanderia: ["Lavadora", "Secadora", "Tendal"],
      oficina: ["Escritorio", "Silla oficina", "Estante", "Librero"]
    };

    const seccionSelect = document.getElementById("seccion");
    const contenedor = document.getElementById("subarticulos-container");

    seccionSelect.addEventListener("change", function () {
      const seleccion = this.value;
      contenedor.innerHTML = "";

      if (articulos[seleccion]) {
        articulos[seleccion].forEach(item => {
          const div = document.createElement("div");
          div.className = "subarticulo-item";

          const label = document.createElement("label");
          label.textContent = item;

          const input = document.createElement("input");
          input.type = "number";
          input.name = `cantidad_${item.toLowerCase().replace(/ /g, "_")}`;
          input.min = "0";
          input.placeholder = "Cantidad";

          div.appendChild(label);
          div.appendChild(input);
          contenedor.appendChild(div);
        });
      }
    });
  });

