const fs = require("fs");

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = this.readProducts();
  }

  readProducts() {
    // Leer el archivo. Si no existe, retorna un arreglo vacío.
    try {
      const data = fs.readFileSync(this.filePath);
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  writeProducts() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (this.products.some((product) => product.code === code)) {
      throw new Error("El código del producto ya existe");
    }

    const newProduct = {
      id: this.products.length + 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    this.writeProducts(); // Guardar cambios en el archivo
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      console.error("Producto no encontrado");
      return null;
    }
    return product;
  }

  getProducts() {
    return this.products;
  }

  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      console.error("Producto no encontrado para actualizar");
      return;
    }

    // Actualiza solo los campos proporcionados
    this.products[index] = { ...this.products[index], ...updatedProduct };
    this.writeProducts(); // Guardar cambios en el archivo
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      console.error("Producto no encontrado para eliminar");
      return;
    }

    this.products.splice(index, 1);
    this.writeProducts(); // Guardar cambios en el archivo
  }
}

const productManager = new ProductManager("products.json");

// Agregar comics
try {
  productManager.addProduct(
    "The Amazing Spider-Man",
    "Las aventuras de Spider-Man en la ciudad de Nueva York",
    5.99,
    "spiderman-thumbnail.jpg",
    "SPD001",
    100
  );
  productManager.addProduct(
    "Batman: The Dark Knight",
    "Batman lucha contra el crimen en Gotham City",
    6.99,
    "batman-thumbnail.jpg",
    "BTM001",
    80
  );
} catch (error) {
  console.error(error.message);
}

// Obtener y mostrar productos
console.log(productManager.getProducts());

// Obtener un producto por ID
const product = productManager.getProductById(1);
if (product) {
  console.log(product);
}

// Actualizar un producto
productManager.updateProduct(1, { price: 7.99 });

// Eliminar un producto
productManager.deleteProduct(2);
