// Establece la conexión con el servidor WebSocket
const socket = io();

socket.on("new comic", (comic) => {
  const productsContainer = document.getElementById("products");

  // Crea el elemento HTML para el nuevo cómic
  const comicElement = document.createElement("div");
  comicElement.className = "product";
  comicElement.innerHTML = `
    <h3>${comic.title}</h3>
    <img src="${comic.thumbnail}" alt="Portada de ${comic.title}">
    <p>${comic.description}</p>
    <p>Precio: $${comic.price}</p>
    <p>Stock: ${comic.stock}</p>
  `;

  // Añade el nuevo cómic al contenedor
  productsContainer.appendChild(comicElement);
});
