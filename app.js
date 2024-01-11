const express = require("express");
const ProductManager = require("./productManager");
const app = express();
const port = 3000;

const productManager = new ProductManager("products.json");

app.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts(limit);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

app.get("/products/:pid", async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const product = await productManager.getProductById(pid);

    if (!product) {
      res.status(404).json({ error: "Producto no encontrado" });
    } else {
      res.json({ product });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
